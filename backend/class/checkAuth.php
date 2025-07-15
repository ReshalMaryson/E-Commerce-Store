<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  POST,OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (
        isset($_SESSION['user_name']) &&
        isset($_SESSION['user_id']) &&
        array_key_exists('profilepic', $_SESSION)
    ) {
        http_response_code(200);
        echo json_encode([
            "status" => "authenticated",
            "userid" => $_SESSION['user_id'],
            "user" => $_SESSION['user_name'],
            "profile_pic" => $_SESSION['profilepic']
        ]);
        exit;
    } else {
        echo json_encode([
            "status" => "unauthenticated",
            "session" => $_SESSION ? $_SESSION : "no session found",
        ]);
        exit;
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'ERROR LOGGING OUT. Method Not Allowed. GET Permitted only'
    ]);
    exit;
}
