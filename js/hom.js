const PRODUCTS_URL = "https://project-amber-psi-97.vercel.app/products";
const CATEGORIES_URL = "https://project-amber-psi-97.vercel.app/categories";
const BASE_IMAGE_URL = "https://res.cloudinary.com/dikubxsj0/image/upload/v1777913774/products";
const WISHLIST_URL = "https://project-amber-psi-97.vercel.app/wishlist"; 


function cleanImageUrl(url) {
  if (!url) return "placeholder.png";
  if (url.includes("https://")) return url.substring(url.indexOf("https://"));
  return `${BASE_IMAGE_URL}/${url}`;
}
window.cleanImageUrl = cleanImageUrl; 

function getAuthToken() {
    return localStorage.getItem("token") || localStorage.getItem("userToken") || "";
}


function initProductSlider(selector) {
  new Swiper(selector, {
    slidesPerView: 5, 
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: `${selector} .swiper-button-next`,
      prevEl: `${selector} .swiper-button-prev`,
    },
    breakpoints: {
      1400: { slidesPerView: 5, spaceBetween: 20 }, 
      1200: { slidesPerView: 4, spaceBetween: 20 }, 
      1024: { slidesPerView: 3, spaceBetween: 15 },
      768: { slidesPerView: 2, spaceBetween: 15 },
      0: { slidesPerView: 1, spaceBetween: 10 }
    }
  });
}


async function loadProducts() {
  try {
    const phoneContainer = document.getElementById("mobile");
    const laptopContainer = document.getElementById("laptop");
    const accessoriesContainer = document.getElementById("accessories");

  
    const catRes = await fetch(CATEGORIES_URL);
    const catData = await catRes.json();
    const categories = catData.data || [];

   
    const res = await fetch(PRODUCTS_URL);
    const responseData = await res.json();
    const allItems = responseData.data || [];

 
    const getCategoryId = (keyword) => {
      const found = categories.find(c => (c.name || "").toLowerCase().includes(keyword.toLowerCase()));
      return found ? found._id || found.id : null;
    };

    const phoneId =  getCategoryId("mobile");
    const laptopId = getCategoryId("laptop");
    const accId = getCategoryId("accessor");


    if (phoneContainer) {
      const phones = allItems.filter(p => {
        const pCatId = p.category?._id || p.category?.id || p.category;
        const pCatName = (p.category?.name || "").toLowerCase();
        return pCatId === phoneId || pCatName.includes("mobile") || pCatName.includes("mobile");
      });
      displayCategoryProducts(phoneContainer, phones);
      initProductSlider(".mobileSwiper"); 
    }

 
    if (laptopContainer) {
      const laptops = allItems.filter(p => {
        const pCatId = p.category?._id || p.category?.id || p.category;
        const pCatName = (p.category?.name || "").toLowerCase();
        return pCatId === laptopId || pCatName.includes("laptop");
      });
      displayCategoryProducts(laptopContainer, laptops);
      initProductSlider(".laptopSwiper"); 
    }


    if (accessoriesContainer) {
      const accessories = allItems.filter(p => {
        const pCatId = p.category?._id || p.category?.id || p.category;
        const pCatName = (p.category?.name || "").toLowerCase();
        return pCatId === accId || pCatName.includes("accessor");
      });
      displayCategoryProducts(accessoriesContainer, accessories);
      initProductSlider(".accessorieSwiper"); 
    }

   
    syncHeartsOnLoad();

  } catch (err) {
    console.error("حدث خطأ أثناء تحميل البيانات وتفعيل السلايدرز:", err);
  }
}


function displayCategoryProducts(container, productsList) {
  container.innerHTML = "";
  if (productsList.length === 0) {
    container.innerHTML = "<p class='text-center w-100 py-4 text-muted'>No products found.</p>";
    return;
  }

  productsList.forEach((product) => {
    const image = product.images && product.images.length > 0 ? cleanImageUrl(product.images[0]) : "placeholder.png";
    const productId = product._id || product.id;
    const finalPrice = product.priceAfterDiscount || product.price;
    const safeTitle = product.title ? product.title.replace(/'/g, "\\'") : 'No Title';

    container.innerHTML += `
      <div class="swiper-slide product position-relative">
          <div class="wishlist-heart-icon position-absolute" style="top: 15px; right: 15px; z-index: 10; cursor: pointer;">
              <i id="heart-${productId}" class="far fa-heart text-xl text-gray-500 transition" onclick="window.toggleWishlist(event, '${productId}')"></i>
          </div>
          <div class="img_product">
              <img src="${image}" alt="${safeTitle}">
          </div>
          <h3 class="name_product">${product.title || "No Title"}</h3>
          <div class="price">
              <p>${finalPrice} EGP</p>
          </div>
          <button onclick="window.addToCart && window.addToCart('${productId}', '${safeTitle}', ${finalPrice}, '${image}')">
              <i class="fa-solid fa-cart-shopping"></i> Add to Cart
          </button>
      </div>
    `;
  });
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
            headers: { "Authorization": `Bearer ${token}` }
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

    
        const activeHearts = document.querySelectorAll('.wishlist-heart-icon i.fas');
        activeHearts.forEach(heart => {
            heart.classList.remove('fas', 'text-blue-500');
            heart.classList.add('far', 'text-gray-500');
        });

        wishlistContainer.innerHTML = "";

        if (wishlistProducts.length === 0) {
            wishlistContainer.innerHTML = "<p class='text-gray-500 text-center py-4 col-span-full'>Your wishlist is empty.</p>";
            return;
        }

        wishlistProducts.forEach(item => {
            const imgUrl = cleanImageUrl(item.images?.[0]);
            
            let discountHTML = "";
            if (item.price && item.priceAfterDiscount && item.price > item.priceAfterDiscount) {
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


async function syncHeartsOnLoad() {
    const token = getAuthToken();
    if (!token) return;
    try {
        const response = await fetch(WISHLIST_URL, { headers: { "Authorization": `Bearer ${token}` } });
        const resData = await response.json();
        const wishlistProducts = resData.data && Array.isArray(resData.data) ? resData.data : (Array.isArray(resData) ? resData : []);
        
        wishlistProducts.forEach(item => {
            const mainHeart = document.getElementById(`heart-${item._id || item.id}`);
            if (mainHeart) {
                mainHeart.classList.remove('far', 'text-gray-500');
                mainHeart.classList.add('fas', 'text-blue-500');
            }
        });
    } catch(e) { console.log(e); }
}


document.addEventListener("DOMContentLoaded", () => {
  new Swiper(".mainSwiper", {
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    autoplay: { delay: 3000, disableOnInteraction: false }
  });

  loadProducts();
  loadWishlistItems(); 

  const wishlistButton = document.querySelector('[data-drawer-target="drawer-wishlist"]');
  if (wishlistButton) {
      wishlistButton.addEventListener("click", loadWishlistItems);
  }
});

window.toggleWishlist = toggleWishlist;
window.loadWishlistItems = loadWishlistItems;