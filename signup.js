// Script for signup.html
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const whatsapp = document.getElementById('whatsapp').value;

    // Sign up user with Supabase Auth
    const { data, error: authError } = await window.supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: username,
                whatsapp: whatsapp
            }
        }
    });

    if (authError) {
        alert('Sign up gagal: ' + authError.message);
        console.error('Sign up auth error:', authError); // For debugging
    } else if (data.user) {
        // If user is created successfully in auth, then insert into 'users' table
        // Note: Supabase's signUp can automatically insert user metadata if configured,
        // but explicitly inserting into a 'users' table is also common.
        // Ensure your 'users' table has 'id' column linked to auth.users.id
        const { error: dbError } = await window.supabase.from('users').insert([{
            id: data.user.id, // Use the user ID from Supabase Auth
            username: username,
            whatsapp: whatsapp
        }]);

        if (dbError) {
            alert('Sign up berhasil, tapi gagal menyimpan data profil: ' + dbError.message);
            console.error('Sign up DB insert error:', dbError); // For debugging
            // Consider logging out the user if profile data couldn't be saved
            await window.supabase.auth.signOut();
        } else {
            alert('Sign up berhasil! Cek email Anda untuk konfirmasi.');
            window.location.href = 'signin.html'; // Redirect to signin page after successful signup
        }
    } else {
        // This case might happen if there's no authError but also no user data (e.g., email already exists)
        alert('Sign up gagal: Email mungkin sudah terdaftar atau ada masalah lain.');
    }
});
