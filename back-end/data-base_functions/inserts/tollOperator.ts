import TollOperator, { UserLevel } from '../../models/toll_operator.ts';
import { connect, disconnect } from 'npm:mongoose';

/**
 * Inserts a new toll operator into the database - connects and disconnects to db.
 * @param {string} _id - Toll Operator ID that will be referenced by it
 * @param {string} name - The name of the toll operator.
 * @param {string} passwordHash - The hashed password for the toll operator.
 * @param {UserLevel} userLevel - The user's access level.
 * @param {string} email - The email address of the toll operator.
 * @param {string} VAT - The VAT number of the toll operator.
 * @param {string} addressStreet - The street address of the toll operator.
 * @param {number} addressNumber - The address number of the toll operator.
 * @param {string} addressArea - The area of the toll operator's address.
 * @param {number} addressZip - The postal code (ZIP) of the toll operator.
 */
async function insertTollOperatorConnect({
    _id,
    name,
    passwordHash,
		userLevel,
    email,
    VAT,
    addressStreet,
    addressNumber,
    addressArea,
    addressZip
}: {
	_id: string;
	name: string;
	passwordHash: string;
	userLevel: UserLevel;
	email: string;
	VAT: string;
	addressStreet: string;
	addressNumber: number;
	addressArea: string;
	addressZip: number;
}) {
	try {
		// Connect to the database
		await connect('mongodb://localhost:27017');
		console.log('Connected to MongoDB');

		// Prepare the toll operator data
		const tollOperatorData = {
			_id,
			name,
			passwordHash,
			userLevel,
			email,
			VAT,
			addressStreet,
			addressNumber,
			addressArea,
			addressZip,
		};

		// Insert the toll operator into the database
		const tollOperator = new TollOperator(tollOperatorData);
		const newTollOperator = await tollOperator.save();
		console.log('Inserted Toll Operator:', newTollOperator);
	} catch (dbError: unknown) {
		if (dbError instanceof Error) {
			// Type narrowing to handle 'unknown' error type
			if (dbError.message.includes('ECONNREFUSED')) {
				console.error('Database connection failed:', dbError);
			} else {
				console.error('Failed to insert Toll Operator:', dbError);
			}
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
 * Inserts a new toll operator into the database.
 * @param {string} _id - Toll Operator ID that will be referenced by it
 * @param {string} name - The name of the toll operator.
 * @param {string} passwordHash - The hashed password for the toll operator.
 * @param {UserLevel} userLevel - The user's access level.
 * @param {string} email - The email address of the toll operator.
 * @param {string} VAT - The VAT number of the toll operator.
 * @param {string} addressStreet - The street address of the toll operator.
 * @param {number} addressNumber - The address number of the toll operator.
 * @param {string} addressArea - The area of the toll operator's address.
 * @param {number} addressZip - The postal code (ZIP) of the toll operator.
 */
async function insertTollOperator({
  _id,
  name,
  passwordHash,
	userLevel,
  email,
  VAT,
  addressStreet,
  addressNumber,
  addressArea,
  addressZip
}: {
	_id: string;
	name: string;
	passwordHash: string;
	userLevel: UserLevel;
	email: string;
	VAT: string;
	addressStreet: string;
	addressNumber: number;
	addressArea: string;
	addressZip: number;
}) {
	try {
		// Prepare the toll operator data
		const tollOperatorData = {
			_id,
			name,
			passwordHash,
			userLevel,
			email,
			VAT,
			addressStreet,
			addressNumber,
			addressArea,
			addressZip,
		};

		const tollOperator = new TollOperator(tollOperatorData);
		const newTollOperator = await tollOperator.save();
		console.log('Inserted Toll Operator:', newTollOperator);

	} catch(error) {
		console.error('Failed to insert Toll Operator:', error);
		throw(error);
	}
}

export{insertTollOperator, insertTollOperatorConnect}
