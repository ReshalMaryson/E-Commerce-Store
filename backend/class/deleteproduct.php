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

class DeleteProduct
{
    private  $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }


    public function delete()
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

                if (is_null($decode) || !isset($decode['id']) || !is_numeric($decode['id'])) {
                    http_response_code(401);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'User Id should Not Be empty and Must be a Number.'
                    ]);
                    exit;
                } else {
                    $id = filter_var($decode['id'], FILTER_VALIDATE_INT);
                }

                $query = "DELETE FROM products WHERE id=:id";
                $stmt = $this->conn->prepare($query);
                if ($stmt) {
                    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

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
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'INTERNAL SERVER OCCURED.'
                    ]);
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


$obj_delete = new DeleteProduct($db);
$obj_delete->delete();
