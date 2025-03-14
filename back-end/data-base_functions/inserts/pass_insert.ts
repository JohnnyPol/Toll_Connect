import mongoose, { disconnect, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import Papa from 'papaparse';
import moment from 'moment';

import pass, {PassDocument} from '@/models/pass.ts';
import { insertPass } from './pass.ts';
import { insertPayment } from './payment.ts';

// Function to convert timestamp to Date using moment.js
function parseTimestamp(timestamp: string): Date {
	return moment(timestamp, 'YYYY/M/D HH:mm').toDate(); // Specify format
}

async function insertPassesFromCSV(path: string, type: boolean) {
	try {
		console.log('Reading passes data...');
		let passesText;
		if(type){
			passesText = await Deno.readTextFile(path);
		} else {
			passesText = path;
		}

		const passes = Papa.parse(passesText, {
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
		}).data;

		console.log(`Found ${passes.length} passes to insert`);


		const session = await mongoose.connection.startSession();

		try {
			for (const pass of passes) {
				try {
					const time = parseTimestamp(
						pass.timestamp.toString(),
					);

					await insertPass(
						{
							tag: pass.tagRef,
							toll: pass.tollID,
							time: time,
							charge: pass.charge,
							tagOperator:
								pass.tagHomeID,
						},
						session,
					);

					console.log(
						`Successfully inserted pass: ${pass.tagRef}`,
					);
				} catch (error) {
					console.error(
						`Failed to insert pass ${pass.tagRef}:`,
						error,
					);
				}
			}


			// 1. Find passes with null Payment
			const passesWithoutPayment = await pass.find({
				payment: null,
			}) as unknown as PassDocument[];

			if (passesWithoutPayment.length > 0) {
				const operatorCharges = new Map<
					string, 					{
						operatorID: string;
						tagHomeID: string;
						date: Date;
						totalCharge: number;
						id: Types.ObjectId;
					}
				>();

				// 2. Get operatorID and date, sum charges
				for (
					let i = 0;
					i < passesWithoutPayment.length;
					i++
				) {
					const Pass = passesWithoutPayment[i];
					const date = moment(Pass.time).startOf(
						'day',
					).toDate();
					const Toll = Pass.toll;

					if (!Toll) {
						console.error(
							`Toll not found for ID: ${Pass.toll}`,
						);
						//await session.abortTransaction();
						throw new Error(
							`Toll not found for ID: ${Pass.toll}`,
						);
					}
					const operatorID = Toll.tollOperator; // Assuming toll has operatorID

					const Tag = Pass.tag;

					if (!Tag) {
						console.error(
							`Tag not found for ID: ${Pass.toll}`,
						);
						//await session.abortTransaction();
						throw new Error(
							`Tag not found for ID: ${Pass.toll}`,
						);
					}
					const homeID = Tag.tollOperator; // Assuming tag has operatorID

					if (!operatorID || !homeID) {
						console.error(
							`Sth is null: ${Pass.toll}`,
						);
						//await session.abortTransaction();
						throw new Error(
							`Sth is null: ${Pass.toll}`,
						);
					}

					const key =
						`${operatorID}-${homeID}-${date.toISOString()}`; // Unique key

					if (!operatorCharges.has(key)) {
						operatorCharges.set(key, {
							operatorID: operatorID,
							tagHomeID: homeID,
							date: date,
							totalCharge:
								Pass!.charge,
							id: new ObjectId(),
						});
					} else {
						const existingCharge =
							operatorCharges.get(
								key,
							);
						if (existingCharge) {
							existingCharge
								.totalCharge +=
									Pass.charge;
						}
					}
				}

				// 3. Create and insert new tuples (if needed) - Adapt as per your needs.
				const newChargeTuples = Array.from(
					operatorCharges.values(),
				);
				console.log('newChargeTuples', newChargeTuples);

				for (const chargeTuple of newChargeTuples) {
					try {
						const payId =
							await insertPayment({
								payer: chargeTuple
									.tagHomeID, // Use tagHomeID as payer
								payee: chargeTuple
									.operatorID, // Use operator ID as payee
								dateofCharge:
									chargeTuple
										.date,
								amount: Number(chargeTuple.totalCharge.toFixed(2)),
								// dateofPayment and dateofValidation are optional, so you can leave them undefined
							}, session);
						const key =
							`${chargeTuple.operatorID}-${chargeTuple.tagHomeID}-${chargeTuple.date}`;
						const charge = operatorCharges
							.get(key);
						if (charge) {
							charge.id = payId;
						}
					} catch (paymentError) {
						console.error(
							'Error inserting payment:',
							paymentError,
						);
						//await session.abortTransaction(); // Abort the whole transaction if a payment fails
						throw paymentError; // Re-throw to be caught by the outer try...catch
					}
				}

				//4. Update passes

				for (
					let i = 0;
					i < passesWithoutPayment.length;
					i++
				) {
					const Pass = passesWithoutPayment[i];
					const date = moment(Pass.time).startOf(
						'day',
					).toDate();
					const Toll = Pass.toll;
					if (!Toll) {
						console.error(
							`Toll not found for ID: ${Pass.toll}`,
						);
						//await session.abortTransaction();
						throw new Error(
							`Toll not found for ID: ${Pass.toll}`,
						);
					}
					const operatorID = Toll.tollOperator; // Assuming toll has operatorID

					const Tag = Pass.tag;
					if (!Tag) {
						console.error(
							`Tag not found for ID: ${Pass.toll}`,
						);
						//await session.abortTransaction();
						throw new Error(
							`Tag not found for ID: ${Pass.toll}`,
						);
					}
					const homeID = Tag.tollOperator; // Assuming tag has operatorID

					if (!operatorID || !homeID) {
						console.error(
							`Sth is null: ${Pass.toll}`,
						);
						//await session.abortTransaction();
						throw new Error(
							`Sth is null: ${Pass.toll}`,
						);
					}

					const key =
						`${operatorID}-${homeID}-${date.toISOString()}`; // Unique key

					const existingCharge = operatorCharges
						.get(key);

					if (existingCharge) {
						await pass.updateOne({
							_id: Pass._id,
						}, {
							payment: existingCharge
								.id,
						})
						const test = await pass.findById(Pass._id);
						console.log(test);
					}
				}
			} else {
				console.log('No passes without payment found.');
			}

			//await session.commitTransaction();
			console.log(
				'Completed passes insertion and processing within transaction',
			);
		} catch (error) {
			//await session.abortTransaction();
			console.error(
				'Error during passes insertion (transaction rolled back):',
				error,
			);
		} finally {
			session.endSession(); // Important: End the session
		}
	} catch (error) {
		console.error('Error during passes import:', error);
		console.trace('Pass operator trace:');
	} 
}

async function insertPassesFromCSVConnection(path: string) {
	try {
		await mongoose.connect('mongodb://localhost:27017');
		console.log('OK connecting to db');
	} catch (err) {
		console.error('ERR connecting to db:', err);
		Deno.exit(1);
	}

	try {
		await insertPassesFromCSV(path, true);
	} finally {
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
}

// Execute the insertion
if (import.meta.main) {
	console.log('Starting path import...');
	let path: string;
	const args = Deno.args;
	if (args.length > 0) {
		path = args[0]; // Get the first argument
	} else {
		path = './passes-sample.csv';
	}
	
	await insertPassesFromCSVConnection(path);

	
}

export { insertPassesFromCSV };
