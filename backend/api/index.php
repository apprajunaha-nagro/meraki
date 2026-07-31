<?php
/**
 * Master Router and API Dispatcher
 */

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Helper for HTTP Headers in all server environments
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

// Load Core
require_once __DIR__ . '/config/env.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/helpers/jwt.php';
require_once __DIR__ . '/helpers/response.php';

// Load Controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/ReviewController.php';
require_once __DIR__ . '/controllers/CheckoutController.php';
require_once __DIR__ . '/controllers/OrderController.php';
require_once __DIR__ . '/controllers/AdminController.php';
require_once __DIR__ . '/controllers/ContactController.php';

// Route detection
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$routePath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (strpos($routePath, $_SERVER['SCRIPT_NAME']) === 0) {
    $routePath = substr($routePath, strlen($_SERVER['SCRIPT_NAME']));
} else if (strpos($routePath, $scriptName) === 0) {
    $routePath = substr($routePath, strlen($scriptName));
}
$routePath = trim($routePath, '/');
$method = $_SERVER['REQUEST_METHOD'];

// Parse Inputs
$inputJSON = file_get_contents('php://input');
$inputData = json_decode($inputJSON, true) ?: [];
$data = array_merge($_GET, $_POST, $inputData);

// Verify JWT Authorization token
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
}

$userSession = null;
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $token = $matches[1];
    $userSession = JWT::verify($token);
}

// Define Routing Table
$routes = [
    // ─── Authentication & User Profile ──────────────────────────────────────────
    ['pattern' => '#^auth/signup$#',            'method' => 'POST',   'controller' => 'AuthController',     'action' => 'signup',           'auth' => false],
    ['pattern' => '#^auth/login$#',             'method' => 'POST',   'controller' => 'AuthController',     'action' => 'login',            'auth' => false],
    ['pattern' => '#^auth/me$#',                'method' => 'GET',    'controller' => 'AuthController',     'action' => 'me',               'auth' => true],
    ['pattern' => '#^auth/profile$#',           'method' => 'PUT',    'controller' => 'AuthController',     'action' => 'updateProfile',    'auth' => true],
    ['pattern' => '#^auth/addresses$#',         'method' => 'GET',    'controller' => 'AuthController',     'action' => 'getAddresses',     'auth' => true],
    ['pattern' => '#^auth/addresses$#',         'method' => 'POST',   'controller' => 'AuthController',     'action' => 'addAddress',       'auth' => true],
    ['pattern' => '#^auth/addresses/(\d+)$#',    'method' => 'DELETE', 'controller' => 'AuthController',     'action' => 'deleteAddress',     'auth' => true],

    // ─── Products & Catalog ──────────────────────────────────────────────────────
    ['pattern' => '#^products$#',               'method' => 'GET',    'controller' => 'ProductController',  'action' => 'list',             'auth' => false],
    ['pattern' => '#^products/categories$#',    'method' => 'GET',    'controller' => 'ProductController',  'action' => 'getCategories',    'auth' => false],
    ['pattern' => '#^products/curated-edits$#', 'method' => 'GET',    'controller' => 'ProductController',  'action' => 'getCuratedEdits',   'auth' => false],
    ['pattern' => '#^products/curated-edits/([^/]+)$#', 'method' => 'GET', 'controller' => 'ProductController', 'action' => 'getCuratedEditProducts', 'auth' => false],
    ['pattern' => '#^products/([^/]+)$#',       'method' => 'GET',    'controller' => 'ProductController',  'action' => 'getBySlug',        'auth' => false],

    // ─── Reviews ─────────────────────────────────────────────────────────────────
    ['pattern' => '#^reviews$#',                'method' => 'POST',   'controller' => 'ReviewController',   'action' => 'create',           'auth' => true],
    ['pattern' => '#^reviews/([^/]+)$#',        'method' => 'GET',    'controller' => 'ReviewController',   'action' => 'getProductReviews', 'auth' => false],

    // ─── Checkout ────────────────────────────────────────────────────────────────
    ['pattern' => '#^checkout/verify-coupon$#', 'method' => 'POST',   'controller' => 'CheckoutController', 'action' => 'verifyCoupon',     'auth' => false],
    ['pattern' => '#^checkout/razorpay-order$#', 'method' => 'POST',  'controller' => 'CheckoutController', 'action' => 'createRazorpayOrder', 'auth' => false],
    ['pattern' => '#^checkout/verify-payment$#', 'method' => 'POST',  'controller' => 'CheckoutController', 'action' => 'verifyPayment',     'auth' => false],
    ['pattern' => '#^checkout/cod-order$#',     'method' => 'POST',   'controller' => 'CheckoutController', 'action' => 'createCodOrder',       'auth' => false],

    // ─── Customer Orders ─────────────────────────────────────────────────────────
    ['pattern' => '#^orders/track$#',           'method' => 'GET',    'controller' => 'OrderController',    'action' => 'track',            'auth' => false],
    ['pattern' => '#^orders/my-orders$#',       'method' => 'GET',    'controller' => 'OrderController',    'action' => 'listMyOrders',     'auth' => true],
    ['pattern' => '#^orders/(\d+)$#',           'method' => 'GET',    'controller' => 'OrderController',    'action' => 'getDetails',       'auth' => true],
    ['pattern' => '#^orders/(\d+)/return$#',    'method' => 'POST',   'controller' => 'OrderController',    'action' => 'requestReturn',    'auth' => true],

    // ─── General Operations ──────────────────────────────────────────────────────
    ['pattern' => '#^contact$#',                'method' => 'POST',   'controller' => 'ContactController',  'action' => 'submitMessage',    'auth' => false],
    ['pattern' => '#^newsletter/subscribe$#',   'method' => 'POST',   'controller' => 'ContactController',  'action' => 'subscribeNewsletter', 'auth' => false],

    // ─── Admin Panels ────────────────────────────────────────────────────────────
    ['pattern' => '#^admin/stats$#',            'method' => 'GET',    'controller' => 'AdminController',    'action' => 'getStats',         'auth' => true],
    ['pattern' => '#^admin/products$#',         'method' => 'GET',    'controller' => 'AdminController',    'action' => 'getProducts',      'auth' => true],
    ['pattern' => '#^admin/products$#',         'method' => 'POST',   'controller' => 'AdminController',    'action' => 'createProduct',    'auth' => true],
    ['pattern' => '#^admin/products/(\d+)$#',    'method' => 'PUT',    'controller' => 'AdminController',    'action' => 'updateProduct',    'auth' => true],
    ['pattern' => '#^admin/products/(\d+)$#',    'method' => 'DELETE', 'controller' => 'AdminController',    'action' => 'deleteProduct',    'auth' => true],
    ['pattern' => '#^admin/orders$#',           'method' => 'GET',    'controller' => 'AdminController',    'action' => 'getOrders',        'auth' => true],
    ['pattern' => '#^admin/orders/(\d+)$#',     'method' => 'PUT',    'controller' => 'AdminController',    'action' => 'updateOrderStatus', 'auth' => true],
    ['pattern' => '#^admin/coupons$#',          'method' => 'GET',    'controller' => 'AdminController',    'action' => 'getCoupons',       'auth' => true],
    ['pattern' => '#^admin/coupons$#',          'method' => 'POST',   'controller' => 'AdminController',    'action' => 'createCoupon',     'auth' => true],
    ['pattern' => '#^admin/coupons/(\d+)$#',    'method' => 'PUT',    'controller' => 'AdminController',    'action' => 'updateCoupon',     'auth' => true],
    ['pattern' => '#^admin/coupons/(\d+)$#',    'method' => 'DELETE', 'controller' => 'AdminController',    'action' => 'deleteCoupon',     'auth' => true],
    ['pattern' => '#^admin/reviews$#',          'method' => 'GET',    'controller' => 'AdminController',    'action' => 'getReviews',       'auth' => true],
    ['pattern' => '#^admin/reviews/(\d+)$#',    'method' => 'PUT',    'controller' => 'AdminController',    'action' => 'moderateReview',   'auth' => true],
    ['pattern' => '#^admin/settings$#',         'method' => 'GET',    'controller' => 'AdminController',    'action' => 'getSettings',      'auth' => true],
    ['pattern' => '#^admin/settings$#',         'method' => 'PUT',    'controller' => 'AdminController',    'action' => 'updateSettings',   'auth' => true]
];

