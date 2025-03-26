<?php
/**
 * 支付宝异步通知接口
 * 接收支付宝支付结果通知
 */

// 载入配置
$config = require_once 'alipay_config.php';

// 记录通知数据
$notifyData = file_get_contents('php://input');
logNotify('received', $notifyData);

// 如果通知数据为空，直接返回失败
if (empty($notifyData)) {
    echo "fail";
    exit;
}

// 解析通知数据
$params = [];
parse_str($notifyData, $params);

try {
    // 导入支付宝SDK
    require_once '../vendor/alipay/AopSdk.php';
    
    // 创建支付宝客户端
    $aop = new \AopClient();
    $aop->alipayrsaPublicKey = $config['alipay_public_key'];
    
    // 验证签名
    $signVerified = $aop->rsaCheckV1($params, $config['alipay_public_key'], $config['sign_type']);
    
    if ($signVerified) {
        // 验证成功，处理业务逻辑
        
        // 验证app_id是否为本应用的appid
        if ($params['app_id'] !== $config['app_id']) {
            logNotify('invalid_appid', json_encode($params));
            echo "fail";
            exit;
        }
        
        // 获取交易状态
        $tradeStatus = $params['trade_status'];
        $outTradeNo = $params['out_trade_no'];
        
        // 验证订单号是否存在
        $order = getOrder($outTradeNo);
        if (!$order) {
            logNotify('order_not_found', json_encode($params));
            echo "fail";
            exit;
        }
        
        // 验证订单金额是否一致
        if ($order['amount'] != $params['total_amount']) {
            logNotify('amount_mismatch', json_encode($params));
            echo "fail";
            exit;
        }
        
        // 处理交易状态
        if ($tradeStatus === 'TRADE_SUCCESS' || $tradeStatus === 'TRADE_FINISHED') {
            // 如果订单已经处理过，直接返回成功
            if ($order['trade_status'] === 'TRADE_SUCCESS') {
                echo "success";
                exit;
            }
            
            // 生成激活码
            $activationCode = getRandomActivationCode($config['activation_codes']);
            
            // 更新订单状态和激活码
            updateOrderStatus($outTradeNo, 'TRADE_SUCCESS', $activationCode);
            
            // 记录处理成功日志
            logNotify('processed_success', json_encode([
                'out_trade_no' => $outTradeNo,
                'trade_status' => $tradeStatus,
                'activation_code' => $activationCode
            ]));
            
            // 通知支付宝处理成功
            echo "success";
        } else {
            // 其他交易状态，记录日志
            logNotify('other_status', json_encode($params));
            echo "success";
        }
    } else {
        // 验证失败
        logNotify('sign_verify_failed', json_encode($params));
        echo "fail";
    }
} catch (Exception $e) {
    // 记录异常日志
    logNotify('exception', $e->getMessage());
    echo "fail";
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
        logNotify('get_order_error', $e->getMessage());
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
        logNotify('update_order_status_error', $e->getMessage());
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
 * 记录通知日志
 * @param string $type 通知类型
 * @param string $message 通知信息
 */
function logNotify($type, $message) {
    global $config;
    
    // 确保日志目录存在
    $logDir = $config['log_path'];
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    // 写入日志
    $logFile = $logDir . 'notify.log';
    $logMessage = '[' . date('Y-m-d H:i:s') . '] [' . $type . '] ' . $message . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);
} 