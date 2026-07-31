<?php
/**
 * ContactController - Contact form submissions and newsletter subscriptions
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

class ContactController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * POST /api/contact - Submit contact message
     */
    public function submitMessage($data) {
        $name    = isset($data['name']) ? trim($data['name']) : '';
        $email   = isset($data['email']) ? trim($data['email']) : '';
        $phone   = isset($data['phone']) ? trim($data['phone']) : null;
        $message = isset($data['message']) ? trim($data['message']) : '';

        if (empty($name) || empty($email) || empty($message)) {
            sendError("Name, email, and message are required.", 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendError("Invalid email address format.", 400);
        }

        try {
            $stmt = $this->db->prepare("
                INSERT INTO contact_messages (name, email, phone, message, status)
                VALUES (?, ?, ?, ?, 'new')
            ");
            $stmt->execute([$name, $email, $phone, $message]);
            $messageId = $this->db->lastInsertId();

            sendSuccess("Your message has been received. Our team will get back to you shortly.", [
                "message_id" => $messageId
            ], 201);

        } catch (PDOException $e) {
            sendError("Failed to save contact message: " . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/newsletter/subscribe - Subscribe to newsletter list
     */
    public function subscribeNewsletter($data) {
        $email = isset($data['email']) ? trim($data['email']) : '';

        if (empty($email)) {
            sendError("Email address is required.", 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendError("Invalid email address format.", 400);
        }

        try {
            $this->db->beginTransaction();

            // Insert into subscribers list
            $stmt = $this->db->prepare("
                INSERT INTO newsletter_subscribers (email) 
                VALUES (?) 
                ON DUPLICATE KEY UPDATE unsubscribed_at = NULL, subscribed_at = CURRENT_TIMESTAMP
            ");
            $stmt->execute([$email]);

            // Update user table if this email belongs to a registered customer
            $stmtUser = $this->db->prepare("UPDATE users SET newsletter_subscribed = 1 WHERE email = ?");
            $stmtUser->execute([$email]);

            $this->db->commit();

            sendSuccess("Thank you for subscribing to our journal!", null, 200);

        } catch (PDOException $e) {
            $this->db->rollBack();
            sendError("Failed to process subscription: " . $e->getMessage(), 500);
        }
    }
}
