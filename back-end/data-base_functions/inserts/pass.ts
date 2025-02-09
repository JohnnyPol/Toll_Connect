import Pass from '../../models/pass.ts';
import Tag from '../../models/tag.ts';
import { insert_tag } from './tag.ts';
import { connect, disconnect } from 'npm:mongoose';

/**
 * Inserts a new toll operator into the database - connects and disconnects to db.
 * @param {string} tag - Tag ID that passed.
 * @param {string} toll - Toll Station ID where pass occured
 * @param {date}   time - The time that the pass happened
 * @param {number} charge - The amount that was charged on the Tag
 * @param {string} tagOperator - Optional Parameter to allow adding the tag if not previously inserted
 */
async function insert_pass_connect({
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
					console.log(
						'Tag not found, inserting new Tag...',
					);
					await insert_tag({
						_id: tag,
						tollOperator: tagOperator,
					}); // Insert the tag if not found
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
		const newPass = await pass.save();
		console.log('Inserted Pass:', newPass);
	} catch (dbError: unknown) {
		if (dbError instanceof Error) {
			// Type narrowing to handle 'unknown' error type
			if (dbError.message.includes('ECONNREFUSED')) {
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
				console.error(
					'Unknown error occurred during disconnection.',
				);
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
async function insert_pass({
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
		if (tagOperator) {
			try {
				// Find the Tag by its custom string ID (tagId)
				const test_tag = await Tag.findById(tag);
				if (!test_tag) {
					console.log(
						'Tag not found, inserting new Tag...',
					);
					await insert_tag({
						_id: tag,
						tollOperator: tagOperator,
					}); // Insert the tag if not found
				}
			} catch (error) {
				console.error('Error checking for Tag:', error);
			}
		}

		// Prepare pass data
		const passData = {
			tag,
			toll,
			time,
			charge,
		};

		// Insert pass into the database
		const pass = new Pass(passData);
		const newPass = await pass.save();
		console.log('Inserted Pass:', newPass);
	} catch (dbError: unknown) {
		if (dbError instanceof Error) {
			console.error(
				'Failed to insert Pass:',
				dbError.message,
			);
		} else {
			console.error(
				'Unknown error occurred during database operation.',
			);
		}
		throw dbError;
	}
}

export { insert_pass, insert_pass_connect };
