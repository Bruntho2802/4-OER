<?php

function dbCheck() {
     $host = "localhost";
     $username = "bit_academy";
     $password = "bit_academy";
     $database = "4oer";
 
     try {
         $conn = new PDO("mysql:host=$host;dbname=$database", $username, $password);
         $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
     } catch (PDOException $e) {
         echo "Fout bij het verbinden met de database: " . $e->getMessage();
     }

     return $conn;
};

function CheckLogin() {
    // Controleren of de gebruiker al is ingelogd
    if (isset($_SESSION['gebruikersnaam'])) {
        header("Location: index.php"); // Redirect naar homepagina
    }
};
