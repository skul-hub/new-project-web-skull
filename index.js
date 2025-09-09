// Script for index.html
function showAuth() {
    window.location.href = 'signin.html';
}

window.onload = () => {
    // Initialize Supabase client if not already done (though config.js should handle this)
    if (!window.supabase) {
        console.error("Supabase client not initialized. Make sure config.js is loaded correctly.");
        // Potentially redirect to a setup page or show an error
        return;
    }

    window.supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session); // For debugging

        if (session) {
            // User is logged in
            // Check if the user is an admin based on stored role
            if (localStorage.getItem('role') === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        } else {
            // User is not logged in or logged out
            // If they were previously an admin, clear the role
            if (localStorage.getItem('role') === 'admin') {
                localStorage.removeItem('role');
            }
            // No redirection here, as this is the public index page
        }
    });

    // Initial check in case the auth state change event doesn't fire immediately on page load
    // This is useful if the user is already logged in and directly types the index.html URL
    window.supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            if (localStorage.getItem('role') === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        }
    }).catch(error => {
        console.error("Error getting session:", error);
    });
};
