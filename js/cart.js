// الحاوية الأساسية والعداد الخاص بكارت العربة في الـ Navbar
const cartContainer = document.getElementById("cart-items-container");
const cartBadge = document.getElementById("cart-badge");
const cartTotalElement = document.getElementById("cart-total-price");
let countcart = 0 ;
const cartid = document.getElementById("cart-count"); 


// 1. دالة إضافة المنتج إلى العربة
function addToCart(productId, productTitle, productPrice, productImage) {
    let cart = JSON.parse(localStorage.getItem("tech_nova_cart")) || [];
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > 0) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            id: productId,
            title: productTitle,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: 1
        });
    }

    localStorage.setItem("tech_nova_cart", JSON.stringify(cart));
    updateCartUI();
    
    if(cartBadge) {
        cartBadge.classList.add("scale-110");
        setTimeout(() => cartBadge.classList.remove("scale-110"), 200);
    }
}

// 2. دالة تحديث الكمية (+ / -)
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem("tech_nova_cart")) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > 0) {
        cart[productIndex].quantity += change;

        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1);
        }

        localStorage.setItem("tech_nova_cart", JSON.stringify(cart));
        updateCartUI();
    }
}

// 3. دالة حذف منتج بالكامل
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("tech_nova_cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem("tech_nova_cart", JSON.stringify(cart));
    updateCartUI();
}

// 4. دالة تحديث واجهة المستخدم وحساب الأسعار
function updateCartUI() {
    if (!cartContainer) return;

    const cart = JSON.parse(localStorage.getItem("tech_nova_cart")) || [];
    cartContainer.innerHTML = "";
    
    let totalPrice = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p class='text-gray-500 text-center py-8 col-span-full'>عربة التسوق فارغة حالياً.</p>";
        if (cartBadge) cartBadge.style.display = "none";
        if (cartTotalElement) cartTotalElement.innerText = "0 EGP";
        return;
    }

    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        totalPrice += itemSubtotal;
        totalItems += item.quantity;

        const cartHTML = `
            <div class="flex items-center gap-4 p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 transition-all hover:shadow-md">
                <img src="${item.image}" class="w-20 h-20 object-contain rounded-lg bg-gray-50 p-1" alt="${item.title}">
                
                <div class="flex-1 min-w-0">
                    <h6 class="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">${item.title}</h6>
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">${item.price} EGP</p>
                    
                    <div class="flex items-center gap-2">
                        <button onclick="window.updateQuantity('${item.id}', -1)" class="w-6 h-6 rounded bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 text-gray-800 dark:text-white flex items-center justify-center font-bold text-sm">-</button>
                        <span class="text-sm font-bold w-6 text-center text-gray-900 dark:text-white">${item.quantity}</span>
                        <button onclick="window.updateQuantity('${item.id}', 1)" class="w-6 h-6 rounded bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 text-gray-800 dark:text-white flex items-center justify-center font-bold text-sm">+</button>
                    </div>
                </div>

                <div class="flex flex-col items-end justify-between h-20">
                    <button onclick="window.removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <i class="fas fa-trash-alt text-sm"></i>
                    </button>
                    <p class="text-sm font-bold text-blue-600 dark:text-blue-400">${itemSubtotal.toFixed(2)} EGP</p>
                </div>
            </div>
        `;
        cartContainer.innerHTML += cartHTML;
    });


    if (cartTotalElement) {
        cartTotalElement.innerText = `${totalPrice.toLocaleString()} EGP`;
    }
}

// 5. دالة الفتح والغلق اليدوي المباشر للعربة (تتخطى أي Block في الصفحة)
function toggleCartDrawer() {
    const cartDrawer = document.getElementById("drawer-cart");
    if (!cartDrawer) return;

    // تأكد من إغلاق الـ Wishlist لو مفتوحة عشان ميتداخلوش
    const wishlistDrawer = document.getElementById("drawer-wishlist");
    if (wishlistDrawer && !wishlistDrawer.classList.contains("translate-x-full")) {
        wishlistDrawer.classList.add("translate-x-full");
    }

    cartDrawer.classList.toggle("translate-x-full");
}

// تشغيل السيستم فوراً
document.addEventListener("DOMContentLoaded", updateCartUI);

// إتاحة الدوال على الـ Window بشكل كامل
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.updateCartUI = updateCartUI;
window.toggleCartDrawer = toggleCartDrawer;