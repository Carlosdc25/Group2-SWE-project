import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, dailyReminderTime, daysToRemind } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const newUser = new User({
      username,
      password, // Will be hashed by schema pre-save hook
      dailyReminderTime,
      daysToRemind,
      completedDailyHabits: false,
      streak: 0,
      habits: {},
    });

    await newUser.save();

    // Return user data (excluding sensitive information)
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login user
router.post('/login', async (req, res) => {
  console.log('Request body:', req.body);
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log("User found in database:", user);
    if (!user) return res.status(400).json({ message: 'Invalid username or password (not a User)' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      userData: {
        _id: user._id,
        username: user.username,
        dailyReminderTime: user.dailyReminderTime,
        daysToRemind: user.daysToRemind,
        completedDailyHabits: user.completedDailyHabits,
        streak: user.streak,
        habits: user.habits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;