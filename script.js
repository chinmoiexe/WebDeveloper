// Shared script for ShopNow: theme toggle, products, cart, search, navigation
const PRODUCTS = [
  {id:1,name:'Smartphone',price:15999,category:'electronics',rating:4,img:'assets/products/smartphone.jpg',desc:'High-performance smartphone with crisp display.'},
  {id:2,name:'Laptop',price:52999,category:'electronics',rating:5,img:'assets/products/laptop.jpg',desc:'Powerful laptop for work and play.'},
  {id:3,name:'Headphones',price:2499,category:'electronics',rating:4,img:'assets/products/headphones.jpg',desc:'Noise-cancelling over-ear headphones.'},
  {id:4,name:'Smartwatch',price:6999,category:'electronics',rating:4,img:'assets/products/smartwatch.jpg',desc:'Health tracking and notifications.'},
  {id:5,name:'Camera',price:22999,category:'electronics',rating:5,img:'assets/products/camera.jpg',desc:'DSLR-quality images in a compact body.'},
  {id:6,name:'Jacket',price:3499,category:'fashion',rating:4,img:'assets/products/jacket.jpg',desc:'Premium leather-look jacket.'},
  {id:7,name:'Running Shoes',price:2599,category:'fashion',rating:4,img:'assets/products/shoes.jpg',desc:'Comfortable shoes for daily runs.'},
  {id:8,name:'Backpack',price:899,category:'accessories',rating:4,img:'assets/products/backpack.jpg',desc:'Durable backpack with laptop sleeve.'},
  {id:9,name:'Cookware Set',price:3199,category:'home',rating:4,img:'assets/products/cookware.jpg',desc:'5-piece set for everyday cooking.'},
  {id:10,name:'Novel Book',price:499,category:'books',rating:5,img:'assets/products/book.jpg',desc:'Bestselling gripping novel.'}
];

// THEME HANDLING
const root = document.documentElement;
const storedTheme = localStorage.getItem('shop_theme');
if(storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);
function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? '' : 'dark';
  if(next) document.documentElement.setAttribute('data-theme', next); else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('shop_theme', next);
  updateThemeButton();
}
function updateThemeButton(){
  const btn = document.getElementById('themeToggle');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = isDark ? '🌞 Light' : '🌙 Dark';
  btn.setAttribute('aria-pressed', isDark);
}

// SEARCH, NAV, and PRODUCT RENDER
function el(id){return document.getElementById(id)}
function formatPrice(n){return '₹'+n.toLocaleString()}

function renderGrid(list, containerId){
  const container = el(containerId);
  container.innerHTML = list.map(p=>`
    <div class="card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">${formatPrice(p.price)}</div>
      <div style="color:#ff9900">${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn" data-id="${p.id}" aria-label="Add ${p.name} to cart">Add</button>
        <button class="btn" data-view="${p.id}">View</button>
      </div>
    </div>
  `).join('');
}

// ROW POPULATE
function populateRow(containerId, list){
  const cont = el(containerId);
  cont.innerHTML = list.map(p=>`
    <div class="row-card">
      <img src="${p.img}" alt="${p.name}">
      <div style="font-weight:700;margin-top:6px">${p.name}</div>
      <div style="color:#b12704;font-weight:800">${formatPrice(p.price)}</div>
      <div style="color:var(--accent)">${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</div>
      <button class="btn" data-id="${p.id}" style="margin-top:8px">Add</button>
    </div>
  `).join('');
}

// CART
let CART = JSON.parse(localStorage.getItem('shop_cart')||'[]');
function saveCart(){ localStorage.setItem('shop_cart', JSON.stringify(CART)); }
function renderCart(){
  const elCart = el('cartItems');
  if(!elCart) return;
  if(CART.length===0){ elCart.innerHTML = '<div style="color:var(--muted)">Your cart is empty</div>'; el('cartTotal').textContent = 'Total: ₹0'; el('cartBadge').textContent='0'; return; }
  elCart.innerHTML = CART.map(i=>`
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}">
      <div style="flex:1">
        <div style="font-weight:700">${i.name}</div>
        <div style="color:var(--muted)">${formatPrice(i.price)} x ${i.qty}</div>
        <div style="display:flex;gap:8px;margin-top:6px">
          <button data-change="-1" data-id="${i.id}">-</button>
          <div>${i.qty}</div>
          <button data-change="+1" data-id="${i.id}">+</button>
          <button data-remove="${i.id}">Remove</button>
        </div>
      </div>
      <div style="font-weight:800">${formatPrice(i.price * i.qty)}</div>
    </div>
  `).join('');
  el('cartTotal').textContent = 'Total: ' + formatPrice(CART.reduce((s,i)=>s+i.price*i.qty,0));
  el('cartBadge').textContent = CART.reduce((s,i)=>s+i.qty,0);
}

