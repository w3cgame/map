<?php
/**
 * 支付宝接口配置文件
 */
return [
    // 应用ID,您的APPID
    'app_id' => '2021005132643724',
    
    // 商户私钥，您的原始格式RSA私钥
    'merchant_private_key' => 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCPsx8c0ikqzuddPMNwfRCXy7fmgBBMIoRBVBuy48stUExkn0/TMq6iEfzNsPsjW34JFPdcRQcZxADG+PBS7H6yDUeN2rEIyetpBvskaSADvjL8wtWhYQhZE5ol5oNhSg+Newlt1pBWgLeB4BGKIIpePuuCD8F8Vpi9kkSKg+KWQet1aTyOZNC1kKh2JvOEYPv7rEC9mJRzy0r3/LxL9AAUIjtcC0/dL4ObQh0Z94+VFYJdT0h6ZBvtkaDlICt5gNSX7rPpdaKgMASA5TcjEFnSkd8erOR+3ZDz3uX0kjcuW3ZJNxnFgjruii49DbS081YwMD9oP70UWLsAGVmWNbwlAgMBAAECggEAVAUoiOJ8vZHyh3qSz3/gptCvey+f19RKviPeei9kyd7se90GgHde0lZwGRiFDrxdKhQ/OY0GxNLsnWpKokGzJopLLy8SWhAt+9/gEf8BgA7CozWMUWp5xhOHCugII2d5RoENF1LgXCOwqFiKCNhT7x0c+JQbzoaXkigmuVK5tp5+Jd6ICo0bvpVvieQOsv9+AZw+fPus/z8/5oOQgGZBQy6G31NwA8S/RehcsPS6Z5h7bzByVHAGr8UUsop7G9BHmZzUvte8vIvWPlus20gzKtKvmt5pNrvWbGiIyEArTb0Fr9D3RqTvLp9n1JmhbssdizWBdIcpKmuWr6jX31hdAQKBgQDD08Vn1dMXzXFvCin5J3b5CYQYlqomOEK9RXx0TCy7TBU/xmdanhKh5Fv1R2yV0xg4tT55f4hBKAdxtvctUYDDNlyMrwJ3Dn5eE48Y4CD01di6CoiWIEu+BIBndps9yhwF1rPDOC5tFWiaiHG2fQD/EdiHeTLQ7eAOUsEFKtSKwQKBgQC72uBMkQnGB6CR1TMRcdEh4I0n6PkRBesuOWA2p/fXDcJYTsn4H+N3i8+CrbqlqIDI7xAYzZZtY5Fo5d3PVC8oZaZkvzagEq6lKcLVMAc4xGDxTkcV6oEkHH3CP+8pIgakrbasJFFaeXO74jBn58Kw3ZzJUtY8XnN7nKqUaBB+ZQKBgGY0uDpKioNI0aRvvJpys5ClG9GtiR6rjIG2q48TVuFmg0ym47iS+gyO4EPzREQqSeEHD5VgL6A6ITCDmxyHBlpcnA89JF85LFEziiMkj27Z0eS/rKwWLRH+zXmymLG2M8wEVAxW3TxHyTGmdxsUwRlfmhCS/Ce5j5BKNr3YrdfBAoGBALHW/P8fU6xY7icBOg5qvLygk6FTye7WtpWVFcPIcjXyPalSNZwjvDkhb7rb81X+1qTixU9l2eIHH9K5wqoTnW1WBhdcej9CUHnltiATDtMr/kaTf3J9BfME0f2Cf0xmfPmLxuLiou3PCsS01nSXkNXVhyeEt3KBTDyazVYfynWNAoGAGYkAsY8+xhPzQjARyARDgbAw93M/mhq3TcSBai1LE86MToIldIu1Ud6RgPSYUDZRtKO8tkEqtOdzxhrSriJ/TwfmrjjYPtATwltG88/22mPjPpo0CY04fwhpPSrZEL9nCbyS0Grpbyzi3up4P1jDZlU3x1T3nwbHZv0YLryT7UM=',
    
    // 支付宝公钥，查看地址：https://openhome.alipay.com/platform/keyManage.htm
    'alipay_public_key' => 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgmhZ9QPjDt3A+KRmHLg28jznW4/v18QBC1rnSiJQBSeqPA/cT3k8aHFWq9WpxMkYfCnRG4q/wUQFO9nw0NmnlAL2lGgtec1S3OJOeKEtw9KsnR6xBXUg0hWk3SnyjNDuhwp5C8W1mORht3dTKs1qKsA01Zc3XZnr/k9hLEQHKem6KiOa7dauIdCceFX1Awy2TDESypVvz4AxNtFOQuHnjvlBFV767EnCdHdCpxF0Eizff2nZ3Fj6ixnUKCnQtnKGIEfFCWYorfu8DQGkfevHqQmWCLNBtKS2RMPYTPz7juEWFJWMAZpd124KmBRr1HwYTa2PYsgtiDd+cVzJWQH7vQIDAQAB',
    
    // 服务器异步通知页面路径，必须是完整的url，不能只写路径
    'notify_url' => 'https://vvchange.top/api/alipay_notify.php',
    
    // 页面跳转同步通知页面路径，必须是完整的url，不能只写路径
    'return_url' => 'https://vvchange.top/index.html',
    
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
        "SLABC123456",
        "SLDEF789012",
        "SLGHI345678",
        "SLJKL901234",
        "SLMNO567890",
        "SLPQR123456",
        "SLSTU789012",
        "SLVWX345678",
        "SLYZ0123456",
        "SL987654321"
    ]
]; 