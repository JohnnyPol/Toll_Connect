import mongoose from 'npm:mongoose';

async function deleteCollection(collection: string) {
  try {
    if (mongoose.connection.readyState!==1) {
      throw (new Error('Database connection is not established.'));
    }

    await mongoose.connection.collection(collection).drop();
    console.log(`Deleted all documents from collection: ${mongoose.connection.collection(collection).collectionName}`);
    

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