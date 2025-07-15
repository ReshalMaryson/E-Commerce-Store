<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  POST,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}

session_start();
include '../config/db.php';

$connection = new Database();
$db = $connection->connect();

class Login
{
    private  $conn;
    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function loginUser()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === "POST") {

                $input = file_get_contents('php://input');
                $decode = json_decode($input, true);

                // checking values format.
                if (
                    !isset($decode['email']) ||
                    !isset($decode['password']) ||
                    $decode['email'] === '' ||
                    $decode['password'] === ''
                ) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'FIELDS MISSING.']);
                    exit;
                } else {
                    $user_email =  isset($decode['email']) ? $decode['email'] : null;
                    $user_password = isset($decode['password']) ? $decode['password'] : null;
                }


                $query = 'SELECT id,name,profile_pic,password FROM users WHERE email=:email ';
                $stmt = $this->conn->prepare($query);
                if ($stmt) {
                    $stmt->bindParam(":email", $user_email, PDO::PARAM_STR);
                    $stmt->execute();
                    $row = $stmt->rowCount();
                    if ($row === 0) {
                        // if user is not registered.
                        http_response_code(404);
                        echo json_encode(['status' => 'error', 'message' => 'User Not Found. Please Sign-Up First.']);
                        exit;
                    } else {
                        $user =  $stmt->fetch(PDO::FETCH_ASSOC);
                        $verifed = password_verify($user_password,  $user['password']);
                        if ($verifed) {
                            //correct password
                            $_SESSION['user_id'] = $user['id'];
                            $_SESSION['user_name'] = $user['name'];
                            $_SESSION['profilepic'] = $user['profile_pic'];

                            http_response_code(200);
                            echo json_encode([
                                "status" => "success",
                                "message" => $_SESSION ?  "session set from login" : "session  not set",
                                "data" => $user
                            ]);
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

$obj = new Login($db);
$obj->loginUser();
