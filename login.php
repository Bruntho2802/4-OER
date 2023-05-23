    <?php
    session_start();
    include_once ("includes/functions.php");

    // Controleren of de gebruiker al is ingelogd
    if (isset($_SESSION['gebruikersnaam'])) {
        header("Location: index.php"); // Redirect naar homepagina
    }

    $conn = dbCheck();

    // Controleren of het loginformulier is verzonden
    if (isset($_POST['login'])) {
        // Gebruikersnaam en wachtwoord ophalen uit het formulier
        $gebruikersnaam = $_POST['gebruikersnaam'];
        $wachtwoord = $_POST['wachtwoord'];

        // Query om de gebruiker op te zoeken in de database
        $query = "SELECT * FROM accounts WHERE gebruikersnaam = :gebruikersnaam AND wachtwoord = :wachtwoord";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':gebruikersnaam', $gebruikersnaam);
        $stmt->bindParam(':wachtwoord', $wachtwoord);
        $stmt->execute();
        $resultaat = $stmt->fetch(PDO::FETCH_ASSOC);

        // Als er een resultaat is, dan is de gebruiker ingelogd
        if ($resultaat) {
            $_SESSION['gebruikersnaam'] = $resultaat['gebruikersnaam'];
            header("Location: index.php"); // Redirect naar homepagina
        } else {
            echo "Ongeldige gebruikersnaam en/of wachtwoord";
        }
    }
    ?>

    <!doctype html>
    <html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Log in</title>
        <link rel="shortcut icon" type="logo/png" href="images/image.png">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    </head>

    <body>
        <div class="container">
            <h3 class="text-center d-flex justify-content-center font-weight-bold" style="color: #247BDA; margin-top: 50px; margin-bottom: 10px">Log in </h3>

            <form method="POST">
                <!-- Username input -->
                <div class="text-center d-flex justify-content-center">
                    <div class="form-outline mb-4 text-center">
                        <label class="form-label" for="form2Example1">Gebruikersnaam</label>
                        <input type="text" name="gebruikersnaam" class="form-control" style="width: 300px" required>
                    </div>
                </div>

                <!-- Password input -->
                <div class="text-center d-flex justify-content-center">
                    <div class="form-outline mb-4 text-center">
                        <label class="form-label" for="form2Example2">Wachtwoord</label>
                        <input type="password" name="wachtwoord" class="form-control" style="width: 300px" required>
                    </div>
                </div>

                <!-- Submit button -->
                <div class="text-center d-flex justify-content-center">
                    <button type="submit" name="login" value="Inloggen" class="btn btn-primary btn-block mb-4" style="width: 150px">Inloggen</button>
                </div>

                <!-- Register & Back buttons -->
                <div class="text-center">
                    <p>Not a member? <a class="text-primary" href="register.php">Register</a></p>
                </div>
            </form>
        </div>
    </body>

    </html>