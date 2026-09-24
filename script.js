// ============================================================
// PRODUCT DATA
// ------------------------------------------------------------
// TEMPORARY PLACEHOLDER DATA — replace product names, prices,
// descriptions and images with real Peace Nature Empire catalog
// data before launch.
//
// SUPABASE INTEGRATION POINT:
// This PRODUCTS array is shaped to mirror a future `products`
// table (id, name, category, price, lengths, desc, img). When
// Supabase is wired up, replace this hardcoded array with a
// fetch from Supabase, e.g.:
//   const { data: PRODUCTS } = await supabase.from('products').select('*');
// Keep the same field names below so the rest of the app (grid
// rendering, cart, modal) does not need to change.
// ============================================================
const PRODUCTS = [
  {
    id: 'bw22',
    name: 'Body Wave Wig',
    category: 'Body Wave',
    price: 185000,
    lengths: ['18"', '22"', '26"'],
    desc: 'Soft, bouncy waves that move naturally. Our most requested everyday texture — pre-plucked hairline, glueless-ready cap.',
    img: './images/img1.jpeg'
  },
  {
    id: 'bs20',
    name: 'Bone Straight Wig',
    category: 'Straight',
    price: 165000,
    lengths: ['16"', '20"', '24"'],
    desc: 'Sleek, pin-straight strands with a glass-like finish. Holds its shape through Lagos humidity with minimal styling.',
    img: './images/img3.jpeg'
  },
  {
    id: 'ww18',
    name: 'Water Wave Wig',
    category: 'Curly',
    price: 175000,
    lengths: ['16"', '20"', '24"'],
    desc: 'Loose, wet-look curls for a low-maintenance, everyday-glam finish. Bounces back after a quick refresh.',
    img: './images/img4.jpeg'
  },
  {
    id: 'hd24',
    name: 'HD Lace Frontal Wig',
    category: 'Lace',
    price: 245000,
    lengths: ['20"', '24"', '28"'],
    desc: 'Undetectable HD lace that melts into every skin tone. Pre-bleached knots and a natural-looking baby hairline.',
    img: './images/img6.jpeg'
  },
  {
    id: 'dw22',
    name: 'Deep Wave Wig',
    category: 'Deep Wave',
    price: 195000,
    lengths: ['18"', '22"', '26"'],
    desc: 'Rich, defined curls with serious volume. A statement texture for owambe season and special occasions.',
    img: './images/img5.jpeg'
  },
  {
    id: 'bc18',
    name: 'Burmese Curly Wig',
    category: 'Curly',
    price: 210000,
    lengths: ['16"', '18"', '22"'],
    desc: 'Tight, springy curls with exceptional bounce and density. Built for texture that lasts through the week.',
    img: './images/img2.jpeg'
  }
];

// ===== STATE =====
const CART_STORAGE_KEY = 'pne_cart';
let cart = loadCart(); // { key, id, name, price, length, qty, img }
let currentFilter = '';
let currentSearch = '';

const fmt = n => '₦' + n.toLocaleString('en-NG');

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read saved cart:', err);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.warn('Could not save cart:', err);
  }
}

// ===== RENDER PRODUCT GRID =====
const grid = document.getElementById('productGrid');
const noResults = document.getElementById('noResults');

function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    const matchesFilter = currentFilter ? p.category === currentFilter : true;
    const q = currentSearch.trim().toLowerCase();
    const matchesSearch = q
      ? p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      : true;
    return matchesFilter && matchesSearch;
  });
}

