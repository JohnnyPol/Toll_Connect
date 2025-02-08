import { connect, disconnect } from 'npm:mongoose';
import { insert_pass } from './pass.ts';
import Papa from 'npm:papaparse';
import moment from 'npm:moment';


// Function to convert timestamp to Date using moment.js
function parseTimestamp(timestamp: string): Date {
  return moment(timestamp, 'YYYY/M/D HH:mm').toDate(); // Specify format
}


async function insertPassesFromCSV(path: string) {
    try {
        console.log('Reading passes data...');
        const passesText = await Deno.readTextFile(path);

        const passes = Papa.parse(passesText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        }).data;

        console.log(`Found ${passes.length} passes to insert`);

        try {
            await connect('mongodb://localhost:27017');
            console.log('OK connecting to db');
        } catch (err) {
            console.error('ERR connectint to db:', err);
            Deno.exit(1);
        }

        for (const pass of passes) {
            try {     

                const time = parseTimestamp((pass.timestamp).toString());

                await insert_pass({
                    tag: pass.tagRef,
                    toll: pass.tollID,
                    time: time,
                    charge: pass.charge,
                    tagOperator: pass.tagHomeID
                });

                console.log(`Successfully inserted pass: ${pass.tagRef}`);
            } catch (error) {
                console.error(`Failed to insert pass ${pass.tagRef}:`, error);
            }
        }

        console.log('Completed toll stations insertion');

    } catch (error) {
        console.error('Error during toll stations import:', error);
    } finally {
        // Disconnect from the database
        try {
          await disconnect();
          console.log('Disconnected from MongoDB');
        } catch (disconnectError: unknown) {
          if (disconnectError instanceof Error) {
            console.error('Error disconnecting from MongoDB:', disconnectError.message);
          } else {
            console.error('Unknown error occurred during disconnection.');
          }
        }
    }
}

// // Execute the insertion
// console.log('Starting path import...');
// let path: string;
// const args = Deno.args;
// if (args.length > 0) {
//     path = args[0];  // Get the first argument
// } else {
//     path = './passes-sample.csv'
// }
// await insertPassesFromCSV(path);

export { insertPassesFromCSV };