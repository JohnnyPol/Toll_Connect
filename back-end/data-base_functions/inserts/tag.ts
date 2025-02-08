import { connect, disconnect, ClientSession } from 'npm:mongoose';
import Tag from '../../models/tag.ts';

/**
 * Inserts a new tag into the database - connects and disconnects to db.
 * @param {string} _id - The ID of the tag
 * @param {string} tollOperator - The ID of the toll operator
 */
async function insert_tag_connect({
    _id,
    tollOperator
}: {
    _id: string;
    tollOperator: string;
}) {
    try {
        // Connect to MongoDB
        await connect('mongodb://localhost:27017');
        console.log('Connected to MongoDB');

        // Prepare and insert tag data
        const tagData = { _id, tollOperator };
        const tag = new Tag(tagData);
        const newTag = await tag.save();
        console.log('Inserted Tag:', newTag);
    } catch (dbError: unknown) {
        if (dbError instanceof Error) {
            if (dbError.message.includes('ECONNREFUSED')) {
                console.error('Database connection failed:', dbError.message);
            } else {
                console.error('Failed to insert Tag:', dbError.message);
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
 * Inserts a new tag into the database (without connection handling)
 * @param {string} _id - The ID of the tag
 * @param {string} tollOperator - The ID of the toll operator
 */
async function insert_tag({
    _id,
    tollOperator
}: {
    _id: string;
    tollOperator: string;
}, session:ClientSession) {
    try {
        const tagData = { _id, tollOperator };
        const tag = new Tag(tagData);
        const newTag = await tag.save();
        console.log('Inserted Tag:', newTag);
    } catch (dbError: unknown) {
        if (dbError instanceof Error) {
            console.error('Failed to insert Tag:', dbError.message);
        } else {
            console.error('Unknown error occurred during database operation.');
        }
        throw(dbError);
    }
}

export { insert_tag, insert_tag_connect };