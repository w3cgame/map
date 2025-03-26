<?php
/**
 * 简化版支付宝测试页面 - 不依赖SQLite
 */

// 设置响应头
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>支付宝支付测试</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2 {
            color: #0066cc;
        }
        .section {
            margin-bottom: 30px;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
        }
        .btn {
            display: inline-block;
            background-color: #0066cc;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
            margin-top: 10px;
        }
        .btn:hover {
            background-color: #0055aa;
        }
        .result {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .success {
            color: green;
            font-weight: bold;
        }
        .error {
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>支付宝模拟测试</h1>
    
    <div class="section">
        <h2>PHP环境测试</h2>
        <div class="result">
            <p>PHP版本: <span class="success"><?php echo PHP_VERSION; ?></span></p>
            <p>已加载扩展:</p>
            <ul>
                <?php
                $extensions = get_loaded_extensions();
                foreach($extensions as $ext) {
                    echo "<li>{$ext}</li>";
                }
                ?>
            </ul>
        </div>
    </div>
    
    <div class="section">
        <h2>模拟支付测试</h2>
        <p>由于环境限制，这里仅模拟支付流程:</p>
        
        <button class="btn" id="simulatePayment">模拟完整支付流程</button>
        
        <div id="simulateResult" class="result" style="display:none;"></div>
    </div>
    
    <script>
        document.getElementById('simulatePayment').addEventListener('click', function() {
            const resultDiv = document.getElementById('simulateResult');
            resultDiv.style.display = 'block';
            
            // 模拟流程
            resultDiv.innerHTML = '<p>正在模拟支付流程...</p>';
            
            // 步骤1: 模拟生成订单
            setTimeout(() => {
                resultDiv.innerHTML += '<p>1. 订单已生成: <span class="success">SL202503261742123456</span></p>';
                
                // 步骤2: 模拟支付中
                setTimeout(() => {
                    resultDiv.innerHTML += '<p>2. 用户支付中...</p>';
                    
                    // 步骤3: 模拟支付成功
                    setTimeout(() => {
                        resultDiv.innerHTML += '<p>3. 支付成功！</p>';
                        
                        // 步骤4: 返回激活码
                        setTimeout(() => {
                            const activationCodes = [
                                "djfk3j4adf",
                                "28fhsj283",
                                "fsd23gdfg",
                                "f3sd54gg",
                                "13g55gvz"
                            ];
                            
                            const randomCode = activationCodes[Math.floor(Math.random() * activationCodes.length)];
                            
                            resultDiv.innerHTML += `
                                <p>4. 激活码生成成功!</p>
                                <p>您的激活码: <span class="success">${randomCode}</span></p>
                                <p>请使用此激活码激活您的产品。</p>
                            `;
                        }, 1000);
                        
                    }, 1500);
                    
                }, 1000);
                
            }, 1000);
        });
    </script>
</body>
</html> 