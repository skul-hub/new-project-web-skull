// user-dashboard.js
let cart = [];
let currentUser = null;

async function checkUserAuth() {
  const { data: { user }, error } = await window.supabase.auth.getUser();
  if (error || !user) {
    window.location.href = 'signin.html';
    return;
  }

  const { data: userData, error: userError } = await window.supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    alert('Gagal memuat profil, silakan login ulang.');
    await window.supabase.auth.signOut();
    window.location.href = 'signin.html';
    return;
  }

  currentUser = userData;
  showSection('products');
}

async function loadProducts() {
  const { data, error } = await window.supabase.from('products').select('*');
  if (error) return console.error(error);

  const container = document.getElementById('productsContainer');
  container.innerHTML = '';
  if (data && data.length > 0) {
    data.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <h3>${p.name}</h3>
        <p>Rp ${p.price.toLocaleString()}</p>
        <img src="${p.image}" alt="${p.name}" style="width:150px; height:150px;">
        <button onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Tambah ke Cart</button>
        <button onclick="buyNow(${p.id}, '${p.name}', ${p.price})">Buy Sekarang</button>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = '<p>Tidak ada produk.</p>';
  }
}

function addToCart(id, name, price) {
  cart.push({ id, name, price });
  updateCartDisplay();
  alert('Ditambahkan ke cart!');
}

function updateCartDisplay() {
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  const cartDiv = document.getElementById('cartItems');
  cartDiv.innerHTML = '';

  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Keranjang kosong.</p>';
  } else {
    cart.forEach(p => {
      const item = document.createElement('p');
      item.textContent = `${p.name} - Rp ${p.price.toLocaleString()}`;
      cartDiv.appendChild(item);
    });
    cartDiv.innerHTML += `<p><strong>Total: Rp ${total.toLocaleString()}</strong></p>`;
  }
}

async function buyNow(pid, name, price) {
  if (!currentUser) return alert('Silakan login.');
  const whatsapp = prompt('Masukkan nomor WhatsApp:');
  if (!whatsapp) return;

  const { error } = await window.supabase.from('orders').insert([{
    product_id: pid,
    user_id: currentUser.id,
    username: currentUser.username,
    whatsapp,
    status: 'pending'
  }]);
  if (error) return alert('Error: ' + error.message);

  alert('Pesanan dibuat!');
  loadHistory();
}

async function checkout() {
  if (cart.length === 0) return alert('Keranjang kosong!');
  if (!currentUser) return alert('Silakan login.');

  const whatsapp = prompt('Masukkan nomor WhatsApp:');
  if (!whatsapp) return;

  for (const p of cart) {
    await window.supabase.from('orders').insert([{
      product_id: p.id,
      user_id: currentUser.id,
      username: currentUser.username,
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
  if (error) return console.error(error);

  const historyDiv = document.getElementById('historyItems');
  historyDiv.innerHTML = '';
  if (data && data.length > 0) {
    data.forEach(o => {
      const div = document.createElement('div');
      div.className = 'order';
      div.innerHTML = `
        <p>Produk ID: ${o.product_id}</p>
        <p>Status: ${o.status}</p>
        <p>WhatsApp: ${o.whatsapp}</p>
      `;
      historyDiv.appendChild(div);
    });
  } else {
    historyDiv.innerHTML = '<p>Belum ada riwayat pesanan.</p>';
  }
}

function showSection(section) {
  document.getElementById('products').style.display = 'none';
  document.getElementById('cart').style.display = 'none';
  document.getElementById('history').style.display = 'none';
  document.getElementById(section).style.display = 'block';

  if (section === 'products') loadProducts();
  if (section === 'cart') updateCartDisplay();
  if (section === 'history') loadHistory();
}

window.onload = () => {
  checkUserAuth();
};

async function logout() {
  await window.supabase.auth.signOut();
  window.location.href = 'signin.html';
}
