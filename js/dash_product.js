
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWVmZTE1ZjYxMTQyODlmMmVhNDY2YjgiLCJpYXQiOjE3ODE3MTQ2ODAsImV4cCI6MTc4OTQ5MDY4MH0.4xbT4TfjlQm9FVy6ixKurLnA-kVmxjtKjM18p7OFWJQ';
const BASE_URL = "https://project-amber-psi-97.vercel.app/products";
const CAT_URL = "https://project-amber-psi-97.vercel.app/categories";

let editMode = false;
let currentProductId = null;

// LOAD DATA ON START
window.onload = () => {
    loadProducts();
    loadCategories(); 
};

// 1. GET ALL CATEGORIES (لربط الاسم بالـ ID)
async function loadCategories() {
    try {
        const res = await fetch(CAT_URL);
        const data = await res.json();
        const categorySelect = document.getElementById("category");       
        const categories = data.data || data; 

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat._id;   // الـ ID الذي يرسل للباك إيند
            option.textContent = cat.name; // الاسم الذي يظهر للمستخدم
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

// 2. CREATE / UPDATE PRODUCT
document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title.value.trim());
    formData.append("slug", slug.value.trim());
    formData.append("description", description.value.trim());
    formData.append("category", category.value); 
    formData.append("quantity", quantity.value);
    formData.append("price", price.value);

    if (imageCover.files[0]) formData.append("imageCover", imageCover.files[0]);
    for (let file of images.files) {
        formData.append("images", file);
    }

    const url = editMode ? `${BASE_URL}/${currentProductId}` : BASE_URL;
    const method = editMode ? "PUT" : "POST";

    const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });

    const data = await res.json();

    if (res.ok) {
        formResult.className = "success";
        formResult.innerText = editMode ? "Updated ✅" : "Added ✅";
        productForm.reset();
        editMode = false;
        currentProductId = null;
        formTitle.innerText = "➕ Add Product";
        loadProducts();
    } else {
        formResult.className = "error";
        formResult.innerText = data.message;
    }
});

// 3. LOAD ALL PRODUCTS INTO TABLE
async function loadProducts() {
    loading.style.display = "block";
    productsTable.style.display = "none";

    const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    loading.style.display = "none";
    productsBody.innerHTML = "";

    data.data.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${p.imageCover}" width="50"></td>
            <td>${p.title}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
            <td>${p.category?.name || "-"}</td>
            <td>
                <button onclick="editProduct('${p._id}')">✏️</button>
                <button onclick="removeProduct('${p._id}')">🗑</button>
            </td>`;
        productsBody.appendChild(row);
    });

    productsTable.style.display = "table";
}

// 4. EDIT PRODUCT (FETCH ONE)
async function editProduct(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const p = data.data;

    title.value = p.title;
    // slug.value = p.slug || "";
    description.value = p.description || "";
    category.value = p.category?._id || ""; // اختيار الكاتيجوري الصحيح تلقائياً
    quantity.value = p.quantity;
    price.value = p.price;

    editMode = true;
    currentProductId = id;
    formTitle.innerText = "✏️ Update Product";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// 5. DELETE PRODUCT
async function removeProduct(id) {
    if (!confirm("Delete?")) return;

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 204 || res.ok) loadProducts();
    //اااااا
}