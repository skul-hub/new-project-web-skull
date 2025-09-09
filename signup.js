// Script for signup.html
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const whatsapp = document.getElementById('whatsapp').value;

    // 1. Sign up user dengan Supabase Auth
    const { data, error: authError } = await window.supabase.auth.signUp({
        email,
        password
    });

    if (authError) {
        alert('Sign up gagal: ' + authError.message);
        console.error('Sign up auth error:', authError);
        return;
    }

    if (data.user) {
        // 2. Jika user berhasil dibuat di Auth, simpan data profil ke tabel 'public.users'
        const { error: dbError } = await window.supabase.from('users').insert([{
            id: data.user.id, // Gunakan ID user dari Supabase Auth
            username: username,
            whatsapp: whatsapp,
            role: 'user' // Set default role sebagai 'user'
        }]);

        if (dbError) {
            alert('Sign up berhasil, tapi gagal menyimpan data profil: ' + dbError.message);
            console.error('Sign up DB insert error:', dbError);
            // Pertimbangkan untuk menghapus user dari auth jika profil gagal disimpan
            await window.supabase.auth.signOut(); // Logout user yang baru dibuat
        } else {
            alert('Sign up berhasil! Silakan login.');
            window.location.href = 'signin.html'; // Redirect ke signin page setelah successful signup
        }
    } else {
        // Kasus ini mungkin terjadi jika tidak ada authError tapi juga tidak ada data user (misal: email sudah terdaftar)
        alert('Sign up gagal: Email mungkin sudah terdaftar atau ada masalah lain.');
    }
});
