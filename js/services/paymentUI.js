/**
 * 支付UI组件
 * 负责显示支付弹窗、二维码和支付状态
 */

// 创建支付弹窗HTML
function createPaymentModal() {
    // 如果已存在，则不重复创建
    if (document.getElementById('paymentModal')) {
        return;
    }

    const modalHTML = `
    <div id="paymentModal" class="overlay">
        <div class="custom-popup payment-popup">
            <div class="popup-header">
                <i class="fas fa-qrcode"></i>
                <h3>支付宝扫码支付</h3>
                <button id="closePayment" class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="popup-content">
                <div class="payment-info">
                    <p class="payment-title">请使用支付宝扫描以下二维码完成支付</p>
                    <p class="payment-amount">支付金额: <span id="paymentAmount">¥0.00</span></p>
                    <p class="payment-desc">购买: <span id="paymentDesc">激活码</span></p>
                </div>
                <div class="qrcode-container">
                    <div id="qrcodeLoading" class="qrcode-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>正在生成支付二维码...</p>
                    </div>
                    <div id="qrcodeWrapper" class="qrcode-wrapper" style="display:none;">
                        <img id="qrcodeImage" src="" alt="支付二维码" />
                    </div>
                    <div id="paymentSuccess" class="payment-success" style="display:none;">
                        <i class="fas fa-check-circle"></i>
                        <p>支付成功！</p>
                    </div>
                </div>
                <div class="payment-footer">
                    <p class="payment-tips">二维码有效期为15分钟，请尽快完成支付</p>
                    <p class="payment-help">支付完成后，将自动为您激活服务</p>
                    <button id="checkPaymentStatus" class="popup-btn check-btn"><i class="fas fa-sync-alt"></i> 我已完成支付</button>
                </div>
            </div>
        </div>
    </div>`;

    // 插入HTML到body末尾
    const div = document.createElement('div');
    div.innerHTML = modalHTML.trim();
    document.body.appendChild(div.firstChild);

    // 添加事件监听器
    setupPaymentEventListeners();
}

// 设置支付弹窗事件监听器
function setupPaymentEventListeners() {
    const closeBtn = document.getElementById('closePayment');
    const checkStatusBtn = document.getElementById('checkPaymentStatus');

    // 关闭弹窗
    closeBtn.addEventListener('click', hidePaymentModal);

    // 检查支付状态
    checkStatusBtn.addEventListener('click', function() {
        const outTradeNo = this.getAttribute('data-order');
        if (!outTradeNo) return;

        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在查询支付状态...';
        this.disabled = true;

        // 调用支付宝服务查询订单状态
        window.alipayService.queryOrderStatus(outTradeNo, function(response) {
            checkStatusBtn.innerHTML = originalText;
            checkStatusBtn.disabled = false;

            if (response.success && response.trade_status === 'TRADE_SUCCESS') {
                // 支付成功
                showPaymentSuccess(response.activation_code);
            } else {
                // 支付未完成
                alert('支付尚未完成，请扫码支付或稍后再试');
            }
        });
    });
}

// 显示支付成功状态
function showPaymentSuccess(activationCode) {
    // 隐藏支付弹窗
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.classList.remove('active');
    }
    
    // 创建并显示成功弹窗
    createSuccessModal(activationCode);
}

