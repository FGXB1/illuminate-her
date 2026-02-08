const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please set MONGODB_URI in your .env (e.g. MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/illuminate-her)'
  );
}

/**
 * In Next.js, serverless functions can run in new processes, so we cache the
 * connection and reuse it. This avoids opening a new connection on every request.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = { connectDB };
