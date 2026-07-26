const API = "https://project-amber-psi-97.vercel.app/categories";
// تثبيت التوكن هنا
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWVmZTE1ZjYxMTQyODlmMmVhNDY2YjgiLCJpYXQiOjE3ODE3MTQ2ODAsImV4cCI6MTc4OTQ5MDY4MH0.4xbT4TfjlQm9FVy6ixKurLnA-kVmxjtKjM18p7OFWJQ";

// =======================
// GET ALL
// =======================
async function getAllCategories() {
    try {
        const res = await fetch(API, {
            headers: {
                "Authorization": `Bearer ${TOKEN}` // إضافة التوكن لحماية الـ GET إذا تطلب الأمر
            }
        });
        const result = await res.json();

        const categories = result.data || result;

        displayCategories(categories);
        displayNavCategories(categories);

    } catch (error) {
        console.error("Error:", error);
    }
}

// =======================
// DISPLAY TABLE
// =======================
function displayCategories(categories) {
    const table = document.getElementById("categoriesTable");

    if (!table) return;

    if (!categories || categories.length === 0) {
        table.innerHTML = "<tr><td colspan='3'>No Data</td></tr>";
        return;
    }

    let html = "";

    categories.forEach(cat => {
        html += `
            <tr>
                <td>${cat._id || cat.id}</td>
                <td>${cat.name}</td>
                <td>
                    <button onclick="editPrompt('${cat._id || cat.id}')">Edit</button>
                    <button onclick="deleteCategory('${cat._id || cat.id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    table.innerHTML = html;
}

// =======================
// NAVBAR
// =======================
function displayNavCategories(categories) {
    const list = document.getElementById("categoryList");

    if (!list) return;

    list.innerHTML = "";

    categories.forEach(cat => {
        list.innerHTML += `
            <a href="#">${cat.name}</a>
        `;
    });
}

// =======================
// CREATE
// =======================
async function createCategory() {
    const name = document.getElementById("catName").value;

    if (!name) return alert("Enter name");

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}` // إرسال التوكن مع الـ POST
            },
            body: JSON.stringify({ name })
        });

        if (!res.ok) throw new Error();

        document.getElementById("catName").value = "";
        getAllCategories();

    } catch {
        alert("Error creating category");
    }
}

// =======================
// DELETE
// =======================
async function deleteCategory(id) {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${TOKEN}` // إرسال التوكن مع الـ DELETE
            }
        });

        if (!res.ok) throw new Error();

        getAllCategories();

    } catch {
        alert("Error deleting");
    }
}

// =======================
// UPDATE
// =======================
async function updateCategory(id, newName) {
    try {
        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}` // إرسال التوكن مع الـ PUT
            },
            body: JSON.stringify({ name: newName })
        });

        if (!res.ok) throw new Error();

        getAllCategories();

    } catch {
        alert("Error updating");
    }
}

// =======================
// EDIT
// =======================
function editPrompt(id) {
    const newName = prompt("Enter new name:");

    if (newName) {
        updateCategory(id, newName);
    }
}

// =======================
// GET BY ID
// =======================
async function getCategoryById() {
    const id = document.getElementById("catId").value;

    if (!id) return alert("Enter ID");

    try {
        const res = await fetch(`${API}/${id}`, {
            headers: {
                "Authorization": `Bearer ${TOKEN}` // إرسال التوكن هنا أيضًا
            }
        });
        const result = await res.json();

        const category = result.data || result;

        displayCategories([category]);

    } catch {
        alert("Not found");
    }
}

getAllCategories();