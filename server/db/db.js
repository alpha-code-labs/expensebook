import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isShuttingDown = false;

export const connectToMongoDB = async () => {
    try {
        if (isShuttingDown) {
            throw new Error('Server is shutting down');
        }

        const mongodb_url = process.env.MONGODB_URI;
        // console.log("Connecting to MongoDB ...");
        
        const options = {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
        };

        await mongoose.connect(mongodb_url, options);
        // console.log("Connected to MongoDB");
        return mongoose.connection;
    } catch (e) {
        console.error("MongoDB connection error:", e);
        throw e;
    }
};

export const closeMongoDBConnection = async () => {
    try {
        isShuttingDown = true;

        if (mongoose.connection.readyState === 1) {
            console.log("Closing MongoDB connection...");
            
            const closeWithTimeout = async () => {
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("MongoDB close timeout")), 5000)
                );

                try {
                    await Promise.race([
                        mongoose.connection.close(),
                        timeoutPromise
                    ]);
                    console.log("MongoDB connection closed successfully");
                } catch (error) {
                    if (error.message === "MongoDB close timeout") {
                        console.log("Forcing MongoDB connection close...");
                        // Force disconnect if timeout occurs
                        mongoose.connection.destroy();
                    }
                    throw error;
                }
            };

            await closeWithTimeout();
        } else {
            console.log("No active MongoDB connection to close");
        }
    } catch (error) {
        console.error("Error while closing MongoDB connection:", error);
        throw error;
    }
};