// signin.js
document.getElementById('signinForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });
  if (error) return alert('Login gagal: ' + error.message);

  const { data: userData, error: userError } = await window.supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (userError || !userData) {
    alert('Login berhasil, tapi gagal membaca role.');
    return;
  }

  if (userData.role === 'admin') {
    window.location.href = 'admin-dashboard.html';
  } else {
    window.location.href = 'user-dashboard.html';
  }
});
