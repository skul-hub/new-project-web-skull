// Script for user-dashboard.html
let cart = [];
let currentUser = null;

window.supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
        window.location.href = 'signin.html';
    } else {
        currentUser = session.user;
        loadProducts();
        loadHistory();
    }
});

async function loadProducts() {
    const { data, error } = await window.supabase.from('products').select('*');
    if (error) {
        console.error('Error loading products:', error);
        return;
    }
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    data.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>Rp ${product.price.toLocaleString()}</p>
            <img src="${product.image}" alt="${product.name}" style="width:150px; height:150px;">
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Tambah ke Cart</button>
            <button onclick="buyNow(${product.id}, '${product.name}', ${product.price})">Buy Sekarang</button>
        `;
        container.appendChild(div);
    });
}

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCartDisplay();
    alert('Ditambahkan ke cart!');
}

function updateCartDisplay() {
    const total = cart.reduce((sum, p) => sum + p.price, 0);
    document.getElementById('cartItems').innerHTML = cart.map(p => `<p>${p.name} - Rp ${p.price.toLocaleString()}</p>`).join('');
    document.getElementById('cartItems').innerHTML += `<p><strong>Total: Rp ${total.toLocaleString()}</strong></p>`;
}

async function buyNow(pId, name, price) {
    const whatsapp = prompt('Masukkan nomor WhatsApp Anda:');
    if (!whatsapp) {
        alert('WhatsApp wajib!');
        return;
    }
    const { error } = await window.supabase.from('orders').insert([{
        product_id: pId,
        user_id: currentUser.id,
        username: currentUser.email,
        whatsapp,
        status: 'pending'
    }]);
    if (error) alert('Error: ' + error.message);
    else {
        alert('Pesanan dibuat! Admin akan hubungi.');
        loadHistory();
    }
}

async function checkout() {
    if (cart.length === 0) return alert('Cart kosong!');
    const whatsapp = prompt('Masukkan nomor WhatsApp Anda:');
    if (!whatsapp) return;
    for (const p of cart) {
        await window.supabase.from('orders').insert([{
            product_id: p.id,
            user_id: currentUser.id,
            username: currentUser.email,
            whatsapp,
            status: 'pending'
        }]);
    }
    cart = [];
    updateCartDisplay();
    alert('Checkout berhasil!');
    loadHistory();
}

async function loadHistory() {
    const { data, error } = await window.supabase.from('orders').select('*').eq('user_id', currentUser.id);
    if (error) {
        console.error('Error loading history:', error);
        return;
    }
    document.getElementById('historyItems').innerHTML = data.map(o => `
        <div class="order">
            <p><strong>Produk ID:</strong> ${o.product_id}</p>
            <p><strong>Status:</strong> ${o.status}</p>
            <p><strong>WhatsApp:</strong> ${o.whatsapp}</p>
        </div>
    `).join('');
}

function showSection(section) {
    ['products', 'cart', 'history'].forEach(s => {
        document.getElementById(s).style.display = (s === section) ? 'block' : 'none';
    });
}

function logout() {
    window.supabase.auth.signOut();
}