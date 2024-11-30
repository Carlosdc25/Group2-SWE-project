import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

//wanted to give tasks id so they could be deleted easier and without as many bugs
const taskSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // Unique identifier for each task
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  task: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: { 
    type: String,
    required: true,
    unique: true,
  },
  dailyReminderTime: {
    type: [String], // Array of strings to hold times in any preferred format, e.g., "08:00 AM"
    required: true,
  },
  daysToRemind: {
    type: [String], // Array of strings, e.g., ["Monday", "Wednesday"]
    required: true,
  },
  completedDailyHabits: {
    type: Boolean,
    default: false,
  },
  streak: {
    type: Number,
    default: 0,
  },
  habits: {
    type: Map,
    of: [taskSchema], // Each habit contains an array of task objects
    default: {},
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Hash password before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add a method to compare hashed password with the provided password
userSchema.methods.isPasswordMatch = async function (providedPassword) {
  // Add a print statement to see both passwords
  console.log('Provided password:', providedPassword);
  console.log('Hashed password:', this
    .password);
  return await bcrypt.compare(providedPassword, this.password);
};

const User = mongoose.model('User', userSchema, 'userinfo');
export default User;
