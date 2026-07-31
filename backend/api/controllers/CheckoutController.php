<?php
/**
 * CheckoutController - Coupon verification, Razorpay order creation, payment verification, and COD
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

class CheckoutController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * POST /api/checkout/verify-coupon - Validate a coupon code
     */
    public function verifyCoupon($data, $userId = null) {
        $code = isset($data['code']) ? strtoupper(trim($data['code'])) : '';
        $subtotal = isset($data['subtotal']) ? (float)$data['subtotal'] : 0.0;

        if (empty($code)) {
            sendError("Coupon code is required.", 400);
        }

        $stmt = $this->db->prepare("SELECT * FROM coupons WHERE code = ? AND active = 1");
        $stmt->execute([$code]);
        $coupon = $stmt->fetch();

        if (!$coupon) {
            sendError("Invalid coupon code.", 404);
        }

        // Check expiry date
        if ($coupon['expiry_date'] && strtotime($coupon['expiry_date']) < strtotime(date('Y-m-d'))) {
            sendError("This coupon has expired.", 400);
        }

        // Check usage limit
        if ($coupon['usage_limit'] !== null && $coupon['usage_count'] >= $coupon['usage_limit']) {
            sendError("This coupon has reached its maximum usage limit.", 400);
        }

        // Check minimum cart value
        if ($coupon['min_cart_value'] !== null && $subtotal < $coupon['min_cart_value']) {
            sendError("Minimum order value of ₹" . number_format($coupon['min_cart_value']) . " is required for this coupon.", 400);
        }

        // Check per-user limit
        if ($userId && $coupon['per_user_limit'] !== null) {
            $stmtUse = $this->db->prepare("SELECT COUNT(id) as cnt FROM orders WHERE user_id = ? AND coupon_code = ? AND payment_status = 'paid'");
            $stmtUse->execute([$userId, $code]);
            $userUsage = (int)$stmtUse->fetch()['cnt'];

            if ($userUsage >= $coupon['per_user_limit']) {
                sendError("You have already used this coupon maximum times.", 400);
            }
        }

        // Calculate discount
        $discountAmount = 0.0;
        if ($coupon['type'] === 'percent') {
            $discountAmount = ($subtotal * (float)$coupon['value']) / 100.0;
        } else {
            $discountAmount = (float)$coupon['value'];
        }

        // Limit discount to subtotal
        if ($discountAmount > $subtotal) {
            $discountAmount = $subtotal;
        }

        sendSuccess("Coupon applied successfully.", [
            "code" => $coupon['code'],
            "type" => $coupon['type'],
            "value" => (float)$coupon['value'],
            "discount_amount" => $discountAmount,
            "description" => $coupon['description']
        ]);
    }

    /**
     * POST /api/checkout/razorpay-order - Start checkout and create Razorpay order
     */
    public function createRazorpayOrder($userSession, $data) {
        $userId = $userSession ? $userSession['user_id'] : null;
        $guestEmail = isset($data['guest_email']) ? trim($data['guest_email']) : null;
        $items = isset($data['items']) ? $data['items'] : []; // Array of {product_id, variant_id, qty}
        $shipping = isset($data['shipping_details']) ? $data['shipping_details'] : [];
        $couponCode = isset($data['coupon_code']) ? strtoupper(trim($data['coupon_code'])) : null;
        $notes = isset($data['notes']) ? trim($data['notes']) : null;

        if (empty($items)) {
            sendError("Your cart is empty.", 400);
        }

        if (empty($shipping['name']) || empty($shipping['line1']) || empty($shipping['city']) || empty($shipping['state']) || empty($shipping['pincode']) || empty($shipping['phone'])) {
            sendError("Complete shipping details are required.", 400);
        }

        try {
            // Verify items, calculate subtotal, and check stock
            $this->db->beginTransaction();
            
            $subtotal = 0.0;
            $validatedItems = [];

            foreach ($items as $item) {
                $pid = (int)$item['product_id'];
                $vid = (int)$item['variant_id'];
                $qty = (int)$item['qty'];

                if ($qty <= 0) continue;

                // Fetch product base price
                $stmtP = $this->db->prepare("SELECT name, base_price, status FROM products WHERE id = ?");
                $stmtP->execute([$pid]);
                $product = $stmtP->fetch();

                if (!$product || $product['status'] !== 'active') {
                    sendError("Product no longer available.", 404);
                }

                // Fetch variant stock and override price
                $stmtV = $this->db->prepare("SELECT size, color, stock_qty, price_override, sku FROM product_variants WHERE id = ? AND product_id = ?");
                $stmtV->execute([$vid, $pid]);
                $variant = $stmtV->fetch();

                if (!$variant) {
                    sendError("Product variant not found.", 404);
                }

                if ($variant['stock_qty'] < $qty) {
                    sendError("Insufficient stock for product: " . $product['name'] . " (" . $variant['size'] . "). Only " . $variant['stock_qty'] . " left.", 400);
                }

                $price = $variant['price_override'] !== null ? (float)$variant['price_override'] : (float)$product['base_price'];
                $subtotal += ($price * $qty);

                $validatedItems[] = [
                    'product_id' => $pid,
                    'variant_id' => $vid,
                    'qty' => $qty,
                    'price' => $price,
                    'name' => $product['name'],
                    'size' => $variant['size'],
                    'color' => $variant['color']
                ];
            }

            // Fetch settings for discount, shipping & taxes
            $stmtSet = $this->db->prepare("SELECT `key`, `value` FROM settings");
            $stmtSet->execute();
            $settings = array_column($stmtSet->fetchAll(), 'value', 'key');

            // Apply Coupon
            $discount = 0.0;
            if (!empty($couponCode)) {
                $stmtC = $this->db->prepare("SELECT * FROM coupons WHERE code = ? AND active = 1");
                $stmtC->execute([$couponCode]);
                $coupon = $stmtC->fetch();

                if ($coupon) {
                    $valid = true;
                    // Run sanity checks
                    if ($coupon['expiry_date'] && strtotime($coupon['expiry_date']) < time()) $valid = false;
                    if ($coupon['usage_limit'] !== null && $coupon['usage_count'] >= $coupon['usage_limit']) $valid = false;
                    if ($coupon['min_cart_value'] !== null && $subtotal < $coupon['min_cart_value']) $valid = false;

                    if ($valid) {
                        if ($coupon['type'] === 'percent') {
                            $discount = ($subtotal * (float)$coupon['value']) / 100.0;
                        } else {
                            $discount = (float)$coupon['value'];
                        }
                        if ($discount > $subtotal) $discount = $subtotal;
                    }
                }
            }

            // Calculate Shipping
            $shipThreshold = isset($settings['free_shipping_above']) ? (float)$settings['free_shipping_above'] : 1499.00;
            $shipFee = isset($settings['standard_shipping_fee']) ? (float)$settings['standard_shipping_fee'] : 99.00;
            if ($subtotal - $discount >= $shipThreshold) {
                $shipFee = 0.0;
            }

            // Calculate Tax (GST 5% included in price or added? Usually added or included. Let's calculate the included GST, or add it. Let's make it included in price as per Indian standards, and calculate the breakdown: gst_breakdown = total * 5/105)
            $gstRate = isset($settings['gst_rate']) ? (float)$settings['gst_rate'] : 5.0;
            $taxableValue = $subtotal - $discount + $shipFee;
            $taxAmount = round(($taxableValue * $gstRate) / (100.0 + $gstRate), 2); // Included GST

            $total = $taxableValue; // Total amount to charge customer (GST is included)

            // Generate Order Number
            $orderNum = "MRK-" . date('Ymd') . "-" . rand(1000, 9999);

            // Save order to Database with status 'pending'
            $stmtOrder = $this->db->prepare("
                INSERT INTO orders (
                    user_id, guest_email, order_number, status, payment_status, payment_method,
                    subtotal, discount, shipping_fee, tax, total, coupon_code,
                    shipping_name, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_pincode, shipping_phone,
                    notes
                ) VALUES (?, ?, ?, 'pending', 'pending', 'razorpay', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmtOrder->execute([
                $userId, $guestEmail, $orderNum,
                $subtotal, $discount, $shipFee, $taxAmount, $total, $couponCode,
                $shipping['name'], $shipping['line1'], isset($shipping['line2']) ? $shipping['line2'] : null, $shipping['city'], $shipping['state'], $shipping['pincode'], $shipping['phone'],
                $notes
            ]);
            $orderId = $this->db->lastInsertId();

            // Insert Order Items
            foreach ($validatedItems as $vi) {
                $stmtItem = $this->db->prepare("
                    INSERT INTO order_items (order_id, product_id, variant_id, qty, price_at_purchase, product_name, variant_size, variant_color)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmtItem->execute([
                    $orderId, $vi['product_id'], $vi['variant_id'], $vi['qty'], $vi['price'], $vi['name'], $vi['size'], $vi['color']
                ]);
            }

            // Create Razorpay Order via cURL
            $razorpayKeyId = getenv('VITE_RAZORPAY_KEY_ID') ?: 'rzp_test_rGPl5Q0V76EwWq';
            $razorpayKeySecret = getenv('RAZORPAY_KEY_SECRET') ?: 'dummy_secret';

            $postData = json_encode([
                "amount" => round($total * 100), // in paise
                "currency" => "INR",
                "receipt" => $orderNum,
                "notes" => [
                    "order_id" => (string)$orderId,
                    "customer_name" => $shipping['name']
                ]
            ]);

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://api.razorpay.com/v1/orders");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_USERPWD, $razorpayKeyId . ":" . $razorpayKeySecret);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            
            $result = curl_exec($ch);
            $httpcode = curl_getinfo($ch, HTTP_CODE);
            curl_close($ch);

            if ($httpcode !== 200) {
                $this->db->rollBack();
                sendError("Failed to initiate payment gateway order: " . $result, 500);
            }

            $razorpayData = json_decode($result, true);
            $razorpayOrderId = $razorpayData['id'];

            // Update database order with Razorpay Order ID
            $stmtUpdate = $this->db->prepare("UPDATE orders SET razorpay_order_id = ? WHERE id = ?");
            $stmtUpdate->execute([$razorpayOrderId, $orderId]);

            $this->db->commit();

            sendSuccess("Order initiated.", [
                "order_id" => $orderId,
                "order_number" => $orderNum,
                "razorpay_key_id" => $razorpayKeyId,
                "razorpay_order_id" => $razorpayOrderId,
                "amount" => round($total * 100),
                "currency" => "INR",
                "shipping" => $shipping
            ]);

        } catch (Exception $e) {
            $this->db->rollBack();
            sendError("Checkout failed: " . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/checkout/verify-payment - Validate Razorpay payment signature
     */
    public function verifyPayment($data) {
        $razorpayPaymentId = isset($data['razorpay_payment_id']) ? trim($data['razorpay_payment_id']) : '';
        $razorpayOrderId   = isset($data['razorpay_order_id']) ? trim($data['razorpay_order_id']) : '';
        $razorpaySignature = isset($data['razorpay_signature']) ? trim($data['razorpay_signature']) : '';

        if (empty($razorpayPaymentId) || empty($razorpayOrderId) || empty($razorpaySignature)) {
            sendError("Payment details missing.", 400);
        }

        $razorpayKeySecret = getenv('RAZORPAY_KEY_SECRET') ?: 'dummy_secret';
        
        // Verify signature
        $expectedSignature = hash_hmac('sha256', $razorpayOrderId . '|' . $razorpayPaymentId, $razorpayKeySecret);
        
        if (!hash_equals($razorpaySignature, $expectedSignature)) {
            // Mark payment as failed in DB
            $stmt = $this->db->prepare("UPDATE orders SET payment_status = 'failed' WHERE razorpay_order_id = ?");
            $stmt->execute([$razorpayOrderId]);
            sendError("Signature verification failed. Payment is fraudulent or failed.", 400);
        }

        try {
            $this->db->beginTransaction();

            // Fetch order details
            $stmtOrder = $this->db->prepare("SELECT id, status, coupon_code, total FROM orders WHERE razorpay_order_id = ?");
            $stmtOrder->execute([$razorpayOrderId]);
            $order = $stmtOrder->fetch();

            if (!$order) {
                sendError("Associated order not found.", 404);
            }

            // If already processed, send success immediately
            if ($order['status'] !== 'pending') {
                $this->db->commit();
                sendSuccess("Payment already verified.", ["order_id" => $order['id']]);
            }

            // Update order status to confirmed and payment to paid
            $stmtUpdate = $this->db->prepare("
                UPDATE orders 
                SET status = 'confirmed', payment_status = 'paid', razorpay_payment_id = ? 
                WHERE id = ?
            ");
            $stmtUpdate->execute([$razorpayPaymentId, $order['id']]);

            // Retrieve items to decrement stock
            $stmtItems = $this->db->prepare("SELECT variant_id, qty, product_name FROM order_items WHERE order_id = ?");
            $stmtItems->execute([$order['id']]);
            $items = $stmtItems->fetchAll();

            foreach ($items as $item) {
                // Update product_variants table
                $stmtStock = $this->db->prepare("UPDATE product_variants SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ?");
                $stmtStock->execute([$item['qty'], $item['variant_id'], $item['qty']]);

                if ($stmtStock->rowCount() === 0) {
                    throw new Exception("Inventory stock error for variant ID: " . $item['variant_id']);
                }
            }

            // Update coupon usage count if applicable
            if (!empty($order['coupon_code'])) {
                $stmtCoupon = $this->db->prepare("UPDATE coupons SET usage_count = usage_count + 1 WHERE code = ?");
                $stmtCoupon->execute([$order['coupon_code']]);
            }

            // Log activity
            $stmtLog = $this->db->prepare("
                INSERT INTO activity_log (action, subject, subject_id, description)
                VALUES ('order_confirmed', 'orders', ?, ?)
            ");
            $stmtLog->execute([$order['id'], "Order confirmed and paid via Razorpay. Total ₹" . number_format($order['total'], 2)]);

            $this->db->commit();
            sendSuccess("Payment verified & order confirmed.", ["order_id" => $order['id']]);

        } catch (Exception $e) {
            $this->db->rollBack();
            sendError("Payment verification processing failed: " . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/checkout/cod-order - Checkout using Cash on Delivery
     */
    public function createCodOrder($userSession, $data) {
        $userId = $userSession ? $userSession['user_id'] : null;
        $guestEmail = isset($data['guest_email']) ? trim($data['guest_email']) : null;
        $items = isset($data['items']) ? $data['items'] : [];
        $shipping = isset($data['shipping_details']) ? $data['shipping_details'] : [];
        $couponCode = isset($data['coupon_code']) ? strtoupper(trim($data['coupon_code'])) : null;
        $notes = isset($data['notes']) ? trim($data['notes']) : null;

        if (empty($items)) {
            sendError("Your cart is empty.", 400);
        }

        if (empty($shipping['name']) || empty($shipping['line1']) || empty($shipping['city']) || empty($shipping['state']) || empty($shipping['pincode']) || empty($shipping['phone'])) {
            sendError("Complete shipping details are required.", 400);
        }

        try {
            $this->db->beginTransaction();

            $subtotal = 0.0;
            $validatedItems = [];

            // Verify items, calculate subtotal, and check stock
            foreach ($items as $item) {
                $pid = (int)$item['product_id'];
                $vid = (int)$item['variant_id'];
                $qty = (int)$item['qty'];

                if ($qty <= 0) continue;

                $stmtP = $this->db->prepare("SELECT name, base_price, status FROM products WHERE id = ?");
                $stmtP->execute([$pid]);
                $product = $stmtP->fetch();

                if (!$product || $product['status'] !== 'active') {
                    sendError("Product no longer available.", 404);
                }

                $stmtV = $this->db->prepare("SELECT size, color, stock_qty, price_override FROM product_variants WHERE id = ? AND product_id = ?");
                $stmtV->execute([$vid, $pid]);
                $variant = $stmtV->fetch();

                if (!$variant) {
                    sendError("Product variant not found.", 404);
                }

                if ($variant['stock_qty'] < $qty) {
                    sendError("Insufficient stock for product: " . $product['name'] . " (" . $variant['size'] . "). Only " . $variant['stock_qty'] . " left.", 400);
                }

                $price = $variant['price_override'] !== null ? (float)$variant['price_override'] : (float)$product['base_price'];
                $subtotal += ($price * $qty);

                $validatedItems[] = [
                    'product_id' => $pid,
                    'variant_id' => $vid,
                    'qty' => $qty,
                    'price' => $price,
                    'name' => $product['name'],
                    'size' => $variant['size'],
                    'color' => $variant['color']
                ];
            }

            // Fetch settings for discount, shipping & taxes
            $stmtSet = $this->db->prepare("SELECT `key`, `value` FROM settings");
            $stmtSet->execute();
            $settings = array_column($stmtSet->fetchAll(), 'value', 'key');

            // Apply Coupon
            $discount = 0.0;
            if (!empty($couponCode)) {
                $stmtC = $this->db->prepare("SELECT * FROM coupons WHERE code = ? AND active = 1");
                $stmtC->execute([$couponCode]);
                $coupon = $stmtC->fetch();

                if ($coupon) {
                    $valid = true;
                    if ($coupon['expiry_date'] && strtotime($coupon['expiry_date']) < time()) $valid = false;
                    if ($coupon['usage_limit'] !== null && $coupon['usage_count'] >= $coupon['usage_limit']) $valid = false;
                    if ($coupon['min_cart_value'] !== null && $subtotal < $coupon['min_cart_value']) $valid = false;

                    if ($valid) {
                        if ($coupon['type'] === 'percent') {
                            $discount = ($subtotal * (float)$coupon['value']) / 100.0;
                        } else {
                            $discount = (float)$coupon['value'];
                        }
                        if ($discount > $subtotal) $discount = $subtotal;
                    }
                }
            }

            // Calculate Shipping
            $shipThreshold = isset($settings['free_shipping_above']) ? (float)$settings['free_shipping_above'] : 1499.00;
            $shipFee = isset($settings['standard_shipping_fee']) ? (float)$settings['standard_shipping_fee'] : 99.00;
            if ($subtotal - $discount >= $shipThreshold) {
                $shipFee = 0.0;
            }

            // Calculate Tax (GST 5% included)
            $gstRate = isset($settings['gst_rate']) ? (float)$settings['gst_rate'] : 5.0;
            $taxableValue = $subtotal - $discount + $shipFee;
            $taxAmount = round(($taxableValue * $gstRate) / (100.0 + $gstRate), 2); // Included GST

            $total = $taxableValue; // Total amount to charge customer (GST is included)

            // Verify COD limits
            $codLimit = isset($settings['cod_order_limit']) ? (float)$settings['cod_order_limit'] : 10000.00;
            if ($total > $codLimit) {
                sendError("Orders exceeding ₹" . number_format($codLimit) . " are not eligible for Cash on Delivery.", 400);
            }

            // Generate Order Number
            $orderNum = "MRK-" . date('Ymd') . "-" . rand(1000, 9999);

            // Save order to Database as 'confirmed' and 'pending' payment status
            $stmtOrder = $this->db->prepare("
                INSERT INTO orders (
                    user_id, guest_email, order_number, status, payment_status, payment_method,
                    subtotal, discount, shipping_fee, tax, total, coupon_code,
                    shipping_name, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_pincode, shipping_phone,
                    notes
                ) VALUES (?, ?, ?, 'confirmed', 'pending', 'cod', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmtOrder->execute([
                $userId, $guestEmail, $orderNum,
                $subtotal, $discount, $shipFee, $taxAmount, $total, $couponCode,
                $shipping['name'], $shipping['line1'], isset($shipping['line2']) ? $shipping['line2'] : null, $shipping['city'], $shipping['state'], $shipping['pincode'], $shipping['phone'],
                $notes
            ]);
            $orderId = $this->db->lastInsertId();

            // Insert Order Items and Decrement Stocks
            foreach ($validatedItems as $vi) {
                $stmtItem = $this->db->prepare("
                    INSERT INTO order_items (order_id, product_id, variant_id, qty, price_at_purchase, product_name, variant_size, variant_color)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmtItem->execute([
                    $orderId, $vi['product_id'], $vi['variant_id'], $vi['qty'], $vi['price'], $vi['name'], $vi['size'], $vi['color']
                ]);

                // Decrement stock
                $stmtStock = $this->db->prepare("UPDATE product_variants SET stock_qty = stock_qty - ? WHERE id = ? AND stock_qty >= ?");
                $stmtStock->execute([$vi['qty'], $vi['variant_id'], $vi['qty']]);

                if ($stmtStock->rowCount() === 0) {
                    throw new Exception("Inventory stock error for variant: " . $vi['name']);
                }
            }

            // Update coupon usage count if applicable
            if (!empty($couponCode)) {
                $stmtCoupon = $this->db->prepare("UPDATE coupons SET usage_count = usage_count + 1 WHERE code = ?");
                $stmtCoupon->execute([$couponCode]);
            }

            // Log activity
            $stmtLog = $this->db->prepare("
                INSERT INTO activity_log (action, subject, subject_id, description)
                VALUES ('order_confirmed', 'orders', ?, ?)
            ");
            $stmtLog->execute([$orderId, "COD order placed. Total ₹" . number_format($total, 2)]);

            $this->db->commit();

            sendSuccess("COD order placed successfully.", [
                "order_id" => $orderId,
                "order_number" => $orderNum,
                "total" => $total,
                "shipping" => $shipping
            ], 201);

        } catch (Exception $e) {
            $this->db->rollBack();
            sendError("Failed to place COD order: " . $e->getMessage(), 500);
        }
    }
}
