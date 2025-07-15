<?php
// Headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

                // Get pagination parameters
                $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20; // Default limit: 20
                $page = isset($_GET['page']) ? intval($_GET['page']) : 1; // Default page: 1
                $offset = ($page - 1) * $limit; // Calculate offset

                // Query to fetch paginated products
                $query = "SELECT * FROM products LIMIT :limit OFFSET :offset";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);

                if ($stmt->execute()) {
                    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    // Get total number of products
                    $countQuery = "SELECT COUNT(*) AS total FROM products";
                    $countStmt = $this->conn->prepare($countQuery);
                    $countStmt->execute();
                    $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

                    http_response_code(200);
                    echo json_encode([
                        'status' => 'success',
                        'data' => $products,
                        'total' => $totalCount,
                        'limit' => $limit,
                        'page' => $page,
                        'total_pages' => ceil($totalCount / $limit)
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Error fetching products.'
                    ]);
                }
            } else {
                http_response_code(405);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Method Not Allowed. Only GET permitted.'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Internal Server Error.'
            ]);
        }
    }
}

$obj_showdata = new ShowData($db);
$obj_showdata->showData();
