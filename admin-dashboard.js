// Script for admin-dashboard.html
if (localStorage.getItem('role') !== 'admin') {
    window.location.href = 'signin.html';
}

document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prodName').value;
    const price = parseInt(document.getElementById('prodPrice').value);
    const image = document.getElementById('prodImage').value;

    const { error } = await window.supabase.from('products').insert([{ name, price, image }]);
    if (error) alert('Error: ' + error.message);
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
    data.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>Rp ${p.price.toLocaleString()}</p>
            <button onclick="deleteProduct(${p.id})">Hapus</button>
        `;
        list.appendChild(div);
    });
}

async function deleteProduct(id) {
    const { error } = await window.supabase.from('products').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else loadProducts();
}

async function loadOrders() {
    const { data, error } = await window.supabase.from('orders').select('*');
    if (error) {
        console.error('Error loading orders:', error);
        return;
    }
    document.getElementById('ordersList').innerHTML = data.map(o => `
        <div class="order">
            <p><strong>User:</strong> ${o.username}</p>
            <p><strong>Status:</strong> ${o.status}</p>
            <p><strong>WhatsApp:</strong> ${o.whatsapp}</p>
            <button onclick="updateStatus(${o.id}, 'done')">Selesai</button>
            <button onclick="updateStatus(${o.id}, 'cancelled')">Batalkan</button>
        </div>
    `).join('');
}

async function updateStatus(id, status) {
    const { error } = await window.supabase.from('orders').update({ status }).eq('id', id);
    if (error) alert('Error: ' + error.message);
    else loadOrders();
}

function showSection(section) {
    // Menyembunyikan semua bagian terlebih dahulu
    document.getElementById('products').style.display = 'none';
    document.getElementById('orders').style.display = 'none';

    // Menampilkan bagian yang dipilih
    document.getElementById(section).style.display = 'block';

    // Memuat data yang relevan saat bagian ditampilkan
    if (section === 'orders') {
        loadOrders();
    } else if (section === 'products') {
        loadProducts();
    }
}

window.onload = () => {
    // Pastikan bagian 'products' ditampilkan secara default saat halaman dimuat
    showSection('products');
};

function logout() {
    localStorage.removeItem('role');
    window.supabase.auth.signOut();
    // Pengalihan ke signin.html akan ditangani oleh onAuthStateChange listener di index.js
}
