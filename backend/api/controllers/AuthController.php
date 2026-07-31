<?php
/**
 * AuthController - Handles user registration, login, profile and address management
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/response.php';

class AuthController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * POST /api/auth/signup
     */
    public function signup($data) {
        $name = isset($data['name']) ? trim($data['name']) : '';
        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? trim($data['password']) : '';
        $phone = isset($data['phone']) ? trim($data['phone']) : null;
        $newsletter = isset($data['newsletter_subscribed']) ? (int)$data['newsletter_subscribed'] : 0;

        if (empty($name) || empty($email) || empty($password)) {
            sendError("Name, email, and password are required.", 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendError("Invalid email address format.", 400);
        }

        if (strlen($password) < 6) {
            sendError("Password must be at least 6 characters.", 400);
        }

        // Check if email already exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            sendError("Email address is already registered.", 409);
        }

        // Hash password and insert user
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        
        try {
            $stmt = $this->db->prepare("
                INSERT INTO users (name, email, phone, password_hash, role, newsletter_subscribed) 
                VALUES (?, ?, ?, ?, 'customer', ?)
            ");
            $stmt->execute([$name, $email, $phone, $passwordHash, $newsletter]);
            $userId = $this->db->lastInsertId();

            // Auto-subscribe to newsletter subscribers table if checked
            if ($newsletter) {
                $stmtNews = $this->db->prepare("INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)");
                $stmtNews->execute([$email]);
            }

            // Fetch created user details
            $stmt = $this->db->prepare("SELECT id, name, email, phone, role, newsletter_subscribed, created_at FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            // Generate JWT
            $token = JWT::generate([
                'user_id' => $user['id'],
                'role' => $user['role'],
                'email' => $user['email']
            ]);

            sendSuccess("Registration successful.", [
                "token" => $token,
                "user" => $user
            ], 201);

        } catch (PDOException $e) {
            sendError("Failed to register user. Please try again. " . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/auth/login
     */
    public function login($data) {
        $email = isset($data['email']) ? trim($data['email']) : '';
        $password = isset($data['password']) ? trim($data['password']) : '';

        if (empty($email) || empty($password)) {
            sendError("Email and password are required.", 400);
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            sendError("Invalid email or password.", 401);
        }

        // Generate JWT
        $token = JWT::generate([
            'user_id' => $user['id'],
            'role' => $user['role'],
            'email' => $user['email']
        ]);

        // Clean user response data (remove password hash)
        unset($user['password_hash']);

        sendSuccess("Login successful.", [
            "token" => $token,
            "user" => $user
        ]);
    }

    /**
     * GET /api/auth/me
     */
    public function me($userSession) {
        if (!$userSession) {
            sendError("Unauthorized.", 401);
        }

        $stmt = $this->db->prepare("SELECT id, name, email, phone, role, newsletter_subscribed, created_at FROM users WHERE id = ?");
        $stmt->execute([$userSession['user_id']]);
        $user = $stmt->fetch();

        if (!$user) {
            sendError("User not found.", 404);
        }

        sendSuccess("User details retrieved.", ["user" => $user]);
    }

    /**
     * PUT /api/auth/profile
     */
    public function updateProfile($userSession, $data) {
        if (!$userSession) {
            sendError("Unauthorized.", 401);
        }

        $userId = $userSession['user_id'];
        $name = isset($data['name']) ? trim($data['name']) : '';
        $email = isset($data['email']) ? trim($data['email']) : '';
        $phone = isset($data['phone']) ? trim($data['phone']) : null;
        $password = isset($data['password']) ? trim($data['password']) : '';

        if (empty($name) || empty($email)) {
            sendError("Name and email are required.", 400);
        }

        // Verify email unique (excluding current user)
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->execute([$email, $userId]);
        if ($stmt->fetch()) {
            sendError("Email address is already in use by another user.", 409);
        }

        try {
            if (!empty($password)) {
                if (strlen($password) < 6) {
                    sendError("Password must be at least 6 characters.", 400);
                }
                $passwordHash = password_hash($password, PASSWORD_BCRYPT);
                $stmt = $this->db->prepare("
                    UPDATE users 
                    SET name = ?, email = ?, phone = ?, password_hash = ?
                    WHERE id = ?
                ");
                $stmt->execute([$name, $email, $phone, $passwordHash, $userId]);
            } else {
                $stmt = $this->db->prepare("
                    UPDATE users 
                    SET name = ?, email = ?, phone = ?
                    WHERE id = ?
                ");
                $stmt->execute([$name, $email, $phone, $userId]);
            }

            // Fetch updated details
            $stmt = $this->db->prepare("SELECT id, name, email, phone, role, newsletter_subscribed, created_at FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            sendSuccess("Profile updated successfully.", ["user" => $user]);

        } catch (PDOException $e) {
            sendError("Failed to update profile: " . $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/auth/addresses
     */
    public function getAddresses($userSession) {
        if (!$userSession) {
            sendError("Unauthorized.", 401);
        }

        $stmt = $this->db->prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC");
        $stmt->execute([$userSession['user_id']]);
        $addresses = $stmt->fetchAll();

        sendSuccess("Addresses retrieved.", ["addresses" => $addresses]);
    }

    /**
     * POST /api/auth/addresses
     */
    public function addAddress($userSession, $data) {
        if (!$userSession) {
            sendError("Unauthorized.", 401);
        }

        $userId = $userSession['user_id'];
        $label = isset($data['label']) ? trim($data['label']) : 'Home';
        $name = isset($data['name']) ? trim($data['name']) : '';
        $line1 = isset($data['line1']) ? trim($data['line1']) : '';
        $line2 = isset($data['line2']) ? trim($data['line2']) : null;
        $city = isset($data['city']) ? trim($data['city']) : '';
        $state = isset($data['state']) ? trim($data['state']) : '';
        $pincode = isset($data['pincode']) ? trim($data['pincode']) : '';
        $phone = isset($data['phone']) ? trim($data['phone']) : '';
        $isDefault = isset($data['is_default']) ? (int)$data['is_default'] : 0;

        if (empty($name) || empty($line1) || empty($city) || empty($state) || empty($pincode) || empty($phone)) {
            sendError("Required shipping details missing.", 400);
        }

        if (strlen($pincode) !== 6 || !is_numeric($pincode)) {
            sendError("Pincode must be exactly 6 digits.", 400);
        }

        try {
            $this->db->beginTransaction();

            if ($isDefault) {
                // Remove default status from existing addresses
                $stmt = $this->db->prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?");
                $stmt->execute([$userId]);
            }

            // Insert new address
            $stmt = $this->db->prepare("
                INSERT INTO addresses (user_id, label, name, line1, line2, city, state, pincode, phone, is_default)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$userId, $label, $name, $line1, $line2, $city, $state, $pincode, $phone, $isDefault]);
            $addressId = $this->db->lastInsertId();

            $this->db->commit();

            // Fetch newly created address
            $stmt = $this->db->prepare("SELECT * FROM addresses WHERE id = ?");
            $stmt->execute([$addressId]);
            $address = $stmt->fetch();

            sendSuccess("Address added successfully.", ["address" => $address], 201);

        } catch (PDOException $e) {
            $this->db->rollBack();
            sendError("Failed to add address: " . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/auth/addresses/:id
     */
    public function deleteAddress($userSession, $addressId) {
        if (!$userSession) {
            sendError("Unauthorized.", 401);
        }

        $userId = $userSession['user_id'];

        // Verify address belongs to user
        $stmt = $this->db->prepare("SELECT is_default FROM addresses WHERE id = ? AND user_id = ?");
        $stmt->execute([$addressId, $userId]);
        $address = $stmt->fetch();

        if (!$address) {
            sendError("Address not found.", 404);
        }

        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare("DELETE FROM addresses WHERE id = ? AND user_id = ?");
            $stmt->execute([$addressId, $userId]);

            // If we deleted the default address, make the most recent address default
            if ($address['is_default']) {
                $stmt = $this->db->prepare("
                    UPDATE addresses 
                    SET is_default = 1 
                    WHERE user_id = ? 
                    ORDER BY id DESC 
                    LIMIT 1
                ");
                $stmt->execute([$userId]);
            }

            $this->db->commit();
            sendSuccess("Address deleted successfully.");

        } catch (PDOException $e) {
            $this->db->rollBack();
            sendError("Failed to delete address: " . $e->getMessage(), 500);
        }
    }
}
