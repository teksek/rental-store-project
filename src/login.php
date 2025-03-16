<?php
    session_start();

    $jsonFile = 'accounts.json';

    // pobieramy dane z żądania
    $data = json_decode(file_get_contents("php://input"), true);

    // sprawdzamy, czy plik istnieje
    if (!file_exists($jsonFile)) {
        echo json_encode(["success" => false, "message" => "No accounts found!"]);
        exit;
    }

    // pobieramy zapisane konta
    $accounts = json_decode(file_get_contents($jsonFile), true);

    // szukamy użytkownika o podanym e-mailu i haśle
    foreach ($accounts as $account) {
        if ($account['email'] === $data['email'] && $account['password'] === $data['password']) {
            $_SESSION['user'] = $account; // Przechowujemy użytkownika w sesji
            echo json_encode(["success" => true, "user" => $account]);
            exit;
        }
    }

    // jeśli nie znaleziono pasujących danych
    echo json_encode(["success" => false, "message" => "Invalid email or password!"]);
?>
