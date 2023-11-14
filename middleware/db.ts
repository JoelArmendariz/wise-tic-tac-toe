import { MongoClient } from "mongodb";
import nextConnect from "next-connect";

const client = new MongoClient("mongodb://localhost:27017/tic-tac-toe", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

async function database(req, _, next) {
  req.dbClient = client;
  req.db = client.db("MCT");
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
