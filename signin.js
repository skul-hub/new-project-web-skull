// Script for signin.html
document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert('Login gagal: ' + error.message);
        console.error('Login error:', error);
    } else if (data.user) {
        // Setelah berhasil login, cek role user dari tabel public.users
        const { data: userData, error: userError } = await window.supabase
            .from('users')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (userError) {
            alert('Login berhasil, tapi gagal mendapatkan role user: ' + userError.message);
            console.error('Error fetching user role:', userError);
            // Opsional: logout user jika role tidak bisa didapatkan
            await window.supabase.auth.signOut();
            return;
        }

        if (userData && userData.role === 'admin') {
            alert('Login Admin Berhasil!');
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Login Berhasil!');
            window.location.href = 'user-dashboard.html';
        }
    } else {
        alert('Login gagal: Tidak ada data pengguna atau email belum dikonfirmasi.');
    }
});
