import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());
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
