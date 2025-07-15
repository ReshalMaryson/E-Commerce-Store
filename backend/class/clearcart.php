<?php
//headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}

include '../config/db.php';

$connection = new Database();
$db = $connection->connect();

class ClearCart
{
    private  $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function clearCart()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

                $input = file_get_contents('php://input');
                $decode = json_decode($input, true); // this has json body data.

                // checking empty json body.
                if (is_null($decode)) {
                    http_response_code(400); // Bad Request
                    echo json_encode(['status' => 'error', 'message' => 'Request body is missing or invalid JSON.']);
                    exit;
                }


                if (!isset($decode['user_id']) || !filter_var($decode['user_id'], FILTER_VALIDATE_INT)) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing user_id.']);
                    exit;
                }
                //user id from body.
                $user_id = $decode['user_id'];

                if (count($decode) === 1) {
                    // Delete all items for the user
                    $query = "DELETE FROM cart WHERE user_id=:id";
                    $stmt = $this->conn->prepare($query);

                    if (!$stmt) {
                        http_response_code(500);
                        echo json_encode(['status' => 'error', 'message' => 'Internal Server Error: Query preparation failed.']);
                        exit;
                    } else {
                        $stmt->bindParam(':id', $user_id, PDO::PARAM_INT);
                    }
                } elseif (
                    isset($decode['cart_id']) &&
                    filter_var($decode['cart_id'], FILTER_VALIDATE_INT)
                ) {
                    $cartid = filter_var($decode['cart_id'], FILTER_VALIDATE_INT);
                    $query = "DELETE FROM cart WHERE id=:cartid AND user_id=:userid ";
                    $stmt = $this->conn->prepare($query);
                    if (!$stmt) {
                        http_response_code(500);
                        echo json_encode(['status' => 'error', 'message' => 'Internal Server Error: Query preparation failed.']);
                        exit;
                    }
                    $stmt->bindParam(':cartid', $cartid, PDO::PARAM_INT);
                    $stmt->bindParam(':userid', $user_id, PDO::PARAM_INT);
                } else {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Invalid cart_id.']);
                    exit;
                }

                //execuet query.
                if ($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode(["status" => "success"]);
                    exit;
                } else {
                    http_response_code(203);
                    echo json_encode(["status" => "unsuccessful"]);
                    exit;
                }
            } else {
                http_response_code(405);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Method Not Allowed. DELETE Permitted only'
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


$obj_delete = new ClearCart($db);
$obj_delete->clearCart();
