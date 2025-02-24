// lib/mongodb.js
import mongoose from 'mongoose';

// Get the MongoDB connection URL from environment variables (e.g., stored in .env file)
const MONGO_DB_URL = process.env.MONGO_DB_URL!;

// Check if the URL is defined; throw an error if it’s missing to prevent connection issues
if (!MONGO_DB_URL) {
    throw new Error('Please define the MONGO_DB_URL environment variable');
}

/** 
 * Cached connection object for MongoDB.
 * This stores the connection (`conn`) and a promise (`promise`) to track connection status.
 * Why? To avoid creating a new connection every time an API is called.
 */
let cached = global.mongoose;

// Set up the cache if it doesn’t exist yet (first time the app runs)
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB and reuses the connection for all API requests.
 * 
 * Why caching is important:
 * - In Next.js, API routes might run as separate serverless functions for each request.
 * - Without caching, we’d connect to MongoDB every time (slow and wasteful).
 * - Caching ensures we connect once and reuse that connection, making it fast and efficient.
 * 
 * How it works:
 * - If there’s already a connection (`cached.conn`), return it immediately.
 * - If a connection is being made (`cached.promise`), wait for it to finish.
 * - If no connection exists, start a new one and save it for later use.
 * 
 * @returns {Promise<mongoose.Connection>} - The MongoDB connection object.
 */
async function dbConnect(): Promise<mongoose.Connection> {
    // If we already have a connection, reuse it (no need to connect again)
    if (cached.conn) {
        return cached.conn;
    }

    // If no connection is in progress, start a new one
    if (!cached.promise) {
        // Options for the connection
        const opts = {
            bufferCommands: true, // Queue commands if the connection isn’t ready yet
            maxPoolSize: 10,       // Allow up to 10 simultaneous connections
        };

        // Start connecting to MongoDB and save the promise so we can wait for it
        cached.promise = mongoose.connect(MONGO_DB_URL, opts).then((mongoose) => {
            return mongoose.connection; // Return the connection object when done
        });
    }

    try {
        // Wait for the connection to finish and store it in the cache
        cached.conn = await cached.promise;
    } catch (error) {
        // If something goes wrong, clear the promise so we can try again next time
        cached.promise = null;
        console.log("=============== error while db:connection", error);
        throw error; // Let the caller handle the error
    }

    // Log success to confirm the connection worked
    console.log("=============== database connection successfully connected");
    return cached.conn;
}

export default dbConnect;