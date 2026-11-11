// Farias Pastéis — filtros, busca e navegação mobile
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.product')];
const searchInput = document.querySelector('#search-flavor');
const resultsCount = document.querySelector('#results-count');
const emptyResults = document.querySelector('#empty-results');
let activeCategory = 'todos';

function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function updateMenu() {
  const query = normalize(searchInput.value);
  let visible = 0;
  cards.forEach(card => {
    const matchesCategory = activeCategory === 'todos' || card.dataset.category === activeCategory;
    const matchesSearch = normalize(card.querySelector('h3').textContent).includes(query);
    const show = matchesCategory && matchesSearch;
    card.hidden = !show;
    if (show) visible++;
  });
  resultsCount.textContent = `${visible} ${visible === 1 ? 'sabor encontrado' : 'sabores encontrados'}`;
  emptyResults.hidden = visible !== 0;
}

filterButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.filter;
  filterButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  updateMenu();
}));
searchInput.addEventListener('input', updateMenu);
document.querySelector('#reset-search').addEventListener('click', () => {
  searchInput.value = '';
  filterButtons.find(button => button.dataset.filter === 'todos').click();
  searchInput.focus();
});
updateMenu();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navlinks');
function closeMenu() {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
}
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Esconde o botão flutuante quando o rodapé ou o CTA final estão visíveis.
const floatingOrder = document.querySelector('.floating-order');
const finalSections = document.querySelectorAll('.cta, .footer');
if (floatingOrder && 'IntersectionObserver' in window) {
  const visibleSections = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visibleSections.add(entry.target) : visibleSections.delete(entry.target));
    floatingOrder.classList.toggle('is-hidden', visibleSections.size > 0);
  }, {threshold: 0.12});
  finalSections.forEach(section => observer.observe(section));
}
