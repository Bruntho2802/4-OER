var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;

var gameOver = false;
var board;

var rows = 6;
var columns = 7;
var currColumns = []; //keeps track of which row each column is at.

window.onload = function () {
    setGame();
}

function setGame() {
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // JS
            row.push(' ');
            // HTML
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

function setPiece() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c];

    if (r < 0) {
        return;
    }

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer == playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
        document.documentElement.style.setProperty('--border-color', 'var(--border-color-yellow)');
    } else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
        document.documentElement.style.setProperty('--border-color', 'var(--border-color-red)');
    }

    r -= 1;
    currColumns[c] = r;

    checkWinner();

    // check if it's the yellow player's turn
    if (currPlayer == playerYellow && !gameOver) {
        setTimeout(function () {
            let randomColumn = Math.floor(Math.random() * columns);
            let r = currColumns[randomColumn];
            while (r < 0) {
                randomColumn = Math.floor(Math.random() * columns);
                r = currColumns[randomColumn];
            }
            let tile = document.getElementById(r.toString() + "-" + randomColumn.toString());
            tile.click();
        }, 1000);
    }
}

function pickBestMove() {
    let bestScore = -Infinity;
    let bestColumn = null;

    for (let c = 0; c < columns; c++) {
        if (currColumns[c] < 0) {
            continue;
        }

        let r = currColumns[c];
        let score = evaluatePosition(r, c, playerYellow);

        // check for red's potential winning moves and add penalty
        let redWinningWindows = findWinningWindows(playerRed);
        let numRedWinningWindows = redWinningWindows.length;
        for (let i = 0; i < numRedWinningWindows; i++) {
            if (redWinningWindows[i].includes(c)) {
                score -= 10000;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestColumn = c;
        }
    }

    return bestColumn;
}

function findWinningWindows(board, currentPlayer) {
    const winningWindows = [];

    // Check horizontal windows
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length - 3; col++) {
            const window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
            const numCurrentPlayerTokens = window.filter(token => token === currentPlayer).length;
            const numOpponentTokens = window.filter(token => token !== currentPlayer && token !== 'empty').length;

            if (numCurrentPlayerTokens === 3 && numOpponentTokens === 1) {
                // This window is a potential win for the current player, check if we need to block the opponent
                const opponentTokenIndex = window.findIndex(token => token !== currentPlayer && token !== 'empty');
                if (opponentTokenIndex >= 0) {
                    const blockingCol = col + opponentTokenIndex;
                    if (isValidMove(board, blockingCol) && board[row][blockingCol] === 'empty') {
                        const blockingWindow = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
                        blockingWindow[blockingCol - col] = currentPlayer;
                        winningWindows.push(blockingWindow);
                    }
                }
            } else if (numCurrentPlayerTokens === 4) {
                // This window is a win for the current player
                winningWindows.push(window);
            }
        }
    }

    // Check vertical windows
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
            const numCurrentPlayerTokens = window.filter(token => token === currentPlayer).length;
            const numOpponentTokens = window.filter(token => token !== currentPlayer && token !== 'empty').length;

            if (numCurrentPlayerTokens === 3 && numOpponentTokens === 1) {
                // This window is a potential win for the current player, check if we need to block the opponent
                const opponentTokenIndex = window.findIndex(token => token !== currentPlayer && token !== 'empty');
                if (opponentTokenIndex >= 0) {
                    const blockingRow = row + opponentTokenIndex;
                    if (isValidMove(board, col) && board[blockingRow][col] === 'empty') {
                        const blockingWindow = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
                        blockingWindow[blockingRow - row] = currentPlayer;
                        winningWindows.push(blockingWindow);
                    }
                }
            } else if (numCurrentPlayerTokens === 4) {
                // This window is a win for the current player
                winningWindows.push(window);
            }
        }
    }

    // Check diagonal windows with positive slope
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[row].length - 3; col++) {
            const window = [
                board[row][col],
                board[row + 1][col + 1],
                board[row + 2][col + 2],
                board[row + 3][col + 3],
            ];
            if (window.every((val) => val === player)) {
                return window;
            }
        }
    }
}

function evaluatePosition(r, c, player) {
    let score = 0;

    // check horizontal
    let left = Math.max(0, c - 3);
    let right = Math.min(columns - 1, c + 3);
    for (let i = left; i <= right - 3; i++) {
        let window = [board[r][i], board[r][i + 1], board[r][i + 2], board[r][i + 3]];
        score += evaluateWindow(window, player);
    }

    // check vertical
    let bottom = Math.max(0, r - 3);
    let top = Math.min(rows - 1, r + 3);
    for (let i = bottom; i <= top - 3; i++) {
        let window = [board[i][c], board[i + 1][c], board[i + 2][c], board[i + 3][c]];
        score += evaluateWindow(window, player);
    }

    // check diagonal
    let d1 = Math.min(right - c, top - r);
    let d2 = Math.min(c - left, top - r);
    for (let i = 0; i <= d1 - 4; i++) {
        let window = [board[r + i][c + i], board[r + i + 1][c + i + 1], board[r + i + 2][c + i + 2], board[r + i + 3][c + i + 3]];
        score += evaluateWindow(window, player);
    }
    for (let i = 0; i <= d2 - 4; i++) {
        let window = [board[r + i][c - i], board[r + i + 1][c - i - 1], board[r + i + 2][c - i - 2], board[r + i + 3][c - i - 3]];
        score += evaluateWindow(window, player);
    }

    // reduce weight given to red's windows
    if (player == playerRed) {
        score *= 0.8;
    }

    return score;
}

function evaluateWindow(window, player) {
    let score = 0;

    let opponent = playerRed;
    if (player == playerRed) {
        opponent = playerYellow;
    }

    let emptyCount = 0;
    let playerCount = 0;
    let opponentCount = 0;

    for (let i = 0; i < 4; i++) {
        if (window[i] == ' ') {
            emptyCount++;
        } else if (window[i] == player) {
            playerCount++;
        } else {
            opponentCount++;
        }
    }

    if (playerCount == 4) {
        score += 100000;
    } else if (playerCount == 3 && emptyCount == 1) {
        score += 1000;
    } else if (playerCount == 2 && emptyCount == 2) {
        score += 100;
    }

    if (opponentCount == 3 && emptyCount == 1) {
        score -= 1000;
    }

    return score;
}

function checkWinner() {
    // horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c + 1] && board[r][c + 1] == board[r][c + 2] && board[r][c + 2] == board[r][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r + 1][c] && board[r + 1][c] == board[r + 2][c] && board[r + 2][c] == board[r + 3][c]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // anti diagonal
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r + 1][c + 1] && board[r + 1][c + 1] == board[r + 2][c + 2] && board[r + 2][c + 2] == board[r + 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // diagonal
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r - 1][c + 1] && board[r - 1][c + 1] == board[r - 2][c + 2] && board[r - 2][c + 2] == board[r - 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}
// print uit wie er heeft gewonnen
function setWinner(r, c) {
    let winner = document.getElementById("winner");
    if (board[r][c] == playerRed) {
        winner.innerText = "Rood heeft gewonnen!";
    } else {
        winner.innerText = "Geel heeft gewonnen!";
    }
    gameOver = true;
}
