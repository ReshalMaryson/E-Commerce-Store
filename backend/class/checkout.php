<?php
require_once 'sendmail.php';
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

class CreateOrder
{
        private $conn;

        public function __construct($db)
        {
                $this->conn = $db;
        }

        public function createOrder()
        {
                try {
                        if ($_SERVER['REQUEST_METHOD'] === "POST") {

                                // Get JSON data
                                $data = json_decode(file_get_contents("php://input"), true);

                                if (!$data || !isset($data['orderItems']) || !is_array($data['orderItems'])) {
                                        echo json_encode(["status" => "error", "message" => "Invalid order data"]);
                                        exit;
                                } else {
                                        // Extract Order Details
                                        $userid = trim($data['userid']);
                                        $fname = trim($data['fname']);
                                        $lname = trim($data['lname']);
                                        $email =  trim($data['email']);
                                        $phone = trim($data['phone']);
                                        $country = trim($data['country']);
                                        $address = trim($data['address']);
                                        $city = trim($data['city']);
                                        $postalcode = trim($data['postalcode']);
                                        $paymentMethod = trim($data['paymentMethod']);
                                        $cardType = trim($data['cardType']) ?? null; // Nullable for COD
                                        $shippingFee = trim($data['shippingFee']);
                                        $subtotal = trim($data['subtotal']);
                                        $total = trim($data['total']);
                                        $orderItems = $data['orderItems']; // Array of products
                                }

                                if (!is_numeric($total) || $total <= 0) {
                                        echo json_encode(["status" => "error", "message" => "Invalid total"]);
                                        exit;
                                }
                                //  transaction for security.
                                $this->conn->beginTransaction();
                                try {

                                        // Insert into sales table
                                        $sql = "INSERT INTO sales (user_id,fname, lname, email, phone, country, address, city, postal_code, payment_method, card_type, shipping_fee, subtotal, total) 
                               
                                    VALUES (:userID,:fname, :lname, :email, :phone, :country, :address, :city, :postal_code, :paymethod, :card_type, :shippingfee, :subtotal, :total)";

                                        $stmt = $this->conn->prepare($sql);
                                        $stmt->bindParam(':userID', $userid, PDO::PARAM_INT);
                                        $stmt->bindParam(':fname', $fname, PDO::PARAM_STR);
                                        $stmt->bindParam(':lname', $lname, PDO::PARAM_STR);
                                        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                                        $stmt->bindParam(':phone', $phone, PDO::PARAM_INT);
                                        $stmt->bindParam(':country', $country, PDO::PARAM_STR);
                                        $stmt->bindParam(':address', $address, PDO::PARAM_STR);
                                        $stmt->bindParam(':city', $city, PDO::PARAM_STR);
                                        $stmt->bindParam(':postal_code', $postalcode, PDO::PARAM_STR);
                                        $stmt->bindParam(':paymethod', $paymentMethod, PDO::PARAM_STR);
                                        $stmt->bindParam(':card_type', $cardType, PDO::PARAM_STR);
                                        $stmt->bindParam(':shippingfee', $shippingFee, PDO::PARAM_INT);
                                        $stmt->bindParam(':subtotal', $subtotal, PDO::PARAM_INT);
                                        $stmt->bindParam(':total', $total, PDO::PARAM_INT);
                                        if ($stmt->execute()) {
                                                $orderId = $this->conn->LastInsertid(); // Get the new order ID

                                                // Insert Order Items into order_products
                                                $sqlItems = "INSERT INTO order_products (order_id, product_id, product_name, price, quantity) VALUES (:or_id, :prodID, :prodName, :prodPrice, :quantity)";
                                                $stmtItems = $this->conn->prepare($sqlItems);

                                                foreach ($orderItems as $item) {
                                                        $stmtItems->bindParam(':or_id', $orderId, PDO::PARAM_INT);
                                                        $stmtItems->bindParam(':prodID', $item['prod_id'], PDO::PARAM_INT);
                                                        $stmtItems->bindParam(':prodName', $item['prod_name'], PDO::PARAM_STR);
                                                        $stmtItems->bindParam(':prodPrice', $item['prod_price'], PDO::PARAM_INT);
                                                        $stmtItems->bindParam(':quantity', $item['quantity'], PDO::PARAM_INT);
                                                        $stmtItems->execute();
                                                }


                                                // updating stock.
                                                $sqlStockCheck = "SELECT stock FROM products WHERE id = :prodID";
                                                $sqlStockUpdate = "UPDATE products SET stock = stock - :quantity WHERE id = :prodID";

                                                $stmtStockCheck = $this->conn->prepare($sqlStockCheck);
                                                $stmtStockUpdate = $this->conn->prepare($sqlStockUpdate);

                                                foreach ($orderItems as $item) {
                                                        // Check current stock
                                                        $stmtStockCheck->bindParam(':prodID', $item['prod_id'], PDO::PARAM_INT);
                                                        $stmtStockCheck->execute();
                                                        $product = $stmtStockCheck->fetch(PDO::FETCH_ASSOC);

                                                        if (!$product) {
                                                                $this->conn->rollBack();
                                                                echo json_encode(["status" => "error", "message" => "Product not found."]);
                                                                exit;
                                                        }

                                                        if ($product['stock'] < $item['quantity']) {
                                                                $this->conn->rollBack();
                                                                echo json_encode(["status" => "error", "message" => "Insufficient stock for product: " . $item['prod_name']]);
                                                                exit;
                                                        } else {
                                                                $stmtStockUpdate->bindParam(':quantity', $item['quantity'], PDO::PARAM_INT);
                                                                $stmtStockUpdate->bindParam(':prodID', $item['prod_id'], PDO::PARAM_INT);
                                                                $stmtStockUpdate->execute();
                                                        }
                                                }

                                                $this->conn->commit(); // Commit transaction

                                                // sending mail.        
                                                if (isset($fname) && isset($email) && isset($lname)) {
                                                        $body = " Thanks " . $fname . " " . $lname . " for Shopping with us. Your Order is Confirmed and will be Delivered in few working days. order id: " . $orderId . " Total: Rs." . $subtotal .
                                                                " Please call 000-00000000 for any query.";

                                                        // this from sendmail.php
                                                        $emailSent = sendmail($email, $fname, $lname, $body);

                                                        if ($emailSent !== true) {
                                                                echo json_encode(["status" => "error", "message" => "Order placed, but email failed: " . $emailSent]);
                                                                exit;
                                                        }
                                                }

                                                echo json_encode(["status" => "success", "message" => "Order placed successfully!", "order_id" => $orderId]);
                                                exit;
                                        } else {
                                                echo json_encode(["status" => "error", "message" => "Failed to place order"]);
                                                exit;
                                        }
                                } catch (Exception $e) {
                                        $this->conn->rollBack(); // Rollback on failure
                                        echo json_encode(["status" => "error", "message" => "Transaction failed: " . $e->getMessage()]);
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


$obj_add = new CreateOrder($db);
$obj_add->createOrder();
