const WISHLIST_URL = "https://project-amber-psi-97.vercel.app/wishlist"; 

function getAuthToken() {
    return localStorage.getItem("token") || localStorage.getItem("userToken") || "";
}

async function toggleWishlist(event, productId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const heartIcon = document.getElementById(`heart-${productId}`);
    if (!heartIcon) return;

    const token = getAuthToken();
    if (!token) {
        alert("برجاء تسجيل الدخول أولاً لإضافة المنتجات للـ Wishlist");
        return;
    }

    const isCurrentlyAdded = heartIcon.classList.contains('fas');

    if (!isCurrentlyAdded) {
        heartIcon.classList.remove('far', 'text-gray-500');
        heartIcon.classList.add('fas', 'text-blue-500');

        try {
            const response = await fetch(WISHLIST_URL, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ productId: productId })
            });

            if (response.ok) {
                loadWishlistItems();
            } else {
                heartIcon.classList.remove('fas', 'text-blue-500');
                heartIcon.classList.add('far', 'text-gray-500');
            }
        } catch (error) {
            heartIcon.classList.remove('fas', 'text-blue-500');
            heartIcon.classList.add('far', 'text-gray-500');
            console.error("Error adding to wishlist:", error);
        }
    } else {
        heartIcon.classList.remove('fas', 'text-blue-500');
        heartIcon.classList.add('far', 'text-gray-500');

        try {
            const response = await fetch(`${WISHLIST_URL}/${productId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            });

            if (response.ok) {
                loadWishlistItems();
            } else {
                heartIcon.classList.remove('far', 'text-gray-500');
                heartIcon.classList.add('fas', 'text-blue-500');
            }
        } catch (error) {
            heartIcon.classList.remove('far', 'text-gray-500');
            heartIcon.classList.add('fas', 'text-blue-500');
            console.error("Error removing from wishlist:", error);
        }
    }
}

async function loadWishlistItems() {
    const wishlistContainer = document.getElementById("wishlist-items-container");
    const wishlistBadge = document.getElementById("wishlist-badge");
    if (!wishlistContainer) return;

    const token = getAuthToken();
    if (!token) return;

    try {
        const response = await fetch(WISHLIST_URL, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        const resData = await response.json();
        const wishlistProducts = resData.data && Array.isArray(resData.data) 
            ? resData.data 
            : (Array.isArray(resData) ? resData : []);

        if (wishlistBadge) {
            if (wishlistProducts.length > 0) {
                wishlistBadge.innerText = wishlistProducts.length;
                wishlistBadge.style.display = "inline-block";
            } else {
                wishlistBadge.style.display = "none";
            }
        }

        wishlistContainer.innerHTML = "";

        if (wishlistProducts.length === 0) {
            wishlistContainer.innerHTML = "<p class='text-gray-500 text-center py-4 col-span-full'>Your wishlist is empty.</p>";
            
            const activeHearts = document.querySelectorAll('.wishlist-heart-icon i.fas');
            activeHearts.forEach(heart => {
                heart.classList.remove('fas', 'text-blue-500');
                heart.classList.add('far', 'text-gray-500');
            });
            return;
        }

        wishlistProducts.forEach(item => {
            const imgUrl = window.cleanImageUrl ? window.cleanImageUrl(item.images?.[0]) : (item.images?.[0] || "placeholder.png");
            
            let discountHTML = "";
            if (Math.random() > 0.5 && item.price && item.priceAfterDiscount && item.price > item.priceAfterDiscount) {
                const discountPercentage = Math.round(((item.price - item.priceAfterDiscount) / item.price) * 100);
                discountHTML = `<div class="dis" style="transform: scale(0.75); transform-origin: top left;"><div class="discount">${discountPercentage}%</div></div>`;
            } else {
                discountHTML = `<div class="dis" style="transform: scale(0.75); transform-origin: top left;"><div class="discount">0%</div></div>`;
            }

            const itemHTML = `
                <div class="the_product" data-brand="${item.brand || ''}" data-category="${item.category?.name || ''}" 
                     style="position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 8px; overflow: hidden; padding: 12px; background: inherit; width: 100%;">
                    
                    ${discountHTML}
                    
                    <div style="position: absolute; top: 8px; right: 8px; z-index: 10; cursor: pointer;">
                        <button onclick="window.toggleWishlist(event, '${item._id || item.id}')" class="text-red-500 hover:text-red-700 bg-white dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow">
                            <i class="fas fa-trash-alt text-sm"></i>
                        </button>
                    </div>

                    <div class="image_wrapper" style="height: 120px; display: flex; justify-content: center; align-items: center; margin-top: 15px;">
                        <img class="product_img" src="${imgUrl}" style="max-height: 100%; object-fit: contain;">
                    </div>

                    <div class="product_details" style="padding: 8px 0; text-align: center;">
                        <p style="font-size: 13px; line-height: 1.4; font-weight: 600; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 36px;">
                            ${item.title || "No Title"}
                        </p>
                    </div>

                    <div class="price" style="text-align: center; margin-bottom: 8px;">
                        <span class="new_price" style="font-size: 14px; font-weight: bold; color: var(--main-color, #2563eb);">${item.priceAfterDiscount || item.price} EGP</span>
                    </div>

                    <button style="width: 100%; padding: 8px 0; font-size: 12px; border-radius: 4px; font-weight: 500;">Add to Cart</button>
                </div>
            `;
            wishlistContainer.innerHTML += itemHTML;

            const mainHeart = document.getElementById(`heart-${item._id || item.id}`);
            if (mainHeart) {
                mainHeart.classList.remove('far', 'text-gray-500');
                mainHeart.classList.add('fas', 'text-blue-500');
            }
        });

    } catch (error) {
        console.error("Error loading wishlist items:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const wishlistButton = document.querySelector('[data-drawer-target="drawer-wishlist"]');
    if (wishlistButton) {
        wishlistButton.addEventListener("click", loadWishlistItems);
    }
});

window.toggleWishlist = toggleWishlist;
window.loadWishlistItems = loadWishlistItems;