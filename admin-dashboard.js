// Script for admin-dashboard.html
let currentAdminUser = null;

// Fungsi untuk memeriksa role admin saat halaman dimuat
async function checkAdminRole() {
    const { data: { user }, error: authError } = await window.supabase.auth.getUser();

    if (authError || !user) {
        console.error("User not authenticated or error fetching user:", authError);
        window.location.href = 'signin.html'; // Redirect if not logged in
        return;
    }

    const { data: userData, error: userError } = await window.supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (userError || !userData || userData.role !== 'admin') {
        console.error("User is not an admin or error fetching user role:", userError);
        alert('Akses ditolak. Anda bukan admin.');
        window.location.href = 'user-dashboard.html'; // Redirect if not admin
        return;
    }

    currentAdminUser = user; // Set current admin user
    console.log("Admin logged in:", currentAdminUser);
    showSection('products'); // Tampilkan bagian produk secara default
}

document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prodName').value;
    const price = parseInt(document.getElementById('prodPrice').value);
    const image = document.getElementById('prodImage').value;

    const { error } = await window.supabase.from('products').insert([{ name, price, image }]);
    if (error) alert('Error adding product: ' + error.message);
    else {
        alert('Produk ditambahkan!');
        loadProducts();
        document.getElementById('addProductForm').reset();
    }
});

async function loadProducts() {
    const { data, error } = await window.supabase.from('products').select('*');
    if (error) {
        console.error('Error loading products:', error);
        return;
    }
    const list = document.getElementById('productsList');
    list.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(p => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <h3>${p.name}</h3>
                <p>Rp ${p.price.toLocaleString()}</p>
                <img src="${p.image}" alt="${p.name}" style="width:150px; height:150px;">
                <button onclick="deleteProduct(${p.id})">Hapus</button>
            `;
            list.appendChild(div);
        });
    } else {
        list.innerHTML = '<p>Tidak ada produk.</p>';
    }
}

async function deleteProduct(id) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        const { error } = await window.supabase.from('products').delete().eq('id', id);
        if (error) alert('Error deleting product: ' + error.message);
        else {
            alert('Produk dihapus!');
            loadProducts();
        }
    }
}

async function loadOrders() {
    const { data, error } = await window.supabase.from('orders').select('*');
    if (error) {
        console.error('Error loading orders:', error);
        return;
    }
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    if (data && data.length > 0) {
        data.forEach(o => {
            const div = document.createElement('div');
            div.className = 'order';
            div.innerHTML = `
                <p><strong>User:</strong> ${o.username}</p>
                <p><strong>Status:</strong> ${o.status}</p>
                <p><strong>WhatsApp:</strong> ${o.whatsapp}</p>
                <button onclick="updateStatus(${o.id}, 'done')">Selesai</button>
                <button onclick="updateStatus(${o.id}, 'cancelled')">Batalkan</button>
            `;
            ordersList.appendChild(div);
        });
    } else {
        ordersList.innerHTML = '<p>Tidak ada pesanan.</p>';
    }
}

async function updateStatus(id, status) {
    const { error } = await window.supabase.from('orders').update({ status }).eq('id', id);
    if (error) alert('Error updating status: ' + error.message);
    else {
        alert('Status pesanan diperbarui!');
        loadOrders();
    }
}

function showSection(section) {
    document.getElementById('products').style.display = 'none';
    document.getElementById('orders').style.display = 'none';

    document.getElementById(section).style.display = 'block';

    if (section === 'orders') {
        loadOrders();
    } else if (section === 'products') {
        loadProducts();
    }
}

window.onload = () => {
    checkAdminRole(); // Panggil fungsi ini saat halaman dimuat
};

async function logout() {
    const { error } = await window.supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error.message);
        alert('Gagal logout: ' + error.message);
    } else {
        window.location.href = 'signin.html';
    }
}
