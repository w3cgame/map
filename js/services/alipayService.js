/**
 * 支付宝当面付服务
 * 集成支付宝当面付API，处理支付流程
 */

// API基础URL，根据不同环境配置
const API_BASE_URL = '';  // 如果是根目录，留空；如果有子目录，可以设置为 '/子目录名'

// 支付宝接口配置
const ALIPAY_CONFIG = {
    APPID: '2021005132643724',
    PUBLIC_KEY: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgmhZ9QPjDt3A+KRmHLg28jznW4/v18QBC1rnSiJQBSeqPA/cT3k8aHFWq9WpxMkYfCnRG4q/wUQFO9nw0NmnlAL2lGgtec1S3OJOeKEtw9KsnR6xBXUg0hWk3SnyjNDuhwp5C8W1mORht3dTKs1qKsA01Zc3XZnr/k9hLEQHKem6KiOa7dauIdCceFX1Awy2TDESypVvz4AxNtFOQuHnjvlBFV767EnCdHdCpxF0Eizff2nZ3Fj6ixnUKCnQtnKGIEfFCWYorfu8DQGkfevHqQmWCLNBtKS2RMPYTPz7juEWFJWMAZpd124KmBRr1HwYTa2PYsgtiDd+cVzJWQH7vQIDAQAB'
};

// 价格配置（以分为单位）
const PRICE_CONFIG = {
    monthly: 5800,   // 58元
    quarterly: 9800, // 98元
    yearly: 29800    // 298元
};

// 套餐名称映射
const PLAN_NAMES = {
    monthly: '30天激活码',
    quarterly: '90天激活码',
    yearly: '365天激活码'
};

// 激活码列表
const ACTIVATION_CODES = [
    "SLABC123456",
    "SLDEF789012",
    "SLGHI345678",
    "SLJKL901234",
    "SLMNO567890"
];

/**
 * 生成支付二维码
 * @param {string} plan - 套餐类型：monthly, quarterly, yearly
 * @param {Function} callback - 回调函数，处理二维码URL
 */
function generatePaymentQRCode(plan, callback) {
    // 验证计划类型
    if (!PRICE_CONFIG[plan]) {
        callback({ error: '无效的套餐类型' });
        return;
    }

    // 修改为使用GET请求，以解决某些服务器环境的兼容性问题
    fetch(`${API_BASE_URL}/api/alipay_precreate.php?plan=${plan}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Response received:', response);
        return response.json();
    })
    .then(data => {
        console.log('Parsed data:', data);
        if (data.success) {
            callback(data);
        } else {
            callback({ error: data.error || '创建订单失败' });
        }
    })
    .catch(error => {
        console.error('Payment QR code generation error:', error);
        console.error('API URL used:', `${API_BASE_URL}/api/alipay_precreate.php?plan=${plan}`);
        callback({ error: '生成支付二维码失败: ' + error.message });
    });
}

/**
 * 查询订单状态
 * @param {string} outTradeNo - 商户订单号
 * @param {Function} callback - 回调函数
 */
function queryOrderStatus(outTradeNo, callback) {
    // 修改为使用GET请求，以解决某些服务器环境的兼容性问题
    fetch(`${API_BASE_URL}/api/alipay_query.php?outTradeNo=${outTradeNo}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Order query response received:', response);
        return response.json();
    })
    .then(data => {
        console.log('Order query data:', data);
        if (data.success) {
            callback(data);
        } else {
            callback({ error: data.error || '查询订单失败' });
        }
    })
    .catch(error => {
        console.error('Order status query error:', error);
        console.error('API URL used:', `${API_BASE_URL}/api/alipay_query.php?outTradeNo=${outTradeNo}`);
        callback({ error: '查询订单失败: ' + error.message });
    });
}

// 导出服务函数
window.alipayService = {
    generatePaymentQRCode,
    queryOrderStatus
}; 