import { MongoError } from 'mongodb';
import { UserLevel } from '../../models/toll_operator.ts';
import { insertTollOperator } from './tollOperator.ts';
import { connect, disconnect } from 'npm:mongoose';

const list_of_operators = [
	{
		_id: 'AM',
		name: 'aegeanmotorway',
		passwordHash:
			'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85',
		userLevel: UserLevel.Operator,
		email: 'operator@example.com',
		VAT: 'VAT12345',
		addressStreet: 'Main Street',
		addressNumber: 123,
		addressArea: 'Central Area',
		addressZip: 12345,
	},
	{
		_id: 'EG',
		name: 'egnatia',
		passwordHash:
			'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85',
		userLevel: UserLevel.Operator,
		email: 'operator@example.com',
		VAT: 'VAT12345',
		addressStreet: 'Main Street',
		addressNumber: 123,
		addressArea: 'Central Area',
		addressZip: 12345,
	},
	{
		_id: 'GE',
		name: 'gefyra',
		passwordHash:
			'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85',
		userLevel: UserLevel.Operator,
		email: 'operator@example.com',
		VAT: 'VAT12345',
		addressStreet: 'Main Street',
		addressNumber: 123,
		addressArea: 'Central Area',
		addressZip: 12345,
	},
	{
		_id: 'KO',
		name: 'kentrikiodos',
		passwordHash:
			'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85',
		userLevel: UserLevel.Operator,
		email: 'operator@example.com',
		VAT: 'VAT12345',
		addressStreet: 'Main Street',
		addressNumber: 123,
		addressArea: 'Central Area',
		addressZip: 12345,
	},
	{
		_id: 'MO',
		name: 'moreas',
		passwordHash:
			'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85',
		userLevel: UserLevel.Operator,
		email: 'operator@example.com',
		VAT: 'VAT12345',
		addressStreet: 'Main Street',
		addressNumber: 123,
		addressArea: 'Central Area',
		addressZip: 12345,
	},
	{
		_id: 'NAO',
		name: 'naodos',
		passwordHash:
			'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85',
		userLevel: UserLevel.Operator,
		email: 'operator@example.com',
		VAT: 'VAT12345',
		addressStreet: 'Main Street',
		addressNumber: 123,
		addressArea: 'Central Area',
		addressZip: 12345,
	},
	{
		_id: 'NO',
		name: 'neaodos',
		passwordHash:
			'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85',
		userLevel: UserLevel.Operator,
		email: 'operator@example.com',
		VAT: 'VAT12345',
		addressStreet: 'Main Street',
		addressNumber: 123,
		addressArea: 'Central Area',
		addressZip: 12345,
	},
	{
		_id: 'OO',
		name: 'olympiaodos',
		passwordHash:
			'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85',
		userLevel: UserLevel.Operator,
		email: 'operator@example.com',
		VAT: 'VAT12345',
		addressStreet: 'Main Street',
		addressNumber: 123,
		addressArea: 'Central Area',
		addressZip: 12345,
	},
	{
		_id: 'admin',
		name: 'admin',
		passwordHash:
			'd9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85',
		userLevel: UserLevel.Admin,
		email: 'operator@example.com',
		VAT: 'VAT12345',
		addressStreet: 'Main Street',
		addressNumber: 123,
		addressArea: 'Central Area',
		addressZip: 12345,
	},
];

async function insertTollOperators() {
	for (const TollOperator of list_of_operators) {
		try {
			await insertTollOperator(TollOperator);
			console.log(`Successfully inserted toll operator: ${TollOperator}`);
		} catch (error) {
			console.error(
				`Failed to insert toll operator ${TollOperator}:`,
				error,
			);
			if (!(error instanceof MongoError && error.code === 11000)) {
				throw error;
			}
		}
	}

	console.log('Completed toll stations insertion');
}

async function insertTollOperatorsConnect() {
	try {
		await connect('mongodb://localhost:27017');
		console.log('OK connecting to db');
	} catch (err) {
		console.error('ERR connecting to db:', err);
		Deno.exit(1);
	}

	await insertTollOperators();

	try {
		await disconnect();
		console.log('Disconnected from MongoDB');
	} catch (disconnectError: unknown) {
		if (disconnectError instanceof Error) {
			console.error(
				'Error disconnecting from MongoDB:',
				disconnectError.message,
			);
		} else {
			console.error(
				'Unknown error occurred during disconnection.',
			);
		}
	}
}

// Execute the insertion
if (import.meta.main) {
	console.log('Starting toll stations import...');
	await insertTollOperatorsConnect();
}

export { insertTollOperators, insertTollOperatorsConnect };
