<?php
/**
 * Response Helper Functions
 */

if (!function_exists('sendJSON')) {
    function sendJSON($data, $statusCode = 200) {
        // Clear buffer to prevent accidental whitespace or PHP notices from breaking JSON output
        if (ob_get_length()) ob_clean();
        
        header('Content-Type: application/json; charset=UTF-8');
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit();
    }
}

if (!function_exists('sendSuccess')) {
    function sendSuccess($message = null, $data = null, $statusCode = 200) {
        $response = ["status" => "success"];
        if ($message !== null) {
            $response["message"] = $message;
        }
        if ($data !== null) {
            $response["data"] = $data;
        }
        sendJSON($response, $statusCode);
    }
}

if (!function_exists('sendError')) {
    function sendError($message, $statusCode = 400, $errors = null) {
        $response = [
            "status" => "error",
            "message" => $message
        ];
        if ($errors !== null) {
            $response["errors"] = $errors;
        }
        sendJSON($response, $statusCode);
    }
}
