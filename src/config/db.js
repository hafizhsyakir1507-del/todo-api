const mongoose = require("mongoose");
let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI belum diatur pada environment variables");
  connectionPromise = mongoose.connect(uri).then(() => mongoose.connection).catch((error) => {
    connectionPromise = null;
    throw error;
  });
  return connectionPromise;
}

module.exports = connectDB;
