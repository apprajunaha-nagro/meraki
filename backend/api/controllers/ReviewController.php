<?php
/**
 * ReviewController - Submitting and retrieving customer reviews
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

class ReviewController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * GET /api/reviews/:product_id - Retrieve reviews for a product
     */
    public function getProductReviews($productId) {
        $stmt = $this->db->prepare("
            SELECT id, user_name, rating, comment, image_url, admin_reply, created_at 
            FROM reviews 
            WHERE product_id = ? AND status = 'approved'
            ORDER BY created_at DESC
        ");
        $stmt->execute([$productId]);
        $reviews = $stmt->fetchAll();

        sendSuccess("Reviews retrieved successfully.", ["reviews" => $reviews]);
    }

    /**
     * POST /api/reviews - Submit a review (requires JWT authentication)
     */
    public function create($userSession, $data) {
        if (!$userSession) {
            sendError("You must be logged in to submit a review.", 401);
        }

        $userId = $userSession['user_id'];
        $productId = isset($data['product_id']) ? (int)$data['product_id'] : 0;
        $rating = isset($data['rating']) ? (int)$data['rating'] : 0;
        $comment = isset($data['comment']) ? trim($data['comment']) : '';
        $imageUrl = isset($data['image_url']) ? trim($data['image_url']) : null;

        if ($productId <= 0 || $rating < 1 || $rating > 5 || empty($comment)) {
            sendError("Invalid review details. Rating (1-5) and comment are required.", 400);
        }

        // Fetch user name
        $stmtUser = $this->db->prepare("SELECT name FROM users WHERE id = ?");
        $stmtUser->execute([$userId]);
        $user = $stmtUser->fetch();
        $userName = $user ? $user['name'] : 'Verified Customer';

        // Check if product exists
        $stmtProd = $this->db->prepare("SELECT id FROM products WHERE id = ?");
        $stmtProd->execute([$productId]);
        if (!$stmtProd->fetch()) {
            sendError("Product not found.", 404);
        }

        try {
            $stmt = $this->db->prepare("
                INSERT INTO reviews (product_id, user_id, user_name, rating, comment, image_url, status)
                VALUES (?, ?, ?, ?, ?, ?, 'pending')
            ");
            $stmt->execute([$productId, $userId, $userName, $rating, $comment, $imageUrl]);
            $reviewId = $this->db->lastInsertId();

            sendSuccess("Review submitted successfully. It will be visible once approved by our team.", [
                "review_id" => $reviewId
            ], 201);

        } catch (PDOException $e) {
            sendError("Failed to submit review: " . $e->getMessage(), 500);
        }
    }
}
