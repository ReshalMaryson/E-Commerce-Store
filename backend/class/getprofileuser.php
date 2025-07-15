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


class findUser
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function finduser()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === "POST") {
                $input = file_get_contents("php://input");
                $decode = json_decode($input, true);

                if ($decode['search'] === "" || trim($decode['search']) === "") {
                    http_response_code(400);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'FIELD MISSING'
                    ]);
                    exit;
                } else {
                    $search = trim($decode['search']);
                }

                if (ctype_digit($search)) {
                    $query = "SELECT * FROM users WHERE id = :id";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bindParam(":id", $search, PDO::PARAM_INT);
                    $stmt->execute();
                    $rowCount = $stmt->rowCount();
                }
                if ($rowCount > 0) {
                    $users = $stmt->fetch(PDO::FETCH_ASSOC);
                    http_response_code(200);
                    echo json_encode(["status" => "success", "users" => $users]);
                    exit;
                } else {
                    http_response_code(404);
                    echo json_encode(["status" => "error", "message" => "User Not Found"]);
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

$obj = new findUser($db);
$obj->finduser();
