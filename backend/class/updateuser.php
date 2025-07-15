<?php
//headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, PUT,OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}
session_start();

include '../config/db.php';

$connection = new Database();
$db = $connection->connect();


class UpdateUser
{
    private  $conn;
    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function updateUser()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {

                // if only to update profile pic.
                if (!empty($_FILES['image'])) {
                    $user_id = isset($_POST['id']) ? (int)filter_var($_POST['id'], FILTER_VALIDATE_INT) : null;

                    //handling image upload.
                    if ($_FILES['image'] && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                        $fileName = $_FILES['image']['name'];
                        $fileTmp = $_FILES['image']['tmp_name'];

                        $validExtensions = ["jpg", "jpeg", "png"];
                        $imageExtension = explode(".", $fileName);
                        // $NewimageExtension = strtolower((pathinfo($fileName, PATHINFO_EXTENSION)));
                        $NewimageExtension = strtolower(end($imageExtension));

                        if (!in_array($NewimageExtension, $validExtensions)) {
                            http_response_code(400);
                            echo json_encode(["status" => "error", "message" => "Extension not supported"]);
                            exit;
                        }
                        $NewimageName = uniqid() . "." . $NewimageExtension;
                        $uploadPath = "../uploads/profilepic/" . $NewimageName;

                        // Move file to uploads directory
                        if (move_uploaded_file($fileTmp, $uploadPath)) {
                            //query
                            try {
                                $query = "UPDATE users SET profile_pic=:profilepic WHERE id=:id";
                                $stmt = $this->conn->prepare($query);

                                if ($stmt) {
                                    $stmt->bindParam(":profilepic", $NewimageName, PDO::PARAM_STR);
                                    $stmt->bindParam(":id", $user_id, PDO::PARAM_INT);

                                    //execute query
                                    if ($stmt->execute()) {
                                        $_SESSION['profilepic'] = $NewimageName;
                                        http_response_code(200);
                                        echo json_encode(["status" => "success", "data" => $NewimageName]);
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
                            } catch (Exception $e) {
                                // ✅ Improved error handling for database issues
                                http_response_code(500);
                                echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
                            }
                            exit;
                        }
                    } else {
                        echo json_encode(["status" => "error", "message" => "No file uploaded", "name" => ""]);
                        exit;
                    }
                } else {
                    // to update all data but not dp.
                    $input = file_get_contents('php://input');
                    $decode = json_decode($input, true); // this has json body data.

                    // checking empty json body.
                    if (is_null($decode)) {
                        http_response_code(400); // Bad Request
                        echo json_encode(['status' => 'error', 'message' => 'Request body is missing or invalid JSON.']);
                        exit;
                    }
                    $user_id = isset($decode['id']) ? (int)filter_var($decode['id'], FILTER_VALIDATE_INT) : null;
                    $name = isset($decode['name']) ? filter_var($decode['name'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $email = isset($decode['email']) ? filter_var($decode['email'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $phone = isset($decode['phone']) ? filter_var($decode['phone'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $address = isset($decode['address']) ? filter_var($decode['address'], FILTER_SANITIZE_SPECIAL_CHARS) : null;
                    $country = isset($decode['country']) ? filter_var($decode['country'], FILTER_SANITIZE_SPECIAL_CHARS) : null;

                    try {
                        //query
                        $query = "UPDATE users SET name=:name, email=:email, phone_number=:phone, address=:address,country=:country WHERE id=:id";

                        $stmt = $this->conn->prepare($query);
                        if ($stmt) {
                            $stmt->bindParam(":name", $name, PDO::PARAM_STR);
                            $stmt->bindParam(":email", $email, PDO::PARAM_STR);
                            $stmt->bindParam(":phone", $phone, PDO::PARAM_STR);
                            $stmt->bindParam(":address", $address, PDO::PARAM_STR);
                            $stmt->bindParam(":country", $country, PDO::PARAM_STR);
                            $stmt->bindParam(":id", $user_id, PDO::PARAM_INT);

                            //execute query
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
                    } catch (Exception $e) {
                        // ✅ Improved error handling for database issues
                        http_response_code(500);
                        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
                    }
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

$obj = new UpdateUser($db);
$obj->updateUser();
