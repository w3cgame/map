# 地图定位与支付宝支付系统

这是一个集成了地图定位功能和支付宝支付的Web应用程序。

## 功能特点

- 用户位置跟踪与显示
- 集成支付宝支付功能
- 激活码系统
- 响应式设计，支持移动设备

## 安装说明

1. 克隆仓库到本地：
```bash
git clone https://github.com/chiyousir/map.git
```

2. 配置支付宝支付（如需使用真实支付功能）：
   - 编辑 `api/alipay_config.php` 文件
   - 更新APPID、商户私钥、支付宝公钥等配置
   - 修改异步通知地址和返回地址为您的实际域名

3. 目录权限设置：
   - 确保 `database` 和 `logs` 目录有写入权限

## 开发环境搭建

1. 使用PHP内置服务器（开发测试用）：
```bash
php -S localhost:8000
```

2. 或者使用常规Web服务器（如Apache/Nginx）部署

## 模拟支付测试

访问以下URL测试模拟支付功能：
```
http://您的域名/api/simple_test.php
```

## 激活码列表

系统预设了以下激活码：
- djfk3j4adf
- 28fhsj283
- fsd23gdfg
- f3sd54gg
- 13g55gvz

## 技术栈

- 前端：HTML, CSS, JavaScript
- 后端：PHP
- 数据库：SQLite
- 支付：支付宝API 