import Pass from '../../models/pass.ts';
import Tag from '../../models/tag.ts';
import Toll from '../../models/toll.ts';
<<<<<<< HEAD
import { insertTag } from './tag.ts';
import { ClientSession, connect, disconnect } from 'npm:mongoose';
import { MongoError } from 'npm:mongodb';
=======
import { insert_tag } from './tag.ts';
import { connect, disconnect } from 'npm:mongoose';
>>>>>>> 463e1530bf94d50988bb654748287ca1cdfdbfed

/**
 * Inserts a new toll operator into the database - connects and disconnects to db.
 * @param {string} tag - Tag ID that passed.
 * @param {string} toll - Toll Station ID where pass occured
 * @param {date}   time - The time that the pass happened
 * @param {number} charge - The amount that was charged on the Tag
 * @param {string} tagOperator - Optional Parameter to allow adding the tag if not previously inserted
 */
<<<<<<< HEAD
async function insertPassConnect({
=======
async function insert_pass_connect({
>>>>>>> 463e1530bf94d50988bb654748287ca1cdfdbfed
	tag,
	toll,
	time,
	charge,
	tagOperator,
}: {
	tag: string;
	toll: string;
	time: Date;
	charge: number;
	tagOperator?: string;
}) {
	try {
		// Connect to the database
		await connect('mongodb://localhost:27017');
		console.log('Connected to MongoDB');

		if (tagOperator) {
			try {
				// Find the Tag by its custom string ID (tagId)
				const test_tag = await Tag.findById(tag);
				if (!test_tag) {
<<<<<<< HEAD
					console.log('Tag not found, inserting new Tag...');
					await insertTag({ _id: tag, tollOperator: tagOperator }); // Insert the tag if not found
=======
					console.log(
						'Tag not found, inserting new Tag...',
					);
					await insert_tag({
						_id: tag,
						tollOperator: tagOperator,
					}); // Insert the tag if not found
>>>>>>> 463e1530bf94d50988bb654748287ca1cdfdbfed
				}
			} catch (error) {
				console.error('Error checking for Tag:', error);
			}
		}

		// Prepare the pass data
		const passData = {
			tag,
			toll,
			time,
			charge,
		};

		// Insert pass into the database
		const pass = new Pass(passData);
<<<<<<< HEAD
		try {
			const newPass = await pass.save();
			console.log('Inserted Pass:', newPass);
		} catch (error) {
			if (error instanceof MongoError && error.code === 11000) {
				// This means the unique index violation occurred
				console.log('Error: Duplicate pass entry detected');
				// Handle the error as needed, e.g., sending a specific message to the user
			} else {
				// Other errors
				console.error('Error while inserting', error);
			}
			throw (new Error('Duplicate pass'));
		}
=======
		const newPass = await pass.save();
		console.log('Inserted Pass:', newPass);
>>>>>>> 463e1530bf94d50988bb654748287ca1cdfdbfed
	} catch (dbError: unknown) {
		if (dbError instanceof Error) {
			// Type narrowing to handle 'unknown' error type
			if (dbError.message.includes('ECONNREFUSED')) {
<<<<<<< HEAD
				console.error('Database connection failed:', dbError.message);
			} else {
				console.error('Failed to insert Pass:', dbError.message);
			}
		} else {
			console.error('Unknown error occurred during database operation.');
=======
				console.error(
					'Database connection failed:',
					dbError.message,
				);
			} else {
				console.error(
					'Failed to insert Pass:',
					dbError.message,
				);
			}
		} else {
			console.error(
				'Unknown error occurred during database operation.',
			);
>>>>>>> 463e1530bf94d50988bb654748287ca1cdfdbfed
		}
		throw dbError;
	} finally {
		// Disconnect from the database
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
<<<<<<< HEAD
				console.error('Unknown error occurred during disconnection.');
=======
				console.error(
					'Unknown error occurred during disconnection.',
				);
>>>>>>> 463e1530bf94d50988bb654748287ca1cdfdbfed
			}
		}
	}
}

/**
 * Inserts a new toll operator into the database - connects and disconnects to db.
 * @param {string} tag - Tag ID that passed.
 * @param {string} toll - Toll Station ID where pass occured
 * @param {date}   time - The time that the pass happened
 * @param {number} charge - The amount that was charged on the Tag
 * @param {string} tagOperator - Optional Parameter to allow adding the tag if not previously inserted
 */
<<<<<<< HEAD
async function insertPass({
=======
async function insert_pass({
>>>>>>> 463e1530bf94d50988bb654748287ca1cdfdbfed
	tag,
	toll,
	time,
	charge,
	tagOperator,
}: {
	tag: string;
	toll: string;
	time: Date;
	charge: number;
	tagOperator: string;
}, session?: ClientSession) {
	try {
		try {
			// Find the Tag by its custom string ID (tagId)
			if (session) {
				const test_tag = await Tag.findById(tag).session(session);
				if (!test_tag) {
					console.log('Tag not found, inserting new Tag...');
					await insertTag(
						{ _id: tag, tollOperator: tagOperator },
						session,
					); // Insert the tag if not found
				}
			} else {
				const test_tag = await Tag.findById(tag);
				if (!test_tag) {
					console.log('Tag not found, inserting new Tag...');
					await insertTag({ _id: tag, tollOperator: tagOperator }); // Insert the tag if not found
				}
			}
		} catch (error) {
			console.error('Error checking for Tag:', error);
		}

		let tollOperator;

		try {
			let test_toll; 

      if(session) {
        test_toll= await Toll.findById(toll).session(session);
      } else {
        test_toll = await Toll.findById(toll);
      }

			if (!test_toll) {
				console.log('Toll not found');
				throw (new Error('Toll not found'));
			}

			tollOperator = test_toll._id;
		} catch (error) {
			console.error('Error checking for Toll:', error);
			throw error;
		}

		// Prepare pass data
		const passData = {
			tag: { _id: tag, tollOperator: tagOperator },
			toll: { _id: toll, tollOperator: tollOperator },
			time: time,
			charge: charge,
		};

		// Insert pass into the database
		const pass = new Pass(passData);
		try {
			if (session) {
				const newPass = await pass.save({ session });
				console.log('Inserted Pass:', newPass);
			} else {
				const newPass = await pass.save();
				console.log('Inserted Pass:', newPass);
			}
		} catch (error) {
			if (error instanceof MongoError && error.code === 11000) {
				// This means the unique index violation occurred
				console.log('Error: Duplicate pass entry detected');
				// Handle the error as needed, e.g., sending a specific message to the user
			} else {
				// Other errors
				console.error('Error while inserting', error);
			}
			throw (new Error('Duplicate pass'));
		}
	} catch (dbError: unknown) {
		if (dbError instanceof Error) {
			console.error('Failed to insert Pass:', dbError.message);
		} else {
			console.error('Unknown error occurred during database operation.');
		}
		throw dbError;
	}
}

export { insertPass, insertPassConnect };
