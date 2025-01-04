import Road from '../../models/road.ts'

/**
 * Find a road by its name and return its ID.
 * @param {string} roadName - The name of the road to search for.
 * @returns {Promise<string | null>} - The _id of the road or null if not found.
 */
async function findRoadIdByName(roadName: string): Promise<string | null> {
    try {
      // Find the road by its name
      const road = await Road.findOne({ name: roadName }).exec();  // Using exec() to get a Document
  
      if (!road) {
        console.log(`No road found with name: ${roadName}`);
        return null;  // Return null if no road found
      }
  
      // Explicitly return the _id as a string (since Mongoose automatically adds _id as a string)
      return road._id.toString(); // Ensure it's a string in case it's an ObjectId
    } catch (error) {
      console.error('Error finding road by name:', error);
      throw new Error('Failed to find road');
    }
}

export {findRoadIdByName};