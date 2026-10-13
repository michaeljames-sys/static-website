<?php
// Local Development Router for PHP Built-In Server
// Usage: php -S 127.0.0.1:8089 router.php

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$docRoot = __DIR__;
$filePath = $docRoot . $uri;

// 1. 301 Redirect direct requests with .html to clean URLs
if (preg_match('#^(.+)\.html$#i', $uri, $matches)) {
    $cleanPath = $matches[1];
    if ($cleanPath === '/index') {
        $cleanPath = '/';
    }
    $query = $_SERVER['QUERY_STRING'] ? '?' . $_SERVER['QUERY_STRING'] : '';
    header("Location: " . $cleanPath . $query, true, 301);
    exit;
}

// 2. If static asset exists (CSS, JS, JPG, SVG, PNG, etc.), serve directly
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false; 
}

// 3. Root page
if ($uri === '/' || $uri === '') {
    header("Content-Type: text/html; charset=UTF-8");
    require $docRoot . '/index.html';
    return true;
}

// 4. Directory with index.html
if (is_dir($filePath) && file_exists($filePath . '/index.html')) {
    header("Content-Type: text/html; charset=UTF-8");
    require $filePath . '/index.html';
    return true;
}

// 5. Clean URL matching a .html file
$trimmedUri = trim($uri, '/');
if (file_exists($docRoot . '/' . $trimmedUri . '.html')) {
    header("Content-Type: text/html; charset=UTF-8");
    require $docRoot . '/' . $trimmedUri . '.html';
    return true;
}

// 6. 404 Fallback
http_response_code(404);
header("Content-Type: text/html; charset=UTF-8");
if (file_exists($docRoot . '/404.html')) {
    require $docRoot . '/404.html';
} else {
    echo "<h1>404 Not Found</h1>";
}
return true;
