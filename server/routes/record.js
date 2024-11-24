
import express from "express";
import connectDB from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Gets a user's info by id
router.get("/", async (req, res) => {
  const userId = req.query.userId; // Assume userId is passed as a query param
  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");
    const results = await collection.find({ _id: new ObjectId(userId) }).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error("Error retrieving user info:", err);
    res.status(500).send("Error retrieving user info");
  }
});

// This section will help you get a list of all the user info
router.get("/all", async (req, res) => { // Adjusted path to avoid duplication
  try {
    const db = await connectDB(); // Properly call connectDB()
    const collection = db.collection("userinfo");
    const results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error("Error retrieving user info:", err);
    res.status(500).send("Error retrieving user info");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received ID:", id); // Log the received ID

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");
    const query = { _id: new ObjectId(id) };
    const result = await collection.findOne(query);

    if (!result) return res.status(404).send("Not found");
    res.status(200).send(result);
  } catch (err) {
    console.error("Error retrieving user info:", err);
    res.status(500).send("Error retrieving user info");
  }
});

// Create a new record
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    const result = await collection.insertOne(newDocument);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error adding user info:", err);
    res.status(500).send("Error adding user info");
  }
});

// Update a user's info by id
router.patch("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    const result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error("Error updating user info:", err);
    res.status(500).send("Error updating user info");
  }
});

// Delete a user's info by id
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    console.error("Error deleting user info:", err);
    res.status(500).send("Error deleting user info");
  }
});

// Add a new task
router.post("/add-task", async (req, res) => {
  try {
    const db = await connectDB();
    const newHabit = {
      habit: req.body.habit,
      task: req.body.task,
    };
    const collection = db.collection("userinfo");
    const result = await collection.insertOne(newHabit);
    res.status(201).send(result);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).send("Error adding task");
  }
});

export default router;