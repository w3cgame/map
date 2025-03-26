/**
 * 支付宝当面付服务
 * 集成支付宝当面付API，处理支付流程
 */

// API基础URL，根据不同环境配置
const API_BASE_URL = '';  // 如果是根目录，留空；如果有子目录，可以设置为 '/子目录名'

// 支付宝接口配置
const ALIPAY_CONFIG = {
    APPID: '2021003128637838',
    PRIVATE_KEY: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtnXaZuTGV19YJyVdmptG2Aaww+pBNSRQ+9k16yLEzyMIVJJJeUj5xXToaYB2AGQFjY1Fpkar3IHEf0QSEr5c54T3zEGkHc+/cltCtWAA3ecmoE8rij6igG9pjI9rOmHXQFJoGxu39u5SH0ZCKlmx6EOGoBJeN9hlT0iAslp9NMy2R+2HrYt9r/bMvR7gMiFEZYwMzzy3wueAh5RKxNDNU6P58QYFrKhN5q4JhAZA3mM5H1Omx5hDECFs3x0nQveTpxnCBYQIxdxxdHu35o4P0EFEgoTSJdYdiB4LwcR9gtqE1N5yLfliWLrmkS/+B0Yj+C358CwWcle4ZYV9P0zu3AgMBAAECggEATc9QpDy32GxPZTtzjHIfcu70+U6S9dBW3pEM0Ia5xHepZEhrwRIjIjOiIsgI8KxETwLoLeQ3N2K20Ieg+sanhC1K0nD8YXa4faiqBcZ28mYG1uln+HpiHL/e9KfRHN5/jq5tCbSGXT2AqA5oNXSNUXfXarIEKn+tgj+eY91tr+8NFcnXXdSolJJ1/vZtZhAy2ZXz4Oc+FGMPbMIxlE5xZZZ5hP6FsSx6KzjiuA1o6qLQpcdp6UdkOVC8FyExX1DvKzfnsLyTATLbThkzAb0kT/elwQCpsUVZnbzOKCBTAs/OaEhTh1OTmQjjrPVliNl88Qprfj302aOLCyRRg2WaoQKBgQDyyNgN/Aj+wG4PSXYq8gSEDKeOnN+xz26bb1b3X/C1TIQ/FE9Fs7xOtMhk7wcai6xJNtYXb1spPhT60LMdoMuzjbXG50wWuREiqDWngQVoWhQ6AwnKVV2qmJxNX7SeJ5XbzRNwIRDor3eo8WS0+eOzbI9ZAXKt6RkZ+u5UTR/50wKBgQC3EMGYsBvwjpkirrsqeLN8XGM0PgHd2spzYXv1HtnyXuzKmgtPshxVhgCXoeESIw23OrDwlbb1UqieJX10dEH5Dej2gR4OY0FLharTZa+FgYvH+HncvzSZcG1NTI6q0ok+zKmqhMq0k4cEg/fmLOADSWS/o0126DtrXd75O5rEDQKBgQDnMHgEwRazt/xWFEcxV+sS75XzCNE+2d9ipiBzSenGSsm345glMKVFcYNOEgt6rLxvr4cpI8H0QQjrWibmNMMlBPGvKXvcO3jkvrbw/bxvhS+zmkcNZELge5iDWXp+DAX5G4zB/srCOKzCtLOIXlkE94B9ahKRJuHfSoL+xb6IPwKBgQCK4A5Nu8PmUPdBBVb9mEVpIVksx6F44ULWFu0HfhkOsg5mgEf2dILkKl0GqwpoTOlZyA90487A+qzqFDzA/HUT8AZ8AmV/urJNDaES78Agwq78y7X+zZqkkFKK4noUgtUVLAPGVSjFpmk19rs4BXEHbUUd0E+y1ehFwhel8R6ufQKBgDvkFt0ciPgjFU8Vo9cu1okAinD545E8hDH7hlzrddUbVKNLOaGmJKXYrhRxAR6/qJncXMqZ3OAdg2QOeEf2DT5CN6jb0TEID9hW3i3Mg7CpHoU0BKJLSYZMOqCwvsR9vptqSEW4ACtEn9CynaCAMXtg5F0At76eH62wNTdSZlgz',
    PUBLIC_KEY: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnA6yqE7gj8MRY6k645J5ayXvkzXBwxgMwtXnvT0Ndgh+wnBWOLjcl5ExGFPcxVVDlvzM55OICwea7JSWPmwglqYg5G8MyS9qYFL4/GNbxkWhkFC0eTagtSRERTGrvatecB2W6ZeujXgGdRp3zCyaDq2jwgL9fualv+XwTcea/Q/DimN1FOqqTEx5D2L9yXnz9EXvzehe12WqCoKk65vSZQQ8zahVQyr13cgImCjMSIclR+qQ2HGpskZKyjhdYAbRFhsVHI5jZdmrrp8nHKbyEAo1AfxsnDcH2bgdNercZyp2qC2l8tDt3ZHru5YGG6VXzgDLvgDlQ9+n9qp47jSV9wIDAQAB'
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
    "djfk3j4adf",
    "28fhsj283",
    "fsd23gdfg",
    "f3sd54gg",
    "13g55gvz"
];

/**
 * 获取随机激活码
 * @returns {string} 随机选取的激活码
 */
function getRandomActivationCode() {
    const randomIndex = Math.floor(Math.random() * ACTIVATION_CODES.length);
    return ACTIVATION_CODES[randomIndex];
}

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
 * 生成订单号
 * @returns {string} 订单号
 */
function generateOrderNumber() {
    const now = new Date();
    return 'SL' + 
           now.getFullYear() +
           padZero(now.getMonth() + 1) +
           padZero(now.getDate()) +
           padZero(now.getHours()) +
           padZero(now.getMinutes()) +
           padZero(now.getSeconds()) +
           Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

/**
 * 数字补零
 * @param {number} num - 需要补零的数字
 * @returns {string} 补零后的字符串
 */
function padZero(num) {
    return num.toString().padStart(2, '0');
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