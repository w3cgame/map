<?php
/**
 * API可访问性测试脚本
 * 用于确认API端点是否可以正常访问
 * 适用于Vercel环境
 */

// 设置响应头为JSON格式
header('Content-Type: application/json');

// 允许跨域请求
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Max-Age: 86400'); // 缓存预检请求结果1天

// 如果是预检请求，直接返回200
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS' || $_SERVER['REQUEST_METHOD'] == 'HEAD') {
    http_response_code(200);
    exit;
}

// 获取请求信息
$headers = [];
foreach ($_SERVER as $name => $value) {
    if (substr($name, 0, 5) == 'HTTP_') {
        $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
    }
}

// 返回成功信息
echo json_encode([
    'success' => true,
    'message' => 'API可访问 - Vercel测试',
    'timestamp' => time(),
    'date' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
        'vercel' => true,
        'request_uri' => $_SERVER['REQUEST_URI'] ?? '',
        'path_info' => $_SERVER['PATH_INFO'] ?? '',
        'query_string' => $_SERVER['QUERY_STRING'] ?? ''
    ],
    'request_headers' => $headers,
    'get_data' => $_GET,
    'post_data' => $_POST,
    'raw_input' => file_get_contents('php://input')
]);
?> 