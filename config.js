// Supabase Config
// Ganti dengan URL Supabase Anda
const supabaseUrl = 'https://dvnfqoektrgarlplkkaj.supabase.co'; 
// Ganti dengan Anon Key Anda
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2bmZxb2VrdHJnYXJscGxra2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDI2MzksImV4cCI6MjA3MjY3ODYzOX0.c_T4297HqKGo3KZYvWM6qXkiw4saE548Cp-UH7qZ7Ts'; 

// Inisialisasi Supabase client
window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

