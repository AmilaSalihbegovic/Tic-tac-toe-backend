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
import { Game } from "./models/game.js";
import { gameWin } from "./helper/gameWin.js";

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
    console.log("A user connected:" +socket.id);

    socket.on('joinGame', async(gameId)=>{
      const game = await Game.findById(gameId);
      socket.join(gameId);
      console.log(game);

      io.to(gameId).emit('gameState', {board: game?.board, moves: game?.moves, status: game?.status})
    });

    socket.on('makeMove', async({id, data})=>{
      console.log(data);
      const updatedGame = await Game.findById(id);
      const row = data?.row;
      const col = data?.col;
      const player = data?.playerID;
      console.log(player);
      if(updatedGame!==null){
        updatedGame.board[row][col] = player === updatedGame.playerX.playerID.toString()? "X":"O"; 
        updatedGame.moves.push({player: player, row:row, col:col})
        updatedGame.save();
        const winner = gameWin(updatedGame.board);
        if(winner === "X"){
          updatedGame.status = "Player X won";
        }else if (winner==="O"){
          updatedGame.status = "Player O won";        
        }else if(updatedGame.moves.length === 9){
          updatedGame.status = "Draw";
        }else{
          updatedGame.status = "in progress";      
        }
      }
      io.to(id).emit('gameState', {board: updatedGame?.board, moves: updatedGame?.moves, status: updatedGame?.status})
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  })
app.set("io", io);

export { app, server, io };