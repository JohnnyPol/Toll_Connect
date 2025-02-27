import { connect, disconnect, Types } from 'npm:mongoose';
import Toll from '../../models/toll.ts';
import { findRoadIdByName } from '../find/road.ts';
import { insertRoad } from './road.ts';

/**
 * Inserts a new toll station into the database - connects and disconnects to db.
 * @param {string} _id - The id used to reference the toll station.
 * @param {string} name - The name of the toll station.
 * @param {number} latitude - The latitude of the toll.
 * @param {number} longitude - The longitude of the toll.
 * @param {string} locality - The locality of the toll.
 * @param {number[]} price - The price of the 1st category
 * @param {('ΠΛ'|'ΜΤ')} PM - The payment method type
 * @param {string} tollOperator - The ID of the associated toll operator.
 * @param {string} roadName - The Name of the associated road.
 */
async function insertTollConnect({
  _id,
  name,
  latitude,
  longitude,
  locality,
  price1,
  price2,
  price3,
  price4,
  PM,
  tollOperator,
  roadName,
}: {
	_id: string;
	name: string;
	latitude: number;
	longitude: number;
	locality: string;
	price1: number;
	price2: number;
	price3: number;
	price4: number;
	PM: string;
	tollOperator: string;
	roadName: string;
}) {
	try {
		// Connect to DB
		await connect('mongodb://localhost:27017');
		console.log('Connected to MongoDB');

    // If road does not exist insert it
    const roadId = await findRoadIdByName(roadName);
    let road_for_use : string = 'Invalid';
    
    if (!roadId) {
      console.log('Road not found, inserting new Road...');
      await insertRoad({name: roadName});
      const temp = await findRoadIdByName(roadName);
      if(temp) road_for_use = temp;
    } else {
      road_for_use = roadId;
    }

		// Get toll Date
		const tollData = {
			_id,
			name,
			latitude,
			longitude,
			locality,
			price: [price1, price2, price3, price4],
			PM,
			tollOperator,
			road: new Types.ObjectId(road_for_use),
		};

		// Insert the toll into the database
		const toll = new Toll(tollData);
		const newToll = await toll.save();
		console.log('Inserted Toll:', newToll);
	} catch (dbError: unknown) {
		if (dbError instanceof Error) {
			console.error('Failed to insert Toll:', dbError);
		} else {
			console.error('Unknown error occurred during database operation.');
		}
		throw dbError;
	} finally {
		// Disconnect from the database
		try {
			await disconnect();
			console.log('Disconnected from MongoDB');
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error('Error disconnecting from MongoDB:', err);
			} else {
				console.error('Unknown error occurred during disconnection.');
			}
		}
	}
}

/**
 * Inserts a new toll station into the database - connects and disconnects to db.
 * @param {string} _id - The id used to reference the toll station.
 * @param {string} name - The name of the toll station.
 * @param {number} latitude - The latitude of the toll.
 * @param {number} longitude - The longitude of the toll.
 * @param {string} locality - The locality of the toll.
 * @param {number[]} price - The price of the 1st category
 * @param {('ΠΛ'|'ΜΤ')} PM - The PM type for the toll.
 * @param {string} tollOperator - The ID of the associated toll operator.
 * @param {string} roadName - The Name of the associated road.
 */
async function insertToll({
_id,
name,
latitude,
longitude,
locality,
price1,
price2,
price3,
price4,
PM,
tollOperator,
roadName,
}: {
	_id: string;
	name: string;
	latitude: number;
	longitude: number;
	locality: string;
	price1: number;
	price2: number;
	price3: number;
	price4: number;
	PM: string;
	tollOperator: string;
	roadName: string;
}) {
  try {
    // If road does not exist insert it
    const roadId = await findRoadIdByName(roadName);
    let road_for_use : string = 'Invalid';
    
    if (!roadId) {
      console.log('Road not found, inserting new Road...');
      await insertRoad({name: roadName});
      const temp = await findRoadIdByName(roadName);
      if(temp) road_for_use = temp;
    } else {
      road_for_use = roadId;
    }

		// Get toll data
		const tollData = {
			_id,
			name,
			latitude,
			longitude,
			locality,
			price: [price1, price2, price3, price4],
			PM,
			tollOperator,
			road: new Types.ObjectId(road_for_use),
		};

		// Insert the toll into the database
		const toll = new Toll(tollData);
		const newToll = await toll.save();
		console.log('Inserted Toll:', newToll);
	} catch (dbError: unknown) {
		if (dbError instanceof Error) {
			console.error('Failed to insert Toll:', dbError);
		} else {
			console.error('Unknown error occurred during database operation.');
		}
		throw dbError;
	}
}

export { insertToll, insertTollConnect };
