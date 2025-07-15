<?php
// Headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../config/db.php';

$connection = new Database();
$db = $connection->connect();

class GetSales
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getsales()
    {
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $input = file_get_contents('php://input');
                $decode = json_decode($input, true);

                if (!empty($decode) && isset($decode['orderID'])) {
                    $o_ID = (int)$decode['orderID'];

                    $query = "SELECT 
                        s.id, s.user_id, s.fname, s.lname, s.email, s.phone, s.address,
                        s.payment_method, s.card_type, s.shipping_fee, s.subtotal, s.created_at,
                        op.product_id, op.product_name, op.price, op.quantity
                        FROM sales s
                        JOIN order_products op ON s.id = op.order_id
                        WHERE s.id = :order_id
                        ORDER BY s.created_at DESC";
                    $stmt = $this->conn->prepare($query);
                    $stmt->bindParam(":order_id", $o_ID, PDO::PARAM_INT);
                    $stmt->execute();
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);

                    if (!$result) {
                        http_response_code(404);
                        echo json_encode(["status" => "error", "message" => "Order not found"]);
                        exit;
                    }


                    $order = [
                        'order_id' => $result['id'],
                        'user_id' => $result['user_id'],
                        'customer' => $result['fname'] . ' ' . $result['lname'],
                        'email' => $result['email'],
                        'phone' => $result['phone'],
                        'address' => $result['address'],
                        'payment_method' => $result['payment_method'],
                        'card_type' => $result['card_type'],
                        'shipping_fee' => $result['shipping_fee'],
                        'subtotal' => $result['subtotal'],
                        'created_at' => $result['created_at'],
                        'products' => []
                    ];

                    // Get the products for this order (multiple rows expected)
                    $productsQuery = "SELECT product_id, product_name, price, quantity
                                      FROM order_products
                                      WHERE order_id = :order_id";
                    $productsStmt = $this->conn->prepare($productsQuery);
                    $productsStmt->bindParam(":order_id", $o_ID, PDO::PARAM_INT);
                    $productsStmt->execute();
                    $products = $productsStmt->fetchAll(PDO::FETCH_ASSOC); // Fetch all products

                    // Attach products array to the order
                    $order['products'] = $products; // `products` is an array

                    http_response_code(200);
                    echo json_encode(["status" => "success", "data" => $order]);
                    exit;
                } else {
                    http_response_code(400);
                    echo json_encode(["status" => "error", "message" => "Invalid JSON request body"]);
                    exit;
                }
            } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
                // Fetch all orders (GET request)
                // $query = "SELECT 
                //     s.order_id, s.user_id, s.fname, s.lname, s.email, s.phone, s.address,
                //     s.payment_method, s.card_type, s.shipping_fee, s.subtotal, s.created_at,
                //     op.product_id, op.product_name, op.price, op.quantity
                //     FROM sales s
                //     JOIN order_products op ON s.order_id = op.order_id
                //     ORDER BY s.created_at DESC";

                $query = "SELECT 
                            s.id AS order_id,  
                            s.user_id, s.fname, s.lname, s.email, s.phone, s.address,
                            s.payment_method, s.card_type, s.shipping_fee, s.subtotal, s.created_at,
                            op.product_id, op.product_name, op.price, op.quantity
                        FROM sales s
                        JOIN order_products op ON s.id = op.order_id  
                        ORDER BY s.created_at DESC";

                $stmt = $this->conn->prepare($query);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $orders = [];
                foreach ($result as $row) {
                    $order_id = $row['order_id'];

                    if (!isset($orders[$order_id])) {
                        $orders[$order_id] = [
                            'order_id' => $row['order_id'],
                            'user_id' => $row['user_id'],
                            'customer' => $row['fname'] . ' ' . $row['lname'],
                            'email' => $row['email'],
                            'phone' => $row['phone'],
                            'address' => $row['address'],
                            'payment_method' => $row['payment_method'],
                            'card_type' => $row['card_type'],
                            'shipping_fee' => $row['shipping_fee'],
                            'subtotal' => $row['subtotal'],
                            'created_at' => $row['created_at'],
                            'products' => []
                        ];
                    }
                    $orders[$order_id]['products'][] = [
                        'product_id' => $row['product_id'],
                        'product_name' => $row['product_name'],
                        'price' => $row['price'],
                        'quantity' => $row['quantity']
                    ];
                }

                http_response_code(200);
                echo json_encode(["status" => "success", "data" => array_values($orders)]);
            } else {
                http_response_code(405);
                echo json_encode(["status" => "error", "message" => "Method not allowed"]);
                exit;
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ]);
        } finally {
            $this->conn = null;
        }
    }
}

$obj_showdata = new GetSales($db);
$obj_showdata->getsales();
