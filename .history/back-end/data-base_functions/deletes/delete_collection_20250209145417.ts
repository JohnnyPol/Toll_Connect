import mongoose from 'npm:mongoose';

async function deleteCollection(collection: string) {
  try {
    if (mongoose.connection.readyState!==1) {
      throw (new Error('Database connection is not established.'));
    }

    await mongoose.connection.collection(collection).drop();
    console.log(`Deleted all documents from collection: ${mongoose.connection.collection(collection).collectionName}`);
    
  } catch (error) {
    console.error('Error deleting documents:', error);
    throw(error);
  }
}

export {deleteCollection};
