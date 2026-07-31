<?php
/**
 * AdminController - Operations for the store admin panel
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

class AdminController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Check if the user is an admin or staff member
     */
    private function verifyAdmin($userSession) {
        if (!$userSession || !in_array($userSession['role'], ['admin', 'staff'])) {
            sendError("Forbidden. Access restricted to store administrators.", 403);
        }
    }

    /**
     * GET /api/admin/stats - Dashboard KPIs and overview charts
     */
    public function getStats($userSession) {
        $this->verifyAdmin($userSession);

        try {
            // KPI 1: Total Sales (paid orders)
            $stmtSales = $this->db->query("SELECT COALESCE(SUM(total), 0) as total_sales FROM orders WHERE payment_status = 'paid'");
            $totalSales = (float)$stmtSales->fetch()['total_sales'];

            // KPI 2: Total Orders
            $stmtOrders = $this->db->query("SELECT COUNT(id) as total_orders FROM orders");
            $totalOrders = (int)$stmtOrders->fetch()['total_orders'];

            // KPI 3: Average Order Value
            $stmtAOV = $this->db->query("SELECT COALESCE(AVG(total), 0) as aov FROM orders WHERE payment_status = 'paid'");
            $aov = (float)$stmtAOV->fetch()['aov'];

            // KPI 4: Low Stock Alert
            $stmtStock = $this->db->query("SELECT COUNT(id) as low_stock FROM product_variants WHERE stock_qty <= 5");
            $lowStock = (int)$stmtStock->fetch()['low_stock'];

            // KPI 5: Pending Reviews Moderation
            $stmtReviews = $this->db->query("SELECT COUNT(id) as pending_reviews FROM reviews WHERE status = 'pending'");
            $pendingReviews = (int)$stmtReviews->fetch()['pending_reviews'];

            // Fetch recent orders
            $stmtRecent = $this->db->query("
                SELECT id, order_number, shipping_name, total, status, payment_status, created_at 
                FROM orders 
                ORDER BY created_at DESC 
                LIMIT 5
            ");
            $recentOrders = $stmtRecent->fetchAll();

            // Fetch sales by day (last 7 days)
            $stmtDailySales = $this->db->query("
                SELECT DATE(created_at) as date, COALESCE(SUM(total), 0) as sales, COUNT(id) as orders
                FROM orders 
                WHERE payment_status = 'paid' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY DATE(created_at)
                ORDER BY DATE(created_at) ASC
            ");
            $dailySales = $stmtDailySales->fetchAll();

            // Fetch top selling products
            $stmtTopProds = $this->db->query("
                SELECT oi.product_name, SUM(oi.qty) as units_sold, SUM(oi.qty * oi.price_at_purchase) as total_revenue
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
                WHERE o.payment_status = 'paid'
                GROUP BY oi.product_id, oi.product_name
                ORDER BY units_sold DESC
                LIMIT 5
            ");
            $topProducts = $stmtTopProds->fetchAll();

            sendSuccess("Stats loaded successfully.", [
                "kpis" => [
                    "total_sales" => $totalSales,
                    "total_orders" => $totalOrders,
                    "avg_order_value" => $aov,
                    "low_stock_count" => $lowStock,
                    "pending_reviews_count" => $pendingReviews,
                ],
                "recent_orders" => $recentOrders,
                "charts" => [
                    "daily_sales" => $dailySales
                ],
                "top_products" => $topProducts
            ]);

        } catch (PDOException $e) {
            sendError("Failed to compile dashboard statistics: " . $e->getMessage(), 500);
        }
    }

    // ─── Products Admin ───────────────────────────────────────────────────────────

    /**
     * GET /api/admin/products - All products including draft and archived
     */
    public function getProducts($userSession, $queryParams) {
        $this->verifyAdmin($userSession);

        $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 20;
        $offset = isset($queryParams['offset']) ? (int)$queryParams['offset'] : 0;
        $status = isset($queryParams['status']) ? trim($queryParams['status']) : '';
        $search = isset($queryParams['search']) ? trim($queryParams['search']) : '';

        $where = ["1=1"];
        $params = [];

        if (!empty($status)) {
            $where[] = "p.status = ?";
            $params[] = $status;
        }

        if (!empty($search)) {
            $where[] = "(p.name LIKE ? OR p.sku LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereSql = implode(" AND ", $where);

        try {
            $stmtCount = $this->db->prepare("SELECT COUNT(id) as total FROM products p WHERE $whereSql");
            $stmtCount->execute($params);
            $total = (int)$stmtCount->fetch()['total'];

            $query = "
                SELECT p.*, c.name as category_name, COALESCE(SUM(pv.stock_qty), 0) as total_stock
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN product_variants pv ON p.id = pv.product_id
                WHERE $whereSql
                GROUP BY p.id
                ORDER BY p.id DESC
                LIMIT $limit OFFSET $offset
            ";
            $stmt = $this->db->prepare($query);
            $stmt->execute($params);
            $products = $stmt->fetchAll();

            // Fetch primary image for each product
            foreach ($products as &$prod) {
                $imgStmt = $this->db->prepare("SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC LIMIT 1");
                $imgStmt->execute([$prod['id']]);
                $img = $imgStmt->fetch();
                $prod['image'] = $img ? $img['image_url'] : null;
                $prod['tags'] = json_decode($prod['tags'], true) ?: [];
            }

            sendSuccess("Products retrieved successfully.", [
                "products" => $products,
                "total" => $total
            ]);

        } catch (PDOException $e) {
            sendError("Failed to fetch admin product list: " . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/admin/products - Add product with variants and images
     */
    public function createProduct($userSession, $data) {
        $this->verifyAdmin($userSession);

        $name             = isset($data['name']) ? trim($data['name']) : '';
        $slug             = isset($data['slug']) ? trim($data['slug']) : '';
        $description      = isset($data['description']) ? trim($data['description']) : null;
        $fabric           = isset($data['fabric']) ? trim($data['fabric']) : null;
        $careInstructions = isset($data['care_instructions']) ? trim($data['care_instructions']) : null;
        $categoryId       = isset($data['category_id']) ? (int)$data['category_id'] : 0;
        $basePrice        = isset($data['base_price']) ? (float)$data['base_price'] : 0.00;
        $mrp              = isset($data['mrp']) ? (float)$data['mrp'] : 0.00;
        $sku              = isset($data['sku']) ? trim($data['sku']) : '';
        $status           = isset($data['status']) ? trim($data['status']) : 'draft';
        $featured         = isset($data['is_featured']) ? (int)$data['is_featured'] : 0;
        $bestseller       = isset($data['is_bestseller']) ? (int)$data['is_bestseller'] : 0;
        $newArrival       = isset($data['is_new_arrival']) ? (int)$data['is_new_arrival'] : 0;
        $metaTitle        = isset($data['meta_title']) ? trim($data['meta_title']) : null;
        $metaDescription  = isset($data['meta_description']) ? trim($data['meta_description']) : null;
        $tags             = isset($data['tags']) ? json_encode($data['tags']) : null;
        
        $variants         = isset($data['variants']) ? $data['variants'] : []; // array of {size, color, color_hex, sku, stock_qty, price_override}
        $images           = isset($data['images']) ? $data['images'] : []; // array of {image_url, sort_order, alt_text}

        if (empty($name) || empty($slug) || empty($sku) || $categoryId <= 0 || $basePrice <= 0 || $mrp <= 0) {
            sendError("Name, slug, SKU, category ID, price and MRP are required.", 400);
        }

        try {
            $this->db->beginTransaction();

            // Save Product
            $stmt = $this->db->prepare("
                INSERT INTO products (
                    name, slug, description, fabric, care_instructions, category_id, base_price, mrp, sku,
                    status, is_featured, is_bestseller, is_new_arrival, meta_title, meta_description, tags
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $name, $slug, $description, $fabric, $careInstructions, $categoryId, $basePrice, $mrp, $sku,
                $status, $featured, $bestseller, $newArrival, $metaTitle, $metaDescription, $tags
            ]);
            $productId = $this->db->lastInsertId();

            // Save Variants
            if (!empty($variants)) {
                $stmtVar = $this->db->prepare("
                    INSERT INTO product_variants (product_id, size, color, color_hex, sku, stock_qty, price_override)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                foreach ($variants as $v) {
                    $vSku = !empty($v['sku']) ? trim($v['sku']) : $sku . "-" . trim($v['size']);
                    $stmtVar->execute([
                        $productId, trim($v['size']), trim($v['color']), trim($v['color_hex']), $vSku, (int)$v['stock_qty'],
                        $v['price_override'] !== null && is_numeric($v['price_override']) ? (float)$v['price_override'] : null
                    ]);
                }
            }

            // Save Images
            if (!empty($images)) {
                $stmtImg = $this->db->prepare("
                    INSERT INTO product_images (product_id, image_url, sort_order, alt_text)
                    VALUES (?, ?, ?, ?)
                ");
                foreach ($images as $img) {
                    $stmtImg->execute([
                        $productId, trim($img['image_url']), (int)$img['sort_order'], trim($img['alt_text'])
                    ]);
                }
            }

            // Log
            $stmtLog = $this->db->prepare("INSERT INTO activity_log (user_id, action, subject, subject_id, description) VALUES (?, 'create_product', 'products', ?, ?)");
            $stmtLog->execute([$userSession['user_id'], $productId, "Product '$name' created."]);

            $this->db->commit();
            sendSuccess("Product created successfully.", ["product_id" => $productId], 201);

        } catch (PDOException $e) {
            $this->db->rollBack();
            sendError("Failed to create product: " . $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/admin/products/:id - Update product
     */
    public function updateProduct($userSession, $productId, $data) {
        $this->verifyAdmin($userSession);

        $name             = isset($data['name']) ? trim($data['name']) : '';
        $slug             = isset($data['slug']) ? trim($data['slug']) : '';
        $description      = isset($data['description']) ? trim($data['description']) : null;
        $fabric           = isset($data['fabric']) ? trim($data['fabric']) : null;
        $careInstructions = isset($data['care_instructions']) ? trim($data['care_instructions']) : null;
        $categoryId       = isset($data['category_id']) ? (int)$data['category_id'] : 0;
        $basePrice        = isset($data['base_price']) ? (float)$data['base_price'] : 0.00;
        $mrp              = isset($data['mrp']) ? (float)$data['mrp'] : 0.00;
        $sku              = isset($data['sku']) ? trim($data['sku']) : '';
        $status           = isset($data['status']) ? trim($data['status']) : 'draft';
        $featured         = isset($data['is_featured']) ? (int)$data['is_featured'] : 0;
        $bestseller       = isset($data['is_bestseller']) ? (int)$data['is_bestseller'] : 0;
        $newArrival       = isset($data['is_new_arrival']) ? (int)$data['is_new_arrival'] : 0;
        $metaTitle        = isset($data['meta_title']) ? trim($data['meta_title']) : null;
        $metaDescription  = isset($data['meta_description']) ? trim($data['meta_description']) : null;
        $tags             = isset($data['tags']) ? json_encode($data['tags']) : null;
        
        $variants         = isset($data['variants']) ? $data['variants'] : [];
        $images           = isset($data['images']) ? $data['images'] : [];

        if (empty($name) || empty($slug) || empty($sku) || $categoryId <= 0 || $basePrice <= 0 || $mrp <= 0) {
            sendError("Name, slug, SKU, category ID, price and MRP are required.", 400);
        }

        try {
            $this->db->beginTransaction();

            // Update Product
            $stmt = $this->db->prepare("
                UPDATE products SET
                    name = ?, slug = ?, description = ?, fabric = ?, care_instructions = ?, category_id = ?, 
                    base_price = ?, mrp = ?, sku = ?, status = ?, is_featured = ?, is_bestseller = ?, 
                    is_new_arrival = ?, meta_title = ?, meta_description = ?, tags = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $name, $slug, $description, $fabric, $careInstructions, $categoryId, $basePrice, $mrp, $sku,
                $status, $featured, $bestseller, $newArrival, $metaTitle, $metaDescription, $tags, $productId
            ]);

            // Sync Variants (simple approach: delete all and re-insert)
            $stmtDelVar = $this->db->prepare("DELETE FROM product_variants WHERE product_id = ?");
            $stmtDelVar->execute([$productId]);

            if (!empty($variants)) {
                $stmtVar = $this->db->prepare("
                    INSERT INTO product_variants (product_id, size, color, color_hex, sku, stock_qty, price_override)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                foreach ($variants as $v) {
                    $vSku = !empty($v['sku']) ? trim($v['sku']) : $sku . "-" . trim($v['size']);
                    $stmtVar->execute([
                        $productId, trim($v['size']), trim($v['color']), trim($v['color_hex']), $vSku, (int)$v['stock_qty'],
                        $v['price_override'] !== null && is_numeric($v['price_override']) ? (float)$v['price_override'] : null
                    ]);
                }
            }

            // Sync Images
            $stmtDelImg = $this->db->prepare("DELETE FROM product_images WHERE product_id = ?");
            $stmtDelImg->execute([$productId]);

            if (!empty($images)) {
                $stmtImg = $this->db->prepare("
                    INSERT INTO product_images (product_id, image_url, sort_order, alt_text)
                    VALUES (?, ?, ?, ?)
                ");
                foreach ($images as $img) {
                    $stmtImg->execute([
                        $productId, trim($img['image_url']), (int)$img['sort_order'], trim($img['alt_text'])
                    ]);
                }
            }

            // Log
            $stmtLog = $this->db->prepare("INSERT INTO activity_log (user_id, action, subject, subject_id, description) VALUES (?, 'update_product', 'products', ?, ?)");
            $stmtLog->execute([$userSession['user_id'], $productId, "Product '$name' updated."]);

            $this->db->commit();
            sendSuccess("Product updated successfully.");

        } catch (PDOException $e) {
            $this->db->rollBack();
            sendError("Failed to update product: " . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/admin/products/:id
     */
    public function deleteProduct($userSession, $productId) {
        $this->verifyAdmin($userSession);

        try {
            $stmtName = $this->db->prepare("SELECT name FROM products WHERE id = ?");
            $stmtName->execute([$productId]);
            $name = $stmtName->fetch()['name'];

            // Cascade delete will automatically delete variants & images
            $stmt = $this->db->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$productId]);

            // Log
            $stmtLog = $this->db->prepare("INSERT INTO activity_log (user_id, action, subject, subject_id, description) VALUES (?, 'delete_product', 'products', ?, ?)");
            $stmtLog->execute([$userSession['user_id'], $productId, "Product '$name' deleted."]);

            sendSuccess("Product deleted successfully.");

        } catch (PDOException $e) {
            sendError("Failed to delete product. It might be linked to completed orders. " . $e->getMessage(), 500);
        }
    }

    // ─── Orders Admin ─────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/orders - All orders with filters
     */
    public function getOrders($userSession, $queryParams) {
        $this->verifyAdmin($userSession);

        $status = isset($queryParams['status']) ? trim($queryParams['status']) : '';
        $paymentStatus = isset($queryParams['payment_status']) ? trim($queryParams['payment_status']) : '';
        $search = isset($queryParams['search']) ? trim($queryParams['search']) : '';
        $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 20;
        $offset = isset($queryParams['offset']) ? (int)$queryParams['offset'] : 0;

        $where = ["1=1"];
        $params = [];

        if (!empty($status)) {
            $where[] = "status = ?";
            $params[] = $status;
        }

        if (!empty($paymentStatus)) {
            $where[] = "payment_status = ?";
            $params[] = $paymentStatus;
        }

        if (!empty($search)) {
            $where[] = "(order_number LIKE ? OR shipping_name LIKE ? OR shipping_phone LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        $whereSql = implode(" AND ", $where);

        try {
            $stmtCount = $this->db->prepare("SELECT COUNT(id) as total FROM orders WHERE $whereSql");
            $stmtCount->execute($params);
            $total = (int)$stmtCount->fetch()['total'];

            $stmt = $this->db->prepare("
                SELECT * FROM orders 
                WHERE $whereSql 
                ORDER BY id DESC 
                LIMIT $limit OFFSET $offset
            ");
            $stmt->execute($params);
            $orders = $stmt->fetchAll();

            sendSuccess("Orders retrieved.", [
                "orders" => $orders,
                "total" => $total
            ]);

        } catch (PDOException $e) {
            sendError("Failed to retrieve orders: " . $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/admin/orders/:id - Update status / shipping courier details
     */
    public function updateOrderStatus($userSession, $orderId, $data) {
        $this->verifyAdmin($userSession);

        $status         = isset($data['status']) ? trim($data['status']) : '';
        $paymentStatus  = isset($data['payment_status']) ? trim($data['payment_status']) : '';
        $courier        = isset($data['courier']) ? trim($data['courier']) : null;
        $trackingNumber = isset($data['tracking_number']) ? trim($data['tracking_number']) : null;

        if (empty($status) && empty($paymentStatus)) {
            sendError("Status or Payment Status is required.", 400);
        }

        try {
            $this->db->beginTransaction();

            // Fetch current order status
            $stmtCur = $this->db->prepare("SELECT status, payment_status FROM orders WHERE id = ?");
            $stmtCur->execute([$orderId]);
            $currentOrder = $stmtCur->fetch();

            if (!$currentOrder) {
                sendError("Order not found.", 404);
            }

            $updateFields = [];
            $params = [];

            if (!empty($status)) {
                $updateFields[] = "status = ?";
                $params[] = $status;
            }

            if (!empty($paymentStatus)) {
                $updateFields[] = "payment_status = ?";
                $params[] = $paymentStatus;
            }

            if ($courier !== null) {
                $updateFields[] = "courier = ?";
                $params[] = $courier;
            }

            if ($trackingNumber !== null) {
                $updateFields[] = "tracking_number = ?";
                $params[] = $trackingNumber;
            }

            $params[] = $orderId;

            $updateSql = implode(", ", $updateFields);
            $stmt = $this->db->prepare("UPDATE orders SET $updateSql WHERE id = ?");
            $stmt->execute($params);

            // Log activity
            $stmtLog = $this->db->prepare("
                INSERT INTO activity_log (user_id, action, subject, subject_id, description)
                VALUES (?, 'update_order', 'orders', ?, ?)
            ");
            $logMsg = "Order status updated to '" . ($status ?: $currentOrder['status']) . "' and payment status updated to '" . ($paymentStatus ?: $currentOrder['payment_status']) . "'.";
            $stmtLog->execute([$userSession['user_id'], $orderId, $logMsg]);

            $this->db->commit();
            sendSuccess("Order updated successfully.");

        } catch (PDOException $e) {
            $this->db->rollBack();
            sendError("Failed to update order details: " . $e->getMessage(), 500);
        }
    }

    // ─── Coupons Admin ────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/coupons - List coupons
     */
    public function getCoupons($userSession) {
        $this->verifyAdmin($userSession);

        $stmt = $this->db->query("SELECT * FROM coupons ORDER BY id DESC");
        $coupons = $stmt->fetchAll();

        sendSuccess("Coupons retrieved.", ["coupons" => $coupons]);
    }

    /**
     * POST /api/admin/coupons - Create coupon
     */
    public function createCoupon($userSession, $data) {
        $this->verifyAdmin($userSession);

        $code         = strtoupper(trim($data['code'] ?? ''));
        $type         = trim($data['type'] ?? '');
        $value        = (float)($data['value'] ?? 0);
        $minCartValue = isset($data['min_cart_value']) ? (float)$data['min_cart_value'] : null;
        $usageLimit   = isset($data['usage_limit']) ? (int)$data['usage_limit'] : null;
        $expiryDate   = isset($data['expiry_date']) ? trim($data['expiry_date']) : null;
        $description  = trim($data['description'] ?? '');
        $active       = (int)($data['active'] ?? 1);

        if (empty($code) || !in_array($type, ['flat', 'percent']) || $value <= 0) {
            sendError("Code, valid type, and positive discount value are required.", 400);
        }

        try {
            $stmt = $this->db->prepare("
                INSERT INTO coupons (code, type, value, min_cart_value, usage_limit, expiry_date, description, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$code, $type, $value, $minCartValue, $usageLimit, $expiryDate ?: null, $description ?: null, $active]);
            $couponId = $this->db->lastInsertId();

            sendSuccess("Coupon created successfully.", ["coupon_id" => $couponId], 201);

        } catch (PDOException $e) {
            sendError("Failed to create coupon code: " . $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/admin/coupons/:id - Update coupon
     */
    public function updateCoupon($userSession, $couponId, $data) {
        $this->verifyAdmin($userSession);

        $code         = strtoupper(trim($data['code'] ?? ''));
        $type         = trim($data['type'] ?? '');
        $value        = (float)($data['value'] ?? 0);
        $minCartValue = isset($data['min_cart_value']) ? (float)$data['min_cart_value'] : null;
        $usageLimit   = isset($data['usage_limit']) ? (int)$data['usage_limit'] : null;
        $expiryDate   = isset($data['expiry_date']) ? trim($data['expiry_date']) : null;
        $description  = trim($data['description'] ?? '');
        $active       = (int)($data['active'] ?? 1);

        if (empty($code) || !in_array($type, ['flat', 'percent']) || $value <= 0) {
            sendError("Code, valid type, and positive discount value are required.", 400);
        }

        try {
            $stmt = $this->db->prepare("
                UPDATE coupons SET
                    code = ?, type = ?, value = ?, min_cart_value = ?, usage_limit = ?, expiry_date = ?, description = ?, active = ?
                WHERE id = ?
            ");
            $stmt->execute([$code, $type, $value, $minCartValue, $usageLimit, $expiryDate ?: null, $description ?: null, $active, $couponId]);

            sendSuccess("Coupon updated successfully.");

        } catch (PDOException $e) {
            sendError("Failed to update coupon code: " . $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/admin/coupons/:id
     */
    public function deleteCoupon($userSession, $couponId) {
        $this->verifyAdmin($userSession);

        try {
            $stmt = $this->db->prepare("DELETE FROM coupons WHERE id = ?");
            $stmt->execute([$couponId]);
            sendSuccess("Coupon deleted successfully.");
        } catch (PDOException $e) {
            sendError("Failed to delete coupon: " . $e->getMessage(), 500);
        }
    }

    // ─── Reviews Admin ────────────────────────────────────────────────────────────

    /**
     * GET /api/admin/reviews - All reviews
     */
    public function getReviews($userSession) {
        $this->verifyAdmin($userSession);

        $stmt = $this->db->query("
            SELECT r.*, p.name as product_name, p.slug as product_slug 
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            ORDER BY r.id DESC
        ");
        $reviews = $stmt->fetchAll();

        sendSuccess("Reviews retrieved.", ["reviews" => $reviews]);
    }

    /**
     * PUT /api/admin/reviews/:id - Moderate review / Reply
     */
    public function moderateReview($userSession, $reviewId, $data) {
        $this->verifyAdmin($userSession);

        $status = isset($data['status']) ? trim($data['status']) : '';
        $adminReply = isset($data['admin_reply']) ? trim($data['admin_reply']) : null;

        if (empty($status) || !in_array($status, ['pending', 'approved', 'rejected'])) {
            sendError("Valid moderation status (pending, approved, rejected) is required.", 400);
        }

        try {
            $stmt = $this->db->prepare("UPDATE reviews SET status = ?, admin_reply = ? WHERE id = ?");
            $stmt->execute([$status, $adminReply, $reviewId]);

            sendSuccess("Review updated successfully.");

        } catch (PDOException $e) {
            sendError("Failed to moderate review: " . $e->getMessage(), 500);
        }
    }

    // ─── Settings Admin ───────────────────────────────────────────────────────────

    /**
     * GET /api/admin/settings - Read settings
     */
    public function getSettings($userSession) {
        $this->verifyAdmin($userSession);

        $stmt = $this->db->query("SELECT * FROM settings");
        $settingsList = $stmt->fetchAll();
        
        $settings = [];
        foreach ($settingsList as $s) {
            $settings[$s['key']] = $s['value'];
        }

        sendSuccess("Settings retrieved.", ["settings" => $settings]);
    }

    /**
     * PUT /api/admin/settings - Save settings
     */
    public function updateSettings($userSession, $data) {
        $this->verifyAdmin($userSession);

        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?");

            foreach ($data as $key => $val) {
                $stmt->execute([$key, (string)$val, (string)$val]);
            }

            $this->db->commit();
            sendSuccess("Settings updated successfully.");

        } catch (PDOException $e) {
            $this->db->rollBack();
            sendError("Failed to update store settings: " . $e->getMessage(), 500);
        }
    }
}
