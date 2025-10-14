const { MongoClient } = require("mongodb");

(async () => {
  const client = new MongoClient(process.env.DB);
  await client.connect();
  console.log("Connected to MongoDB!");
})().catch((err) => {
  console.error("Error connecting to db: ", err);
});
