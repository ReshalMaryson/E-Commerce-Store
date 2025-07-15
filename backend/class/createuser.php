<?php
//headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}

include '../config/db.php';

$connection = new Database();
$db = $connection->connect();

class CreateUser
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function createUser()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === "POST") {

                // checking values format.
                if (
                    !isset($_POST['name']) ||
                    !isset($_POST['password']) ||
                    !isset($_POST['email']) ||
                    $_POST['name'] === "" ||
                    $_POST['email'] === "" ||
                    $_POST['password'] === ""
                ) {
                    http_response_code(401);
                    echo json_encode(['status' => 'error', 'message' => 'FIELDS MISSING.']);
                }
                $name = isset($_POST['name']) ? filter_var($_POST['name'], FILTER_SANITIZE_SPECIAL_CHARS) : null;

                $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
                $email =  isset($_POST['email']) ? $_POST['email'] : null;


                // query and database.
                $query = "SELECT email FROM users WHERE email=:email";
                $stmt = $this->conn->prepare($query);
                if ($stmt) {
                    $stmt->bindParam(":email", $email, PDO::PARAM_STR);
                    $stmt->execute();
                    $row = $stmt->rowCount();
                    if ($row > 0) {
                        http_response_code(409);
                        echo json_encode(['status' => 'duplication', 'message' => 'Email Already exists.']);
                        exit;
                    } else {

                        $query = "INSERT INTO users (name,email,password) VALUES (:name,:email,:password)";

                        $stmt = $this->conn->prepare($query);
                        if ($stmt) {
                            $stmt->bindParam(":name", $name, PDO::PARAM_STR);
                            $stmt->bindParam(":email", $email, PDO::PARAM_STR);
                            $stmt->bindParam(":password", $password, PDO::PARAM_STR);
                            if ($stmt->execute()) {
                                http_response_code(201);
                                echo json_encode(["status" => "success"]);
                                exit;
                            } else {
                                http_response_code(203);
                                echo json_encode(['status' => 'error', 'message' => 'unsuccessful']);
                                exit;
                            }
                        } else {
                            http_response_code(500);
                            echo json_encode([
                                'status' => 'error',
                                'message' => 'INTERNAL ERROR OCCUERED.'
                            ]);
                            exit;
                        }
                    }
                } else {
                    http_response_code(400);
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


$obj_add = new CreateUser($db);
$obj_add->createUser();
