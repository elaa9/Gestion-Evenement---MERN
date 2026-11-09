const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose
 * Reads connection string from environment variable MONGO_URI
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    // If running in development without live db yet, log informative tip
    console.error('[MongoDB] Ensure MongoDB is running locally or provide a valid MongoDB Atlas MONGO_URI in server/.env');
    // We don't necessarily exit immediately so server can still serve health check or informative message
  }
};

module.exports = connectDB;