// Match route
$routeMatched = false;

foreach ($routes as $route) {
    $pattern = $route['pattern'];
    if (preg_match($pattern, $routePath, $matches)) {
        $reqMethod      = $route['method'];
        $controllerName = $route['controller'];
        $actionName     = $route['action'];
        $requiresAuth   = $route['auth'];

        // Verify request method matches
        if ($method !== $reqMethod) {
            continue;
        }

        $routeMatched = true;

        // Check authentication requirement
        if ($requiresAuth && !$userSession) {
            sendError("Authentication token is missing, invalid, or expired.", 401);
        }

        // Initialize controller and invoke action
        $controller = new $controllerName();

        // Extract parameters (excluding the full match index 0)
        array_shift($matches);

        // Arguments preparation
        if ($requiresAuth) {
            if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
                // If there's an ID parameter in the URL path, pass it first
                if (!empty($matches)) {
                    $controller->$actionName($userSession, $matches[0], $data);
                } else {
                    $controller->$actionName($userSession, $data);
                }
            } else {
                // For GET requests with query strings and path params
                if (!empty($matches)) {
                    $controller->$actionName($userSession, $matches[0], $data);
                } else {
                    $controller->$actionName($userSession, $data);
                }
            }
        } else {
            if (!empty($matches)) {
                $controller->$actionName($matches[0], $data);
            } else {
                $controller->$actionName($data);
            }
        }
        exit();
    }
}

// 404 Fallback
sendError("Endpoint not found or method not allowed.", 404);
