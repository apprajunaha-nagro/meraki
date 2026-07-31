<?php
/**
 * OrderController - Guest tracking, customer order history, and returns requests
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

class OrderController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * GET /api/orders/track - Track order (Guest & User)
     */
    public function track($queryParams) {
        $orderNumber = isset($queryParams['order_number']) ? trim($queryParams['order_number']) : '';
        $contact     = isset($queryParams['contact']) ? trim($queryParams['contact']) : ''; // Can be email or phone

        if (empty($orderNumber) || empty($contact)) {
            sendError("Order number and email/phone are required.", 400);
        }

        // Search in database matching order number and contact details
        $stmt = $this->db->prepare("
            SELECT * FROM orders 
            WHERE order_number = ? AND (guest_email = ? OR shipping_phone = ? OR shipping_phone LIKE ?)
        ");
        // Support partial matches for phone (e.g. +91)
        $stmt->execute([$orderNumber, $contact, $contact, "%$contact%"]);
        $order = $stmt->fetch();

        if (!$order) {
            sendError("No matching order was found.", 404);
        }

        // Hydrate with items
        $stmtItems = $this->db->prepare("
            SELECT oi.*, pi.image_url 
            FROM order_items oi
            LEFT JOIN product_images pi ON oi.product_id = pi.product_id AND pi.sort_order = 0
            WHERE oi.order_id = ?
            GROUP BY oi.id
        ");
        $stmtItems->execute([$order['id']]);
        $order['items'] = $stmtItems->fetchAll();

        sendSuccess("Order located.", ["order" => $order]);
    }

    /**
     * GET /api/orders/my-orders - Authenticated customer's order history
     */
    public function listMyOrders($userSession) {
        if (!$userSession) {
            sendError("Unauthorized.", 401);
        }

        $userId = $userSession['user_id'];

        $stmt = $this->db->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $orders = $stmt->fetchAll();

        // Hydrate each order with item summaries
        foreach ($orders as &$order) {
            $stmtItems = $this->db->prepare("
                SELECT oi.*, pi.image_url 
                FROM order_items oi
                LEFT JOIN product_images pi ON oi.product_id = pi.product_id AND pi.sort_order = 0
                WHERE oi.order_id = ?
                GROUP BY oi.id
            ");
            $stmtItems->execute([$order['id']]);
            $order['items'] = $stmtItems->fetchAll();
        }

        sendSuccess("Orders retrieved successfully.", ["orders" => $orders]);
    }

    /**
     * GET /api/orders/:id - Single order details
     */
    public function getDetails($userSession, $orderId) {
        if (!$userSession) {
            sendError("Unauthorized.", 401);
        }

        $userId = $userSession['user_id'];
        $role   = $userSession['role'];

        $stmt = $this->db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();

        if (!$order) {
            sendError("Order not found.", 404);
        }

        // Restrict to owner unless admin/staff
        if ($order['user_id'] != $userId && !in_array($role, ['admin', 'staff'])) {
            sendError("Forbidden.", 403);
        }

        // Fetch items
        $stmtItems = $this->db->prepare("
            SELECT oi.*, pi.image_url, p.slug as product_slug
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            LEFT JOIN product_images pi ON oi.product_id = pi.product_id AND pi.sort_order = 0
            WHERE oi.order_id = ?
            GROUP BY oi.id
        ");
        $stmtItems->execute([$orderId]);
        $order['items'] = $stmtItems->fetchAll();

        // Check if there are return requests
        $stmtReturns = $this->db->prepare("SELECT * FROM return_requests WHERE order_id = ?");
        $stmtReturns->execute([$orderId]);
        $order['return_requests'] = $stmtReturns->fetchAll();

        sendSuccess("Order details retrieved.", ["order" => $order]);
    }

    /**
     * POST /api/orders/:id/return - Request a return for an item
     */
    public function requestReturn($userSession, $orderId, $data) {
        if (!$userSession) {
            sendError("Unauthorized.", 401);
        }

        $userId = $userSession['user_id'];
        $orderItemId = isset($data['order_item_id']) ? (int)$data['order_item_id'] : 0;
        $reason = isset($data['reason']) ? trim($data['reason']) : '';

        if ($orderItemId <= 0 || empty($reason)) {
            sendError("Order item ID and reason are required.", 400);
        }

        // Verify order ownership and eligibility (must be delivered)
        $stmt = $this->db->prepare("SELECT user_id, status FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();

        if (!$order) {
            sendError("Order not found.", 404);
        }

        if ($order['user_id'] != $userId) {
            sendError("Forbidden.", 403);
        }

        if ($order['status'] !== 'delivered') {
            sendError("Only delivered orders are eligible for return.", 400);
        }

        // Verify order item belongs to this order
        $stmtItem = $this->db->prepare("SELECT id FROM order_items WHERE id = ? AND order_id = ?");
        $stmtItem->execute([$orderItemId, $orderId]);
        if (!$stmtItem->fetch()) {
            sendError("Order item not found in this order.", 404);
        }

        // Check if a return request already exists for this item
        $stmtCheck = $this->db->prepare("SELECT id FROM return_requests WHERE order_item_id = ?");
        $stmtCheck->execute([$orderItemId]);
        if ($stmtCheck->fetch()) {
            sendError("A return request has already been submitted for this item.", 409);
        }

        try {
            $stmtInsert = $this->db->prepare("
                INSERT INTO return_requests (order_id, order_item_id, reason, status)
                VALUES (?, ?, ?, 'pending')
            ");
            $stmtInsert->execute([$orderId, $orderItemId, $reason]);
            $requestId = $this->db->lastInsertId();

            // Log activity
            $stmtLog = $this->db->prepare("
                INSERT INTO activity_log (action, subject, subject_id, description)
                VALUES ('return_requested', 'return_requests', ?, ?)
            ");
            $stmtLog->execute([$requestId, "Return requested for item in Order ID: " . $orderId]);

            sendSuccess("Return request submitted successfully.", ["return_request_id" => $requestId], 201);

        } catch (PDOException $e) {
            sendError("Failed to submit return request: " . $e->getMessage(), 500);
        }
    }
}