function renderGrid() {
  const list = getFilteredProducts();
  noResults.hidden = list.length !== 0;
  grid.innerHTML = list.map(p => `
    <div class="product-card reveal">
      <div class="product-img"><img src="${p.img}" alt="${p.name}"></div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-meta">${p.category} · ${p.lengths[p.lengths.length - 1]} max</p>
        <p class="product-desc">${p.desc}</p>
        <p class="product-price">${fmt(p.price)}</p>
        <div class="product-actions">
          <button class="btn btn-ghost" data-view="${p.id}">View Details</button>
          <button class="btn btn-dark" data-quickadd="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('[data-view]').forEach(btn =>
    btn.addEventListener('click', () => openModal(btn.dataset.view))
  );
  grid.querySelectorAll('[data-quickadd]').forEach(btn =>
    btn.addEventListener('click', () => {
      const p = PRODUCTS.find(x => x.id === btn.dataset.quickadd);
      addToCart(p, p.lengths[0], 1);
    })
  );
  observeReveals();
}
renderGrid();

// ===== SEARCH + FILTER PILLS =====
const productSearch = document.getElementById('productSearch');
const filterPills = document.getElementById('filterPills');

productSearch.addEventListener('input', e => {
  currentSearch = e.target.value;
  renderGrid();
});

filterPills.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    currentFilter = pill.dataset.filter;
    filterPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderGrid();
  });
});

// collection filter links (scroll to shop + apply filter + sync pills)
document.querySelectorAll('.collection-card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    currentFilter = card.dataset.filter;
    filterPills.querySelectorAll('.pill').forEach(p =>
      p.classList.toggle('active', p.dataset.filter === currentFilter)
    );
    renderGrid();
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== PRODUCT MODAL =====
const modalOverlay = document.getElementById('modalOverlay');
const productModal = document.getElementById('productModal');
let modalState = { product: null, length: null, qty: 1 };

function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  modalState = { product: p, length: p.lengths[0], qty: 1 };
  renderModal();
  modalOverlay.classList.add('open');
}

function renderModal() {
  const p = modalState.product;
  productModal.innerHTML = `
    <button class="modal-close" id="modalClose" aria-label="Close">&times;</button>
    <div class="modal-img"><img src="${p.img}" alt="${p.name}"></div>
    <div class="modal-body">
      <h3>${p.name}</h3>
      <p class="modal-price">${fmt(p.price)}</p>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-field">
        <label>Length</label>
        <div class="length-options">
          ${p.lengths.map(l => `<span class="length-opt ${l === modalState.length ? 'active' : ''}" data-length="${l}">${l}</span>`).join('')}
        </div>
      </div>
      <div class="modal-field">
        <label>Quantity</label>
        <div class="modal-qty">
          <button id="qtyMinus" type="button">&minus;</button>
          <span id="qtyVal">${modalState.qty}</span>
          <button id="qtyPlus" type="button">+</button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-gold" id="modalAdd">Add to Cart</button>
      </div>
    </div>
  `;
  productModal.querySelector('#modalClose').addEventListener('click', closeModal);
  productModal.querySelectorAll('.length-opt').forEach(el =>
    el.addEventListener('click', () => { modalState.length = el.dataset.length; renderModal(); })
  );
  productModal.querySelector('#qtyMinus').addEventListener('click', () => {
    modalState.qty = Math.max(1, modalState.qty - 1); renderModal();
  });
  productModal.querySelector('#qtyPlus').addEventListener('click', () => {
    modalState.qty += 1; renderModal();
  });
  productModal.querySelector('#modalAdd').addEventListener('click', () => {
    addToCart(modalState.product, modalState.length, modalState.qty);
    closeModal();
  });
}

function closeModal() { modalOverlay.classList.remove('open'); }
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeCart(); closeMobileMenu(); closeCheckout(); }
});

// ===== CART =====
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');

function addToCart(p, length, qty) {
  const key = p.id + '-' + length;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ key, id: p.id, name: p.name, price: p.price, length, qty, img: p.img });
  }
  saveCart();
  renderCart();
  openCart();
  showToast(`${p.name} added to cart`);
}

function cartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function renderCart() {
  cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty. Start exploring the collection.</p>';
  } else {
    cartItemsEl.innerHTML = cart.map(i => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}">
        <div class="cart-item-info">
          <h4>${i.name}</h4>
          <p class="cart-item-meta">Length: ${i.length}</p>
          <div class="qty-control">
            <button data-dec="${i.key}" type="button">&minus;</button>
            <span>${i.qty}</span>
            <button data-inc="${i.key}" type="button">+</button>
          </div>
          <a class="cart-item-remove" data-remove="${i.key}">Remove</a>
        </div>
        <div class="cart-item-price">${fmt(i.price * i.qty)}</div>
      </div>
    `).join('');
  }
  cartTotalEl.textContent = fmt(cartTotal());

  cartItemsEl.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.inc, 1)));
  cartItemsEl.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.dec, -1)));
  cartItemsEl.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeItem(b.dataset.remove)));
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
}

