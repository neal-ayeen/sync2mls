document.title = 'Property Status - Sync2MLS';
const baseProperties = [
  { name: '14 Montague Terrace', location: 'Brooklyn Heights, NY', status: 'For sale', price: '$1,850,000' },
  { name: '8 Sterling Place', location: 'Park Slope, NY', status: 'For sale', price: '$2,275,000' },
  { name: '75 Berry Street, Unit 4B', location: 'Williamsburg, NY', status: 'Listing', price: '$1,420,000' },
  { name: '51 Conselyea Street', location: 'Williamsburg, NY', status: 'Coming soon', price: '$1,975,000' },
];
const drafts = JSON.parse(localStorage.getItem('listingStudioProperties') || '[]');
const properties = [...baseProperties, ...drafts];
const states = [['For sale', 'forSale', 'forSaleList'], ['Listing', 'listing', 'listingList'], ['Coming soon', 'comingSoon', 'comingSoonList']];
const slug = (value) => value.toLowerCase().replace(' ', '-');
states.forEach(([status, key, listId]) => {
  const matches = properties.filter((property) => property.status === status);
  document.querySelector(`#${key}Count`).textContent = matches.length;
  document.querySelector(`#${key}FolderCount`).textContent = matches.length;
  document.querySelector(`#${listId}`).innerHTML = matches.length ? matches.map((property) => `<button class="property-row" data-name="${property.name}" data-location="${property.location}" type="button"><span class="property-thumb"></span><span><strong>${property.name}</strong><small>${property.location}</small></span><b class="pill ${slug(status)}">${status}</b><em>${property.price}</em></button>`).join('') : '<p>No properties in this folder yet.</p>';
});
const dialog = document.querySelector('#propertyDialog');
document.querySelectorAll('.property-row').forEach((row) => row.addEventListener('click', () => {
  dialog.querySelector('h2').textContent = row.dataset.name;
  dialog.querySelector('h2 + p').textContent = `${row.dataset.location} is ready to review. You can return to the main workspace to update its listing details.`;
  dialog.showModal();
}));
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
const toast = document.querySelector('#toast');
let toastTimer;
const showToast = (message) => { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); };
document.querySelectorAll('.status-card').forEach((card) => card.addEventListener('click', () => {
  const folder = document.querySelector(`.folder.${card.dataset.folder}`);
  folder.open = true; folder.scrollIntoView({ behavior: 'smooth', block: 'center' }); showToast(`${card.querySelector('span').textContent} folder opened`);
}));
document.querySelectorAll('[data-toast]').forEach((control) => control.addEventListener('click', () => showToast(control.dataset.toast)));
document.querySelectorAll('.folder summary').forEach((summary) => summary.addEventListener('click', () => {
  const name = summary.querySelector('h2').textContent.trim(); setTimeout(() => showToast(`${name} folder ${summary.parentElement.open ? 'opened' : 'closed'}`), 0);
}));
