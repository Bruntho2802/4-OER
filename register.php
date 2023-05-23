<?php
session_start();

// Controleren of de gebruiker al is ingelogd
if (isset($_SESSION['gebruikersnaam'])) {
    header("Location: index.php"); // Redirect naar homepagina
}

// Databasegegevens
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

// Controleren of het registratieformulier is verzonden
if (isset($_POST['register'])) {
    // Gebruikersnaam en wachtwoord ophalen uit het formulier
    $gebruikersnaam = $_POST['gebruikersnaam'];
    $wachtwoord = $_POST['wachtwoord'];

    // Controleren of de gebruikersnaam al bestaat in de database
    $query = "SELECT * FROM accounts WHERE gebruikersnaam = :gebruikersnaam";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':gebruikersnaam', $gebruikersnaam);
    $stmt->execute();
    $resultaat = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultaat) {
        echo "Gebruikersnaam bestaat al.";
    } else {
        // Query om de nieuwe gebruiker in de database op te slaan
        $query = "INSERT INTO accounts (gebruikersnaam, wachtwoord) VALUES (:gebruikersnaam, :wachtwoord)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':gebruikersnaam', $gebruikersnaam);
        $stmt->bindParam(':wachtwoord', $wachtwoord);
        $stmt->execute();

        echo "Account succesvol aangemaakt.";
    }
}
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Log out</title>
    <link rel="shortcut icon" type="logo/png" href="images/image.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>

<body>
    <div class="container">
        <h3 class="text-center d-flex justify-content-center font-weight-bold" style="color: #247BDA; margin-top: 50px; margin-bottom: 10px">Register een account </h3>
        <form method="post" action="register.php">

            <div class="text-center d-flex justify-content-center">
                <div class="form-outline mb-4 text-center">
                    <label class="form-label" for="form2Example1">Gebruikersnaam</label>
                    <input type="text" name="gebruikersnaam" required class="form-control" style="width: 300px" name="username" />
                </div>
            </div>

            <div class="text-center d-flex justify-content-center">
                <div class="form-outline mb-4 text-center">
                    <label class="form-label" for="form2Example2">Wachtwoord</label>
                    <input type="password" name="wachtwoord" required class="form-control" style="width: 300px" name="password" />
                </div>
            </div>

            <div class="text-center d-flex justify-content-center">
                <button type="submit" name="register" class="btn btn-primary btn-block mb-4" style="width: 150px">Registreer</button>
            </div>

            <div class="text-center">
                <p>Heb je al een account? <a class="text-primary" href="login.php">Log in</a></p>
            </div>
        </form>
    </div>
</body>

</html>