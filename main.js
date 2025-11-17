// 购物车数据
let cart = [];

// P5.js 背景动画
function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-background');
}

function draw() {
    clear();
    
    // 创建石榴籽粒子效果
    for (let i = 0; i < 50; i++) {
        let x = (noise(i * 0.01, frameCount * 0.005) * width);
        let y = (noise(i * 0.01 + 100, frameCount * 0.005) * height);
        
        fill(192, 57, 43, 50); // 石榴红色，透明度50
        noStroke();
        ellipse(x, y, 8, 8);
        
        // 添加一些绿色粒子
        if (i % 3 === 0) {
            fill(39, 174, 96, 30); // 绿色，透明度30
            ellipse(x + 20, y + 20, 6, 6);
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeCart();
    initializeAnimations();
    initializeMobileMenu();
    initializeFloatingButtons();
});

// 初始化轮播
function initializeCarousel() {
    if (document.getElementById('product-carousel')) {
        new Splide('#product-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            breakpoints: {
                768: {
                    perPage: 1,
                },
                1024: {
                    perPage: 2,
                }
            }
        }).mount();
    }
}

// 初始化浮动按钮
function initializeFloatingButtons() {
    const backToTopBtn = document.getElementById('backToTop');
    const wechatContact = document.getElementById('wechatContact');
    const wechatQr = document.getElementById('wechatQr');
    
    // 回到顶部功能
    if (backToTopBtn) {
        // 初始状态：页面在顶部时隐藏按钮
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
        
        // 滚动事件监听
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
        
        // 点击回到顶部
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 微信联系功能
    if (wechatContact && wechatQr) {
        let isQrVisible = false;
        
        // 点击显示/隐藏二维码
        wechatContact.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡
            
            if (isQrVisible) {
                wechatQr.classList.remove('active');
            } else {
                wechatQr.classList.add('active');
            }
            
            isQrVisible = !isQrVisible;
        });
        
        // 点击页面其他地方关闭二维码
        document.addEventListener('click', (e) => {
            if (isQrVisible && !wechatQr.contains(e.target) && e.target !== wechatContact) {
                wechatQr.classList.remove('active');
                isQrVisible = false;
            }
        });
    }
}

// 初始化移动端菜单
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    // 打开移动端菜单
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    }
    
    // 关闭移动端菜单
    function closeMobileMenuFunc() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // 恢复滚动
    }
    
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', closeMobileMenuFunc);
    }
    
    // 点击遮罩层关闭菜单
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenuFunc);
    }
}

// 初始化购物车功能
function initializeCart() {
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    
    if (cartBtn && cartSidebar && closeCart) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('translate-x-full');
        });
        
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.add('translate-x-full');
        });
    }
}

// 初始化动画
function initializeAnimations() {
    // 页面滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为需要动画的元素添加观察
    const animatedElements = document.querySelectorAll('.card-hover, .feature-icon');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 标题动画
    anime({
        targets: '.hero-title',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutElastic(1, .8)',
        delay: 500
    });
}

// 添加到购物车功能
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartUI();
    showCartNotification(productName);
}

// 更新购物车UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    // 更新购物车数量
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // 更新购物车内容
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center">购物车为空</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center py-3 border-b">
                <div class="flex-1">
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-sm text-gray-500">¥${item.price} × ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity('${item.name}', -1)" class="w-6 h-6 bg-gray-200 rounded text-sm">-</button>
                    <span class="w-8 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)" class="w-6 h-6 bg-gray-200 rounded text-sm">+</button>
                    <button onclick="removeFromCart('${item.name}')" class="ml-2 text-red-500 text-sm">删除</button>
                </div>
            </div>
        `).join('');
    }
    
    // 更新总价
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `¥${total}`;
}

// 更新商品数量
function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            updateCartUI();
        }
    }
}

// 从购物车移除商品
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartUI();
}

// 显示添加购物车通知
function showCartNotification(productName) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = `已添加 ${productName} 到购物车`;
    
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // 隐藏通知
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 产品筛选功能（用于产品页面）
function filterProducts(category) {
    const products = document.querySelectorAll('.product-item');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            anime({
                targets: product,
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 500,
                easing: 'easeOutQuad'
            });
        } else {
            anime({
                targets: product,
                opacity: [1, 0],
                scale: [1, 0.8],
                duration: 300,
                easing: 'easeInQuad',
                complete: () => {
                    product.style.display = 'none';
                }
            });
        }
    });
}

// 价格筛选功能
function filterByPrice(minPrice, maxPrice) {
    const products = document.querySelectorAll('.product-item');
    
    products.forEach(product => {
        const price = parseInt(product.dataset.price);
        
        if (price >= minPrice && price <= maxPrice) {
            product.style.display = 'block';
            anime({
                targets: product,
                opacity: [0, 1],
                duration: 500
            });
        } else {
            anime({
                targets: product,
                opacity: [1, 0],
                duration: 300,
                complete: () => {
                    product.style.display = 'none';
                }
            });
        }
    });
}

// 表单验证功能
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('border-red-500');
            isValid = false;
        } else {
            input.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// 提交联系表单
function submitContactForm() {
    if (validateForm('contact-form')) {
        // 这里可以添加实际的表单提交逻辑
        showSuccessMessage('感谢您的咨询，我们会尽快与您联系！');
        document.getElementById('contact-form').reset();
    } else {
        showErrorMessage('请填写所有必填项');
    }
}

// 显示成功消息
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// 显示错误消息
function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// 平滑滚动到指定元素
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 移动端菜单切换
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});