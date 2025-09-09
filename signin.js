// Script for signin.html
document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Admin login logic
    if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('role', 'admin');
        alert('Login Admin Berhasil!'); // Add alert for clarity
        window.location.href = 'admin-dashboard.html';
        return; // Stop further execution for admin login
    }

    // Regular user login logic using Supabase
    const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert('Login gagal: ' + error.message);
        console.error('Login error:', error); // For debugging
    } else if (data.user) {
        // Successfully logged in a regular user
        localStorage.removeItem('role'); // Ensure admin role is not set for regular users
        alert('Login Berhasil!'); // Add alert for clarity
        window.location.href = 'user-dashboard.html';
    } else {
        // This case might happen if there's no error but also no user data (e.g., email not confirmed)
        alert('Login gagal: Tidak ada data pengguna atau email belum dikonfirmasi.');
    }
});
