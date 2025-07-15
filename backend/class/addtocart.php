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

class CreateCart
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function addcart()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === "POST") {
                $input = file_get_contents("php://input");
                $decode = json_decode($input, true);

                // checking values format.
                if (

                    !isset($decode['prod_id']) ||
                    !isset($decode['user_id']) ||
                    !isset($decode['prod_name']) ||
                    !isset($decode['prod_price']) ||
                    !isset($decode['quantity'])
                ) {
                    http_response_code(401);
                    echo json_encode(['status' => 'error', 'message' => 'FIELDS MISSING.']);
                    exit;
                } else {
                    $prod_name = isset($decode['prod_name']) ? filter_var($decode['prod_name'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $prod_price =  isset($decode['prod_price']) ? filter_var($decode['prod_price'], FILTER_VALIDATE_INT) : null;
                    $prod_id = isset($decode['prod_id']) ? filter_var($decode['prod_id'], FILTER_VALIDATE_INT) : null;
                    $user_id = isset($decode['user_id']) ? filter_var($decode['user_id'], FILTER_VALIDATE_INT) : null;
                    $quantity = isset($decode['quantity']) ? filter_var($decode['quantity'], FILTER_VALIDATE_INT) : null;
                }



                // query and database.
                $query = "INSERT INTO cart (user_id, prod_id, prod_name, prod_price, quantity) VALUES (:userid,:prodid, :prodname,:prodprice, :quantity)";
                $stmt = $this->conn->prepare($query);
                if ($stmt) {
                    $stmt->bindParam(":userid", $user_id, PDO::PARAM_INT);
                    $stmt->bindParam(":prodid", $prod_id, PDO::PARAM_INT);
                    $stmt->bindParam(":prodname", $prod_name, PDO::PARAM_STR);
                    $stmt->bindParam(":prodprice", $prod_price, PDO::PARAM_INT);
                    $stmt->bindParam(":quantity", $quantity, PDO::PARAM_INT);
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


$obj_add = new CreateCart($db);
$obj_add->addcart();
