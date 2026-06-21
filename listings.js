document.title = 'Listings - Sync2MLS';
const baseListings = [
  { name: '14 Montague Terrace', location: 'Brooklyn Heights, NY', status: 'For sale', price: '$1,850,000', facts: '3 beds · 2.5 baths · 1,940 sq ft', image: 'one' },
  { name: '8 Sterling Place', location: 'Park Slope, NY', status: 'For sale', price: '$2,275,000', facts: '4 beds · 3 baths · 2,350 sq ft', image: 'two' },
  { name: '75 Berry Street, Unit 4B', location: 'Williamsburg, NY', status: 'Listing', price: '$1,420,000', facts: '2 beds · 2 baths · 1,280 sq ft', image: 'three' },
  { name: '51 Conselyea Street', location: 'Williamsburg, NY', status: 'Coming soon', price: '$1,975,000', facts: '3 beds · 2 baths · 1,780 sq ft', image: 'one' },
];
const saved = JSON.parse(localStorage.getItem('listingStudioProperties') || '[]').map((item) => ({ ...item, facts: 'Details pending', image: item.image || 'three' }));
let activeFilter = 'all'; let newestFirst = true;
const listings = [...baseListings, ...saved];
const grid = document.querySelector('#listingGrid'); const search = document.querySelector('#searchListings'); const dialog = document.querySelector('#listingDialog'); const toast = document.querySelector('#toast'); let toastTimer;
const showToast = (text) => { toast.textContent = text; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); };
const count = (status) => status === 'all' ? listings.length : listings.filter((item) => item.status === status).length;
document.querySelector('#allCount').textContent = count('all'); document.querySelector('#forSaleCount').textContent = count('For sale'); document.querySelector('#listingCount').textContent = count('Listing'); document.querySelector('#comingSoonCount').textContent = count('Coming soon'); document.querySelector('#listingNavCount').textContent = listings.length;
const render = () => {
  const query = search.value.toLowerCase().trim();
  let filtered = listings.filter((item) => (activeFilter === 'all' || item.status === activeFilter) && `${item.name} ${item.location} ${item.status}`.toLowerCase().includes(query));
  if (!newestFirst) filtered = [...filtered].reverse();
  document.querySelector('#resultCount').textContent = `${filtered.length} listing${filtered.length === 1 ? '' : 's'}`;
  grid.innerHTML = filtered.length ? filtered.map((item) => `<article class="listing-card" data-name="${item.name}"><div class="listing-image ${item.image && item.image.startsWith('data:') ? 'uploaded-image' : item.image}"${item.image && item.image.startsWith('data:') ? ` style="background-image:url('${item.image}')"` : ''}><span class="badge ${item.status.toLowerCase().replace(' ', '-')}">${item.status.toUpperCase()}</span><button class="favorite" aria-label="Save listing">♡</button></div><div class="card-body"><p>${item.location}</p><h2>${item.price}</h2><div class="card-facts">${item.facts}</div></div><footer class="card-footer"><span>Updated today</span><button class="card-menu">•••</button></footer></article>`).join('') : '<p>No listings match your search.</p>';
  grid.querySelectorAll('.listing-card').forEach((card) => card.addEventListener('click', () => openListing(listings.find((item) => item.name === card.dataset.name))));
  grid.querySelectorAll('.favorite').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); button.classList.toggle('saved'); button.textContent = button.classList.contains('saved') ? '♥' : '♡'; showToast(button.classList.contains('saved') ? 'Listing saved' : 'Listing removed from saved'); }));
  grid.querySelectorAll('.card-menu').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); showToast('Listing actions opened'); }));
};
const openListing = (item) => { dialog.querySelector('h2').textContent = item.name; dialog.querySelector('.property-location').textContent = item.location; dialog.querySelector('.property-stats').textContent = `${item.status} · ${item.price} · ${item.facts}`; dialog.showModal(); };
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => { activeFilter = button.dataset.filter; document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button)); render(); }));
search.addEventListener('input', render);
document.querySelector('#sortButton').addEventListener('click', (event) => { newestFirst = !newestFirst; event.currentTarget.textContent = newestFirst ? 'Newest first ⌄' : 'Oldest first ⌃'; render(); });
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.querySelector('.primary-button').addEventListener('click', () => showToast('Listing editor opened from the workspace'));
document.querySelectorAll('[data-toast]').forEach((item) => item.addEventListener('click', () => showToast(item.dataset.toast)));
render();
