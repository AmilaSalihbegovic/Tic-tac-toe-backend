import express from "express";
import { Game, gameschema } from "../models/game.js";
import bodyParser from "body-parser";
import {createNewGame, deleteGame, getAllGames, getGameByID, getGameHistoryID, joinGame} from '../controllers/gameController.js'
import { makeMove } from "../controllers/gameController.js";

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//Get all games
router.get("/", getAllGames);
//get game by id for game history later on
router.get("/history/:id", getGameHistoryID);
router.get("/:id", getGameByID);
//Create new game
router.post("/", createNewGame);
//join the game
router.post("/:id", joinGame);
//make move
router.post("/move/:id", makeMove);
//delete game
router.delete("/:id", deleteGame);

export default router;
