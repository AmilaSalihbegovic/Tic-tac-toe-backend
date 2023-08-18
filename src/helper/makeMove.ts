import { gameWin } from "./gameWin.js";
import { FindBestMove } from "./minimax.js";

const gameWinner = async (
  req: any,
  res: any,
  game: any,
  playerID: string,
  row: number,
  col: number
) => {
  if (gameWin(game.board) === "X") {
    game.moves.push({ player: playerID, row: row, col: col });
    game.status = "Player X won";
    game.save();
    return res.status(200).send("Player X has won!");
  } else if (gameWin(game.board) === "O") {
    game.moves.push({ player: playerID, row: row, col: col });
    game.status = "Player O won";
    game.save();
    return res.status(200).send("Player O has won!");
  } else if (game.moves.length === 9) {
    game.status = "Draw";
    game.save();
    return res.status(200).send("Draw");
  } else {
    game.moves.push({ player: playerID, row: row, col: col });
    game.save();
    const lastMove = game.moves[game.moves.length - 1];
    const lastMoveRow = lastMove.row;
    const lastMoveCol = lastMove.col;
    if(playerID===null){
      return res.status(200).send([lastMoveRow, lastMoveCol]);
    }
    return res.status(200).send("Move is made");
  }
};

export const makeMoveFunction = async (
  req: any,
  res: any,
  game: any,
  playerID: string,
  currentSymbol: string,
  row: number,
  col: number
) => {
  const num_rows = game.board.length;
  const num_col = game.board[0].length;

   if(game.playerX.playerID.toString() !==playerID && playerID !== null && !game.playerO.playerID){
     return res.status(403).send("You cannot access this game3!");

   }
  currentSymbol = game.playerX.playerID.toString() === playerID ? "X" : "O";
  if (!game.playerO.playerID) {
    if (
      (game.playerX.playerID.toString() !== playerID &&
        currentSymbol === "X") 
    ) {
      return res.status(403).send("You cannot access this game2!");
    }
  } else if (
    (game.playerX.playerID.toString() !== playerID && currentSymbol === "X") ||
    (game.playerO.playerID.toString() !== playerID && currentSymbol === "O")
  ) {
    return res.status(403).send("You cannot access this game1!");
  }
  if (game.status === "in progress") {
    if (!game.playerO.playerID && playerID === null && currentSymbol === "O") {
      const aiMove = FindBestMove(game.board);
      const aiRow = aiMove.row;
      const aiCol = aiMove.col;
      game.board[aiRow][aiCol] = "O";
      gameWinner(req, res, game, playerID, aiRow, aiCol);
    } else if (0 <= row && row < num_rows && 0 <= col && col < num_col) {
      const boardField = game.board[row][col];
      if (boardField !== "") {
        return res.status(400).send("The field is not empty!");
      } else {
        game.board[row][col] = currentSymbol;
        gameWinner(req, res, game, playerID, row, col);
      }
    } else {
      return res.status(400).send("The move must be in board");
    }
  } else {
    return res.status(400).send("Game is finished!");
  }
};
