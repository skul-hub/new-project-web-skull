// Script for signup.html
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const whatsapp = document.getElementById('whatsapp').value;

    const { user, error } = await window.supabase.auth.signUp({ email, password });
    if (error) alert('Sign up gagal: ' + error.message);
    else {
        await window.supabase.from('users').insert([{ id: user.id, username, whatsapp }]);
        alert('Sign up berhasil! Cek email untuk konfirmasi.');
        window.location.href = 'signin.html';
    }
});