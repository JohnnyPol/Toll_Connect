import { connect, disconnect} from 'npm:mongoose';
import Payment from '../../models/payment.ts';
import { ClientSession } from 'mongodb';

/**
 * Inserts a new payment into the database - connects and disconnects to db.
 * @param {string} payer - The ID of the payer toll operator
 * @param {string} payee - The ID of the payee toll operator
 * @param {Date} dateofCharge - The date of the charge
 * @param {number} amount - The payment amount
 * @param {Date} [dateofPayment] - The date of the payment (optional)
 * @param {Date} [dateofValidation] - The date of validation (optional)
 */
async function insertPaymentConnect({
    payer,
    payee,
    dateofCharge,
    amount,
    dateofPayment,
    dateofValidation
}: {
    payer: string;
    payee: string;
    dateofCharge: Date;
    amount: number;
    dateofPayment?: Date; // Optional
    dateofValidation?: Date; // Optional
}) {
    try {
        // Connect to MongoDB
        await connect('mongodb://localhost:27017');
        console.log('Connected to MongoDB');

        // Prepare and insert payment data
        const paymentData: { 
            payer: string; 
            payee: string; 
            dateofCharge: Date; 
            amount: number; 
            dateofPayment?: Date; 
            dateofValidation?: Date; 
        } = {
            payer,
            payee,
            dateofCharge,
            amount,
            dateofPayment,
            dateofValidation
        };

        const payment = new Payment(paymentData);
        const newPayment = await payment.save();
        console.log('Inserted Payment:', newPayment);
    } catch (dbError: unknown) {
        if (dbError instanceof Error) {
            if (dbError.message.includes('ECONNREFUSED')) {
                console.error('Database connection failed:', dbError.message);
            } else {
                console.error('Failed to insert Payment:', dbError.message);
            }
        } else {
            console.error('Unknown error occurred during database operation.');
        }
        throw(dbError);
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

/**
 * Inserts a new payment into the database (without connection handling)
 * @param {string} payer - The ID of the payer toll operator
 * @param {string} payee - The ID of the payee toll operator
 * @param {Date} dateofCharge - The date of the charge
 * @param {number} amount - The payment amount
 * @param {Date} [dateofPayment] - The date of the payment Optional
 * @param {Date} [dateofValidation] - The date of validation Optional
 */
async function insertPayment({
    payer,
    payee,
    dateofCharge,
    amount,
    dateofPayment,
    dateofValidation
}: {
    payer: string;
    payee: string;
    dateofCharge: Date;
    amount: number;
    dateofPayment?: Date; // Optional
    dateofValidation?: Date; // Optional
}, session?:ClientSession) {
    try {
        // Prepare and insert payment data
        const paymentData: { 
            payer: string; 
            payee: string; 
            dateofCharge: Date; 
            amount: number; 
            dateofPayment?: Date; 
            dateofValidation?: Date; 
        } = {
            payer,
            payee,
            dateofCharge,
            amount,
            dateofPayment,
            dateofValidation
        };
        const payment = new Payment(paymentData);
        if(session) {
            const newPayment = await payment.save({session});
            console.log('Inserted Payment:', newPayment);
            return newPayment._id;
        } else {
            const newPayment = await payment.save();
            console.log('Inserted Payment:', newPayment);
            return newPayment._id;
        }
        
    } catch (dbError: unknown) {
        if (dbError instanceof Error) {
            console.error('Failed to insert Payment:', dbError.message);
        } else {
            console.error('Unknown error occurred during database operation.');
        }
        throw(dbError);
    }
}

export { insertPayment, insertPaymentConnect };