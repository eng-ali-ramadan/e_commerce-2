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

                users.forEach(user => {
                    const row = `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td><span class="role-badge">${user.role}</span></td>
                            <td class="action-btns">
                                <i class="fas fa-trash delete-btn" onclick="deleteUser('${user._id}')" title="Delete User"></i>
                            </td>
                        </tr>`;
                    tableBody.innerHTML += row;
                });
            } catch (error) { console.error('Error fetching users:', error); }
        }

        // CREATE: إضافة مستخدم جديد
        document.getElementById('userForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const userData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                passwordConfirm: document.getElementById('passwordConfirm').value,
                role: document.getElementById('role').value
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    alert('User Created Successfully!');
                    document.getElementById('userForm').reset();
                    getUsers(); // تحديث الجدول فوراً
                } else {
                    const err = await response.json();
                    alert('Error: ' + err.message);
                }
            } catch (error) { console.error('Error creating user:', error); }
        });

        // DELETE: مسح مستخدم/
        async function deleteUser(userId) {
            if (confirm('Are you sure you want to delete this user?')) {
                try {
                    const response = await fetch(`${API_URL}/${userId}`, { 
                        method: 'DELETE', 
                        headers: getHeaders() 
                    });
                    
                    if (response.ok) { 
                        alert('User Deleted!'); 
                        getUsers(); // تحديث الجدول فوراً
                    } else {
                        alert('Failed to delete user.');
                    }
                } catch (error) { console.error('Error deleting user:', error); }
            }
        }

        window.onload = getUsers;