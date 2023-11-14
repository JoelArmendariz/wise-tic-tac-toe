import { Db, MongoClient, MongoClientOptions } from "mongodb";

const uri = "mongodb://localhost:27017/tic-tac-toe";
const options: MongoClientOptions = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};

let client: MongoClient;
let database: Db;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(uri, options);
    await client.connect();
    console.log("Connected to MongoDB");
    database = client.db();
  }
  return database;
};

const disconnectFromDatabase = async () => {
  if (client) {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
};

export { connectToDatabase, disconnectFromDatabase };
