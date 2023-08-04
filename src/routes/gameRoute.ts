import express from "express";
import { Game, gameschema } from "../models/game.js";
import bodyParser from "body-parser";
import {createNewGame, joinGame, makeMove} from '../controllers/gameController.js'

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//Get all games
router.get("/", async (req, res) => {
  try {
    const games = await Game.find();
    if(games.length === 0 || games === null){
        res.status(400).send("There is no games in database!");
    }else{
        res.json(games);
    }
  } catch (error) {
    return console.log("Error while getting the data", error);
  }
});

//get game by id for game history later on
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if(!game){
        res.status(400).send("Game with given ID does not exist.");
    }else{
        res.status(200).send(game.status);
    }
  } catch (error) {
    return res.status(400).send("Could not get the game.");
  }
});

//Create new game
router.post("/", createNewGame);
//join the game
router.post("/:id", joinGame);
//make move
router.post("/move/:id", makeMove);
//delete game

router.delete("/:id", async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if(!game){
        res.status(400).send("Game with given ID does not exist.");
    }else{
        res.status(200).send("A game has been deleted successfully");
    }
  } catch (error) {
    return console.log("Error while trying to delete game.", error);
  }
});

export default router;
