<?php
/**
 * 模拟支付宝支付完成接口
 * 仅用于测试环境
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

// 载入配置
$config = require_once 'alipay_config.php';

// 检查请求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => '请使用POST方法请求']);
    exit;
}

// 获取POST数据
$postData = json_decode(file_get_contents('php://input'), true);
if (!$postData) {
    echo json_encode(['success' => false, 'error' => '无效的请求数据']);
    exit;
}

// 验证必要参数
if (!isset($postData['outTradeNo'])) {
    echo json_encode(['success' => false, 'error' => '缺少outTradeNo参数']);
    exit;
}

$out_trade_no = $postData['outTradeNo'];

try {
    // 检查订单是否存在
    $order = getOrder($out_trade_no);
    if (!$order) {
        echo json_encode(['success' => false, 'error' => '订单不存在']);
        exit;
    }
    
    // 如果订单已支付，直接返回结果
    if ($order['trade_status'] === 'TRADE_SUCCESS') {
        echo json_encode([
            'success' => true,
            'message' => '订单已支付',
            'activation_code' => $order['activation_code']
        ]);
        exit;
    }
    
    // 生成激活码
    $activationCode = getRandomActivationCode($config['activation_codes']);
    
    // 更新订单状态和激活码
    updateOrderStatus($out_trade_no, 'TRADE_SUCCESS', $activationCode);
    
    // 返回成功结果
    echo json_encode([
        'success' => true,
        'message' => '模拟支付成功',
        'activation_code' => $activationCode
    ]);
    
} catch (Exception $e) {
    // 记录错误日志
    logError('mock_payment_error', $e->getMessage());
    
    // 返回错误信息
    echo json_encode([
        'success' => false,
        'error' => '系统错误: ' . $e->getMessage()
    ]);
}

/**
 * 获取订单信息
 * @param string $orderNo 订单号
 * @return array|false 订单信息或false
 */
function getOrder($orderNo) {
    try {
        // 打开SQLite数据库
        $db = new SQLite3('../database/alipay.db');
        
        // 准备SQL语句
        $stmt = $db->prepare('SELECT * FROM orders WHERE order_no = :order_no LIMIT 1');
        $stmt->bindValue(':order_no', $orderNo, SQLITE3_TEXT);
        
        // 执行SQL
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        
        // 关闭数据库连接
        $db->close();
        
        return $row;
    } catch (Exception $e) {
        // 记录错误日志
        logError('get_order_error', $e->getMessage());
        return false;
    }
}

/**
 * 更新订单状态和激活码
 * @param string $orderNo 订单号
 * @param string $tradeStatus 交易状态
 * @param string $activationCode 激活码
 * @return bool 是否成功
 */
function updateOrderStatus($orderNo, $tradeStatus, $activationCode) {
    try {
        // 打开SQLite数据库
        $db = new SQLite3('../database/alipay.db');
        
        // 准备SQL语句
        $stmt = $db->prepare('UPDATE orders SET trade_status = :trade_status, activation_code = :activation_code, update_time = CURRENT_TIMESTAMP WHERE order_no = :order_no');
        $stmt->bindValue(':trade_status', $tradeStatus, SQLITE3_TEXT);
        $stmt->bindValue(':activation_code', $activationCode, SQLITE3_TEXT);
        $stmt->bindValue(':order_no', $orderNo, SQLITE3_TEXT);
        
        // 执行SQL
        $result = $stmt->execute();
        
        // 关闭数据库连接
        $db->close();
        
        return $result ? true : false;
    } catch (Exception $e) {
        // 记录错误日志
        logError('update_order_status_error', $e->getMessage());
        return false;
    }
}

/**
 * 获取随机激活码
 * @param array $codes 激活码列表
 * @return string 随机选取的激活码
 */
function getRandomActivationCode($codes) {
    $randomIndex = mt_rand(0, count($codes) - 1);
    return $codes[$randomIndex];
}

/**
 * 记录错误日志
 * @param string $type 错误类型
 * @param string $message 错误信息
 */
function logError($type, $message) {
    global $config;
    
    // 确保日志目录存在
    $logDir = $config['log_path'];
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    // 写入日志
    $logFile = $logDir . 'error.log';
    $logMessage = '[' . date('Y-m-d H:i:s') . '] [' . $type . '] ' . $message . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);
} 