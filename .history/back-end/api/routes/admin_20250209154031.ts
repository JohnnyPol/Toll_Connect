// api/routes/admin.ts
import { Middleware, Request, Response, Router } from 'npm:express';
import { MongoClient } from 'npm:mongodb';
import * as path from "npm:path";
import { insertTollsFromCSV } from '../../data-base_functions/inserts/toll_insert.ts';
import { fromFileUrl, dirname, join } from "https://deno.land/std/path/mod.ts";
import { insertPassesFromCSV } from '../../data-base_functions/inserts/pass_insert.ts';
import mongoose from "npm:mongoose";
import multer,{ FileFilterCallback } from 'npm:multer';
import { deleteCollection } from '../../data-base_functions/deletes/delete_collection.ts';
import toll_operator from '../../models/toll_operator.ts';


import * as fs from 'node:fs/promises';


const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
};

const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (_req: Request, file: multer.File, cb: FileFilterCallback) => {
        // Check if file is CSV (required by spec)
        if (file.mimetype !== 'text/csv') {
            cb(new Error('Only CSV files are allowed (mimetype: text/csv)'));
            return;
        }
        cb(null, true);
    }
});

import { parse } from 'npm:csv-parse/sync';

async function validateCSVFile(filePath: string): Promise<boolean> {
    try {
        const csvContent = await fs.readFile(filePath, 'utf-8');
        const records = parse(csvContent, { columns: true, skip_empty_lines: true });

         // Check if the file is empty or the header row is missing
    if (records.length === 0) {
        console.error('CSV file is empty or missing header row.');
        return false;
      }

        // Define required fields based on `passes-sample.csv`
        const requiredFields = ['timestamp', 'tollID', 'tagRef', 'tagHomeID', 'charge'];
    
        const headerFields = Object.keys(records[0]);

        // Check if the number of fields matches the required format
     if (headerFields.length !== requiredFields.length) {
         console.error('CSV header field count does not match the required format.');
         return false;
       }
       for (let i = 0; i < requiredFields.length; i++) {
        if (headerFields[i] !== requiredFields[i]) {
          console.error(
            `Header field mismatch at position ${i + 1}: expected "${requiredFields[i]}", but found "${headerFields[i]}".`
          );
          return false;
        }
      }
  
      return true;
    } catch (error) {
      console.error('Error validating CSV file:', error);
      return false;
    }
  }





//const client = new MongoClient('mongodb://localhost:27017/');

export default function(oapi: Middleware): Router {
    const router = new Router();

    // Healthcheck endpoint
    router.get('/healthcheck', async (_req: Request, res: Response) => {
        try {
            if (mongoose.connection.readyState !== 1)
                throw(new Error("no connected to db"));
            //const db = client.db();
            //const db = mongoose.connection.db;

            const [stations, tags, passes] = await Promise.all([
                mongoose.connection.collection('toll').countDocuments(),
                mongoose.connection.collection('tag').countDocuments(),
                mongoose.connection.collection('pass').countDocuments()
            ]);

            res.status(200).json({
                status: "OK",
                dbconnection: "mongodb://localhost:27017/",
                n_stations: stations,
                n_tags: tags,
                n_passes: passes
            });
        } catch(error)  {
            console.error(error);
            res.status(401).json({
                status: "failed",
                dbconnection: "mongodb://localhost:27017/"
            });
        }
    });

 // Reset stations endpoint
  // Reset stations endpoint
  router.post('/resetstations', async (_req: Request, res: Response) => {
    try {
        // Step 1: Delete all existing documents
        await deleteCollection("payment");
        await deleteCollection("pass");
        await  deleteCollection("toll"); 

       // Step 2: Construct the correct path to the CSV file
       const currentFilePath = fromFileUrl(import.meta.url);
       const currentDir = dirname(currentFilePath);
       const projectRoot = join(currentDir, '..', '..');
       const csvPath = join(projectRoot, 'data-base_functions', 'inserts', 'tollstations2024.csv');
        // Step 3: Insert new stations using the existing function
        await insertTollsFromCSV(csvPath);

        res.status(200).json({ status: "OK" });
    } catch (error) {
        console.error('Error in resetstations:', error);
        res.status(500).json({ 
            status: "failed", 
            info: error instanceof Error ? error.message : 'Unknown error occurred' 
        });
    }
});

router.post('/resetpasses', async (_req: Request, res: Response) => {
    try {
        // Get database connection
        //const db = client.db();
    
        if (mongoose.connection.readyState !== 1)
            throw(new Error("no connected to db"));

            await deleteCollection("payment");
            await deleteCollection("pass");
            await deleteCollection("tag");

            const newPassword = await hashPassword('freepasses4all');
            

            await toll_operator.updateOne({_id: 'admin'}, {passwordHash: newPassword});

    

        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error('Error in resetpasses:', error);
        res.status(500).json({
            status: 'failed',
            info: error instanceof Error
                ? error.message
                : 'Unknown error occurred',
        });
    }
});

/*router.post('/addpasses', upload.single('file'), async (req: Request, res: Response) => {
    try {
        console.log(" Received request to upload passes");
        console.log(" req.body:", req.body);
        console.log(" req.file:", req.file);

        if (!req.file) {
            console.error(" No file uploaded");
            throw new Error("No file uploaded");
        }

        console.log(`File received: ${req.file.originalname}`);
        console.log(`Stored at: ${req.file.path}`);

        // Validate and process the file
        const filePath = req.file.path;
        const isValid = await validateCSVFile(filePath);
        if (!isValid) {
            throw new Error("Invalid CSV format. Please upload a valid file.");
        }

        await insertPassesFromCSV(filePath);
        console.log(" Successfully inserted passes from CSV.");

        res.status(200).json({ status: "OK" });
    } catch (error) {
        console.error(" Error in /addpasses:", error);
        res.status(500).json({
            status: "failed",
            info: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
});

*/
return router;
}

