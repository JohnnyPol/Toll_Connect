import { connect, disconnect, Model, Types, Schema} from 'npm:mongoose';
import { idtype } from '../../models/util.ts';

async function deleteById<T>(
  model: Model<T>, 
  id: string | Types.ObjectId,
): Promise<void> {
  try {
    // Step 1: Connect to the database
    await connect('mongodb://localhost:27017');
    console.log('Connected to MongoDB');

    // Get the expected ID type from the model (either Schema.Types.String or Schema.Types.ObjectId)
    const expectedIdType = idtype(model);

    // Check the constructor type of expectedIdType (Schema.Types.ObjectId or Schema.Types.String)
    let convertedId: string | Types.ObjectId = id;

    if (expectedIdType === Schema.Types.String) {
      // If the expected type is Schema.Types.String, treat the ID as a string
      convertedId = id as string;
    } else if (expectedIdType === Schema.Types.ObjectId) {
      // If the expected type is Schema.Types.ObjectId, convert the string ID to ObjectId
      convertedId = new Types.ObjectId(id);
    }

    // Step 2: Perform the deletion
    const result = await model.deleteOne({ _id: convertedId });

    if (result.deletedCount === 0) {
      console.warn('No document found with the provided ID.');
    } else {
      console.log('Document deleted successfully.');
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  } finally {
    // Step 3: Disconnect from the database
    try {
      await disconnect();
      console.log('Disconnected from MongoDB');
    } catch (disconnectError) {
      console.error('Error disconnecting from MongoDB:', disconnectError);
    }
  }
}

export {deleteById};

