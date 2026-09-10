// ===== PRODUCT DATA =====
const PRODUCTS = [
  {
    id: 'bw22',
    name: 'Body Wave Wig',
    category: 'Body Wave',
    price: 185000,
    lengths: ['18"', '22"', '26"'],
    desc: 'Soft, bouncy waves that move naturally. Our most requested everyday texture — pre-plucked hairline, glueless-ready cap.',
    img: 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'bs20',
    name: 'Bone Straight Wig',
    category: 'Straight',
    price: 165000,
    lengths: ['16"', '20"', '24"'],
    desc: 'Sleek, pin-straight strands with a glass-like finish. Holds its shape through Lagos humidity with minimal styling.',
    img: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'ww18',
    name: 'Water Wave Wig',
    category: 'Curly',
    price: 175000,
    lengths: ['16"', '20"', '24"'],
    desc: 'Loose, wet-look curls for a low-maintenance, everyday-glam finish. Bounces back after a quick refresh.',
    img: 'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'hd24',
    name: 'HD Lace Frontal Wig',
    category: 'Lace',
    price: 245000,
    lengths: ['20"', '24"', '28"'],
    desc: 'Undetectable HD lace that melts into every skin tone. Pre-bleached knots and a natural-looking baby hairline.',
    img: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'dw22',
    name: 'Deep Wave Wig',
    category: 'Deep Wave',
    price: 195000,
    lengths: ['18"', '22"', '26"'],
    desc: 'Rich, defined curls with serious volume. A statement texture for owambe season and special occasions.',
    img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 'bc18',
    name: 'Burmese Curly Wig',
    category: 'Curly',
    price: 210000,
    lengths: ['16"', '18"', '22"'],
    desc: 'Tight, springy curls with exceptional bounce and density. Built for texture that lasts through the week.',
    img: 'https://images.unsplash.com/photo-1554519515-242161756769?q=80&w=900&auto=format&fit=crop'
  }
];

// ===== STATE =====
let cart = []; // { id, name, price, length, qty, img }

const fmt = n => '₦' + n.toLocaleString('en-NG');

// ===== RENDER PRODUCT GRID =====
const grid = document.getElementById('productGrid');
function renderGrid(filter) {
  const list = filter ? PRODUCTS.filter(p => p.category === filter) : PRODUCTS;
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

// collection filter links
document.querySelectorAll('.collection-card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    renderGrid(card.dataset.filter);
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
          <button id="qtyMinus">&minus;</button>
          <span id="qtyVal">${modalState.qty}</span>
          <button id="qtyPlus">+</button>
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
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeCart(); closeMobileMenu(); } });

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
  renderCart();
  openCart();
  showToast(`${p.name} added to cart`);
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
            <button data-dec="${i.key}">&minus;</button>
            <span>${i.qty}</span>
            <button data-inc="${i.key}">+</button>
          </div>
          <a class="cart-item-remove" data-remove="${i.key}">Remove</a>
        </div>
        <div class="cart-item-price">${fmt(i.price * i.qty)}</div>
      </div>
    `).join('');
  }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartTotalEl.textContent = fmt(total);

  cartItemsEl.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.inc, 1)));
  cartItemsEl.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.dec, -1)));
  cartItemsEl.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeItem(b.dataset.remove)));
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  renderCart();
}

function removeItem(key) {
  cart = cart.filter(i => i.key !== key);
  renderCart();
}

function openCart() { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); }
function closeCart() { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); }

document.getElementById('cartToggle').addEventListener('click', () => { renderCart(); openCart(); });
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) { showToast('Your cart is empty'); return; }
  showToast('On the live site, this connects to your preferred payment or order system.');
});

renderCart();

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