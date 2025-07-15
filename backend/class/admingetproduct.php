<?php
//headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}

include '../config/db.php';

$connection = new Database();
$db = $connection->connect();

class ShowData
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function showData()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {

                $query = "SELECT * FROM products";
                $stmt = $this->conn->prepare($query);
                if ($stmt) {
                    $stmt->execute();
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
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

$obj_showdata = new ShowData($db);
$obj_showdata->showData();
