// Imports for general server setup
import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import PushNotifications from "node-pushnotifications";
import { fileURLToPath } from 'url';

// Imports for database
import connectDB from "./db/connection.js";
import records from "./routes/record.js";

// Web Push Keys (replace with your actual keys)
const publicVapidKey = "BBFPmJ3We2RjxJ1fbMFaznxyX1FvgDy0mrk2dWZFDQZBRGjbIKoL_gJj8NoVld4sCaZ3N-Tit6CSJaK5iwVAjQA";
const privateVapidKey = "oHeT0zuWP5JpifyeyxyScqnxp8sGF5NZ_i8Td7i8h9A";

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Allow frontend requests
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file; want to use __dirname so commonJS to ES workaround; https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
const __dirname = path.dirname(__filename); // get the name of the directory
app.use(express.static(path.join(__dirname, "../client/public"))); // Serve static files
app.use(express.json()); // JSON parsing
app.use(bodyParser.json()); // Body parser for notifications

// Routes
app.use("/record", records); // MongoDB routes

// Web Push Notifications Setup
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  
  const settings = {
    web: {
      vapidDetails: {
        subject: "mailto:ashleyemaurer@gmail.com", // Replace with your email
        publicKey: publicVapidKey,
        privateKey: privateVapidKey,
      },
      TTL: 2419200,
      contentEncoding: "aes128gcm",
      headers: {},
    },
    isAlwaysUseFCM: false,
  };

  // Send 201 - resource created
  const push = new PushNotifications(settings);

  // Create payload
  const payload = { title: "Notification from Knock" };
  
  push.send(subscription, payload, (err, result) => {
    if (err) {
      console.error("Push Notification Error:", err);
      //res.status(500).json({ error: "Notification failed" });
    } else {
      console.log("Push Notification Result:", result);
      //res.status(201).json({ success: "Notification sent successfully" });
    }
  });
});

// MongoDB Connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Fallback for serving main files
//app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../client/public/index.html")));
//app.get("/main.js", (req, res) => res.sendFile(path.join(__dirname, "../client/public/main.js")));
app.get("/sw.js", (req, res) => res.sendFile(path.join(__dirname, "../client/public/sw.js")));
