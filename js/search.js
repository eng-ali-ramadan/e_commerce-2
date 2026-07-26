
const searchInput = document.querySelector('input[type="search"]');
const dropdown = document.getElementById("searchDropdown");

const resultSection = document.getElementById("search-results");
const resultContainer = document.getElementById("search-products");

// فتح القائمة
searchInput.addEventListener("focus", () => {
    dropdown.style.display = "block";
});

// غلق القائمة
document.addEventListener("click", (e) => {

    if (
        !e.target.closest(".search-box") &&
        !e.target.closest(".search-dropdown")
    ) {
        dropdown.style.display = "none";
    }

});

// عرض منتجات القسم
function showCategoryProducts(category) {

    resultContainer.innerHTML = "";

    const section = document.querySelector(
        `.swiper[data-category="${category}"]`
    );

    if (!section) {
        console.log("Section not found:", category);
        return;
    }

    const products = section.querySelectorAll(".product");

    console.log("Found Products:", products.length);

    products.forEach(product => {

        const clone = product.cloneNode(true);

        clone.classList.remove("swiper-slide");

        resultContainer.appendChild(clone);

    });

    resultSection.style.display = "block";

    resultSection.scrollIntoView({
        behavior: "smooth"
    });
}

// فلترة داخل النتائج
searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const products = resultContainer.querySelectorAll(".product");

    products.forEach(product => {

        const name = product
            .querySelector(".name_product")
            .textContent
            .toLowerCase();

        product.style.display =
            name.includes(value)
                ? "block"
                : "none";

    });

});

// الضغط على عناصر القائمة
document.querySelectorAll(".search-item").forEach(item => {

    item.addEventListener("click", () => {

        dropdown.style.display = "none";

        searchInput.value = "";

        showCategoryProducts(
            item.dataset.target
        );

    });

});