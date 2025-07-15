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

include '../config/db.php';

$connection = new Database();
$db = $connection->connect();

class LoginAdmin
{

    private  $conn;
    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function loginadmin()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === "POST") {

                $input = file_get_contents('php://input');
                $decode = json_decode($input, true);

                // checking values format.
                if (
                    $decode['username'] !== "admin"
                ) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Admins Allowed to Login Only.']);
                    exit;
                } else {
                    $username =  isset($decode['username']) ? $decode['username'] : null;
                    $password = isset($decode['password']) ? $decode['password'] : null;
                }


                $query = 'SELECT * FROM users WHERE name=:username ';
                $stmt = $this->conn->prepare($query);
                if ($stmt) {
                    $stmt->bindParam(":username", $username, PDO::PARAM_STR);
                    $stmt->execute();
                    $row = $stmt->rowCount();
                    if ($row === 0) {
                        // if user is not registered.
                        http_response_code(404);
                        echo json_encode(['status' => 'error', 'message' => 'Admin Not Found. Please Sign-Up First.']);
                        exit;
                    } else {
                        $user =  $stmt->fetch(PDO::FETCH_ASSOC);
                        $verifed = password_verify($password,  $user['password']);
                        if ($verifed && $user) {
                            $_SESSION['user_id'] = $user['id'];
                            $_SESSION['user_name'] = $user['name'];
                            $_SESSION['profilepic'] = $user['profile_pic'];

                            http_response_code(200);
                            echo json_encode(["status" => "success", "data" => $user]);
                            exit;
                        } else {
                            // incorrect password
                            http_response_code(409);
                            echo json_encode(['status' => 'inncorrect', 'message' => 'Incorrect Password.']);
                            exit;
                        }
                    }
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'INTERNAL ERROR OCCUERED.'
                    ]);
                    exit;
                }
            } else {
                http_response_code(405);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Method Not Allowed. POST Permitted only'
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
        } finally {
            $this->conn = null;
        }
    }
}

$obj = new LoginAdmin($db);
$obj->loginadmin();
