<?php
/**
 * 支付宝SDK入口文件
 */

// 设置报错级别
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// 定义SDK路径
define('AOP_SDK_WORK_DIR', dirname(__FILE__) . '/');

// 引入核心类文件
require_once AOP_SDK_WORK_DIR . 'aop/AopClient.php';
require_once AOP_SDK_WORK_DIR . 'aop/SignData.php';

// 引入接口请求类文件 - 这些是我们需要使用的类
require_once AOP_SDK_WORK_DIR . 'aop/request/AlipayTradePrecreateRequest.php'; // 扫码支付
require_once AOP_SDK_WORK_DIR . 'aop/request/AlipayTradeQueryRequest.php';    // 订单查询
require_once AOP_SDK_WORK_DIR . 'aop/request/AlipayTradeCloseRequest.php';    // 交易关闭
require_once AOP_SDK_WORK_DIR . 'aop/request/AlipayTradeCancelRequest.php';   // 交易撤销
require_once AOP_SDK_WORK_DIR . 'aop/request/AlipayTradeRefundRequest.php';   // 交易退款 