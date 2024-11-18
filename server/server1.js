//imports for database
import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import records from "./routes/record.js";

// imports for notifications
//const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const PushNotifications = require("node-pushnotifications");

const PORT = process.env.PORT || 5050;
const app = express();

// allow frontend requests (5173 is frontend)
app.use(cors({ origin: 'http://localhost:5173' }));
// Set static path to serve service worker file sw.js
app.use(express.static(path.join(__dirname, "../client/public"))); 
app.use(express.json()); //can access parsed data via req.body
app.use("/record", records);

// Connect to the database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });





