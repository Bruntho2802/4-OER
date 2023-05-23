<?php
session_start();
if (!isset($_SESSION['gebruikersnaam'])) {
    header("Location: login.php");
    exit();
}

$host = "localhost";
$username = "bit_academy";
$password = "bit_academy";
$database = "4oer";

// PDO-verbinding maken
try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Fout bij het verbinden met de database: " . $e->getMessage();
}

// Haal de ID van de ingelogde gebruiker op
$gebruikersnaam = $_SESSION['gebruikersnaam'];
$stmt = $conn->prepare("SELECT id FROM accounts WHERE gebruikersnaam = :gebruikersnaam");
$stmt->bindParam(':gebruikersnaam', $gebruikersnaam);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
$userId = $result['id'];

include("update_winner.php");

?>
<script>
    // Spelers Red en Yellow
    var playerRed = "R";
    var playerYellow = "Y";
    var currPlayer = playerRed;

    // Red begint het spel
    var gameOver = false;
    var board;

    // Maakt aantal rijen in het bord; 6 horizontaal en 7 verticaal
    var rows = 6;
    var columns = 7;
    var currColumns = []; // Houdt bij in welke rij elke kolom staat

    // Setgame wordt geladen wanneer de pagina word geopent
    window.onload = function() {
        setGame();
    }

    // Als je een optie hebt gekozen waar je je munt in laat vallen valt het altijd op de onderste rij.
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

        // hier wordt gechecked of speler Yellow aan de beurt is
        checkWinner();
        if (currPlayer == playerYellow && !gameOver) {
            setTimeout(function() {
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

    // Hier wordt bepaald wie de winner is
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
    //  print uit wie er heeft gewonnen en verstuur een POST 
    function setWinner(r, c) {
        let winner = document.getElementById("winner");
        if (board[r][c] == playerRed) {
            const parentContainer = document.createElement("div");
            parentContainer.classList.add("parent-container");

            const winner = document.createElement("div");
            winner.innerText = "JIJ HEBT GEWONNEN!";
            winner.style.fontSize = "50px";

            parentContainer.appendChild(winner);
            document.body.appendChild(parentContainer);
            const xmlhttp = new XMLHttpRequest();
            // redirect naar Update_winner.php
            xmlhttp.open("POST", 'update_winner.php', true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {

                }
            };
            // de waarde van de POST
            xmlhttp.send("winner=red");

        } else {
            const parentContainer = document.createElement("div");
            parentContainer.classList.add("parent-container");

            const winner = document.createElement("div");
            winner.innerText = "VERLOREN!";
            winner.style.fontSize = "50px";

            parentContainer.appendChild(winner);
            document.body.appendChild(parentContainer);
        }
        gameOver = true;
    }
</script>

<!DOCTYPE html>
<html>

<head>
    <title>Game</title>
</head>

<body>
    <div id="winner"></div>
    <script>
        // let playerRed = "red";
        // let board = [
        //     [playerRed, null, null],
        //     [playerRed, null, null],
        //     [playerRed, null, null]
        // ];
        // let gameOver = false;

        // function setWinner(r, c) {
        //     let winner = document.getElementById("winner");
        //     if (board[r][c] == playerRed) {
        //         winner.innerText = "Rood heeft gewonnen! !!!";
        //         // Send the winner data to PHP script
        //         let xmlhttp = new XMLHttpRequest();
        //         xmlhttp.open("POST", "update_winner.php", true);
        //         xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //         xmlhttp.onreadystatechange = () => {
        //             if (this.readyState == 4 && this.status == 200) {
        //                 console.log(this.responseText);
        //             }
        //         };

        //         xmlhttp.send("winner=red");
        //     } else {
        //         winner.innerText = "Geel heeft gewonnen! !!!";
        //         // Send the winner data to PHP script
        //         // let xmlhttp = new XMLHttpRequest();
        //         // xmlhttp.onreadystatechange = function() {
        //         //     if (this.readyState == 4 && this.status == 200) {
        //         //         console.log(this.responseText);
        //         //     }
        //         // };

        //     }
        //     gameOver = true;
        // }
    </script>




</body>

</html>