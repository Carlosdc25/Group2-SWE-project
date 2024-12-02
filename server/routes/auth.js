import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const predefinedHabits = ["High Priority", "Academics", "Gym", "Home"]; //Initializing habits to be these
const predefinedDailyReminderTime = [9, 0, "AM"]; //Initializing default reminder time
const predefinedDaysToRemind = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Register a new user
router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    dailyReminderTime,
    daysToRemind,
  } = req.body;

  // Check if all required fields are provided
  if (!firstName || !lastName || !email || !username || !password) {
    return res
      .status(400)
      .json({
        message:
          "All fields are required: firstName, lastName, email, username, and password.",
      });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists",
      });
    }

    const habits = {};
    predefinedHabits.forEach((habit) => {
      habits[habit] = []; // Initialize each habit with an empty array
    });

    const dailyReminderTime = predefinedDailyReminderTime;
    const daysToRemind = predefinedDaysToRemind;

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password, // Will be hashed by schema pre-save hook
      dailyReminderTime,
      daysToRemind,
      completedDailyHabits: false,
      streak: 0,
      habits,
    });

    await newUser.save();

    // Return success response
    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log("Retrieved User from Database:", user);
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      userData: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName, // Include firstName
        lastName: user.lastName, // Include lastName
        email: user.email, // Include email
        dailyReminderTime: user.dailyReminderTime,
        daysToRemind: user.daysToRemind,
        completedDailyHabits: user.completedDailyHabits,
        streak: user.streak,
        habits: user.habits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
