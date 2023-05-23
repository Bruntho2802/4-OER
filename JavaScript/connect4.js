// player rood en geel 
var playerRed = "R";
var playerYellow = "Y";
// rood begint hier altijd
var currPlayer = playerRed;

var gameOver = false;
var board;
// maakt aantal rijen in het bord 6 verticaal rows en 7 horizontaal columns
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

    r -= 1;
    currColumns[c] = r;

    checkWinner();
}
// controleert of je hebt gewonnen
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
        const parentContainer = document.createElement("div");
            parentContainer.classList.add("parent-container");

            const winner = document.createElement("div");
            winner.innerText = "ROOD HEEFT GEWONNEN!";
            winner.style.fontSize = "50px";

            parentContainer.appendChild(winner);
            document.body.appendChild(parentContainer);
        // als geel wint print rood heeft gewonnen
    } else {
        const parentContainer = document.createElement("div");
            parentContainer.classList.add("parent-container");

            const winner = document.createElement("div");
            winner.innerText = "GEEL HEEFT GEWONNEN!";
            winner.style.fontSize = "50px";

            parentContainer.appendChild(winner);
            document.body.appendChild(parentContainer);
    }
    gameOver = true;
}

