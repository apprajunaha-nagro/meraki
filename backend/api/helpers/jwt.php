<?php
/**
 * Simple Native JWT Helper Class
 */

require_once __DIR__ . '/../config/env.php';

class JWT {
    private static function base64UrlEncode($data) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode($data) {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $padlen = 4 - $remainder;
            $data .= str_repeat('=', $padlen);
        }
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }

    /**
     * Generate a JWT
     */
    public static function generate($payload, $expiryDays = 7) {
        $secret = getenv('JWT_SECRET') ?: 'meraki_secret_key_2026_dhanbad_jharkhand_soul';
        
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        
        $payload['iat'] = time();
        $payload['exp'] = time() + ($expiryDays * 24 * 60 * 60);

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Verify and decode a JWT. Returns payload array on success, false on failure/expiration.
     */
    public static function verify($token) {
        $secret = getenv('JWT_SECRET') ?: 'meraki_secret_key_2026_dhanbad_jharkhand_soul';
        
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }

        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;

        $signature = self::base64UrlDecode($base64UrlSignature);
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);

        if (!hash_equals($signature, $expectedSignature)) {
            return false;
        }

        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        
        // Validate expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }

        return $payload;
    }
}
