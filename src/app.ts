import express from "express";
import mongoose from "mongoose";
import game from './routes/gameRoute.js';
import user from './routes/userRoute.js';
import dotenv from "dotenv";

dotenv.config();
//console.log(dotenv.config());
const app = express();
app.use('/api/user', user);
app.use('/api/game', game);



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

const size = 3; // For a 3x3 board
const emptyCell = '_';
const initialBoard = Array.from({ length: size }, () => Array(size).fill(emptyCell));


const game = new Game({
  playerX: ["64ca44f8509375329d47dece", "X"],
  playerO: ["64ca4545cccdcc50e65abb63", "O"],
  status: "in progress",
  board: initialBoard,
  moves: [
    {
      row: 2,
      column: 1,
      player: "O",
    },
    { row: 1, column: 2, player: "O" },
  ],
});
game.save();
*/
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
