const { MongoClient } = require("mongodb");
const path = process.env.MONGO_URI || process.env.DB;
const client = new MongoClient(path);

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

function getCollection(name) {
  return getDB().collection(name);
}

module.exports = { connectDB, getDB, getCollection };
