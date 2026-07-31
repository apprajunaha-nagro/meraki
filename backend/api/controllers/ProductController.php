<?php
/**
 * ProductController - Catalog retrieval, searching, categories, and curated edits
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

class ProductController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * GET /api/products - Lists products with filters, sorting, and pagination
     */
    public function list($queryParams) {
        $search      = isset($queryParams['search']) ? trim($queryParams['search']) : '';
        $category    = isset($queryParams['category']) ? trim($queryParams['category']) : '';
        $featured    = isset($queryParams['featured']) ? (int)$queryParams['featured'] : null;
        $bestseller  = isset($queryParams['bestseller']) ? (int)$queryParams['bestseller'] : null;
        $newArrival  = isset($queryParams['new_arrival']) ? (int)$queryParams['new_arrival'] : null;
        $minPrice    = isset($queryParams['min_price']) && is_numeric($queryParams['min_price']) ? (float)$queryParams['min_price'] : null;
        $maxPrice    = isset($queryParams['max_price']) && is_numeric($queryParams['max_price']) ? (float)$queryParams['max_price'] : null;
        $sort        = isset($queryParams['sort']) ? trim($queryParams['sort']) : 'newest';
        $limit       = isset($queryParams['limit']) && is_numeric($queryParams['limit']) ? (int)$queryParams['limit'] : 12;
        $offset      = isset($queryParams['offset']) && is_numeric($queryParams['offset']) ? (int)$queryParams['offset'] : 0;
        
        $where = ["p.status = 'active'"];
        $params = [];

        // Category Filter
        if (!empty($category)) {
            if (is_numeric($category)) {
                $where[] = "p.category_id = ?";
                $params[] = $category;
            } else {
                $where[] = "c.slug = ?";
                $params[] = $category;
            }
        }

        // Search Filter (matches name, SKU, tags)
        if (!empty($search)) {
            $where[] = "(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        // Flags
        if ($featured !== null) {
            $where[] = "p.is_featured = ?";
            $params[] = $featured;
        }
        if ($bestseller !== null) {
            $where[] = "p.is_bestseller = ?";
            $params[] = $bestseller;
        }
        if ($newArrival !== null) {
            $where[] = "p.is_new_arrival = ?";
            $params[] = $newArrival;
        }

        // Price Filters
        if ($minPrice !== null) {
            $where[] = "p.base_price >= ?";
            $params[] = $minPrice;
        }
        if ($maxPrice !== null) {
            $where[] = "p.base_price <= ?";
            $params[] = $maxPrice;
        }

        // Construct Query
        $whereSql = implode(" AND ", $where);
        
        // Sorting
        $orderSql = "p.created_at DESC"; // default newest
        if ($sort === 'price-asc') {
            $orderSql = "p.base_price ASC";
        } elseif ($sort === 'price-desc') {
            $orderSql = "p.base_price DESC";
        } elseif ($sort === 'popularity') {
            // Can be ordered by average rating or bestseller flag
            $orderSql = "p.is_bestseller DESC, p.created_at DESC";
        }

        // Get total count for pagination
        $countQuery = "
            SELECT COUNT(DISTINCT p.id) as total 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE $whereSql
        ";
        $stmtCount = $this->db->prepare($countQuery);
        $stmtCount->execute($params);
        $totalCount = (int)$stmtCount->fetch()['total'];

        // Get Paginated Products
        $query = "
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE $whereSql
            ORDER BY $orderSql
            LIMIT $limit OFFSET $offset
        ";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        $productsList = $stmt->fetchAll();

        // Hydrate products with primary image, variant summary and reviews stats
        foreach ($productsList as &$prod) {
            // Get all images
            $imgStmt = $this->db->prepare("SELECT image_url, alt_text FROM product_images WHERE product_id = ? ORDER BY sort_order ASC");
            $imgStmt->execute([$prod['id']]);
            $images = $imgStmt->fetchAll();
            $prod['images'] = array_column($images, 'image_url');

            // Parse tags
            $prod['tags'] = $prod['tags'] ? json_decode($prod['tags'], true) : [];

            // Get variants (sizes/colors)
            $varStmt = $this->db->prepare("SELECT id, size, color, color_hex, sku, stock_qty, price_override FROM product_variants WHERE product_id = ?");
            $varStmt->execute([$prod['id']]);
            $variants = $varStmt->fetchAll();
            $prod['variants'] = $variants;

            // Compute total stock
            $totalStock = 0;
            $sizes = [];
            $colors = [];
            foreach ($variants as $v) {
                $totalStock += (int)$v['stock_qty'];
                if (!empty($v['size']) && !in_array($v['size'], $sizes)) {
                    $sizes[] = $v['size'];
                }
                if (!empty($v['color']) && !in_array($v['color'], $colors)) {
                    $colors[] = [
                        'name' => $v['color'],
                        'hex' => $v['color_hex']
                    ];
                }
            }
            $prod['stock_qty'] = $totalStock;
            $prod['sizes'] = $sizes;
            $prod['colors'] = $colors;

            // Get ratings summary
            $rateStmt = $this->db->prepare("
                SELECT COUNT(id) as rating_count, COALESCE(AVG(rating), 0) as rating_avg 
                FROM reviews 
                WHERE product_id = ? AND status = 'approved'
            ");
            $rateStmt->execute([$prod['id']]);
            $ratingData = $rateStmt->fetch();
            $prod['rating'] = (float)round($ratingData['rating_avg'], 1);
            $prod['review_count'] = (int)$ratingData['rating_count'];
        }

        sendSuccess("Products retrieved successfully.", [
            "products" => $productsList,
            "pagination" => [
                "total" => $totalCount,
                "limit" => $limit,
                "offset" => $offset,
                "has_more" => ($offset + $limit) < $totalCount
            ]
        ]);
    }

    /**
     * GET /api/products/:slug - Single product detail
     */
    public function getBySlug($slug) {
        // Fetch product
        $stmt = $this->db->prepare("
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.slug = ? AND p.status = 'active'
        ");
        $stmt->execute([$slug]);
        $product = $stmt->fetch();

        if (!$product) {
            sendError("Product not found.", 404);
        }

        // Fetch images
        $imgStmt = $this->db->prepare("SELECT id, image_url, alt_text FROM product_images WHERE product_id = ? ORDER BY sort_order ASC");
        $imgStmt->execute([$product['id']]);
        $product['images'] = $imgStmt->fetchAll();

        // Fetch variants
        $varStmt = $this->db->prepare("SELECT id, size, color, color_hex, sku, stock_qty, price_override FROM product_variants WHERE product_id = ?");
        $varStmt->execute([$product['id']]);
        $product['variants'] = $varStmt->fetchAll();

        // Parse tags
        $product['tags'] = $product['tags'] ? json_decode($product['tags'], true) : [];

        // Fetch approved reviews
        $revStmt = $this->db->prepare("
            SELECT id, user_name, rating, comment, image_url, admin_reply, created_at 
            FROM reviews 
            WHERE product_id = ? AND status = 'approved' 
            ORDER BY created_at DESC
        ");
        $revStmt->execute([$product['id']]);
        $product['reviews'] = $revStmt->fetchAll();

        // Calculate average rating
        $ratingCount = count($product['reviews']);
        $ratingSum = array_sum(array_column($product['reviews'], 'rating'));
        $product['rating'] = $ratingCount > 0 ? (float)round($ratingSum / $ratingCount, 1) : 0.0;
        $product['review_count'] = $ratingCount;

        sendSuccess("Product retrieved successfully.", ["product" => $product]);
    }

    /**
     * GET /api/categories - Lists categories with product counts
     */
    public function getCategories() {
        $query = "
            SELECT c.*, COUNT(p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id AND p.status = 'active'
            WHERE c.is_active = 1
            GROUP BY c.id
            ORDER BY c.sort_order ASC
        ";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $categories = $stmt->fetchAll();

        sendSuccess("Categories retrieved successfully.", ["categories" => $categories]);
    }

    /**
     * GET /api/curated-edits - Lists curated homepage selections
     */
    public function getCuratedEdits() {
        $stmt = $this->db->prepare("SELECT * FROM curated_edits WHERE is_active = 1 ORDER BY sort_order ASC");
        $stmt->execute();
        $edits = $stmt->fetchAll();

        sendSuccess("Curated edits retrieved successfully.", ["curated_edits" => $edits]);
    }

    /**
     * GET /api/curated-edits/:slug - List products in a curated edit
     */
    public function getCuratedEditProducts($slug) {
        $stmt = $this->db->prepare("SELECT * FROM curated_edits WHERE slug = ? AND is_active = 1");
        $stmt->execute([$slug]);
        $edit = $stmt->fetch();

        if (!$edit) {
            sendError("Curated edit collection not found.", 404);
        }

        // Get product list
        $query = "
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            JOIN curated_edit_products cep ON p.id = cep.product_id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE cep.edit_id = ? AND p.status = 'active'
            ORDER BY cep.sort_order ASC
        ";
        $stmtProds = $this->db->prepare($query);
        $stmtProds->execute([$edit['id']]);
        $productsList = $stmtProds->fetchAll();

        // Hydrate products with images, variants, and reviews
        foreach ($productsList as &$prod) {
            $imgStmt = $this->db->prepare("SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC LIMIT 2");
            $imgStmt->execute([$prod['id']]);
            $prod['images'] = array_column($imgStmt->fetchAll(), 'image_url');

            $prod['tags'] = $prod['tags'] ? json_decode($prod['tags'], true) : [];

            $varStmt = $this->db->prepare("SELECT id, size, color, color_hex, stock_qty FROM product_variants WHERE product_id = ?");
            $varStmt->execute([$prod['id']]);
            $variants = $varStmt->fetchAll();
            
            $totalStock = 0;
            $sizes = [];
            foreach ($variants as $v) {
                $totalStock += (int)$v['stock_qty'];
                if (!empty($v['size']) && !in_array($v['size'], $sizes)) {
                    $sizes[] = $v['size'];
                }
            }
            $prod['stock_qty'] = $totalStock;
            $prod['sizes'] = $sizes;

            $rateStmt = $this->db->prepare("
                SELECT COUNT(id) as rating_count, COALESCE(AVG(rating), 0) as rating_avg 
                FROM reviews 
                WHERE product_id = ? AND status = 'approved'
            ");
            $rateStmt->execute([$prod['id']]);
            $ratingData = $rateStmt->fetch();
            $prod['rating'] = (float)round($ratingData['rating_avg'], 1);
            $prod['review_count'] = (int)$ratingData['rating_count'];
        }

        sendSuccess("Curated edit products retrieved.", [
            "curated_edit" => $edit,
            "products" => $productsList
        ]);
    }
}
