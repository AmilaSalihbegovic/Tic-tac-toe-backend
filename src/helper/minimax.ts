import { gameWin } from "./gameWin.js";

export function minimax(
  board: string[][],
  depth: number,
  isMaximizingPlayer: boolean
) {
  const scores = {
    X: -1,
    O: 1,
    draw: 0,
  };

  if (gameWin(board) === "X") {
    return scores.X;
  }
  if (gameWin(board) === "O") {
    return scores.O;
  }
  if (depth === 9) {
    return scores.draw;
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === "") {
          board[row][col] = "O";
          const score = minimax(board, depth + 1, false);
          board[row][col] = "";
          bestScore = Math.max(bestScore, score);
        }
      }
    }
    return bestScore;
  }
  let bestScore = Infinity;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        board[row][col] = "X";
        const score = minimax(board, depth + 1, true);
        board[row][col] = "";
        bestScore = Math.min(bestScore, score);
      }
    }
  }
  return bestScore;
}

export function FindBestMove(board: string[][]) {
  let bestScore = -Infinity;
  let bestMove = { row: -1, col: -1 };
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        board[row][col] = "O";
        const score = minimax(board, 0, false);
        board[row][col] = "";

        if (score > bestScore) {
          bestScore = score;
          bestMove = { row, col };
        }
      }
    }
  }
  return bestMove;
}
