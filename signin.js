// Script for signin.html
document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('role', 'admin');
        window.location.href = 'admin-dashboard.html';
        return;
    }

    const { user, error } = await window.supabase.auth.signIn({ email, password });
    if (error) alert('Login gagal: ' + error.message);
    else window.location.href = 'user-dashboard.html';
});