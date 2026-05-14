import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import commentsRouter from "./routes/comments.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

if (!process.env.MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Server will start without DB connection.");
} else {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));
}

app.use("/api/comments", commentsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
