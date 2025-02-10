import mongoose from 'npm:mongoose';

async function deleteTollStations() {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb://localhost:27017");
        console.log(" Connected to MongoDB");

        if (!mongoose.connection.db) {
             throw new Error('Database connection is not established.');
           }

   
            // Drop the entire "toll" collection
            await mongoose.connection.db.collection("toll").drop();
            console.log(" Dropped collection: toll");
     
    } catch (error) {
        console.error(" Error dropping 'toll' collection:", error);
        throw error;
    } finally {
        // Disconnect from MongoDB
        try {
            await mongoose.disconnect();
            console.log(" Disconnected from MongoDB");
        } catch (disconnectError) {
            console.error(" Error disconnecting from MongoDB:", disconnectError);
        }
    }
}

export { deleteTollStations };
