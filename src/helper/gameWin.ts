export function gameWin(gameBoard: string[][]) {
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