import express from "express";
import { Game, gameschema } from "../models/game.js";
import bodyParser from "body-parser";
import {createNewGame, deleteGame, getAllGames, getGameByID, joinGame} from '../controllers/gameController.js'
import { makeMove } from "../controllers/gameController.js";

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get("/", getAllGames);
router.get("/:id", getGameByID);
router.post("/", createNewGame);
router.post("/:id", joinGame);
router.post("/move/:id", makeMove);
router.delete("/:id", deleteGame);

export default router;
