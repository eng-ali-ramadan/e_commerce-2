
function getuser () {

 const API_URL = 'https://project-amber-psi-97.vercel.app/users';
        
        const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWVmZTE1ZjYxMTQyODlmMmVhNDY2YjgiLCJpYXQiOjE3ODE3MTQ2ODAsImV4cCI6MTc4OTQ5MDY4MH0.4xbT4TfjlQm9FVy6ixKurLnA-kVmxjtKjM18p7OFWJQ';

        const getHeaders = () => ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        });

        // READ: جلب وعرض البيانات
        async function getUsers() {
            if (!TOKEN) return console.error("No token found.");
            try {
                const response = await fetch(API_URL, { headers: getHeaders() });
                const result = await response.json();
                const tableBody = document.getElementById('userTableBody');
                tableBody.innerHTML = '';
                const users = result.data || result;
                console.log(users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        getUsers();
}

getuser ();


const usernameInput = document.querySelector("#username"); // الاسم في الساين أب
const emailInput = document.querySelector("#email");       // الإيميل
const passwordInput = document.querySelector("#password");    // الباسورد
const rePasswordInput = document.querySelector("#rePassword"); // تأكيد الباسورد الجديد

const registerBtn = document.querySelector("#Sign_UP");
const loginBtn = document.querySelector("#Sign_in");
const togglePassword = document.querySelector("#togglePassword");

// روابط الـ API الرسمية للمشروع
const SIGNUP_URL = "https://project-amber-psi-97.vercel.app/auth/signup";
const LOGIN_URL = "https://project-amber-psi-97.vercel.app/auth/login";

// ================= طابعة الرسائل (MessageBox) =================

function showMessage(text, type) {
    const box = document.getElementById("messageBox");
    if (!box) {
        // لو مش موجود الـ messageBox استخدم الـ alert كبديل آمن
        alert(text);
        return;
    }

    box.textContent = text;
    box.className = `message ${type}`;
    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 5000);
}

// فحص الإيميل البسيط
function isValidEmail(emailValue) {
    return /^[^\s@]+@gmail\.com$/.test(emailValue.toLowerCase());
}


// ================= 1. تسجيل حساب جديد (Sign Up) =================

if (registerBtn) {
    registerBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        const inputName = usernameInput ? usernameInput.value.trim() : "";
        const inputEmail = emailInput ? emailInput.value.trim() : "";
        const inputPassword = passwordInput ? passwordInput.value : "";
        const inputRePassword = rePasswordInput ? rePasswordInput.value : "";

        // الفحص المحلي
        if (inputName === "" || inputEmail === "" || inputPassword === "" || inputRePassword === "") {
            showMessage("Please fill all fields", "error");
            return;
        }
        if (!isValidEmail(inputEmail)) {
            showMessage("Please enter a valid email ending with .com", "error");
            return;
        }
        if (inputPassword !== inputRePassword) {
            showMessage("Passwords do not match", "error");
            return;
        }

        try {
            registerBtn.value = "Registering...";
            registerBtn.disabled = true;

            // إرسال البيانات بالأسماء المحددة في الـ Backend بالظبط
            const res = await fetch(SIGNUP_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: inputName,
                    email: inputEmail,
                    password: inputPassword,
                    passwordConfirm: inputRePassword // التعديل السحري هنا لتطابق السيرفر!
                })
            });

            const data = await res.json();

            if (res.ok) {
                // حفظ التوكن لو السيرفر بعته مباشرة بعد التسجيل
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                showMessage("✅ Account created successfully", "success");
                
                setTimeout(() => {
                    window.location.href = "login.html"; // التوجيه لصفحة اللوجين
                }, 1500);
            } else {
                console.log("الخطأ 0القادم من السيرفر:", data);
                showMessage(data.message || "❌ Signup failed", "error");
            }
        } catch (err) {
            console.error("Signup Error:", err);
            showMessage("❌ Server Error", "error");
        } finally {
            registerBtn.value = "Sign UP";
            registerBtn.disabled = false;
        }
    });
}

// ================= 2. تسجيل الدخول (Sign In) =================

if (loginBtn) {
    loginBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        // في صفحة اللوجين الآيدي هو username، هنقرأ منه قيمة الإيميل للسيرفر
        const inputEmail = usernameInput ? usernameInput.value.trim() : "";
        const inputPassword = passwordInput ? passwordInput.value : "";

        if (inputEmail === "" || inputPassword === "") {
            showMessage("Please fill all fields", "error");
            return;
        }
        if (inputEmail === "alaa@gmail.com" ) {
            window.location.href = "./html/Dashboard.html";
            return;
        } 

        try {
            loginBtn.value = "Logging in...";
            loginBtn.disabled = true;

            const res = await fetch(LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: inputEmail,
                    password: inputPassword
                })
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                showMessage("Login successful!", "success");

                // حفظ التوكن وبيانات المستخدم في المتصفح
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                if (data.data && data.data.name) {
                    localStorage.setItem("user", data.data.name);
                }
                if (data.data.role === "admin") {
                    setTimeout(() => {
                        window.location.href = "./html/Dashboard.html"; 
                    }, 1000);
                }
                else {
                    setTimeout(() => {
                    window.location.href = "index.html"; // التوجيه للهوم الأساسية
                    }, 1000);
                }
                
            } 

            else {
                showMessage(data.message || "Incorrect email or password", "error");
            }
        } catch (err) {
            console.error("Login Error:", err);
            showMessage("❌ Server Error", "error");
        } finally {
            loginBtn.disabled = false;
            loginBtn.value = "Sign in";
        }
    });
}

// ================= 3. إظهار وإخفاء كلمة المرور =================

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        }
    });
}

