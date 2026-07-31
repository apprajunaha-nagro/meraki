<?php
/**
 * Simple .env loader for PHP REST API
 */

function loadEnv($dir = null) {
    if ($dir === null) {
        $dir = dirname(__DIR__, 2); // Default to project root (e.g. backend/)
    }

    $envPaths = [
        $dir . '/.env',
        dirname($dir) . '/.env',
        dirname(__DIR__) . '/.env'
    ];
    
    $envPath = null;
    foreach ($envPaths as $path) {
        if (file_exists($path)) {
            $envPath = $path;
            break;
        }
    }

    if (!$envPath) {
        // No .env file found; fallback to system env vars
        return;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Parse key-value pairs
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $value = trim($parts[1]);

            // Strip optional quotes around value
            if (preg_match('/^["\'](.*)["\']$/', $value, $matches)) {
                $value = $matches[1];
            }

            // Set environment variables if not already set
            if (getenv($key) === false) {
                putenv("$key=$value");
            }
            if (!isset($_ENV[$key])) {
                $_ENV[$key] = $value;
            }
            if (!isset($_SERVER[$key])) {
                $_SERVER[$key] = $value;
            }
        }
    }
}

// Automatically load on include
loadEnv();
