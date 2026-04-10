const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_code_analyzer';

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`[DB] Connected to MongoDB: ${mongoose.connection.name}`);
}

module.exports = {
  connectDatabase,
};
