import { Game } from "../models/game.js";

export const createNewGame = async (req: any, res: any) => {
  try {
    const playerX = req.body.playerX;
    const playerO = req.body.playerO;

    if (!playerX) {
      res.status(400).send("Players are required for the game to start");
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
      });
      game.save();
      res.status(200).send("Game created!");
    } else {
      const game = await Game.create({
        playerX: playerX,
        playerO: null,
        status: "in progress",
        board: initialBoard,
        moves: [],
      });
      game.save();
      res.status(200).send("Game created!");
    }
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
      res.status(400).send("Game does not exist, try again");
    }
    const game = await Game.findById(gameid);
    if (!game) {
      res.status(400).send("Game does not exist, try again");
    } else {
      if (game.playerO.playerID) {
        res.status(400).send("Game is already full.");
      } else {
        game.playerO.playerID = playerID;
        await game.save();
        res.status(200).send("Player has joined the game.");
      }
    }
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
    let currentSymbol = null;

    if (gameid === null) {
      return res.status(400).send("Game does not exist, try again");
    }
    const game = await Game.findById(gameid);

    if (!game) {
      return res.status(400).send("Game does not exist, try again");
    } else {
      const num_rows = game.board.length;
      const num_col = game.board[0].length;

      if (!game.playerO.playerID) {
        if (game.playerX.playerID.toString() !== playerID) {
          return res
            .status(403)
            .send(
              "Player with this ID does not have the permision to play game with given id."
            );
        }
      }

      if (
        game.playerX.playerID.toString() !== playerID &&
        game.playerO.playerID.toString() !== playerID
      ) {
        return res
          .status(403)
          .send(
            "Player with this ID does not have the permision to play game with given id."
          );
      }
      if (game.playerX.playerID.toString() === playerID) {
        currentSymbol = "X";
      } else {
        currentSymbol = "O";
      }
      if (game.status === "in progress") {
        console.log(0 <= row && row < num_rows && 0 <= col && col < num_col);
        if (0 <= row && row < num_rows && 0 <= col && col < num_col) {
          const boardField = game.board[row][col];
          if (boardField !== "") {
            return res
              .status(400)
              .send("Field is not emty, cannot override move.");
          } else {
            game.board[row][col] = currentSymbol;
            if (gameWin(game.board) === "X") {
              game.moves.push({ player: playerID, row: row, col: col });
              game.status = "Player X won";
              game.save();
              return res.status(201).send("Player X won!");
            } else if (gameWin(game.board) === "O") {
              game.moves.push({ player: playerID, row: row, col: col });            
              game.status = "Player O won";
              game.save();
              return res.status(201).send("Player O won!");
            }else if(game.moves.length ===8){
                res.status(202).send("Its a draw!");
                game.status = "Draw";
                game.save();
            }
            game.moves.push({ player: playerID, row: row, col: col });
            game.save();
            return res.status(201).send("The move is made.");
          }
        } else {
          res.status(400).send("The move is not in the board.");
        }
      } else {
        res.status(400).send("Game with given id is over.");
      }
    }
  } catch (error) {
    return res
      .status(400)
      .send("Error occured while trying to make move." + error);
  }
};

function gameWin(gameBoard: string[][]) {
  for (let i = 0; i < 3; i++) {
    if (
      gameBoard[i][0] == "X" &&
      gameBoard[i][1] == "X" &&
      gameBoard[i][2] == "X"
    ) {
      return "X";
    } else if (
      gameBoard[i][0] == "O" &&
      gameBoard[i][1] == "O" &&
      gameBoard[i][2] == "O"
    ) {
      return "O";
    }
  }
  for (let j = 0; j < 3; j++) {
    if (
      gameBoard[0][j] == "X" &&
      gameBoard[1][j] == "X" &&
      gameBoard[2][j] == "X"
    ) {
      return "X";
    } else if (
      gameBoard[0][j] == "O" &&
      gameBoard[1][j] == "O" &&
      gameBoard[2][j] == "O"
    ) {
      return "O";
    }
  }
  if (
    (gameBoard[0][0] == "X" &&
      gameBoard[1][1] == "X" &&
      gameBoard[2][2] == "X") ||
    (gameBoard[0][2] == "X" && gameBoard[1][1] == "X" && gameBoard[2][0] == "X")
  ) {
    return "X";
  } else if (
    (gameBoard[0][0] == "O" &&
      gameBoard[1][1] == "O" &&
      gameBoard[2][2] == "O") ||
    (gameBoard[0][2] == "O" && gameBoard[1][1] == "O" && gameBoard[2][0] == "O")
  ) {
    return "O";
  }
}