function addToCartId(id, qty=1){ const p = PRODUCTS.find(x=>x.id==id); const ex = CART.find(i=>i.id==id); if(ex) ex.qty+=qty; else CART.push({...p, qty}); saveCart(); renderCart(); openCart(); }

// UI EVENTS (delegated)
document.addEventListener('click', (e)=>{
  if(e.target.matches('[data-id]')){ const id = +e.target.getAttribute('data-id'); addToCartId(id); }
  if(e.target.matches('[data-view]')){ const id = +e.target.getAttribute('data-view'); openQuickView(id); }
  if(e.target.matches('[data-remove]')){ const id=+e.target.getAttribute('data-remove'); CART=CART.filter(i=>i.id!==id); saveCart(); renderCart(); }
  if(e.target.matches('[data-change]')){ const id=+e.target.getAttribute('data-id'); const delta = +e.target.getAttribute('data-change'); const it = CART.find(i=>i.id==id); if(it){ it.qty = Math.max(0, it.qty + delta); if(it.qty===0) CART=CART.filter(x=>x.id!==id); saveCart(); renderCart(); } }
  if(e.target.id==='themeToggle') toggleTheme();
  if(e.target.id==='openCartBtn') { openCart(); }
  if(e.target.id==='closeCart') closeCart();
});

// CART sidebar open/close
function openCart(){ const sidebar=el('cartSidebar'); sidebar.classList.add('open'); sidebar.setAttribute('aria-hidden','false'); el('openCartBtn').setAttribute('aria-expanded','true'); }
function closeCart(){ const sidebar=el('cartSidebar'); sidebar.classList.remove('open'); sidebar.setAttribute('aria-hidden','true'); el('openCartBtn').setAttribute('aria-expanded','false'); }

// QUICK VIEW modal
function openQuickView(id){
  const p = PRODUCTS.find(x=>x.id==id);
  const modal = document.createElement('div'); modal.className='modal-backdrop'; modal.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="btn" onclick="this.closest('.modal-backdrop').remove()" style="float:right">Close</button>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <img src="${p.img}" alt="${p.name}" style="width:320px;height:240px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <h2>${p.name}</h2>
          <div style="font-weight:800;color:#b12704">${formatPrice(p.price)}</div>
          <div style="color:var(--accent)">${'★'.repeat(p.rating)}</div>
          <p style="color:var(--muted);margin-top:10px">${p.desc}</p>
          <div style="margin-top:12px;display:flex;gap:8px">
            <button class="btn" data-id="${p.id}">Add to cart</button>
            <button onclick="this.closest('.modal-backdrop').remove()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// SEARCH
function doSearch(q){
  const filtered = PRODUCTS.filter(p=> p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  renderGrid(filtered,'productGrid');
  populateRow('dealsRow', filtered.slice(0,6));
  populateRow('recRow', filtered.slice(2).concat(filtered.slice(0,2)));
  populateRow('bestRow', filtered.slice(1,5));
  el('searchInfo').textContent = filtered.length + ' results';
}

// THEME button label init
document.addEventListener('DOMContentLoaded', ()=>{
  updateThemeButton();
  // initial render
  renderGrid(PRODUCTS,'productGrid');
  populateRow('dealsRow', PRODUCTS.slice(0,6));
  populateRow('recRow', PRODUCTS.slice(2).concat(PRODUCTS.slice(0,2)));
  populateRow('bestRow', PRODUCTS.slice(1,5));
  renderCart();
  // search interactions
  el('searchInput').addEventListener('input', (e)=> doSearch(e.target.value.toLowerCase().trim()));
  el('searchInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter') doSearch(e.target.value.toLowerCase().trim()); });
  // cart button
  el('openCartBtn').addEventListener('click', ()=>{ const sidebar=el('cartSidebar'); sidebar.classList.toggle('open'); });
});