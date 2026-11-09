const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose with auto-retry
 * Reads connection string from environment variable MONGO_URI
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[MongoDB Error] MONGO_URI environment variable is missing!');
    return;
  }

  const tryConnect = async (retries = 5, delay = 5000) => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
      console.log(`[MongoDB] Database name: ${conn.connection.name}`);
    } catch (error) {
      console.error(`[MongoDB Connection Error] ${error.message}`);
      if (retries > 0) {
        console.log(`[MongoDB] Retrying connection in ${delay / 1000}s... (${retries} attempts left)`);
        setTimeout(() => tryConnect(retries - 1, delay), delay);
      } else {
        console.error('[MongoDB] All connection attempts failed. Check Atlas Network Access (0.0.0.0/0) and credentials.');
      }
    }
  };

  await tryConnect();
};

module.exports = connectDB;
