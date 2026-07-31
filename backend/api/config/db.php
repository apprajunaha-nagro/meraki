<?php
/**
 * Database Connection Helper (PDO Singleton)
 */

require_once __DIR__ . '/env.php';

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $db   = getenv('DB_NAME') ?: 'meraki_by_kritika';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASS') ?: '';
        $port = getenv('DB_PORT') ?: '3306';
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$db;port=$port;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->conn = new PDO($dsn, $user, $pass, $options);
        } catch (\PDOException $e) {
            // In a real application, log this and show a generic error
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Database connection failed: " . $e->getMessage()
            ]);
            exit();
        }
    }

    public static function getConnection() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance->conn;
    }
}
