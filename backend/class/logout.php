<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  POST,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}

class LogOut
{
    public function Logout()
    {
        try {

            if ($_SERVER['REQUEST_METHOD'] === "POST") {

                if (isset($_SESSION['user_id'])) {
                    $_SESSION = [];
                    session_destroy();

                    echo json_encode(["status" => "success", "message" => "USER LOGGED OUT."]);
                    exit;
                } else {
                    http_response_code(202);
                    echo json_encode(["status" => "unsuccessful", "message" => "NO, USER LOGGED IN."]);
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
        } catch (Exception $e) {
            echo $e->getMessage();
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'INTERNAL ERROR OCCUERED.'
            ]);
            exit;
        }
    }
}

$obj = new LogOut();
$obj->Logout();
