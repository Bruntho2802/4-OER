<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact</title>
    <link rel="shortcut icon" type="logo/png" href="images/image.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="style/style.css">
</head>

<body>
    <?php
    session_start();
    if (!isset($_SESSION['gebruikersnaam'])) {
        header("Location: login.php"); // Redirect naar loginpagina
        exit();
    }
    ?>

    <!-- NAVBAR -->
    <?php include("includes/navbar.php"); ?>

    <div class="container">
        <div class="container">
            <div class="p-5 text-center">
                <h1 class="d-flex justify-content-center font-weight-bold text">Contact</h1>
            </div>
        </div>

        <img src="images/contact.jpg" class="rounded mx-auto d-block img-fluid" style="width:auto; height:300px;" alt="connect4">

        <div class="contacten bg-primary">
            <!-- klikbare e-mail en telefoonnummer -->
            <div class="e-mail">
                <h3><a class="mail" href="mailto:169357@student.horizoncollege.nl" target="_blank"><i class="bi bi-envelope-at"></i>4oerservice@gmail.com</a></h3>
            </div>
            <div class="nummer">
                <h3><a class="telefoon" href="tel:0618920693">06 12345678</a></h3>
            </div>
            <!-- klikbare afbeeldingen van twitter en YouTube -->
            <div class="socials">
                <a class="social" target="_blank" href="https://twitter.com/elonmusk"><img class="social" src="images/twitter.png"></a>
                <a class="social" target="_blank" href="https://www.youtube.com/watch?v=CL0qa-O9uuI&ab_channel=FrankAbbing"><img class="social" src="images/youtube.png"></a>
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