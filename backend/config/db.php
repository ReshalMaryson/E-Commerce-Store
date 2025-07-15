<?php

class Database
{
    private $conn;

    public function connect()
    {
        try {
            $this->conn = new PDO("mysql:host=localhost;dbname=shopping_store;", "root", "");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            if ($this->conn) {
                // echo "connected";
                return $this->conn;
            }
        } catch (Exception $e) {
            echo "Error Connecting" . $e->getMessage();
            return null;
        }
    }
}