// 创建支付成功弹窗
function createSuccessModal(activationCode) {
    // 移除已存在的成功弹窗（如果有）
    const existingModal = document.getElementById('successModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const successModalHTML = `
    <div id="successModal" class="overlay success-overlay">
        <div class="custom-popup success-popup">
            <div class="success-header">
                <h3>支付成功</h3>
            </div>
            <div class="success-content">
                <div class="success-message">
                    <h4>付款已完成，谢谢您的支持！</h4>
                    <p>您的激活码已生成，请妥善保存</p>
                </div>
                
                <div class="activation-code-section">
                    <div class="code-label">
                        <i class="fas fa-key"></i>
                        <span>激活码</span>
                    </div>
                    <div class="code-box">
                        <span id="activationCodeDisplay">${activationCode}</span>
                        <button id="copyActivationCode" class="copy-btn" title="复制激活码">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <p class="copy-hint">点击右方按钮复制激活码</p>
                </div>
                
                <div class="success-actions">
                    <button id="useActivationCode" class="popup-btn use-code-btn">
                        <i class="fas fa-check"></i> 立即使用激活码
                    </button>
                    <button id="closeSuccessModal" class="popup-btn close-success-btn">
                        <i class="fas fa-times"></i> 关闭窗口
                    </button>
                </div>
            </div>
        </div>
    </div>`;
    
    // 插入成功弹窗到body
    const successDiv = document.createElement('div');
    successDiv.innerHTML = successModalHTML.trim();
    document.body.appendChild(successDiv.firstChild);
    
    // 显示弹窗
    setTimeout(() => {
        document.getElementById('successModal').classList.add('active');
        
        // 添加复制功能
        setupSuccessModalEvents(activationCode);
    }, 300);
}

// 设置成功弹窗事件
function setupSuccessModalEvents(activationCode) {
    const copyBtn = document.getElementById('copyActivationCode');
    const useCodeBtn = document.getElementById('useActivationCode');
    const closeBtn = document.getElementById('closeSuccessModal');
    
    // 复制按钮功能
    copyBtn.addEventListener('click', function() {
        const codeText = document.getElementById('activationCodeDisplay').textContent;
        navigator.clipboard.writeText(codeText).then(function() {
            const copyHint = document.querySelector('.copy-hint');
            copyHint.textContent = '复制成功!';
            copyHint.classList.add('copied');
            
            // 添加按钮动画
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.classList.add('copied-btn');
            
            setTimeout(() => {
                copyHint.textContent = '点击上方按钮复制激活码';
                copyHint.classList.remove('copied');
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                copyBtn.classList.remove('copied-btn');
            }, 2000);
        }).catch(function() {
            // 如果复制失败，提供后备方案
            const codeElement = document.getElementById('activationCodeDisplay');
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(codeElement);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();
            
            const copyHint = document.querySelector('.copy-hint');
            copyHint.textContent = '复制成功!';
            copyHint.classList.add('copied');
            
            // 添加按钮动画
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.classList.add('copied-btn');
            
            setTimeout(() => {
                copyHint.textContent = '点击上方按钮复制激活码';
                copyHint.classList.remove('copied');
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                copyBtn.classList.remove('copied-btn');
            }, 2000);
        });
    });
    
    // 立即使用按钮功能
    useCodeBtn.addEventListener('click', function() {
        hideSuccessModal();
        
        // 填入激活码
        const activationInput = document.getElementById('activationCode');
        const popupActivationInput = document.getElementById('popupActivationCode');
        
        if (activationInput) {
            activationInput.value = activationCode;
            // 触发input事件
            const inputEvent = new Event('input', {bubbles: true});
            activationInput.dispatchEvent(inputEvent);
        }
        
        // 如果激活码弹窗已显示，也填入激活码
        if (popupActivationInput && document.getElementById('overlay').classList.contains('active')) {
            popupActivationInput.value = activationCode;
            // 更新弹窗内容
            const popupContent = document.querySelector('.popup-content p');
            popupContent.textContent = `您已成功购买激活码，请点击确认继续`;
            popupContent.style.color = "var(--success-color)";
            
            // 触发input事件
            const inputEvent = new Event('input', {bubbles: true});
            popupActivationInput.dispatchEvent(inputEvent);
        }
    });
    
    // 关闭按钮功能
    closeBtn.addEventListener('click', hideSuccessModal);
}

// 隐藏成功弹窗
function hideSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('active');
        
        // 等待动画完成后移除DOM
        setTimeout(() => {
            if (successModal && successModal.parentNode) {
                successModal.parentNode.removeChild(successModal);
            }
        }, 300);
    }
}

// 显示支付弹窗，并加载支付二维码
function showPaymentModal(plan, price, description) {
    createPaymentModal();
    
    // 显示弹窗
    const paymentModal = document.getElementById('paymentModal');
    paymentModal.classList.add('active');
    
    // 更新支付信息
    document.getElementById('paymentAmount').textContent = price;
    document.getElementById('paymentDesc').textContent = description;
    
    // 显示加载状态
    document.getElementById('qrcodeLoading').style.display = 'flex';
    document.getElementById('qrcodeWrapper').style.display = 'none';
    document.getElementById('paymentSuccess').style.display = 'none';
    
    // 生成支付二维码
    window.alipayService.generatePaymentQRCode(plan, function(response) {
        if (response.error) {
            alert('生成支付二维码失败: ' + response.error);
            return;
        }
        
        // 更新二维码图片
        const qrcodeImage = document.getElementById('qrcodeImage');
        qrcodeImage.src = response.qrCodeUrl;
        
        // 保存订单号到检查按钮
        document.getElementById('checkPaymentStatus').setAttribute('data-order', response.outTradeNo);
        
        // 隐藏加载状态，显示二维码
        document.getElementById('qrcodeLoading').style.display = 'none';
        document.getElementById('qrcodeWrapper').style.display = 'flex';
        
        // 添加自动查询功能，每5秒查询一次支付状态
        let checkCount = 0;
        const maxChecks = 30; // 最多查询30次，约2.5分钟
        
        const autoCheckInterval = setInterval(function() {
            checkCount++;
            
            // 如果弹窗已关闭或已达到最大查询次数，停止查询
            if (!paymentModal.classList.contains('active') || checkCount >= maxChecks) {
                clearInterval(autoCheckInterval);
                return;
            }
            
            // 查询支付状态
            window.alipayService.queryOrderStatus(response.outTradeNo, function(response) {
                if (response.success && response.trade_status === 'TRADE_SUCCESS') {
                    clearInterval(autoCheckInterval);
                    showPaymentSuccess(response.activation_code);
                }
            });
        }, 5000);
    });
}

// 隐藏支付弹窗
function hidePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.classList.remove('active');
    }
}

// 导出支付UI功能
window.paymentUI = {
    showPaymentModal,
    hidePaymentModal
}; 