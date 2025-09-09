// Script for signin.html
document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 1. Login via Supabase Auth
    const { data, error } = await window.supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert("Login gagal: " + error.message);
        console.error("Sign in error:", error);
        return;
    }

    // 2. Ambil profil user dari public.users
    const { data: userProfile, error: profileError } = await window.supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

    if (profileError || !userProfile) {
        alert("Gagal memuat profil user.");
        console.error("Profile fetch error:", profileError);
        return;
    }

    // 3. Redirect sesuai role
    if (userProfile.role === "admin") {
        alert("Login berhasil! Selamat datang Admin.");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Login berhasil! Selamat datang " + userProfile.username + ".");
        window.location.href = "user-dashboard.html";
    }
});
