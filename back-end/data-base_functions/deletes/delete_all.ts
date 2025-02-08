import mongoose from 'npm:mongoose';

async function deleteAllDocuments() {
  try {
    // Step 1: Connect to the database
    await mongoose.connect('mongodb://localhost:27017');
    console.log('Connected to MongoDB');

    // Step 2: Check if connection.db is defined
    if (!mongoose.connection.db) {
      throw new Error('Database connection is not established.');
    }

    // Step 3: Get all collections
    const collections = await mongoose.connection.db.collections();

    // Step 4: Iterate over each collection and delete all documents
    for (const collection of collections) {
      await collection.drop();
      console.log(`Deleted all documents from collection: ${collection.collectionName}`);
    }

    console.log('All documents in the database have been deleted.');
  } catch (error) {
    console.error('Error deleting documents:', error);
  } finally {
    // Step 5: Disconnect from the database
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
  }
}

export {deleteAllDocuments};

// Run the function
if(import.meta.main) {
  deleteAllDocuments();
}
