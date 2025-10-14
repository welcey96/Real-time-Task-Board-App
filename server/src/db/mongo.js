const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.DB);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("Connected to MongoDB!");
    return db;
  } catch (err) {
    console.error("Error connecting to db: ", err);
  }
}

function getDB() {
  if (!db) throw new Error("DB not connected yet!");
  return db;
}

module.exports = { connectDB, getDB };
