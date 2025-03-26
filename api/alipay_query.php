<?php
/**
 * 支付宝订单查询接口
 * 用于查询订单支付状态
 * Vercel兼容版本
 */

// 设置响应头为JSON格式
header('Content-Type: application/json');

// 允许跨域请求
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Max-Age: 86400'); // 缓存预检请求结果1天

// Vercel特殊处理：如果是预检请求或不支持的方法，返回成功
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS' || $_SERVER['REQUEST_METHOD'] == 'HEAD') {
    http_response_code(200);
    exit;
}

// 载入配置
$config = require_once 'alipay_config.php';

// 获取数据 - 优先从查询参数中获取
if (isset($_GET['outTradeNo'])) {
    $postData = $_GET;
    logError('request_data', 'GET查询参数: ' . json_encode($_GET));
} else {
    // 尝试从POST请求体中获取
    $input = file_get_contents('php://input');
    $postData = json_decode($input, true);
    
    // 记录原始输入用于调试
    logError('request_data', 'POST数据: ' . $input);
    
    // 如果POST解析失败，尝试直接从$_POST获取
    if (!$postData && !empty($_POST)) {
        $postData = $_POST;
        logError('request_data', 'Form POST数据: ' . json_encode($_POST));
    }
}

// 记录请求方法和完整请求
logError('request_debug', 'Method: ' . $_SERVER['REQUEST_METHOD'] . ', Headers: ' . json_encode(getallheaders()));

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
    // 先从数据库中查询订单状态
    $orderStatus = getOrderStatus($out_trade_no);
    
    // 如果订单已支付成功，直接返回结果
    if ($orderStatus && $orderStatus['trade_status'] === 'TRADE_SUCCESS') {
        echo json_encode([
            'success' => true,
            'trade_status' => 'TRADE_SUCCESS',
            'activation_code' => $orderStatus['activation_code']
        ]);
        exit;
    }
    
    // 如果订单状态不是支付成功，查询支付宝订单状态
    require_once '../vendor/alipay/AopSdk.php';
    
    // 创建支付宝客户端
    $aop = new \AopClient();
    $aop->gatewayUrl = $config['gateway_url'];
    $aop->appId = $config['app_id'];
    $aop->rsaPrivateKey = $config['merchant_private_key'];
    $aop->alipayrsaPublicKey = $config['alipay_public_key'];
    $aop->apiVersion = '1.0';
    $aop->signType = $config['sign_type'];
    $aop->postCharset = $config['charset'];
    $aop->format = 'json';
    
    // 创建查询请求
    $request = new \AlipayTradeQueryRequest();
    
    // 设置业务参数
    $bizContent = [
        'out_trade_no' => $out_trade_no
    ];
    $request->setBizContent(json_encode($bizContent));
    
    // 执行请求
    $result = $aop->execute($request);
    $responseNode = str_replace(".", "_", $request->getApiMethodName()) . "_response";
    $resultCode = $result->$responseNode->code;
    
    if (!empty($resultCode) && $resultCode == 10000) {
        $tradeStatus = $result->$responseNode->trade_status;
        
        // 如果支付成功，生成激活码并更新数据库
        if ($tradeStatus === 'TRADE_SUCCESS' || $tradeStatus === 'TRADE_FINISHED') {
            // 生成激活码
            $activationCode = getRandomActivationCode($config['activation_codes']);
            
            // 更新订单状态和激活码
            updateOrderStatus($out_trade_no, 'TRADE_SUCCESS', $activationCode);
            
            // 返回成功结果
            echo json_encode([
                'success' => true,
                'trade_status' => $tradeStatus,
                'activation_code' => $activationCode
            ]);
        } else {
            // 返回订单状态
            echo json_encode([
                'success' => true,
                'trade_status' => $tradeStatus
            ]);
        }
    } else {
        // 返回失败结果
        echo json_encode([
            'success' => false,
            'error' => '查询订单失败: ' . $result->$responseNode->sub_msg,
            'errorCode' => $result->$responseNode->sub_code
        ]);
    }
} catch (Exception $e) {
    // 记录错误日志
    logError('alipay_query_error', $e->getMessage());
    
    // 返回错误信息
    echo json_encode([
        'success' => false,
        'error' => '系统错误: ' . $e->getMessage()
    ]);
}

/**
 * 从数据库中获取订单状态
 * @param string $orderNo 订单号
 * @return array|false 订单信息或false
 */
function getOrderStatus($orderNo) {
    try {
        // 打开SQLite数据库
        $db = new SQLite3('../database/alipay.db');
        
        // 准备SQL语句
        $stmt = $db->prepare('SELECT trade_status, activation_code FROM orders WHERE order_no = :order_no LIMIT 1');
        $stmt->bindValue(':order_no', $orderNo, SQLITE3_TEXT);
        
        // 执行SQL
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        
        // 关闭数据库连接
        $db->close();
        
        return $row;
    } catch (Exception $e) {
        // 记录错误日志
        logError('get_order_status_error', $e->getMessage());
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
        if (!mkdir($logDir, 0755, true)) {
            // 如果创建目录失败，尝试写入到系统临时目录
            $logDir = sys_get_temp_dir() . '/';
        }
    }
    
    // 写入日志
    $logFile = $logDir . 'error.log';
    $logMessage = '[' . date('Y-m-d H:i:s') . '] [' . $type . '] ' . $message . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);
    
    // 同时输出到PHP错误日志
    error_log($logMessage);
}

/**
 * 获取所有HTTP请求头
 * 兼容不同PHP环境
 */
function getallheaders() {
    $headers = [];
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) == 'HTTP_') {
            $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
        }
    }
    return $headers;
} 