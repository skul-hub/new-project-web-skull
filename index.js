// Script for index.html
function showAuth() {
    window.location.href = 'signin.html';
}

window.onload = () => {
    window.supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            window.location.href = 'user-dashboard.html';
        } else if (localStorage.getItem('role') === 'admin') {
            window.location.href = 'admin-dashboard.html';
        }
    });
};