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
        // Refresh session supaya auth.uid() kebaca
        await window.supabase.auth.getSession();

        // 2. Insert profil ke tabel public.users
        const { error: dbError } = await window.supabase.from('users').insert([{
            id: data.user.id,
            username: username,
            whatsapp: whatsapp,
            role: 'user'
        }]);

        if (dbError) {
            alert('Sign up berhasil, tapi gagal simpan profil: ' + dbError.message);
            console.error('DB insert error:', dbError);
            await window.supabase.auth.signOut();
            return;
        }

        // 3. Berhasil
        alert('Sign up berhasil! Silakan login.');
        window.location.href = 'signin.html';
    } else {
        alert('Sign up gagal: Email mungkin sudah terdaftar.');
    }
});
