import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import job from "./cron/cron.js";
import cors from "cors";

dotenv.config();

// Create the Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? 'https://mswd-hackathon-frontend.vercel.app' : '*', // Allow all in development
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,  // Allow cookies and other credentials
};

app.use(cors(corsOptions));

// Connect to the database and start cron jobs
connectDB();
job.start();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares	
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Serve the React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
