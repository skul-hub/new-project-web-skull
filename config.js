// config.js
const supabaseUrl = 'https://rzvzhnfrogokupuzjipn.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dnpobmZyb2dva3VwdXpqaXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTA0NTgsImV4cCI6MjA3Mjk2NjQ1OH0.96nUsNHnIH3wUGkDFvUwgOEeoqEBY13y6jk97wVRG0o'; // ganti dengan anon key dari Supabase

const { createClient } = supabase;
window.supabase = createClient(supabaseUrl, supabaseKey);

