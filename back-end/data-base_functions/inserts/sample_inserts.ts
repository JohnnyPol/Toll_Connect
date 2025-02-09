import { insertTollOperatorConnect } from './tollOperator.ts';
import { insertPaymentConnect } from './payment.ts';
import { insertRoadConnect } from './road.ts';
import { insertTollConnect } from './toll.ts';
import {insertTagConnect} from './tag.ts'
import {insertPassConnect} from './pass.ts'

//Sample Usage
insertTollOperatorConnect({
  _id: 'operator123' ,
  name: 'Operator One',
  passwordHash: 'free4all',
  email: 'operator@example.com',
  VAT : 'VAT12345',
  addressStreet: 'Main Street',
  addressNumber: 123,
  addressArea: 'Central Area',
  addressZip: 12345
});

// Sample Usage
insertPaymentConnect({
    payer: 'operator123',
    payee: 'operator456',
    dateofCharge: new Date('2024-01-15'),
    amount: 150.50,
    dateofPayment: new Date('2024-01-16'),
    dateofValidation: new Date('2024-01-16')
});


// Sample Usage
insertRoadConnect({
    name: 'Highway A1'
});

insertTagConnect({
    _id: 'TA0357',
    tollOperator: 'operator123'

});

// Sample Usage
insertTollConnect({
    _id: 'toll123',
    name: 'Athens North Toll Station',
    latitude: 37.9838,
    longitude: 23.7275,
    locality: 'Athens',
    price1: 2.50,
    price2: 3.50,
    price3: 4.50,
    price4: 5.50,
    PM: 'ΜΤ',  
    tollOperator: 'operator123',  // References the toll operator ID
    roadName: 'road456'  // References the road ID
});

insertPassConnect({
    tag: 'TA0358',
    toll: 'NO25',
    time: new Date('2024-01-03-00-18'),
    charge: 2.5,
    tagOperator: 'NO'
});