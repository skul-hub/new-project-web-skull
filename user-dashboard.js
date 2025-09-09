// Script for user-dashboard.html
let cart = [];
let currentUser = null;

// Fungsi untuk memeriksa autentikasi dan memuat data user
async function checkUserAuth() {
    const { data: { user }, error: authError } = await window.supabase.auth.getUser();

    if (authError || !user) {
        console.error("User not authenticated or error fetching user:", authError);
        window.location.href = 'signin.html'; // Redirect if not logged in
        return;
    }

    // Ambil data profil user dari tabel public.users
    const { data: userData, error: userError } = await window.supabase
        .from('users')
        .select('*') // Ambil semua kolom, termasuk role jika diperlukan di masa depan
        .eq('id', user.id)
        .single();

    if (userError || !userData) {
        console.error("Error fetching user profile:", userError);
        alert('Gagal memuat profil pengguna. Silakan coba login kembali.');
        await window.supabase.auth.signOut(); // Logout jika profil tidak ditemukan
        window.location.href = 'signin.html';
        return;
    }

    currentUser = userData; // Set currentUser dengan data dari tabel public.users
    console.log("User logged in:", currentUser);
    showSection('products'); // Tampilkan bagian produk secara default
}

async function loadProducts() {
    const { data, error } = await window.supabase.from('products').select('*');
    if (error) {
        console.error('Error loading products:', error);
        return;
    }
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    if (data && data.length > 0) {
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
    } else {
        container.innerHTML = '<p>Tidak ada produk yang tersedia.</p>';
    }
}

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCartDisplay();
    alert('Ditambahkan ke cart!');
}

function updateCartDisplay() {
    const total = cart.reduce((sum, p) => sum + p.price, 0);
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Keranjang Anda kosong.</p>';
    } else {
        cart.forEach(p => {
            const itemP = document.createElement('p');
            itemP.textContent = `${p.name} - Rp ${p.price.toLocaleString()}`;
            cartItemsDiv.appendChild(itemP);
        });
        const totalP = document.createElement('p');
        totalP.innerHTML = `<strong>Total: Rp ${total.toLocaleString()}</strong>`;
        cartItemsDiv.appendChild(totalP);
    }
}

async function buyNow(pId, name, price) {
    if (!currentUser) {
        alert('Silakan login untuk melakukan pembelian.');
        window.location.href = 'signin.html';
        return;
    }

    const whatsapp = prompt('Masukkan nomor WhatsApp Anda:');
    if (!whatsapp) {
        alert('Nomor WhatsApp wajib diisi untuk pesanan.');
        return;
    }

    const { error } = await window.supabase.from('orders').insert([{
        product_id: pId,
        user_id: currentUser.id,
        username: currentUser.username, // Gunakan username dari tabel public.users
        whatsapp: whatsapp,
        status: 'pending'
    }]);

    if (error) {
        alert('Error creating order: ' + error.message);
        console.error('Order creation error:', error);
    } else {
        alert('Pesanan dibuat! Admin akan segera menghubungi Anda.');
        loadHistory(); // Muat ulang riwayat setelah pesanan baru dibuat
    }
}

async function checkout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }

    if (!currentUser) {
        alert('Silakan login untuk melakukan checkout.');
        window.location.href = 'signin.html';
        return;
    }

    const whatsapp = prompt('Masukkan nomor WhatsApp Anda:');
    if (!whatsapp) {
        alert('Nomor WhatsApp wajib diisi untuk checkout.');
        return;
    }

    let allOrdersSuccessful = true;
    for (const p of cart) {
        const { error } = await window.supabase.from('orders').insert([{
            product_id: p.id,
            user_id: currentUser.id,
            username: currentUser.username, // Gunakan username dari tabel public.users
            whatsapp: whatsapp,
            status: 'pending'
        }]);
        if (error) {
            console.error('Error inserting order for product ' + p.name + ':', error.message);
            allOrdersSuccessful = false;
            // Lanjutkan meskipun ada error untuk produk lain, atau bisa juga break
        }
    }

    if (allOrdersSuccessful) {
        cart = []; // Kosongkan keranjang
        updateCartDisplay();
        alert('Checkout berhasil! Admin akan segera menghubungi Anda.');
        loadHistory(); // Muat ulang riwayat setelah checkout
    } else {
        alert('Checkout selesai, namun ada beberapa pesanan yang gagal dibuat. Silakan cek riwayat pesanan Anda.');
    }
}

async function loadHistory() {
    if (!currentUser) {
        console.warn("currentUser not set, cannot load history.");
        return;
    }
    const { data, error } = await window.supabase.from('orders').select('*').eq('user_id', currentUser.id);
    if (error) {
        console.error('Error loading history:', error);
        return;
    }
    const historyItemsDiv = document.getElementById('historyItems');
    historyItemsDiv.innerHTML = ''; // Clear previous items

    if (data && data.length > 0) {
        data.forEach(o => {
            const div = document.createElement('div');
            div.className = 'order';
            div.innerHTML = `
                <p><strong>Produk ID:</strong> ${o.product_id}</p>
                <p><strong>Status:</strong> ${o.status}</p>
                <p><strong>WhatsApp:</strong> ${o.whatsapp}</p>
            `;
            historyItemsDiv.appendChild(div);
        });
    } else {
        historyItemsDiv.innerHTML = '<p>Anda belum memiliki riwayat pesanan.</p>';
    }
}

function showSection(section) {
    document.getElementById('products').style.display = 'none';
    document.getElementById('cart').style.display = 'none';
    document.getElementById('history').style.display = 'none';

    document.getElementById(section).style.display = 'block';

    if (section === 'products') {
        loadProducts();
    } else if (section === 'cart') {
        updateCartDisplay();
    } else if (section === 'history') {
        loadHistory();
    }
}

window.onload = () => {
    checkUserAuth(); // Panggil fungsi ini saat halaman dimuat
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
