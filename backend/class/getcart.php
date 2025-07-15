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

class GetCart
{
    private $conn;
    public $totalprice;
    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function getCart()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $input = file_get_contents("php://input");
                $decode = json_decode($input, true);

                if (!isset($decode["id"])) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => ' User not logged in']);
                    exit;
                } else {
                    $userid = (int)$decode['id'];
                }

                $query = "SELECT * FROM cart WHERE user_id=:userid";
                $stmt = $this->conn->prepare($query);

                if ($stmt) {
                    $stmt->bindParam(":userid", $userid, PDO::PARAM_INT);
                    $stmt->execute();
                    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    foreach ($result as $item) {
                        $this->totalprice += $item['prod_price'] * $item['quantity'];
                    }

                    http_response_code(200);
                    echo json_encode([
                        'status' => 'success',
                        'data' => $result,
                        "totalprice" => $this->totalprice
                    ]);
                    exit;
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

$obj_showdata = new GetCart($db);
$obj_showdata->getCart();
