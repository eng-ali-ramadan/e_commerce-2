document.addEventListener("productsLoaded", () => {
  console.log("✅ تم تحميل المنتجات بنجاح في ملف الفلتر! عدد المنتجات المتاحة:", window.allProductsArray.length);
  setupFilterListeners();
});

function setupFilterListeners() {
  const checkboxes = document.querySelectorAll("#side_bar input[type='checkbox']");
  console.log("🔍 عدد الـ Checkboxes اللي الكود لقاها في السايد بار:", checkboxes.length);
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", applyFilters);
  });
}

function applyFilters() {
  // 1. تجميع الكاتيجوريز المختارة
  const selectedCategories = Array.from(document.querySelectorAll(".cate input[type='checkbox']:checked"))
                                  .map(cb => cb.value.toLowerCase());

  // 2. تجميع البراندات المختارة
  const selectedBrands = Array.from(document.querySelectorAll(".brands input[type='checkbox']:checked"))
                              .map(cb => cb.value.toLowerCase());

  console.log("📂 الأنواع المختارة (Categories):", selectedCategories);
  console.log("🏷️ الشركات المختارة (Brands):", selectedBrands);

  // 3. الفلترة
  const filtered = window.allProductsArray.filter(product => {
    // جلب اسم الكاتيجوري والبراند من السيرفر وتحويلهم لسمول
    const productCat = product.category?.name?.toLowerCase() || "";
    
    // فحص لو السيرفر باعت البراند كـ String أو Object
    let productBrand = "";
    if (product.brand) {
      productBrand = typeof product.brand === "object" 
        ? (product.brand.name || "").toLowerCase() 
        : product.brand.toLowerCase();
    }

    // شرط الكاتيجوري
    const matchesCategory = selectedCategories.length === 0 || 
                            selectedCategories.some(cat => productCat.includes(cat));

    // شرط البراند
    const matchesBrand = selectedBrands.length === 0 || 
                         selectedBrands.some(brand => productBrand.includes(brand) || productCat.includes(brand));

    return matchesCategory && matchesBrand;
  });

  console.log("🎯 عدد المنتجات بعد الفلترة الحالية:", filtered.length);

  // 4. إعادة العرض
  window.displayProducts(filtered);
}