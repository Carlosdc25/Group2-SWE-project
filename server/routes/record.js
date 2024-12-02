import express from "express";
import connectDB from "../db/connection.js";
import User from "../models/User.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Gets a user's info by id
router.get("/", async (req, res) => {
  const userId = req.query.userId; // Assume userId is passed as a query param
  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");
    const results = await collection
      .find({ _id: new ObjectId(userId) })
      .toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error("Error retrieving user info:", err);
    res.status(500).send("Error retrieving user info");
  }
});

router.get("/get-habits", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send("Username is required");
  }

  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");

    // Fetch the user's habits
    const user = await collection.findOne(
      { username },
      { projection: { habits: 1 } } // Only return the habits field
    );

    if (!user || !user.habits) {
      return res.status(404).send("No habits found for this user");
    }

    res.status(200).json(user.habits); // Send the habits as the response
  } catch (error) {
    console.error("Error retrieving habits:", error);
    res.status(500).send("Error retrieving habits");
  }
});

// This section will help you get a list of all the user info
router.get("/all", async (req, res) => {
  // Adjusted path to avoid duplication
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

//updates the Habit Title
router.patch("/update-habit-title/:username", async (req, res) => {
  console.log("PATCH /update-habit-title called");
  console.log("Params:", req.params); // Log the username
  console.log("Body:", req.body);

  const { username } = req.params;
  const { oldTitle, newTitle } = req.body;

  if (!username || !oldTitle || !newTitle) {
    return res
      .status(400)
      .send("Username, oldTitle, and newTitle are required");
  }

  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");

    // Renaming the Habit Field
    const result = await collection.updateOne(
      { username },
      {
        $rename: {
          [`habits.${oldTitle}`]: `habits.${newTitle}`,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send("Habit title not found or update failed");
    }

    res.status(200).send("Habit title updated successfully");
  } catch (err) {
    console.error("Error updating habit title:", err);
    res.status(500).send("Error updating habit title");
  }
});

router.get("/get-tasks", async (req, res) => {
  const { username } = req.query;

  if (!username)
    return res.status(400).send("userId query parameter is required");

  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");

    const user = await collection.findOne(
      { username },
      { projection: { habits: 1 } } // Only return the habits field
    );

    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user.habits || {}); //returns empty object if no user is defined
  } catch (err) {
    console.error("Error retrieving tasks:", err);
    res.status(500).send("Error retrieving tasks");
  }
});

router.delete("/delete-task/:username/:habit/:taskId", async (req, res) => {
  const { username, habit, taskId } = req.params;

  if (!username || !habit || !taskId) {
    return res.status(400).send("Username, habit, and taskId are required");
  }

  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");

    const result = await collection.updateOne(
      { username },
      { $pull: { [`habits.${habit}`]: { _id: new ObjectId(taskId) } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send("Task not found or already deleted");
    }

    res.status(200).send("Task deleted successfully");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Error deleting task");
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
// router.post("/add-task", async (req, res) => {
//   try {
//     const db = await connectDB();
//     const newHabit = {
//       habit: req.body.habit,
//       task: req.body.task,
//     };
//     const collection = db.collection("userinfo");
//     const result = await collection.insertOne(newHabit);
//     res.status(201).send(result);
//   } catch (err) {
//     console.error("Error adding task:", err);
//     res.status(500).send("Error adding task");
//   }
// });
// Get a user's habits and tasks

// Add a new task to a user's habit
router.post("/add-task", async (req, res) => {
  const { username, habit, task } = req.body;

  if (!username || !habit || !task) {
    return res.status(400).send("username, habit, and task are required");
  }

  try {
    //create new task
    const newTask = { _id: new ObjectId(), task };

    const db = await connectDB();
    const collection = db.collection("userinfo");

    const result = await collection.updateOne(
      { username },
      { $push: { [`habits.${habit}`]: newTask } },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && !result.upsertedCount) {
      return res.status(404).send("User not found or task addition failed");
    }

    res.status(201).send("Task added successfully");
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).send("Error adding task");
  }
});

// Change user's reminder time/days
/*
router.post("/reminder-change", async (req, res) => {
  const changes = {
    username: userData.username,
    newDailyReminderTime: dailyReminderTime,
    newDaysToRemind: daysToRemind,
  }; 
  console.log(req.body);
  const { username, newDailyReminderTime, newDaysToRemind } = req.body;
  console.log(username);
  console.log(newDailyReminderTime);
  console.log(newDaysToRemind);

  if (!username || !newDailyReminderTime || !newDaysToRemind) {
    return res.status(400).send("username, time, days are required");
  }

  console.log("Is username a valid string?:", typeof username === "string");

  try {
    const db = await connectDB();
    const collection = db.collection("userinfo");
    
    const result = await collection.updateOne(
      { username },
      {
        $set: {
          dailyReminderTime: newDailyReminderTime,
          daysToRemind: newDaysToRemind,
        },
      }
    ); 
    const result = await collection.updateOne(
      { username: "ashley44511" },
      {
        $set: {
          dailyReminderTime: ["9", "0", "AM"],
          daysToRemind: ["Sunday", "Monday"],
        },
      }
    );

    if (result.modifiedCount === 0 && !result.upsertedCount) {
      return res.status(404).send("User not found or reminder change fail");
    }

    res.status(201).send("Reminder changed successfully");
  } catch (err) {
    console.error("Error changing reminder:", err);
    res.status(500).send("Error changing reminder");
  }
}); */

router.post("/reminder-change", async (req, res) => {
  try {
    const { username, newDailyReminderTime, newDaysToRemind } = req.body;

    // Find the user by username and update their reminder settings
    const updatedUser = await User.findOneAndUpdate(
      { username: username }, // Query filter
      {
        $set: {
          dailyReminderTime: newDailyReminderTime,
          daysToRemind: newDaysToRemind,
        },
      },
      { new: true } // Return the updated document instead of the original
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({
        message: "Reminder settings updated successfully",
        user: updatedUser,
      });
  } catch (error) {
    console.error("Error updating reminder settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
