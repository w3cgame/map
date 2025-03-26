<?php
/**
 * 支付宝接口配置文件
 */
return [
    // 应用ID,您的APPID
    'app_id' => '2021003128637838',
    
    // 商户私钥，您的原始格式RSA私钥
    'merchant_private_key' => 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtnXaZuTGV19YJyVdmptG2Aaww+pBNSRQ+9k16yLEzyMIVJJJeUj5xXToaYB2AGQFjY1Fpkar3IHEf0QSEr5c54T3zEGkHc+/cltCtWAA3ecmoE8rij6igG9pjI9rOmHXQFJoGxu39u5SH0ZCKlmx6EOGoBJeN9hlT0iAslp9NMy2R+2HrYt9r/bMvR7gMiFEZYwMzzy3wueAh5RKxNDNU6P58QYFrKhN5q4JhAZA3mM5H1Omx5hDECFs3x0nQveTpxnCBYQIxdxxdHu35o4P0EFEgoTSJdYdiB4LwcR9gtqE1N5yLfliWLrmkS/+B0Yj+C358CwWcle4ZYV9P0zu3AgMBAAECggEATc9QpDy32GxPZTtzjHIfcu70+U6S9dBW3pEM0Ia5xHepZEhrwRIjIjOiIsgI8KxETwLoLeQ3N2K20Ieg+sanhC1K0nD8YXa4faiqBcZ28mYG1uln+HpiHL/e9KfRHN5/jq5tCbSGXT2AqA5oNXSNUXfXarIEKn+tgj+eY91tr+8NFcnXXdSolJJ1/vZtZhAy2ZXz4Oc+FGMPbMIxlE5xZZZ5hP6FsSx6KzjiuA1o6qLQpcdp6UdkOVC8FyExX1DvKzfnsLyTATLbThkzAb0kT/elwQCpsUVZnbzOKCBTAs/OaEhTh1OTmQjjrPVliNl88Qprfj302aOLCyRRg2WaoQKBgQDyyNgN/Aj+wG4PSXYq8gSEDKeOnN+xz26bb1b3X/C1TIQ/FE9Fs7xOtMhk7wcai6xJNtYXb1spPhT60LMdoMuzjbXG50wWuREiqDWngQVoWhQ6AwnKVV2qmJxNX7SeJ5XbzRNwIRDor3eo8WS0+eOzbI9ZAXKt6RkZ+u5UTR/50wKBgQC3EMGYsBvwjpkirrsqeLN8XGM0PgHd2spzYXv1HtnyXuzKmgtPshxVhgCXoeESIw23OrDwlbb1UqieJX10dEH5Dej2gR4OY0FLharTZa+FgYvH+HncvzSZcG1NTI6q0ok+zKmqhMq0k4cEg/fmLOADSWS/o0126DtrXd75O5rEDQKBgQDnMHgEwRazt/xWFEcxV+sS75XzCNE+2d9ipiBzSenGSsm345glMKVFcYNOEgt6rLxvr4cpI8H0QQjrWibmNMMlBPGvKXvcO3jkvrbw/bxvhS+zmkcNZELge5iDWXp+DAX5G4zB/srCOKzCtLOIXlkE94B9ahKRJuHfSoL+xb6IPwKBgQCK4A5Nu8PmUPdBBVb9mEVpIVksx6F44ULWFu0HfhkOsg5mgEf2dILkKl0GqwpoTOlZyA90487A+qzqFDzA/HUT8AZ8AmV/urJNDaES78Agwq78y7X+zZqkkFKK4noUgtUVLAPGVSjFpmk19rs4BXEHbUUd0E+y1ehFwhel8R6ufQKBgDvkFt0ciPgjFU8Vo9cu1okAinD545E8hDH7hlzrddUbVKNLOaGmJKXYrhRxAR6/qJncXMqZ3OAdg2QOeEf2DT5CN6jb0TEID9hW3i3Mg7CpHoU0BKJLSYZMOqCwvsR9vptqSEW4ACtEn9CynaCAMXtg5F0At76eH62wNTdSZlgz',
    
    // 支付宝公钥，查看地址：https://openhome.alipay.com/platform/keyManage.htm
    'alipay_public_key' => 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnA6yqE7gj8MRY6k645J5ayXvkzXBwxgMwtXnvT0Ndgh+wnBWOLjcl5ExGFPcxVVDlvzM55OICwea7JSWPmwglqYg5G8MyS9qYFL4/GNbxkWhkFC0eTagtSRERTGrvatecB2W6ZeujXgGdRp3zCyaDq2jwgL9fualv+XwTcea/Q/DimN1FOqqTEx5D2L9yXnz9EXvzehe12WqCoKk65vSZQQ8zahVQyr13cgImCjMSIclR+qQ2HGpskZKyjhdYAbRFhsVHI5jZdmrrp8nHKbyEAo1AfxsnDcH2bgdNercZyp2qC2l8tDt3ZHru5YGG6VXzgDLvgDlQ9+n9qp47jSV9wIDAQAB',
    
    // 服务器异步通知页面路径，必须是完整的url，不能只写路径
    'notify_url' => 'https://您的实际域名/api/alipay_notify.php',
    
    // 页面跳转同步通知页面路径，必须是完整的url，不能只写路径
    'return_url' => 'https://您的实际域名/index.html',
    
    // 签名方式
    'sign_type' => 'RSA2',
    
    // 支付宝网关
    'gateway_url' => 'https://openapi.alipay.com/gateway.do',
    
    // 编码
    'charset' => 'UTF-8',
    
    // 日志路径
    'log_path' => __DIR__ . '/../logs/',
    
    // 价格配置（以分为单位）
    'price_config' => [
        'monthly' => 5800,   // 58元
        'quarterly' => 9800, // 98元
        'yearly' => 29800    // 298元
    ],
    
    // 套餐名称映射
    'plan_names' => [
        'monthly' => '30天激活码',
        'quarterly' => '90天激活码',
        'yearly' => '365天激活码'
    ],
    
    // 激活码列表 - 随机从这个列表中选择一个作为激活码
    'activation_codes' => [
        "djfk3j4adf",
        "28fhsj283",
        "fsd23gdfg",
        "f3sd54gg",
        "13g55gvz"
    ]
]; 