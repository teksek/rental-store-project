<?php
    $jsonFile = 'data/accounts.json';

    // pobieramy dane z żądania
    $data = json_decode(file_get_contents("php://input"), true);

    // jeśli plik istnieje, odczytujemy jego zawartość
    if (file_exists($jsonFile)) {
        $accounts = json_decode(file_get_contents($jsonFile), true);
    } else {
        $accounts = []; // Jeśli pliku nie ma, tworzymy pustą tablicę
    }

    // sprawdzamy, czy użytkownik już istnieje
    foreach ($accounts as $account) {
        if ($account['email'] === $data['email']) {
            echo json_encode(["success" => false, "message" => "You already have an account!"]);
            exit;
        }
    }

    // dodajemy nowego użytkownika
    $accounts[] = $data;

    // zapisujemy do pliku JSON
    file_put_contents($jsonFile, json_encode($accounts, JSON_PRETTY_PRINT));

    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
?>