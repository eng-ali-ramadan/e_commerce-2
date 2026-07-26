let PRODUCTS_URL = "https://project-amber-psi-97.vercel.app/products";
const BASE_IMAGE_URL = "https://res.cloudinary.com/dikubxsj0/image/upload/v1777913774/products";

window.allProductsArray = []; 
window.productContainer = null;

async function loadProducts() {
  try {
    const laptopContainer = document.getElementById("laptop");
    const phoneContainer = document.getElementById("phone");
    const accessoriesContainer = document.getElementById("accessories");

    let filterKeyword = "";

    if (laptopContainer) {
      window.productContainer = laptopContainer;
      filterKeyword = "laptop";
    } else if (phoneContainer) {
      window.productContainer = phoneContainer;
      filterKeyword = "phone";
    } else if (accessoriesContainer) {
      window.productContainer = accessoriesContainer;
      filterKeyword = "accessories";
    }

    if (!window.productContainer) return;

    const res = await fetch(PRODUCTS_URL);
    const data = await res.json();
    
    window.allProductsArray = (data.data || []).filter((product) => 
      
      {
    
      const categoryName = product.category?.name?.toLowerCase().trim() || "";

      if (filterKeyword === "phone") {
        return categoryName.startsWith("phone") ;
      }
      

      if (filterKeyword === "laptop") {
        return categoryName.startsWith("laptop");
      }

      if (filterKeyword === "accessories") {
        return categoryName.startsWith("accessories");
      }

      return false;
    });

    displayProducts(window.allProductsArray);
    document.dispatchEvent(new Event("productsLoaded"));

    if (window.loadWishlistItems) {
        window.loadWishlistItems();
    }

  } catch (err) {
    console.error("Error loading products:", err);
  }
}

function displayProducts(productsList) {
  if (!window.productContainer) return;
  
  window.productContainer.innerHTML = "";

  if (productsList.length === 0) {
    window.productContainer.innerHTML = "<p class='no-products'>No products found.</p>";
    return;
  }

  let fullProductsHTML = "";

  productsList.forEach((product) => {
    const image = product.images && product.images.length > 0 ? cleanImageUrl(product.images[0]) : "placeholder.png";
    const productId = product._id || product.id;

    let discountHTML = ``;
    if (product.price && product.priceAfterDiscount && product.price > product.priceAfterDiscount) {
      const discountPercentage = Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
      
    }

    const escapedTitle = product.title ? product.title.replace(/'/g, "\\'") : '';

    fullProductsHTML += `
      <div class="the_product" data-brand="${product.brand || ''}" data-category="${product.category?.name || ''}" style="position: relative;">
          ${discountHTML}
          
          <div class="wishlist-heart-icon" style="position: absolute; top: 10px; right: 10px; z-index: 10; cursor: pointer;">
              <i class="far fa-heart text-xl text-gray-500 hover:text-blue-500 transition-colors" 
                 id="heart-${productId}" 
                 onclick="window.toggleWishlist(event, '${productId}')">
              </i>
          </div>

          <div class="image_wrapper">
              <img class="product_img" src="${image}" alt="${escapedTitle}">
          </div>

          <div class="product_details">
              <p>${product.title || "No Title"}</p>
              <span class="msg">${product.description || ""}</span>
          </div>

          <div class="price">
              <span class="new_price">${product.priceAfterDiscount || product.price} EGP</span>
          </div>

          <button onclick="window.addToCart('${productId}', '${escapedTitle}', ${product.priceAfterDiscount || product.price}, '${image}')">
              Add to Cart
          </button>
      </div>
    `;
  });

  window.productContainer.innerHTML = fullProductsHTML;
}

const cleanImageUrl = (url) => {
  if (!url) return "placeholder.png";
  if (url.includes("https://")) {
    return url.substring(url.indexOf("https://"));
  }
  return `${BASE_IMAGE_URL}/${url}`;
};

window.cleanImageUrl = cleanImageUrl;
window.displayProducts = displayProducts;

/* ============ Search Feature ============ */

function handleSearch(event) {
  const keyword = event.target.value.toLowerCase().trim();

  if (!keyword) {
    displayProducts(window.allProductsArray);
    return;
  }

  const filtered = window.allProductsArray.filter((product) => {
    const title = product.title ? product.title.toLowerCase() : "";
    const description = product.description ? product.description.toLowerCase() : "";
    const brand = product.brand ? product.brand.toLowerCase() : "";
    return (
      title.includes(keyword) ||
      description.includes(keyword) ||
      brand.includes(keyword)
    );
  });

  displayProducts(filtered);
}

window.handleSearch = handleSearch;

function setupSearchInput() {
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupSearchInput();
});