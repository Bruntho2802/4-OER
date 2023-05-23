<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>4OER</title>
    <link rel="shortcut icon" type="logo/png" href="images/image.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>

<body>
    <?php
    session_start();
    if (!isset($_SESSION['gebruikersnaam'])) {
        header("Location: login.php");
        exit();
    }
    ?>

    <!-- NAVBAR -->
    <?php include("includes/navbar.php"); ?>

    <!-- CONNECT 4 IMAGE -->
    <img src="images/connect4.png" class="rounded mx-auto d-block img-fluid" style="width:auto; height:300px; margin-top: 50px;" alt="connect4">
<!-- knoppen richting de gamemodes -->
    <div class="container">
        <div class="p-5 text-center">
            <h3 class="d-flex justify-content-center font-weight-bold text" style="margin-bottom: 15px;">Vier op een rij</h3>
            <a class="btn btn-outline-black btn-lg text-white font-weight-bold" style="background-color: #247BDA; " href="game.php" role="button">Speel tegen een vriend!</a>
            <a class="btn btn-outline-black btn-lg text-white font-weight-bold" style="background-color: #247BDA; " href="gamebot.php" role="button">Speel tegen een bot!</a>
        </div>
    </div>

    <!-- uitleg van het spel -->
    <div class="container" style="margin-bottom: 50px">
        <div class="row">
            <div class="d-flex align-items-center flex-column mb-12 col-md-12">
                <h3 class="font-weight-bold text-center" style="margin-bottom: 10px;">Hoe werkt Vier op een rij?</h3>
                <div class="d-block p-2 text-white font-weight-bold bg-primary rounded-3">
                    <p>Vier op een rij is een bordspel voor twee spelers met als doel als eerste speler een aaneengesloten rij van vier schijven te vormen. Een rij kan zowel verticaal, horizontaal als diagonaal worden gevormd en beëindigt het spel.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <?php include("includes/footer.php"); ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>
</body>

</html>