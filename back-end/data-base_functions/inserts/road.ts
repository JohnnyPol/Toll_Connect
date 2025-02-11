// roadOperations.ts
import { connect, disconnect } from 'npm:mongoose';
import Road from '../../models/road.ts';

/**
 * Inserts a new road into the database - connects and disconnects to db.
 * @param {string} name - The name of the road
 */
async function insertRoadConnect({
    name
}: {
	name: string;
}) {
	try {
		// Connect to MongoDB
		await connect('mongodb://localhost:27017');
		console.log('Connected to MongoDB');

		// Prepare and insert road data
		const roadData = { name };
		const road = new Road(roadData);
		const newRoad = await road.save();
		console.log('Inserted Road:', newRoad);
	} catch (dbError: unknown) {
		if (dbError instanceof Error) {
			if (dbError.message.includes('ECONNREFUSED')) {
				console.error('Database connection failed:', dbError);
			} else {
				console.error('Failed to insert Road:', dbError);
			}
		} else {
			console.error(
				'Unknown error occurred during database operation.',
			);
		}
		throw dbError;
	} finally {
		try {
			await disconnect();
			console.log('Disconnected from MongoDB');
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error('Error disconnecting from MongoDB:', err);
			} else {
				console.error( 'Unknown error occurred during disconnection.');
			}
		}
	}
}

/**
 * Inserts a new road into the database (without connection handling)
 * @param {string} name - The name of the road
 */
async function insertRoad({
    name
}: {
	name: string;
}) {
	try {
		const roadData = { name };
		const road = new Road(roadData);
		const newRoad = await road.save();
		console.log('Inserted Road:', newRoad);
	} catch (dbError: unknown) {
		if (dbError instanceof Error) {
			console.error('Failed to insert Road:', dbError);
		} else {
			console.error('Unknown error occurred during database operation.');
		}
		throw dbError;
	}
}



export { insertRoad, insertRoadConnect };
