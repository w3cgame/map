<?php
/**
 * 支付宝当面付预创建订单接口
 * 用于生成支付二维码
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
if (isset($_GET['plan'])) {
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
if (!isset($postData['plan'])) {
    echo json_encode(['success' => false, 'error' => '缺少plan参数']);
    exit;
}

$plan = $postData['plan'];

// 验证套餐类型
if (!isset($config['price_config'][$plan])) {
    echo json_encode(['success' => false, 'error' => '无效的套餐类型']);
    exit;
}

// 生成订单号
$out_trade_no = 'SL' . date('YmdHis') . mt_rand(1000, 9999);
$amount = number_format($config['price_config'][$plan] / 100, 2);
$subject = $config['plan_names'][$plan];

try {
    // 导入支付宝SDK
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
    
    // 创建请求
    $request = new \AlipayTradePrecreateRequest();
    $request->setNotifyUrl($config['notify_url']);
    
    // 设置业务参数
    $bizContent = [
        'out_trade_no' => $out_trade_no,
        'total_amount' => $amount,
        'subject' => $subject,
        'body' => '星链Starlink - ' . $subject,
        'timeout_express' => '15m',
        'product_code' => 'FACE_TO_FACE_PAYMENT',
    ];
    
    // 记录请求参数
    logError('alipay_precreate_request', json_encode($bizContent));
    
    $request->setBizContent(json_encode($bizContent));
    
    // 执行请求
    $result = $aop->execute($request);
    
    // 记录响应结果
    logError('alipay_precreate_response', json_encode($result));
    
    // 检查是否有结果返回
    if(!$result) {
        echo json_encode([
            'success' => false,
            'error' => '支付宝接口返回空结果'
        ]);
        exit;
    }
    
    $responseNode = str_replace(".", "_", $request->getApiMethodName()) . "_response";
    
    // 检查响应节点是否存在
    if(!isset($result->$responseNode)) {
        echo json_encode([
            'success' => false,
            'error' => '支付宝接口响应格式异常',
            'result' => json_encode($result)
        ]);
        exit;
    }
    
    $resultCode = $result->$responseNode->code;
    
    // 记录订单信息到数据库，方便后续查询
    recordOrder($out_trade_no, $plan, $amount, $subject);
    
    if(!empty($resultCode) && $resultCode == 10000) {
        // 获取二维码链接
        $qrCode = $result->$responseNode->qr_code;
        
        // 返回成功结果
        echo json_encode([
            'success' => true,
            'qrCodeUrl' => $qrCode,
            'outTradeNo' => $out_trade_no
        ]);
    } else {
        // 获取详细的错误信息
        $subCode = isset($result->$responseNode->sub_code) ? $result->$responseNode->sub_code : 'unknown';
        $subMsg = isset($result->$responseNode->sub_msg) ? $result->$responseNode->sub_msg : '未知错误';
        
        // 记录错误
        logError('alipay_precreate_error', "错误码: $subCode, 错误信息: $subMsg");
        
        // 返回失败结果
        echo json_encode([
            'success' => false,
            'error' => '创建订单失败: ' . $subMsg,
            'errorCode' => $subCode
        ]);
    }
} catch (Exception $e) {
    // 记录错误日志
    logError('alipay_precreate_exception', $e->getMessage() . "\n" . $e->getTraceAsString());
    
    // 返回错误信息
    echo json_encode([
        'success' => false,
        'error' => '系统错误: ' . $e->getMessage()
    ]);
}

/**
 * 记录订单到数据库
 * @param string $orderNo 订单号
 * @param string $plan 套餐类型
 * @param float $amount 金额
 * @param string $subject 商品名称
 */
function recordOrder($orderNo, $plan, $amount, $subject) {
    try {
        // 创建orders表的SQL
        $createTableSQL = "CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_no TEXT NOT NULL,
            plan TEXT NOT NULL,
            amount NUMERIC NOT NULL,
            subject TEXT NOT NULL,
            trade_status TEXT DEFAULT 'WAIT_BUYER_PAY',
            activation_code TEXT NULL,
            create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        // 打开SQLite数据库
        $db = new SQLite3('../database/alipay.db');
        
        // 创建表（如果不存在）
        $db->exec($createTableSQL);
        
        // 准备SQL语句
        $stmt = $db->prepare('INSERT INTO orders (order_no, plan, amount, subject) VALUES (:order_no, :plan, :amount, :subject)');
        $stmt->bindValue(':order_no', $orderNo, SQLITE3_TEXT);
        $stmt->bindValue(':plan', $plan, SQLITE3_TEXT);
        $stmt->bindValue(':amount', $amount, SQLITE3_FLOAT);
        $stmt->bindValue(':subject', $subject, SQLITE3_TEXT);
        
        // 执行SQL
        $stmt->execute();
        
        // 关闭数据库连接
        $db->close();
    } catch (Exception $e) {
        // 记录错误日志
        logError('record_order_error', $e->getMessage());
    }
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