import { insert_toll_operator_connect } from './tollOperator.ts';
import { insert_payment_connect } from './payment.ts';
import { insert_road_connect } from './road.ts';
import { insert_toll_connect } from './toll.ts';
import {insert_tag_connect} from './tag.ts'
import {insert_pass_connect} from './pass.ts'

//Sample Usage
insert_toll_operator_connect({
  _id: 'operator123' ,
  name: 'Operator One',
  passwordHash: 123456789,
  email: 'operator@example.com',
  VAT : 'VAT12345',
  addressStreet: 'Main Street',
  addressNumber: 123,
  addressArea: 'Central Area',
  addressZip: 12345
});

// Sample Usage
insert_payment_connect({
    payer: 'operator123',
    payee: 'operator456',
    dateofCharge: new Date('2024-01-15'),
    amount: 150.50,
    dateofPayment: new Date('2024-01-16'),
    dateofValidation: new Date('2024-01-16')
});


// Sample Usage
insert_road_connect({
    name: 'Highway A1'
});

insert_tag_connect({
    _id: 'TA0357',
    tollOperator: 'operator123'

});

// Sample Usage
insert_toll_connect({
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

insert_pass_connect({
    tag: 'TA0358',
    toll: 'NO25',
    time: new Date('2024-01-03-00-18'),
    charge: 2.5,
    tagOperator: 'NO'
});