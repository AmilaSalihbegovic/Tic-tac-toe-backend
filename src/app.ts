import express from "express";
import mongoose from "mongoose";
import game from "./routes/gameRoute.js";
import user from "./routes/userRoute.js";
import auth from "./controllers/authController.js";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { makeMove } from "./controllers/gameController.js";

dotenv.config();

const app = express();

app.use(cors());
app.use("/api/user", user);
app.use("/api/game", game);
app.use("/api/auth", auth);

const server = http.createServer(app);

const io = new Server(server, {
  cors:{
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

async function connectToMongoDB(connectionString: string) {
  await mongoose.connect(connectionString);
  console.log("Connection established");
}

try {
  await connectToMongoDB(process.env.MONGODB_CONNECTION_STRING || "");
} catch (e) {
  console.log("Error" + e);
}


const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


io.on("connection", (socket)=>{

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  })
app.set("io", io);

export { app, server, io };