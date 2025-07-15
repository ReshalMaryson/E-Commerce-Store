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


class FindProd
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function findprod()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === "POST") {
                $input = file_get_contents("php://input");
                $decode = json_decode($input, true);

                if (
                    (!isset($decode['search']) || trim($decode['search']) === "") &&
                    (!isset($decode['min']) || trim($decode['min']) === "") &&
                    (!isset($decode['max']) || trim($decode['max']) === "")
                ) {
                    http_response_code(400);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'FIELD MISSING'
                    ]);
                    exit;
                } else {
                    $search = isset($decode['search']) ? trim($decode['search']) : null;
                    $min = isset($decode['min']) ? (float)trim($decode['min']) : null;
                    $max = isset($decode['max']) ? (float)trim($decode['max']) : null;
                }



                if ($min !== null && $max !== null) {
                    // Ensure min and max are valid numbers
                    $min_price = (float)$decode['min'];
                    $max_price = (float)$decode['max'];

                    $query = "SELECT * FROM products WHERE price BETWEEN :min AND :max ORDER BY price DESC";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bindParam(":min", $min_price, PDO::PARAM_STR);
                    $stmt->bindParam(":max", $max_price, PDO::PARAM_STR);
                } elseif (ctype_digit($search)) {
                    $query = "SELECT * FROM products WHERE id = :id";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bindParam(":id", $search, PDO::PARAM_INT);
                } else {
                    $query = "SELECT * FROM products WHERE name LIKE :search OR category LIKE :search";
                    $stmt = $this->conn->prepare($query);
                    $searchWildcard = "%$search%";
                    $stmt->bindParam(":search", $searchWildcard, PDO::PARAM_STR);
                }

                $stmt->execute();
                $rowCount = $stmt->rowCount();

                if ($rowCount > 0) {
                    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    http_response_code(200);
                    echo json_encode(["status" => "success", "products" => $products]);
                } else {
                    http_response_code(404);
                    echo json_encode(["status" => "error", "message" => "Product Not Found"]);
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

$obj = new FindProd($db);
$obj->findprod();
