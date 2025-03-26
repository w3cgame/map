<?php
/**
 * 支付宝支付测试页面
 */

// 加载配置
$config = require_once 'alipay_config.php';

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
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        select, input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .result {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .qrcode {
            text-align: center;
            margin: 20px 0;
        }
        .qrcode img {
            max-width: 200px;
            border: 1px solid #ddd;
            padding: 10px;
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
    <h1>支付宝支付测试工具</h1>
    
    <div class="section">
        <h2>1. 生成支付二维码</h2>
        <div class="form-group">
            <label for="plan">选择套餐:</label>
            <select id="plan">
                <option value="monthly">月度套餐 (58元)</option>
                <option value="quarterly">季度套餐 (98元)</option>
                <option value="yearly">年度套餐 (298元)</option>
            </select>
        </div>
        
        <button class="btn" id="generateQRCode">生成支付二维码</button>
        
        <div id="qrcodeResult" class="result" style="display:none;">
            <div class="qrcode">
                <img id="qrcodeImage" src="" alt="支付二维码">
                <p>订单号: <span id="outTradeNo"></span></p>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>2. 查询订单状态</h2>
        <div class="form-group">
            <label for="orderNo">订单号:</label>
            <input type="text" id="orderNo" placeholder="输入要查询的订单号">
        </div>
        
        <button class="btn" id="queryOrder">查询订单状态</button>
        
        <div id="queryResult" class="result" style="display:none;"></div>
    </div>
    
    <div class="section">
        <h2>3. 模拟支付完成</h2>
        <p>由于无法直接调用支付宝付款，以下可以模拟支付成功流程：</p>
        <div class="form-group">
            <label for="mockOrderNo">订单号:</label>
            <input type="text" id="mockOrderNo" placeholder="输入要模拟支付的订单号">
        </div>
        
        <button class="btn" id="mockPayment">模拟支付成功</button>
        
        <div id="mockResult" class="result" style="display:none;"></div>
    </div>
    
    <script>
        document.getElementById('generateQRCode').addEventListener('click', function() {
            const plan = document.getElementById('plan').value;
            const resultDiv = document.getElementById('qrcodeResult');
            
            // 显示加载中
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '正在生成支付二维码...';
            
            // 请求API
            fetch('alipay_precreate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ plan })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const qrCodeUrl = data.qrCodeUrl;
                    const outTradeNo = data.outTradeNo;
                    
                    resultDiv.innerHTML = `
                        <div class="qrcode">
                            <img id="qrcodeImage" src="${qrCodeUrl}" alt="支付二维码">
                            <p>订单号: <span id="outTradeNo">${outTradeNo}</span></p>
                        </div>
                        <p class="success">二维码生成成功！请使用支付宝扫码支付。</p>
                        <p>支付完成后，可以使用上面的订单号查询支付状态。</p>
                    `;
                    
                    // 自动填充订单查询框
                    document.getElementById('orderNo').value = outTradeNo;
                    document.getElementById('mockOrderNo').value = outTradeNo;
                } else {
                    resultDiv.innerHTML = `<p class="error">错误: ${data.error || '生成二维码失败'}</p>`;
                }
            })
            .catch(error => {
                resultDiv.innerHTML = `<p class="error">请求错误: ${error.message}</p>`;
            });
        });
        
        document.getElementById('queryOrder').addEventListener('click', function() {
            const orderNo = document.getElementById('orderNo').value.trim();
            const resultDiv = document.getElementById('queryResult');
            
            if (!orderNo) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = '<p class="error">请输入订单号</p>';
                return;
            }
            
            // 显示加载中
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '正在查询订单状态...';
            
            // 请求API
            fetch('alipay_query.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ outTradeNo: orderNo })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    let statusText = '';
                    switch(data.trade_status) {
                        case 'WAIT_BUYER_PAY':
                            statusText = '等待买家付款';
                            break;
                        case 'TRADE_SUCCESS':
                            statusText = '交易支付成功';
                            break;
                        case 'TRADE_FINISHED':
                            statusText = '交易结束，不可退款';
                            break;
                        case 'TRADE_CLOSED':
                            statusText = '交易关闭';
                            break;
                        default:
                            statusText = data.trade_status;
                    }
                    
                    resultDiv.innerHTML = `<p>订单状态: <span class="success">${statusText}</span></p>`;
                    
                    if (data.activation_code) {
                        resultDiv.innerHTML += `<p>激活码: <span class="success">${data.activation_code}</span></p>`;
                    }
                } else {
                    resultDiv.innerHTML = `<p class="error">错误: ${data.error || '查询订单失败'}</p>`;
                }
            })
            .catch(error => {
                resultDiv.innerHTML = `<p class="error">请求错误: ${error.message}</p>`;
            });
        });
        
        document.getElementById('mockPayment').addEventListener('click', function() {
            const orderNo = document.getElementById('mockOrderNo').value.trim();
            const resultDiv = document.getElementById('mockResult');
            
            if (!orderNo) {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = '<p class="error">请输入订单号</p>';
                return;
            }
            
            // 显示加载中
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '正在模拟支付...';
            
            // 请求模拟支付API
            fetch('mock_payment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ outTradeNo: orderNo })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resultDiv.innerHTML = `
                        <p class="success">模拟支付成功！</p>
                        <p>激活码: <span class="success">${data.activation_code}</span></p>
                        <p>您可以使用此激活码来激活产品。</p>
                    `;
                } else {
                    resultDiv.innerHTML = `<p class="error">错误: ${data.error || '模拟支付失败'}</p>`;
                }
            })
            .catch(error => {
                resultDiv.innerHTML = `<p class="error">请求错误: ${error.message}</p>`;
            });
        });
    </script>
</body>
</html> 