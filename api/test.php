<?php
/**
 * API可访问性测试脚本
 * 用于确认API端点是否可以正常访问
 */

// 设置响应头为JSON格式
header('Content-Type: application/json');

// 允许跨域请求
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 如果是预检请求，直接返回200
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 返回成功信息
echo json_encode([
    'success' => true,
    'message' => 'API可访问',
    'timestamp' => time(),
    'date' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown'
    ]
]);
?> 