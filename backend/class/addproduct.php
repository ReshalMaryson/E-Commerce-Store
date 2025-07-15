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

class AddProduct
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function addproduct()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === "POST") {

                // checking values format.
                if (
                    is_numeric($_POST['name']) ||
                    is_numeric($_POST['description']) ||
                    $_POST['name'] === "" ||
                    $_POST['description'] === ""
                ) {
                    http_response_code(401);
                    echo json_encode(['status' => 'error', 'message' => 'FIELDS MISSING.']);
                    exit;
                } else {
                    $name = isset($_POST['name']) ? filter_var($_POST['name'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $description = isset($_POST['description']) ? filter_var($_POST['description'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $price =  isset($_POST['price']) ? filter_var($_POST['price'], FILTER_VALIDATE_INT) : null;
                    $stock = isset($_POST['stock']) ? filter_var($_POST['stock'], FILTER_VALIDATE_INT) : null;
                    $category = isset($_POST['category']) ? filter_var($_POST['category'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                }

                //handling image upload.
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $fileName = $_FILES['image']['name'];
                    $fileTmp = $_FILES['image']['tmp_name'];


                    $validExtensions = ["jpg", "jpeg", "png"];
                    $imageExtension = explode(".", $fileName);
                    $NewimageExtension = strtolower(end($imageExtension));

                    if (!in_array($NewimageExtension, $validExtensions)) {
                        http_response_code(500);
                        echo json_encode(["status" => "error", "message" => "Extension not supported"]);
                        exit;
                    }

                    $NewimageName = uniqid() . "." . $NewimageExtension;
                    $uploadPath = "../uploads/product/" . $NewimageName;

                    // Move file to uploads directory
                    move_uploaded_file($fileTmp, $uploadPath);
                } else {
                    echo json_encode(["status" => "error", "message" => "No file uploaded", "name" => ""]);
                    exit;
                }

                // query and database.

                $query = "INSERT INTO products (name,description,price,stock,category,image) VALUES (:name,:description,:price,:stock,:category,:image)";
                $stmt = $this->conn->prepare($query);
                if ($stmt) {
                    $stmt->bindParam(":name", $name, PDO::PARAM_STR);
                    $stmt->bindParam(":description", $description, PDO::PARAM_STR);
                    $stmt->bindParam(":price", $price, PDO::PARAM_INT);
                    $stmt->bindParam(":stock", $stock, PDO::PARAM_INT);
                    $stmt->bindParam(":category", $category, PDO::PARAM_STR);
                    $stmt->bindParam(":image", $NewimageName, PDO::PARAM_STR);
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


$obj_add = new AddProduct($db);
$obj_add->addproduct();
