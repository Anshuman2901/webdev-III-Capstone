// [LECTURE 19: Introduction to Databases (SQL vs NoSQL)]
// [LECTURE 20: MongoDB Basics + Installation, Atlas & Local Configuration]
// [LECTURE 27: Connecting Node.js with MongoDB]

const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      autoIndex: true, // Build indexes automatically in development
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.error(`[Database Note] Ensure MongoDB is running locally at ${config.mongoUri} or update MONGO_URI in .env`);
    // Do not crash immediately so CLI/testing can report diagnostics if needed
    throw error;
  }
};

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log('[Database Event] Mongoose connected to MongoDB cluster/instance.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Event] Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('[Database Event] Mongoose connection disconnected.');
});

module.exports = connectDB;
