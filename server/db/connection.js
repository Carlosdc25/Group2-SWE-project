import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.ATLAS_URI || "";

let db;

async function connectDB() {
  if (db) return db; // Return existing connection

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    db = client.db("users");
    return db;
  } catch (err) {
    console.error(err);
    throw err; // Let the caller handle the error
  }
}

export default connectDB;
