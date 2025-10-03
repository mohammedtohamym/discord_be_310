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

if (!MONGO_URI) {
  console.error(
    "Missing MONGO_URI environment variable. Copy .env.example to .env and provide a valid MongoDB connection string."
  );
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("database connection failed. Server not started");
    if (err?.name === "MongooseServerSelectionError") {
      console.error(
        "Unable to connect to MongoDB cluster. If you're using MongoDB Atlas, ensure your current IP is whitelisted or switch to a local MongoDB instance."
      );
    }
    console.error(err);
  });
