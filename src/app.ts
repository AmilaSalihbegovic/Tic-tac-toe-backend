import express from "express";
import mongoose from "mongoose";
import game from './routes/gameRoute.js';
import user from './routes/userRoute.js';
import auth from './controllers/authController.js';
import dotenv from "dotenv";
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';



dotenv.config();


const app = express();
app.use('/api/user', user);
app.use('/api/game', game);
app.use('/api/auth', auth);
app.use(cors());
const server = http.createServer(app);

// export const io = new Server(server, {
//   //cors 
// })

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
