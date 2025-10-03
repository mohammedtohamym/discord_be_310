const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const socketServer = require("./socketServer");
const authRoutes = require("./routes/authRoutes");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes");

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
app.use(express.json());
app.use(cors());

// register the routes
app.use("/api/auth", authRoutes);
app.use("/api/friend-invitation", friendInvitationRoutes);

mongoose.set("strictQuery", false);

const server = http.createServer(app);
socketServer.registerSocketServer(server);

const { MONGO_URI } = process.env;

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

if (!MONGO_URI) {
  console.warn(
    "Missing MONGO_URI environment variable. Copy .env.example to .env and provide a valid MongoDB connection string. Database connection skipped."
  );
} else {
  const connectToDatabase = async (attempt = 1) => {
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error(
        `Database connection attempt ${attempt} failed. Server is still running.`
      );
      if (err?.name === "MongooseServerSelectionError") {
        console.error(
          "Unable to connect to MongoDB cluster. If you're using MongoDB Atlas, ensure your current IP is whitelisted or switch to a local MongoDB instance."
        );
      }
      console.error(err);

      const retryDelayMs = Math.min(30000, attempt * 5000);
      console.log(
        `Retrying database connection in ${retryDelayMs / 1000} seconds...`
      );
      setTimeout(() => connectToDatabase(attempt + 1), retryDelayMs);
    }
  };

  connectToDatabase();
}
