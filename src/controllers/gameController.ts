import { makeMoveFunction } from "../helper/makeMove.js";
import { Game } from "../models/game.js";

export const getAllGames = async (req: any, res: any) => {
  try {
    const games = await Game.find();
    if (games.length === 0 || games === null) {
      return res.status(400).send("There is no games in database!");
    }
    return res.json(games);
  } catch (error) {
    return console.log("Error while getting the data", error);
  }
};
export const getGameByID = async (req: any, res: any) => {
  try {
    const game = await Game.findById(req.params.id);
    let info = "";
    if (!game) {
      res.status(400).send("Game with given ID does not exist.");
    } else {
      res.status(200).send(game);
    }
  } catch (error) {
    return res.status(400).send("Could not get the game.");
  }
};
export const deleteGame = async (req: any, res: any) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      res.status(400).send("Game with given ID does not exist.");
    } else {
      res.status(200).send("A game has been deleted successfully");
    }
  } catch (error) {
    return console.log("Error while trying to delete game.", error);
  }
};
export const createNewGame = async (req: any, res: any) => {
  try {
    const playerX = req.body.playerX;
    const playerO = req.body.playerO;
    if (!playerX) {
      return res.status(400).send("Players are required for the game to start");
    }
    const size = 3;
    const emptyCell = "";
    const initialBoard = Array.from({ length: size }, () =>
      Array(size).fill(emptyCell)
    );
    if (playerO !== null) {
      const game = await Game.create({
        playerX: playerX,
        playerO: playerO,
        status: "in progress",
        board: initialBoard,
        moves: [],
        currentPlayer: "X",
      });
      game.save();
      return res.status(200).send(game);
    }
    const game = await Game.create({
      playerX: playerX,
      playerO: null,
      status: "in progress",
      board: initialBoard,
      moves: [],
      currentPlayer: "X",
    });
    game.save();
    return res.status(200).send(game);
  } catch (error) {
    res
      .status(400)
      .send("Could not create the game because of an error: " + error);
  }
};

export const joinGame = async (req: any, res: any) => {
  try {
    const playerID = req.body.playerID;
    const gameid = req.params.id;

    if (gameid === null) {
      return res.status(400).send("Game does not exist, try again");
    }
    const game = await Game.findById(gameid);
    if (!game) {
      return res.status(400).send("Game does not exist, try again");
    }
    if (game.playerO.playerID !== null) {
      return res.status(400).send("Game is already full.");
    }
    game.playerO.playerID = playerID;
    await game.save();
    return res.status(200).send("Player has joined the game.");
  } catch (error) {
    res.status(400).send("Error occured while trying to join the game.");
  }
};
export const makeMove = async (req: any, res: any) => {
  try {
    const playerID = req.body.playerID;
    const row = req.body.row;
    const col = req.body.col;
    const gameid = req.params.id;

    if (gameid === null) {
      return res.status(400).send("Game does not exist, try again");
    }
    const game = await Game.findById(gameid);
    if (!game) {
      return res.status(400).send("Game does not exist, try again");
    }
    let currentSymbol = game.currentPlayer;
    makeMoveFunction(req, res, game, playerID, currentSymbol, row, col);
  } catch (error) {
    return res
      .status(400)
      .send("Error occured while trying to make move." + error);
  }
};
