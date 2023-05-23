// player rood en geel 
var playerRed = "R";
var playerYellow = "Y";
// rood begint hier altijd
var currPlayer = playerRed;

var gameOver = false;
var board;
// maakt aantal rijen in het bord 6 horizontaal rows en 7 verticaal columns
var rows = 6;
var columns = 7;
var currColumns = [];   // houdt bij in welke rij elke kolom staat.

// setgame wordt geladen wanneer de pagina word geopent
window.onload = function () {
    setGame();
}
// als je een optie hebt gekozen waar je je munt in laat vallen valt het altijd op de onderste rij.
function setGame() {
    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];
    // afmetingen uitprinten afmetingen rows x columns
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // nieuwe row aangemaakt
            row.push(' ');
            // maakt nieuwe div element in een html bestand 
            let tile = document.createElement("div");
            //  HTML-element dat is opgeslagen in de variabele "tile".
            tile.id = r.toString() + "-" + c.toString();
            // nieuwe classlist genaamd tile 
            tile.classList.add("tile");
            // Wanneer dit event wordt geactiveerd door een gebruiker die op het element klikt, wordt de functie genaamd "setPiece" uitgevoerd.
            tile.addEventListener("click", setPiece);
            // code selecteert het HTML element met het id "board" met behulp van de getElementById()
            document.getElementById("board").append(tile);
        }
        // voegt een nieuwe rij toe aan het bord 
        board.push(row);
    }
}
// Deze functie controleert of het spel voorbij is 
function setPiece() {
    if (gameOver) {
        return;
    }

    // zet de resulterende strings om in getallen met parseInt() en slaat ze op in de variabelen r en c. 
    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    //  haalt de huidige waarde op van de c-de kolom in de currColumns array en slaat deze op in de variabele r.
    r = currColumns[c];

    if (r < 0) {
        return;
    }
    //  zorgt er voor dat de border kleur elke beurt veranderd
    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());

    // als rood aan de beurd is veranderd border naar geel
    if (currPlayer == playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
        document.documentElement.style.setProperty('--border-color', 'var(--border-color-yellow)');
    }
    // als rood aan de beurd is veranderd border naar rood
    else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
        document.documentElement.style.setProperty('--border-color', 'var(--border-color-red)');
    }
    // hier begint het stukje BOT
    r -= 1;
    currColumns[c] = r;

    checkWinner();

    // hier wordt gechecked of speler Yellow aan de beurt is
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

// Hier wordt bepaald wat de beste "move" is
function pickBestMove() {
    let bestScore = -Infinity;
    let bestColumn = null;

    for (let c = 0; c < columns; c++) {
        if (currColumns[c] < 0) {
            continue;
        }

        let r = currColumns[c];
        let score = evaluatePosition(r, c, playerYellow);

        // Checkt speler rood's win kansen (welke moves) en zorgt ervoor dat deze worden ingenomen door yellow
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

    // Checkt horizontale rij
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length - 3; col++) {
            const window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
            const numCurrentPlayerTokens = window.filter(token => token === currentPlayer).length;
            const numOpponentTokens = window.filter(token => token !== currentPlayer && token !== 'empty').length;

            if (numCurrentPlayerTokens === 3 && numOpponentTokens === 1) {
                // Je kan winnen door deze rij + checkt of we dit vakje moeten innemen
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
                // Je kan winnen in deze rij
                winningWindows.push(window);
            }
        }
    }

    // Checkt verticale rij
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
            const numCurrentPlayerTokens = window.filter(token => token === currentPlayer).length;
            const numOpponentTokens = window.filter(token => token !== currentPlayer && token !== 'empty').length;

            if (numCurrentPlayerTokens === 3 && numOpponentTokens === 1) {
                // Je kan winnen door deze rij + checkt of we dit vakje moeten innemen
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
                // Je kan winnen in deze rij
                winningWindows.push(window);
            }
        }
    }

    // Checkt schuine rijen van links naar rechts
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

    // checkt horizontale rij
    let left = Math.max(0, c - 3);
    let right = Math.min(columns - 1, c + 3);
    for (let i = left; i <= right - 3; i++) {
        let window = [board[r][i], board[r][i + 1], board[r][i + 2], board[r][i + 3]];
        score += evaluateWindow(window, player);
    }

    // checkt verticale rij
    let bottom = Math.max(0, r - 3);
    let top = Math.min(rows - 1, r + 3);
    for (let i = bottom; i <= top - 3; i++) {
        let window = [board[i][c], board[i + 1][c], board[i + 2][c], board[i + 3][c]];
        score += evaluateWindow(window, player);
    }

    // checkt schuine rijen
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

    // vermindert de "weight" die naar de vakjes van rood gaan
    if (player == playerRed) {
        score *= 0.8;
    }

    return score;
}

// hier wordt een venster van vier vakjes gekeken en geeft de score van Yellow of Red terug
function evaluateWindow(window, player) {
    let score = 0;

    let opponent = playerRed;
    if (player == playerRed) {
        opponent = playerYellow;
    }

    let emptyCount = 0;
    let playerCount = 0;
    let opponentCount = 0;

    // Telt het aantal lege vakjes van Yellow en Red
    for (let i = 0; i < 4; i++) {
        if (window[i] == ' ') {
            emptyCount++;
        } else if (window[i] == player) {
            playerCount++;
        } else {
            opponentCount++;
        }
    }

    // Geeft een score aan het venster wat afhangt van de hoeveelheid lege vakjes
    if (playerCount == 4) {
        score += 100000;
    } else if (playerCount == 3 && emptyCount == 1) {
        score += 1000;
    } else if (playerCount == 2 && emptyCount == 2) {
        score += 100;
    }

    // Haalt de score van het venster af wat afhangt van de hoeveelheid lege vakjes
    if (opponentCount == 3 && emptyCount == 1) {
        score -= 1000;
    }

    return score;
}
// Hier eindigt het stukje BOT
function checkWinner() {
    // controleert of horizontaal 4 munten op een rij hebt 
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

    // controleert of verticaal 4 munten op een rij hebt 
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

    // controleert of rechts boven naar links onder 4 munten op een rij hebt 
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

    // controleert of links boven naar rechts onder 4 munten op een rij hebt 
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
    // als rood wint print rood heeft gewonnen
    if (board[r][c] == playerRed) {
        winner.innerText = "Rood heeft gewonnen!";
        // als geel wint print rood heeft gewonnen
    } else {
        winner.innerText = "Geel heeft gewonnen!";
    }
    gameOver = true;
}