function removeItem(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
}

function openCart() { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); }
function closeCart() { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); }

document.getElementById('cartToggle').addEventListener('click', () => { renderCart(); openCart(); });
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.getElementById('clearCartBtn').addEventListener('click', () => {
  if (cart.length === 0) return;
  cart = [];
  saveCart();
  renderCart();
  showToast('Cart cleared');
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) { showToast('Your cart is empty'); return; }
  closeCart();
  openCheckout();
});

renderCart();

// ===== CHECKOUT MODAL =====
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutSummary = document.getElementById('checkoutSummary');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutNote = document.getElementById('checkoutNote');
const proceedBtn = document.getElementById('proceedToPaymentBtn');

function renderCheckoutSummary() {
  const rows = cart.map(i => `
    <div class="cs-row"><span>${i.name} (${i.length}) × ${i.qty}</span><span>${fmt(i.price * i.qty)}</span></div>
  `).join('');
  checkoutSummary.innerHTML = rows + `<div class="cs-row cs-total"><span>Total</span><span>${fmt(cartTotal())}</span></div>`;
}

function openCheckout() {
  renderCheckoutSummary();
  checkoutNote.textContent = '';
  checkoutOverlay.classList.add('open');
}
function closeCheckout() { checkoutOverlay.classList.remove('open'); }

document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
checkoutOverlay.addEventListener('click', e => { if (e.target === checkoutOverlay) closeCheckout(); });

function validateCheckoutForm(data) {
  const errors = {};
  if (!data.fullName.trim()) errors.fullName = 'Please enter your full name.';
  if (!data.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.phone.trim()) {
    errors.phone = 'Please enter your phone number.';
  } else if (!/^[0-9+\s-]{7,15}$/.test(data.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!data.address.trim()) errors.address = 'Please enter your delivery address.';
  if (!data.city.trim()) errors.city = 'Please enter your city.';
  if (!data.state.trim()) errors.state = 'Please enter your state.';
  return errors;
}

checkoutForm.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(checkoutForm);
  const data = Object.fromEntries(formData.entries());
  const errors = validateCheckoutForm(data);

  checkoutForm.querySelectorAll('input').forEach(input => input.classList.remove('invalid'));
  checkoutForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');

  const errorKeys = Object.keys(errors);
  if (errorKeys.length > 0) {
    errorKeys.forEach(key => {
      const input = checkoutForm.querySelector(`[name="${key}"]`);
      const errorEl = checkoutForm.querySelector(`[data-error-for="${key}"]`);
      if (input) input.classList.add('invalid');
      if (errorEl) errorEl.textContent = errors[key];
    });
    checkoutNote.textContent = 'Please fix the highlighted fields.';
    return;
  }

  // ============================================================
  // SUPABASE + PAYSTACK INTEGRATION POINT
  // ------------------------------------------------------------
  // Validation has passed. This is where the real order flow
  // should be wired in:
  //
  //   1. Create a pending order in Supabase:
  //        - insert into `orders` (customer info + total + status: 'pending')
  //        - insert matching rows into `order_items` for each cart item
  //   2. Initialize Paystack (Inline/Popup) with:
  //        - amount: cartTotal() * 100  (kobo)
  //        - email: data.email
  //        - reference: the created order's id/reference
  //   3. On Paystack success callback, verify the transaction
  //      server-side, then update the Supabase order status to 'paid'.
  //   4. On failure/close, leave the order as 'pending' or mark
  //      'failed' and let the customer retry.
  //
  // No API keys (public or secret) belong in this file.
  // ============================================================
  console.log('Checkout data ready for order creation:', data, { items: cart, total: cartTotal() });
  checkoutNote.textContent = 'Details captured. Payment integration (Paystack) connects here on the live site.';
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
function closeMobileMenu() { mobileMenu.classList.remove('open'); hamburger.classList.remove('open'); }
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  formNote.textContent = "Thanks — this demo form doesn't submit yet, but on the live site your message lands straight in the inbox.";
  contactForm.reset();
});

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ===== SCROLL REVEAL =====
function observeReveals() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}
document.querySelectorAll('.why-card, .testimonial-card, .about-copy, .about-visual').forEach(el => el.classList.add('reveal'));
observeReveals();