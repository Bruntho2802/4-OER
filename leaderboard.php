<!DOCTYPE html>
<html lang="en">

<head>
    <link rel="stylesheet" href="Style/style.css">
    <link rel="shortcut icon" type="logo/png" href="images/image.png">
    <title>Scorebord</title>
</head>

<body>

    <?php
    // kijken of je bent ingelogd
    session_start();
    if (!isset($_SESSION['gebruikersnaam'])) {
        header("Location: login.php");
        exit();
    }

    include_once("includes/functions.php");

    $conn = dbCheck();

    // de query voor het ophalen van de gegevens
    $query = "SELECT gebruikersnaam, score FROM accounts ORDER BY score DESC";
    ?>

    <!-- NAVBAR -->
    <?php include("includes/navbar.php"); ?>

    <div class="container">
        <div class="container">
            <div class="p-5 text-center">
                <h3 class="d-flex justify-content-center font-weight-bold text" style="margin-bottom: 15px;">Scoreboard</h3>
                <table class="table">
                    <thead>
                        <!-- tabel titels -->
                        <tr>
                            <th>Positie</th>
                            <th>Gebruikersnaam</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>

                        <!-- de loop voor het printen van de scores -->
                        <?php
                        $i = 1;
                        foreach ($conn->query($query) as $row) {
                            echo '<tr>';
                            // printen van de positienummers
                            echo '<td>' . $i . '</td>';
                            // printen van de namen
                            echo '<td>' . $row['gebruikersnaam'] . '</td>';
                            // printen van de scores
                            echo '<td>' . $row['score'] . '</td>';
                            echo '</tr>';
                            // verhoog de positienummer met 1
                            $i++;
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <?php include("includes/footer.php"); ?>

</body>

</html>