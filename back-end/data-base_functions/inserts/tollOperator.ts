import TollOperator from '../../models/toll_operator.ts';
import { connect, disconnect } from 'npm:mongoose';

/**
 * Inserts a new toll operator into the database - connects and disconnects to db.
 * @param {string} _id - Toll Operator ID that will be referenced by it
 * @param {string} name - The name of the toll operator.
 * @param {string} passwordHash - The hashed password for the toll operator.
 * @param {string} email - The email address of the toll operator.
 * @param {string} VAT - The VAT number of the toll operator.
 * @param {string} addressStreet - The street address of the toll operator.
 * @param {number} addressNumber - The address number of the toll operator.
 * @param {string} addressArea - The area of the toll operator's address.
 * @param {number} addressZip - The postal code (ZIP) of the toll operator.
 */
async function insert_toll_operator_connect({
    _id,
    name,
    passwordHash,
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
      email,
      VAT,
      addressStreet,
      addressNumber,
      addressArea,
      addressZip
    };

    // Insert the toll operator into the database
    const tollOperator= new TollOperator(tollOperatorData);
    const newTollOperator = await tollOperator.save();
    console.log('Inserted Toll Operator:', newTollOperator);
  } catch (dbError: unknown) {
    if (dbError instanceof Error) {
      // Type narrowing to handle 'unknown' error type
      if (dbError.message.includes('ECONNREFUSED')) {
        console.error('Database connection failed:', dbError.message);
      } else {
        console.error('Failed to insert Toll Operator:', dbError.message);
      }
    } else {
      console.error('Unknown error occurred during database operation.');
    }
    throw(dbError);
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

/**
 * Inserts a new toll operator into the database.
 * @param {string} _id - Toll Operator ID that will be referenced by it
 * @param {string} name - The name of the toll operator.
 * @param {string} passwordHash - The hashed password for the toll operator.
 * @param {string} email - The email address of the toll operator.
 * @param {string} VAT - The VAT number of the toll operator.
 * @param {string} addressStreet - The street address of the toll operator.
 * @param {number} addressNumber - The address number of the toll operator.
 * @param {string} addressArea - The area of the toll operator's address.
 * @param {number} addressZip - The postal code (ZIP) of the toll operator.
 */
async function insert_toll_operator({
  _id,
  name,
  passwordHash,
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
        email,
        VAT,
        addressStreet,
        addressNumber,
        addressArea,
        addressZip
      };
  
      // Insert the toll operator into the database
      const tollOperator= new TollOperator(tollOperatorData);
      const newTollOperator = await tollOperator.save();
      console.log('Inserted Toll Operator:', newTollOperator);
    } catch (dbError: unknown) {
      if (dbError instanceof Error) {
            console.error('Failed to insert Toll Operator:', dbError.message);
      } else {
        console.error('Unknown error occurred during database operation.');
      }
      throw(dbError);
    }
  }

export{insert_toll_operator, insert_toll_operator_connect}
