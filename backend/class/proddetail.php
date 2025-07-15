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

class GetProd
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function Prod()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {

                $input = file_get_contents("php://input");
                $decode = json_decode($input, true);

                if ($decode['id'] === "") {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Id NOT PROVIDED OR NOT A NUMER.']);
                    exit;
                } else {
                    $id = (int)$decode['id'];
                }

                $query = "SELECT * FROM products WHERE id=:id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":id", $id, PDO::PARAM_INT);
                if ($stmt) {
                    $stmt->execute();
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    if (empty($result)) {
                        // failure response.
                        http_response_code(404);
                        echo json_encode(['status' => 'unsuccessful', 'message' => ' Error Fetching Products']);
                        exit;
                    } else {
                        http_response_code(200);
                        echo json_encode(['status' => 'success', 'data' => $result]);
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
            } else {
                http_response_code(405);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'METHOD NOT AllOWED. GET Permitted only'
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
        };
    }
}

$obj_showdata = new GetProd($db);
$obj_showdata->Prod();
