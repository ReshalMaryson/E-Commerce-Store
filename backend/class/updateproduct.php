<?php
//headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  PUT,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}

include '../config/db.php';

$connection = new Database();
$db = $connection->connect();


class Update
{
    private  $conn;
    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function updateProduct()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

                $input = file_get_contents('php://input');
                $decode = json_decode($input, true); // this has json body data.

                // checking empty json body.
                if (is_null($decode)) {
                    http_response_code(400); // Bad Request
                    echo json_encode(['status' => 'error', 'message' => 'Request body is missing or invalid JSON.']);
                    exit;
                }

                // checking values format.
                if (!isset($decode['id'], $decode['p_name'], $decode['p_description'], $decode['p_category'], $decode['p_price'], $decode['p_stock'])) {
                    http_response_code(401);
                    echo json_encode(['status' => 'error', 'message' => 'FIELDS MISSING.']);
                } else {
                    $name = isset($decode['p_name']) ? filter_var($decode['p_name'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $description = isset($decode['p_description']) ? filter_var($decode['p_description'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $id = isset($decode['id']) ? (int)filter_var($decode['id'], FILTER_VALIDATE_INT) : null;
                    $category = isset($decode['p_category']) ? filter_var($decode['p_category'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $price = isset($decode['p_price']) ? (int) $decode['p_price'] : null;
                    $stock = isset($decode['p_stock']) ? (int) $decode['p_stock'] : null;
                }

                //query
                $query = "UPDATE products SET name=:name,description=:description, price=:price, stock=:stock,category=:category WHERE id=:id";

                $stmt = $this->conn->prepare($query);
                if ($stmt) {
                    $stmt->bindParam(":name", $name, PDO::PARAM_STR);
                    $stmt->bindParam(":description", $description, PDO::PARAM_STR);
                    $stmt->bindParam(":price", $price, PDO::PARAM_INT);
                    $stmt->bindParam(":stock", $stock, PDO::PARAM_INT);
                    $stmt->bindParam(":category", $category, PDO::PARAM_STR);
                    $stmt->bindParam(":id", $id, PDO::PARAM_INT);


                    if ($stmt->execute()) {
                        http_response_code(200);
                        echo json_encode(["status" => "success"]);
                        exit;
                    } else {
                        http_response_code(204);
                        echo json_encode([
                            'status' => 'unsuccessful',
                            'message' => 'Error UPDATING.'
                        ]);
                        exit;
                    }
                } else {
                    http_response_code(500);
                    echo json_encode([
                        "status" => "error",
                        "message" => "INTERNAL SERVER ERROR OCCURED."
                    ]);
                    exit;
                }
            } else {
                http_response_code(405);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Method Not Allowed. PUT Permitted only'
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

$obj = new Update($db);
$obj->updateProduct();
