import { insert_toll_operator } from './tollOperator.ts';
import { connect, disconnect } from 'npm:mongoose';

const list_of_operators = [
    {
        _id: 'AM',
        name: 'aegeanmotorway',
        passwordHash: "123456789",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345,
        markerIcon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'  
    }, 
    {
        _id: 'EG',
        name: 'egnatia',
        passwordHash: "123456789",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345,
        markerIcon: 'http://maps.google.com/mapfiles/kml/paddle/grn-circle.png'  
    },
    {
        _id: 'GE',
        name: 'gefyra',
        passwordHash: "123456789",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345,
        markerIcon: 'http://maps.google.com/mapfiles/kml/paddle/ltblu-circle.png'  
    },
    {
        _id: 'KO',
        name: 'kentrikiodos',
        passwordHash: "123456789",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345,
        markerIcon: 'http://maps.google.com/mapfiles/kml/paddle/pink-circle.png'  
    },
    {
        _id: 'MO',
        name: 'moreas',
        passwordHash: "123456789",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345,
        markerIcon: 'http://maps.google.com/mapfiles/kml/paddle/purple-circle.png'  
    },
    {
        _id: 'NAO',
        name: 'naodos',
        passwordHash: "123456789",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345,
        markerIcon: 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png'  
    },
    {
        _id: 'NO',
        name: 'neaodos',
        passwordHash: "123456789",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345,
        markerIcon: 'http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png'  
    },
    {
        _id: 'OO',
        name: 'olympiaodos',
        passwordHash: "123456789",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345
    },
    {
        _id: 'Admin',
        name: 'admin',
        passwordHash: "123456789",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345,
        markerIcon: 'http://maps.google.com/mapfiles/kml/paddle/orange-circle.png'  
    },
    {
        _id: 'dummy@mail', // testing the login page 
        name: 'admin',
        passwordHash: "d9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85",
        email: 'operator@example.com',
        VAT: 'VAT12345',
        addressStreet: 'Main Street',
        addressNumber: 123,
        addressArea: 'Central Area',
        addressZip: 12345
    },
];

async function insertTollOperators() {
    try {
        await connect('mongodb://localhost:27017');
        console.log('OK connecting to db');
    } catch (err) {
        console.error('ERR connecting to db:', err);
        Deno.exit(1);
    }

    for (const TollOperator of list_of_operators) {
        try {
            await insert_toll_operator(TollOperator);

            console.log(`Successfully inserted toll operator: ${TollOperator}`);
        } catch (error) {
            console.error(`Failed to insert toll station ${TollOperator}:`, error);
        }
    }

    console.log('Completed toll stations insertion');

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

// Execute the insertion
console.log('Starting toll stations import...');
await insertTollOperators();