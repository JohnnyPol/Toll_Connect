import mongoose from 'mongoose';

async function deleteCollection(collection: string): Promise<void> {
	try {
		if (mongoose.connection.readyState !== 1) {
			throw (new Error('Database connection is not established.'));
		}

		const col = await mongoose.connection.collection(collection);
		if (col) {
			await col.deleteMany({});
			console.log(
				`Deleted all documents from collection: ${
					mongoose.connection.collection(collection).collectionName
				}`,
			);
		}
	} catch (error) {
		console.error('Error deleting documents:', error);
		throw error;
	}
}

export { deleteCollection };
