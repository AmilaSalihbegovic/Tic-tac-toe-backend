import express from "express";
import { Game, gameschema } from "../models/game.js";
import bodyParser from "body-parser";
import { auth } from "../middleware/auth.js";
import { io } from "../app.js";
import { error } from "console";
import { Document } from "mongoose";

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Get all games
router.get("/", auth, async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    return console.log("Error while getting the data", error);
  }
});

//get game by id
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    res.json(game);
  } catch (error) {
    return res.status(400).send("Could not get the game.");
  }
});

//post new game
router.post("/", async (req, res) => {
  try {
    const newGame = new Game(req.body);
    newGame.save().then((g) => res.json(g));
  } catch (error) {
    return console.log("Error while trying to add new game", error);
  }
});

//delete game

router.delete("/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    res.json(game);
  } catch (error) {
    return console.log("Error while trying to delete game.", error);
  }
});

export default router;
