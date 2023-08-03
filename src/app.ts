import express from "express";
import mongoose from "mongoose";
import game from './routes/gameRoute.js';
import user from './routes/userRoute.js';
import auth from './routes/auth.js';
import dotenv from "dotenv";
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';



dotenv.config();
//console.log(dotenv.config());


const app = express();
app.use('/api/user', user);
app.use('/api/game', game);
app.use('/api/auth', auth);
app.use(cors());
const server = http.createServer(app);

export const io = new Server(server, {
  //cors 
})

async function connectToMongoDB(connectionString: string) {
  await mongoose.connect(connectionString);
  console.log("Connection established");
}

try {
  await connectToMongoDB(process.env.MONGODB_CONNECTION_STRING || "");
} catch (e) {
  console.log("Error" + e);
}

//console.log(process.env)
/*
const user = new User({
    name: 'test2',
    email: 'test2',
    password: 'testtest2'
});
user.save();

const size = 3; 
const emptyCell = '_';
const initialBoard = Array.from({ length: size }, () => Array(size).fill(emptyCell));


const game = new Game({
  playerX: ["64ca44f8509375329d47dece", "X"],
  playerO: ["64ca4545cccdcc50e65abb63", "O"],
  status: "in progress"
});
game.save();
*/
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
