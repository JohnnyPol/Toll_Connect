import { connect, disconnect} from 'npm:mongoose';
import { insertToll } from './toll.ts';
import Papa from 'npm:papaparse';

async function insertTollsFromCSV(path:string,) {
    try {
        console.log('Reading toll stations data...');
        const tollStationsText = await Deno.readTextFile(path);

        const tollStations = Papa.parse(tollStationsText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        }).data; 

		console.log(
			`Found ${tollStations.length} toll stations to insert`,
		);

        for (const station of tollStations) {
            try {
                // Validate PM value
                if (station.PM !== 'ΜΤ' && station.PM !== 'ΠΛ') {
                    throw new Error(`Invalid PM value ${station.PM} for station ${station.Name}. Must be either 'ΜΤ' or 'ΠΛ'`);
                }      

                await insertToll({
                    _id: station.TollID,
                    name: station.Name,
                    latitude: station.Lat,
                    longitude: station.Long,
                    locality: station.Locality,
                    price1: station.Price1,
                    price2: station.Price2,
                    price3: station.Price3,
                    price4: station.Price4,
                    PM: station.PM,  // Use PM value directly from CSV
                    tollOperator: station.OpID,
                    roadName: station.Road
                },);

                console.log(`Successfully inserted toll station: ${station.Name}`);
            } catch (error) {
                console.error(`Failed to insert toll station ${station.Name}:`, error);
                throw(error);
            }
        }

        console.log('Completed toll stations insertion');
    } catch (error) {
        console.error('Error during toll stations import:', error);
        throw(error);
    }

}

async function insertTollsFromCSVConnect(path: string,) {
   
    try {
        await connect('mongodb://localhost:27017');
        console.log('OK connecting to db');
    } catch (err) {
        console.error('ERR connectint to db:', err);
        Deno.exit(1);
    }

    try {
        await insertTollsFromCSV(path);
    } finally {
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

// Execute the insertion
if(import.meta.main){
    console.log('Starting toll stations import...');
    let path: string;
    const args = Deno.args;
    if (args.length > 0) {
        path = args[0];  // Get the first argument
    } else {
        path = './tollstations.csv'
    }
    await insertTollsFromCSVConnect(path);
}

export {insertTollsFromCSV};
