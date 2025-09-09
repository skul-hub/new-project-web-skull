// Script for signup.html
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const whatsapp = document.getElementById('whatsapp').value;

    // 1. Sign up user ke Supabase Auth
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
        // 2. Simpan profil ke tabel public.users
        const { error: dbError } = await window.supabase.from('users').insert([{
            id: data.user.id,
            username: username,
            whatsapp: whatsapp,
            role: 'user'
        }]);

        if (dbError) {
            alert('Sign up berhasil, tapi gagal menyimpan profil: ' + dbError.message);
            console.error('Sign up DB insert error:', dbError);
            await window.supabase.auth.signOut(); // logout supaya tidak nyangkut
            return;
        }

        // 3. Tangani konfirmasi email
        if (!data.user.confirmed_at) {
            alert('Sign up berhasil! Silakan cek email Anda untuk konfirmasi sebelum login.');
            // Tetap redirect ke signin agar user bisa login setelah confirm email
            window.location.href = 'signin.html';
        } else {
            alert('Sign up berhasil! Anda bisa langsung login.');
            window.location.href = 'signin.html';
        }
    } else {
        alert('Sign up gagal: Email mungkin sudah terdaftar atau ada masalah lain.');
    }
});
