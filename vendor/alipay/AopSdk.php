<?php
/**
 * 支付宝开放平台SDK入口文件
 */

// 定义AOP SDK版本
define('AOP_SDK_VERSION', '1.0');

// 引入核心文件
require_once 'aop/AopClient.php';
require_once 'aop/AopCertClient.php';
require_once 'aop/request/AlipayTradeQueryRequest.php';
require_once 'aop/request/AlipayTradePrecreateRequest.php';

// 设置报错级别
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// 定义SDK路径
define('AOP_SDK_WORK_DIR', dirname(__FILE__) . '/');

// 引入接口请求类文件 - 这些是我们需要使用的类
require_once AOP_SDK_WORK_DIR . 'aop/request/AlipayTradeCloseRequest.php';    // 交易关闭
require_once AOP_SDK_WORK_DIR . 'aop/request/AlipayTradeCancelRequest.php';   // 交易撤销
require_once AOP_SDK_WORK_DIR . 'aop/request/AlipayTradeRefundRequest.php';   // 交易退款 