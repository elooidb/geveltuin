const DATA_ROOT = './data/';
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID';

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

$('.nav-toggle').addEventListener('click', e => {
  const nav = $('#nav');
  const open = nav.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', open);
});

async function loadJSON(path){ const res = await fetch(DATA_ROOT + path); if(!res.ok) throw new Error(path); return res.json(); }

function setSiteContent(site){
  $$('[data-site]').forEach(el => { const key = el.dataset.site; if(site[key]) el.textContent = site[key]; });
}

function renderOffers(offers){
  $('#offers').innerHTML = offers.map(o => `<article class="card"><p class="eyebrow">${o.audience}</p><h3>${o.title}</h3><p>${o.description}</p><a href="#contact">Meer info →</a></article>`).join('');
}

function renderFaqs(faqs){
  $('#faqs').innerHTML = faqs.map(f => `<details><summary>${f.question}</summary><p>${f.answer}</p></details>`).join('');
}

function renderProducts(products){
  $('#products').innerHTML = products.map(p => `<article class="product">
    <p class="eyebrow">${p.category}</p>
    <h3>${p.name}</h3>
    <p>${p.description}</p>
    <p class="price">€${Number(p.price).toFixed(2)}</p>
    <button class="btn primary snipcart-add-item"
      data-item-id="${p.id}"
      data-item-price="${p.price}"
      data-item-url="/data/products.json"
      data-item-description="${p.description.replace(/"/g, '&quot;')}"
      data-item-image="${p.image || ''}"
      data-item-name="${p.name.replace(/"/g, '&quot;')}">In winkelmand</button>
  </article>`).join('');
}

Promise.all([loadJSON('site.json'), loadJSON('offers.json'), loadJSON('faqs.json'), loadJSON('products.json')])
  .then(([site, offers, faqs, products]) => { setSiteContent(site); renderOffers(offers); renderFaqs(faqs); renderProducts(products); })
  .catch(err => console.error('Content loading failed:', err));

$('#contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = $('.form-status');
  status.textContent = 'Versturen...';
  try {
    const res = await fetch(FORM_ENDPOINT, { method:'POST', body:new FormData(e.target), headers:{Accept:'application/json'} });
    if(!res.ok) throw new Error('Form endpoint failed');
    status.textContent = 'Bedankt! We nemen snel contact op.';
    e.target.reset();
  } catch {
    status.textContent = 'Formulier nog niet gekoppeld. Mail ons voorlopig rechtstreeks.';
  }
});