// create-admin.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rzvzhnfrogokupuzjipn.supabase.co";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dnpobmZyb2dva3VwdXpqaXBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzM5MDQ1OCwiZXhwIjoyMDcyOTY2NDU4fQ.JPzm5zc9yxbqD_M27MjHcGL4ShlgimpjkMRUf2_RvCc"; // ambil dari Supabase → Project Settings → API → Service Role

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function createAdmin() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: "admin@storeskull.com",
    password: "yoel123pro",
    email_confirm: true
  });

  if (error) {
    console.error("❌ Error membuat admin:", error);
    return;
  }

  console.log("✅ Admin dibuat di auth:", data.user);

  // Insert juga ke tabel public.users dengan role admin
  const { error: dbError } = await supabaseAdmin.from("users").insert([{
    id: data.user.id,
    username: "SuperAdmin",
    whatsapp: "081234567890",
    role: "admin"
  }]);

  if (dbError) {
    console.error("❌ Error insert ke public.users:", dbError);
  } else {
    console.log("✅ Admin ditambahkan ke tabel public.users");
  }
}

createAdmin();
