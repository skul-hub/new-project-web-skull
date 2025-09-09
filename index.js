// Script for index.html
function showAuth() {
    window.location.href = 'signin.html';
}

window.onload = async () => {
    if (!window.supabase) {
        console.error("Supabase client not initialized. Make sure config.js is loaded correctly.");
        return;
    }

    // Cek status autentikasi saat halaman dimuat
    const { data: { user }, error: authError } = await window.supabase.auth.getUser();

    if (authError) {
        console.error("Error getting user session:", authError);
        // Biarkan di halaman index jika ada error atau tidak ada user
        return;
    }

    if (user) {
        // Jika user login, cek rolenya dari tabel public.users
        const { data: userData, error: userError } = await window.supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (userError) {
            console.error("Error fetching user role:", userError);
            // Biarkan di halaman index atau redirect ke signin jika data user tidak ditemukan
            window.location.href = 'signin.html';
            return;
        }

        if (userData && userData.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'user-dashboard.html';
        }
    }
    // Jika tidak ada user, tetap di halaman index
};
