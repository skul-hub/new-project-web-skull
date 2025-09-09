// signup.js
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const whatsapp = document.getElementById('whatsapp').value;

  // Buat akun auth
  const { data, error } = await window.supabase.auth.signUp({ email, password });
  if (error) return alert('Sign up gagal: ' + error.message);

  if (data.user) {
    // Masukkan data user ke tabel public.users
    const { error: dbError } = await window.supabase.from('users').insert([{
      id: data.user.id,
      username,
      whatsapp,
      role: 'user'
    }]);

    if (dbError) {
      alert('Sign up berhasil, tapi gagal simpan profil: ' + dbError.message);
      return;
    }

    alert('Sign up berhasil! Silakan login.');
    window.location.href = 'signin.html';
  }
});
