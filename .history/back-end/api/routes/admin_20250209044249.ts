// api/routes/admin.ts
import { Middleware, Request, Response, Router } from 'npm:express';
import { MongoClient } from 'npm:mongodb';
import multer from 'npm:multer';
import * as path from "npm:path";
import { insertTollsFromCSV } from '../../data-base_functions/inserts/toll_insert.ts';
import { deleteAllDocuments } from '../../data-base_functions/deletes/delete_all.ts';
import { fromFileUrl, dirname, join } from "https://deno.land/std/path/mod.ts";
import { insertPassesFromCSV } from '../../data-base_functions/inserts/pass_insert.ts';
import mongoose from "npm:mongoose";

import * as fs from 'node:fs/promises';

import { parse } from 'npm:csv-parse/sync';

async function validateCSVFile(filePath: string): Promise<boolean> {
    try {
        const csvContent = await fs.readFile(filePath, 'utf-8');
        const records = parse(csvContent, { columns: true, skip_empty_lines: true });

        // Define required fields based on `passes-sample.csv`
        const requiredFields = ['passId', 'stationId', 'tagId', 'date', 'time'];
        return requiredFields.every(field => field in records[0]);
    } catch (error) {
        console.error('Error validating CSV file:', error);
        return false;
    }
}





const client = new MongoClient('mongodb://localhost:27017/');

export default function(oapi: Middleware): Router {
    const router = new Router();

    // Healthcheck endpoint
    router.get('/healthcheck', async (_req: Request, res: Response) => {
        try {
            const db = client.db();
            const [stations, tags, passes] = await Promise.all([
                db.collection('toll').countDocuments(),
                db.collection('tag').countDocuments(),
                db.collection('pass').countDocuments()
            ]);

            res.status(200).json({
                status: "OK",
                dbconnection: "mongodb://localhost:27017/",
                n_stations: stations,
                n_tags: tags,
                n_passes: passes
            });
        } catch (error) {
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
        deleteAllDocuments;

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

return router;
}