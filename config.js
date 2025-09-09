// Supabase Config
// Ganti dengan URL Supabase Anda
const supabaseUrl = 'https://grcgachetkbbxgdewcty.supabase.co'; 
// Ganti dengan Anon Key Anda
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyY2dhY2hldGtiYnhnZGV3Y3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzM1MzcsImV4cCI6MjA3MjYwOTUzN30.AxFhUICmyR3IP16Fox9a_7rqu7JCsAQbmB59CR0M-CA'; 

// Inisialisasi Supabase client
window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
