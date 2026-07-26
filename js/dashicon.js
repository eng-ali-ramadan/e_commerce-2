// header.js أو main.js

const token = localStorage.getItem("token");
const dashboardLink = document.getElementById("dashboardLink");

// إخفاء الرابط افتراضيًا
if (dashboardLink) {
    dashboardLink.style.display = "none";
}

// لو لا يوجد توكن يبقى المستخدم غير مسجل دخول
if (!token) {
    console.log("No token found");
} else {
    // جلب بيانات المستخدم من قاعدة البيانات
    fetch("https://project-amber-psi-97.vercel.app/users/getMe", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        // لو التوكن غير صالح
        if (!response.ok) {
            throw new Error("Unauthorized");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);

        // حسب شكل الـ API
        const user =
            data.data?.user ||
            data.data;

        // لو المستخدم Admin أظهر الرابط
        if (user && user.role === "admin") {
            dashboardLink.style.display = "block";
        }
    })
    .catch(error => {
        console.error("Error:", error);

        // حذف التوكن لو منتهي أو غير صالح
        localStorage.removeItem("token");
    });
}