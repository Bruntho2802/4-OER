<?php
session_start();

// Als de gebruiker niet is ingelogd, dan wordt hij/zij doorgestuurd naar de loginpagina
if(!isset($_SESSION['gebruikersnaam'])) {
    header("Location: ../login.php");   
}

// Verwijder de sessievariabele met de gebruikersnaam
unset($_SESSION['gebruikersnaam']);

// Vernietig de sessie
session_destroy();

// Redirect naar de loginpagina
header("Location: ../login.php");
?>
