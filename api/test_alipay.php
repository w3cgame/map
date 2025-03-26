<?php
/**
 * 支付宝SDK测试文件
 */

// 设置响应头
header('Content-Type: text/html; charset=utf-8');

// 检查SDK文件
echo "<h2>支付宝SDK检查</h2>";

// 1. 检查配置文件
$configPath = __DIR__ . '/alipay_config.php';
if (file_exists($configPath)) {
    echo "✅ 配置文件存在: $configPath<br>";
    $config = require_once $configPath;
    echo "✅ 配置文件加载成功<br>";
    
    // 检查关键配置
    echo "<h3>配置信息检查</h3>";
    echo "应用ID: " . $config['app_id'] . "<br>";
    echo "通知URL: " . $config['notify_url'] . "<br>";
    echo "返回URL: " . $config['return_url'] . "<br>";
} else {
    echo "❌ 配置文件不存在: $configPath<br>";
}

// 2. 检查SDK文件
$sdkPath = __DIR__ . '/../vendor/alipay/AopSdk.php';
if (file_exists($sdkPath)) {
    echo "✅ SDK文件存在: $sdkPath<br>";
    
    try {
        require_once $sdkPath;
        echo "✅ SDK文件加载成功<br>";
        
        // 尝试创建客户端对象
        $aop = new \AopClient();
        echo "✅ 成功创建AopClient对象<br>";
    } catch (Exception $e) {
        echo "❌ SDK加载失败: " . $e->getMessage() . "<br>";
    }
} else {
    echo "❌ SDK文件不存在: $sdkPath<br>";
    echo "<p>请前往支付宝开放平台下载SDK，并将AopSdk.php文件放到 vendor/alipay/ 目录中</p>";
    echo "<p>下载地址: <a href='https://opendocs.alipay.com/open/54/103419' target='_blank'>https://opendocs.alipay.com/open/54/103419</a></p>";
}

// 3. 检查数据库
echo "<h3>数据库检查</h3>";
$dbPath = __DIR__ . '/../database/alipay.db';
if (file_exists($dbPath)) {
    echo "✅ 数据库文件存在: $dbPath<br>";
    
    try {
        $db = new SQLite3($dbPath);
        echo "✅ 数据库连接成功<br>";
        
        // 检查表结构
        $result = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'");
        if ($result->fetchArray()) {
            echo "✅ 数据库表orders存在<br>";
        } else {
            echo "❌ 数据库表orders不存在<br>";
        }
        
        $db->close();
    } catch (Exception $e) {
        echo "❌ 数据库连接失败: " . $e->getMessage() . "<br>";
    }
} else {
    echo "❓ 数据库文件不存在: $dbPath (首次使用时会自动创建)<br>";
}

// 4. 检查目录权限
echo "<h3>目录权限检查</h3>";
$dirsToCheck = [
    __DIR__ . '/../database',
    __DIR__ . '/../logs',
    __DIR__ . '/../vendor/alipay'
];

foreach ($dirsToCheck as $dir) {
    if (is_dir($dir)) {
        echo "✅ 目录存在: $dir<br>";
        
        if (is_writable($dir)) {
            echo "✅ 目录可写: $dir<br>";
        } else {
            echo "❌ 目录不可写: $dir<br>";
        }
    } else {
        echo "❌ 目录不存在: $dir<br>";
    }
}

// 5. 显示总结信息
echo "<h3>设置需要修改的内容</h3>";
echo "<ol>";
echo "<li>将 <code>api/alipay_config.php</code> 中的通知URL和返回URL修改为您的实际域名</li>";
echo "<li>从支付宝开放平台下载SDK，并将AopSdk.php文件放到 vendor/alipay/ 目录中</li>";
echo "<li>确保所有目录具有写入权限</li>";
echo "</ol>";

echo "<h3>测试方法</h3>";
echo "<p>配置完成后，您可以通过在前端页面中点击购买按钮来测试支付流程</p>";
echo "<p>成功购买后，系统会从激活码列表中随机选择一个返回给您</p>";
echo "<p>支付记录会保存在数据库中，您可以通过查询数据库了解订单状态</p>"; 