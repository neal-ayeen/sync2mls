const listingModal = document.querySelector('#listingModal');
document.title = 'Sync2MLS — Real estate workspace';
const settingsModal = document.querySelector('#settingsModal');
const sidebar = document.querySelector('.sidebar');
const mobileMenu = document.querySelector('.mobile-menu');
const crumb = document.querySelector('.crumb strong');
const profileMenu = document.querySelector('#profileMenu');
const profilePopover = document.querySelector('#profilePopover');
const toast = document.querySelector('#toast');
let toastTimer;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
};
const closeDialogOnBackdrop = (dialog) => {
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
};
document.querySelector('#newListing').addEventListener('click', () => listingModal.showModal());
closeDialogOnBackdrop(listingModal);
closeDialogOnBackdrop(settingsModal);
document.querySelectorAll('[data-nav]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const view = link.dataset.nav;
    document.querySelectorAll('[data-nav]').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    crumb.textContent = link.textContent.replace(/\d+/g, '').trim();
    if (view === 'settings') { event.preventDefault(); settingsModal.showModal(); }
    if (window.innerWidth <= 760) { sidebar.classList.remove('open'); mobileMenu.setAttribute('aria-expanded', 'false'); }
  });
});
mobileMenu.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  mobileMenu.setAttribute('aria-expanded', String(isOpen));
});
profileMenu.addEventListener('click', () => {
  const isOpen = profilePopover.hasAttribute('hidden');
  profilePopover.toggleAttribute('hidden', !isOpen);
  profileMenu.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('[data-toast]').forEach((button) => button.addEventListener('click', () => {
  profilePopover.setAttribute('hidden', ''); profileMenu.setAttribute('aria-expanded', 'false'); showToast(button.dataset.toast);
}));
document.querySelectorAll('dialog form').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  showToast(form.closest('dialog').id === 'listingModal' ? 'Listing draft saved' : 'Preferences saved');
  form.closest('dialog').close();
}));

let listingStep = 1;
const wizardPages = [...document.querySelectorAll('.wizard-page')];
const wizardLabels = [...document.querySelectorAll('.wizard-steps li')];
const previousStep = document.querySelector('#previousStep');
const nextStep = document.querySelector('#nextStep');
const saveListing = document.querySelector('#saveListing');
const stepNumber = document.querySelector('#stepNumber');
const showListingStep = (step) => {
  listingStep = step;
  wizardPages.forEach((page) => page.classList.toggle('active', Number(page.dataset.step) === step));
  wizardLabels.forEach((label, index) => label.classList.toggle('current', index === step - 1));
  previousStep.hidden = step === 1;
  nextStep.hidden = step === wizardPages.length;
  saveListing.hidden = step !== wizardPages.length;
  stepNumber.textContent = step;
};
const isStepValid = () => {
  const currentPage = wizardPages[listingStep - 1];
  const fields = [...currentPage.querySelectorAll('input[required], select[required], textarea[required]')];
  const invalidField = fields.find((field) => !field.checkValidity());
  if (invalidField) { invalidField.reportValidity(); return false; }
  return true;
};
nextStep.addEventListener('click', () => { if (isStepValid()) showListingStep(listingStep + 1); });
previousStep.addEventListener('click', () => showListingStep(listingStep - 1));
listingModal.addEventListener('close', () => showListingStep(1));

// Make dashboard controls behave like an interactive product prototype.
const propertyPreview = document.createElement('dialog');
propertyPreview.className = 'property-modal';
propertyPreview.innerHTML = '<form method="dialog"><button class="close" aria-label="Close">×</button><p class="eyebrow">LISTING PREVIEW</p><h2></h2><p>Open this listing to review buyer activity, photos, documents, and marketing details.</p><div class="property-actions"><button class="secondary-button" value="close">Close</button><button class="primary-button" value="close">Open listing <span>→</span></button></div></form>';
document.body.append(propertyPreview);
closeDialogOnBackdrop(propertyPreview);

document.querySelectorAll('.property-card').forEach((card) => {
  card.tabIndex = 0;
  const openPreview = () => {
    propertyPreview.querySelector('h2').textContent = card.dataset.property;
    propertyPreview.showModal();
  };
  card.addEventListener('click', openPreview);
  card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') openPreview(); });
});
document.querySelectorAll('.save-button').forEach((button) => button.addEventListener('click', (event) => {
  event.stopPropagation();
  const saved = button.classList.toggle('saved');
  button.textContent = saved ? '♥' : '♡';
  button.setAttribute('aria-label', saved ? 'Remove saved listing' : 'Save listing');
  showToast(saved ? 'Listing saved to your favorites' : 'Listing removed from favorites');
}));
document.querySelectorAll('.more-button').forEach((button) => button.addEventListener('click', (event) => {
  event.stopPropagation(); showToast('Listing actions are ready to use.');
}));
document.querySelectorAll('.attention-list article').forEach((task) => task.addEventListener('click', () => {
  task.classList.toggle('complete');
  showToast(task.classList.contains('complete') ? 'Task marked complete' : 'Task reopened');
}));
document.querySelectorAll('.attention-list button').forEach((button) => button.addEventListener('click', (event) => {
  event.stopPropagation();
  button.closest('article').click();
}));
document.querySelectorAll('.click-card, .help-button, .icon-button, .more, .task-link, .section-heading a').forEach((element) => {
  if (!element.dataset.toast) element.dataset.toast = 'This workspace view is ready to explore.';
  element.addEventListener('click', () => showToast(element.dataset.toast));
});
const periodButton = document.querySelector('.select');
if (periodButton) periodButton.addEventListener('click', () => {
  const periods = ['This week', 'This month', 'This quarter'];
  const next = periods[(periods.indexOf(periodButton.dataset.period || 'This week') + 1) % periods.length];
  periodButton.dataset.period = next; periodButton.textContent = `${next}⌄`; showToast(`Portfolio activity: ${next.toLowerCase()}`);
});
document.querySelectorAll('.next-up article').forEach((eventCard) => eventCard.addEventListener('click', () => showToast(`${eventCard.querySelector('strong').textContent} opened`)));
wizardLabels.forEach((label, index) => {
  label.tabIndex = 0;
  label.addEventListener('click', () => showListingStep(index + 1));
  label.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') showListingStep(index + 1); });
});

// Keep feature details within the Property step, in the same concise field pattern
// as square footage, lot size, and year built.
const propertyFacts = wizardPages[2].querySelector('.form-grid');
const interiorField = [...propertyFacts.querySelectorAll('label')].find((label) => label.textContent.trim().startsWith('Interior features'));
const exteriorField = [...propertyFacts.querySelectorAll('label')].find((label) => label.textContent.trim().startsWith('Exterior features'));
if (interiorField && exteriorField) {
  const details = document.createElement('div');
  details.className = 'feature-details full';
  details.innerHTML = '<span>Feature details</span><p>Add the features buyers use to compare homes.</p>';
  const exterior = document.createElement('label');
  exterior.innerHTML = 'Exterior features<input placeholder="e.g. Pool, patio, views, fencing, landscaping" />';
  const interior = document.createElement('label');
  interior.innerHTML = 'Interior features<input placeholder="e.g. Fireplace, kitchen, appliances, built-ins" />';
  const flooring = document.createElement('label');
  flooring.innerHTML = 'Flooring type<input placeholder="e.g. Hardwood, tile, carpet" />';
  interiorField.replaceWith(details, exterior, interior, flooring);
  exteriorField.remove();
}

// Refine the marketing copy so the property narrative has a clear purpose.
const marketingPage = wizardPages[3];
const marketingHeading = marketingPage.querySelector('h3');
const marketingIntro = marketingPage.querySelector(':scope > p');
const descriptionField = [...marketingPage.querySelectorAll('label')].find((label) => label.textContent.trim().startsWith('Property description'));
if (marketingHeading && marketingIntro && descriptionField) {
  marketingHeading.textContent = 'Media, listing story & contact';
  marketingIntro.textContent = 'Use photos and a clear, accurate description to help buyers understand the home before they visit.';
  descriptionField.innerHTML = 'Listing description <small class="field-help">Lead with the home’s strongest qualities, then cover layout, updates, outdoor space, and location benefits.</small><textarea required placeholder="Example: Sun-filled two-bedroom home with a renovated kitchen, original millwork, private terrace, and easy access to parks, transit, and local dining."></textarea>';
}

const initialProperties = [
  { name: '14 Montague Terrace', location: 'Brooklyn Heights, NY', status: 'For sale', price: '$1,850,000' },
  { name: '8 Sterling Place', location: 'Park Slope, NY', status: 'For sale', price: '$2,275,000' },
  { name: '75 Berry Street, Unit 4B', location: 'Williamsburg, NY', status: 'Listing', price: '$1,420,000' },
  { name: '51 Conselyea Street', location: 'Williamsburg, NY', status: 'Coming soon', price: '$1,975,000' },
];
const savedProperties = () => JSON.parse(localStorage.getItem('listingStudioProperties') || '[]');
const allProperties = () => [...initialProperties, ...savedProperties()];
const calendarModal = document.createElement('dialog');
calendarModal.className = 'calendar-modal';
calendarModal.innerHTML = '<form method="dialog"><button class="close" aria-label="Close">×</button><p class="eyebrow">OCTOBER 2026</p><h2>Your calendar</h2><div class="calendar-grid"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><i></i><i></i><i></i><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b><b>6</b><b>7</b><b>8</b><b>9</b><b>10</b><b>11</b><b>12</b><b>13</b><b>14</b><b>15</b><b>16</b><b>17</b><b>18</b><b>19</b><b>20</b><b>21</b><b class="event-day">23</b><b class="event-day">24</b><b>25</b><b>26</b><b>27</b><b>28</b><b>29</b><b>30</b><b>31</b></div><div class="calendar-events"><button type="button" data-event="Private showing · 14 Montague Terrace · 10:30 AM"><i></i>Private showing <small>Oct 23 · 10:30 AM</small></button><button type="button" data-event="Open house · 8 Sterling Place · 12:00 PM"><i></i>Open house <small>Oct 24 · 12:00 PM</small></button></div></form>';
document.body.append(calendarModal);
closeDialogOnBackdrop(calendarModal);
calendarModal.querySelectorAll('[data-event]').forEach((item) => item.addEventListener('click', () => showToast(item.dataset.event)));

const baseAppointments = [
  { day: 23, title: 'Private showing', time: '10:30 AM', note: '14 Montague Terrace' },
  { day: 24, title: 'Open house', time: '12:00 PM', note: '8 Sterling Place' },
];
const savedAppointments = () => JSON.parse(localStorage.getItem('listingStudioAppointments') || '[]');
const appointmentModal = document.createElement('dialog');
appointmentModal.className = 'appointment-modal';
appointmentModal.innerHTML = '<form id="appointmentForm"><button class="close" type="button" aria-label="Close">×</button><p class="eyebrow">NEW SCHEDULE ITEM</p><h2>Add to calendar</h2><p class="appointment-date"></p><div class="appointment-grid"><label>Title<input name="title" required placeholder="e.g. Client showing" autofocus /></label><label>Time<input name="time" type="time" required /></label><label class="full">Property or location<input name="note" placeholder="e.g. 14 Montague Terrace" /></label><label class="full">Notes<textarea name="notes" placeholder="Optional details, reminders, or attendee notes."></textarea></label></div><button class="primary-button" type="submit">Add schedule <span>→</span></button></form>';
document.body.append(appointmentModal);
closeDialogOnBackdrop(appointmentModal);
let selectedCalendarDay = 1;
const renderCalendarAppointments = () => {
  const appointments = [...baseAppointments, ...savedAppointments()];
  const eventList = calendarModal.querySelector('.calendar-events');
  eventList.innerHTML = appointments.length ? appointments.map((event) => `<button type="button" data-event="${event.title} · Oct ${event.day} · ${event.time}"><i></i>${event.title} <small>Oct ${event.day} · ${event.time}${event.note ? ` · ${event.note}` : ''}</small></button>`).join('') : '<p class="no-events">No scheduled items yet. Choose a date to add one.</p>';
  eventList.querySelectorAll('[data-event]').forEach((item) => item.addEventListener('click', () => showToast(item.dataset.event)));
  calendarModal.querySelectorAll('.calendar-grid b').forEach((date) => {
    const day = Number(date.textContent);
    date.classList.toggle('event-day', appointments.some((event) => Number(event.day) === day));
  });
};
calendarModal.querySelectorAll('.calendar-grid b').forEach((date) => date.addEventListener('click', () => {
  selectedCalendarDay = Number(date.textContent);
  appointmentModal.querySelector('.appointment-date').textContent = `October ${selectedCalendarDay}, 2026`;
  appointmentModal.querySelector('[name="title"]').value = '';
  appointmentModal.querySelector('[name="time"]').value = '';
  appointmentModal.querySelector('[name="note"]').value = '';
  appointmentModal.querySelector('[name="notes"]').value = '';
  appointmentModal.showModal();
}));
appointmentModal.querySelector('#appointmentForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.currentTarget));
  const hours = Number(formData.time.split(':')[0]);
  const minutes = formData.time.split(':')[1];
  const time = `${((hours + 11) % 12) + 1}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
  const appointments = [...savedAppointments(), { day: selectedCalendarDay, title: formData.title, time, note: formData.note, notes: formData.notes }];
  localStorage.setItem('listingStudioAppointments', JSON.stringify(appointments));
  appointmentModal.close();
  renderCalendarAppointments();
  showToast(`Scheduled for October ${selectedCalendarDay}`);
});
renderCalendarAppointments();

const statusModal = document.createElement('dialog');
statusModal.className = 'status-modal';
statusModal.innerHTML = '<form method="dialog"><button class="close" aria-label="Close">×</button><p class="eyebrow">LISTING PORTFOLIO</p><h2>Property status</h2><p class="status-subtitle">Every listing in one place, organized by its current market state.</p><div class="status-summary"></div><div class="status-list"></div></form>';
document.body.append(statusModal);
closeDialogOnBackdrop(statusModal);
const renderStatus = () => {
  const properties = allProperties();
  const counts = ['For sale', 'Listing', 'Coming soon'].map((status) => `${properties.filter((property) => property.status === status).length} ${status}`);
  statusModal.querySelector('.status-summary').innerHTML = counts.map((count) => `<span>${count}</span>`).join('');
  statusModal.querySelector('.status-list').innerHTML = properties.map((property) => `<button type="button" class="status-row"><span><strong>${property.name}</strong><small>${property.location}</small></span><b class="status-pill ${property.status.toLowerCase().replace(' ', '-')}">${property.status}</b><em>${property.price}</em></button>`).join('');
  statusModal.querySelectorAll('.status-row').forEach((row) => row.addEventListener('click', () => showToast(`${row.querySelector('strong').textContent} opened`)));
};
document.querySelector('[data-nav="calendar"]').addEventListener('click', (event) => { event.preventDefault(); calendarModal.showModal(); });
document.querySelector('#listingForm').addEventListener('submit', () => {
  const form = document.querySelector('#listingForm');
  const input = (selector) => form.querySelector(selector);
  const address = input('input[placeholder="e.g. 22 W 11th Street"]')?.value || 'New property draft';
  const city = input('input[placeholder="City"]')?.value || 'Location pending';
  const state = input('input[placeholder="State"]')?.value || '';
  const price = input('input[placeholder="$ 0"]')?.value || 'Price pending';
  const statusValue = [...form.querySelectorAll('select')].find((select) => select.value === 'Coming soon' || select.value === 'Active' || select.value === 'Pending')?.value || 'Active';
  const status = statusValue === 'Coming soon' ? 'Coming soon' : statusValue === 'Active' ? 'Listing' : 'For sale';
  const saveDraft = (image) => {
    const documents = [...form.querySelectorAll('.document-upload input[type="file"]')].flatMap((input) => [...input.files].map((file) => file.name));
    const updated = [...savedProperties(), { name: address, location: `${city}${state ? `, ${state}` : ''}`, status, price, image, documents }];
    localStorage.setItem('listingStudioProperties', JSON.stringify(updated));
  };
  const photo = form.querySelector('.file-field input[type="file"]')?.files[0];
  if (photo) {
    const reader = new FileReader();
    reader.addEventListener('load', () => saveDraft(reader.result));
    reader.readAsDataURL(photo);
  } else {
    saveDraft(null);
  }
});
const listingPhotoInput = document.querySelector('.file-field input[type="file"]');
if (listingPhotoInput) {
  const uploadField = listingPhotoInput.closest('.file-field');
  const hint = uploadField.querySelector('span');
  const previewPanel = document.createElement('div');
  previewPanel.className = 'photo-preview-panel';
  previewPanel.hidden = true;
  uploadField.after(previewPanel);
  const showSelectedPhotos = () => {
    const count = listingPhotoInput.files.length;
    if (!count) {
      hint.innerHTML = 'Choose photos or drag them here <small>JPEG, PNG, or WEBP · up to 50 photos</small>';
      previewPanel.hidden = true;
      return;
    }
    hint.innerHTML = `${count} photo${count === 1 ? '' : 's'} selected <small>These photos will appear with the listing</small>`;
    previewPanel.innerHTML = '';
    [...listingPhotoInput.files].forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const tile = document.createElement('div');
      tile.className = 'asset-tile';
      const thumbnail = document.createElement('button');
      thumbnail.type = 'button'; thumbnail.className = 'asset-thumbnail photo-thumb';
      thumbnail.innerHTML = `<img src="${url}" alt="${file.name}" /><small>${file.name}</small>`;
      thumbnail.addEventListener('click', () => openAssetPreview(url, 'image', file.name));
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'remove-asset'; remove.setAttribute('aria-label', `Remove ${file.name}`); remove.textContent = '×';
      remove.addEventListener('click', (event) => {
        event.stopPropagation();
        const data = new DataTransfer();
        [...listingPhotoInput.files].filter((_, fileIndex) => fileIndex !== index).forEach((item) => data.items.add(item));
        listingPhotoInput.files = data.files;
        showSelectedPhotos();
      });
      tile.append(thumbnail, remove);
      previewPanel.append(tile);
    });
    previewPanel.hidden = false;
  };
  uploadField.addEventListener('click', (event) => {
    if (event.target !== listingPhotoInput) listingPhotoInput.click();
  });
  uploadField.addEventListener('dragover', (event) => { event.preventDefault(); uploadField.classList.add('dragging'); });
  uploadField.addEventListener('dragleave', () => uploadField.classList.remove('dragging'));
  uploadField.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadField.classList.remove('dragging');
    if (event.dataTransfer.files.length) {
      listingPhotoInput.files = event.dataTransfer.files;
      showSelectedPhotos();
    }
  });
  listingPhotoInput.addEventListener('change', showSelectedPhotos);

  const documentField = document.createElement('label');
  documentField.className = 'full file-field document-upload';
  documentField.innerHTML = '<input type="file" accept="application/pdf,.pdf" multiple /><span>Upload documents <small>PDF files only · disclosures, inspection reports, floor plans, and contracts</small></span>';
  previewPanel.after(documentField);
  const documentInput = documentField.querySelector('input');
  const documentHint = documentField.querySelector('span');
  const documentPanel = document.createElement('div');
  documentPanel.className = 'document-preview-panel';
  documentPanel.hidden = true;
  documentField.after(documentPanel);
  const updateDocuments = () => {
    const count = documentInput.files.length;
    documentHint.innerHTML = count ? `${count} PDF document${count === 1 ? '' : 's'} selected <small>Ready to attach to this listing</small>` : 'Upload documents <small>PDF files only · disclosures, inspection reports, floor plans, and contracts</small>';
    documentPanel.innerHTML = '';
    if (count) {
      [...documentInput.files].forEach((file, index) => {
        const url = URL.createObjectURL(file);
        const tile = document.createElement('div');
        tile.className = 'asset-tile';
        const thumbnail = document.createElement('button');
        thumbnail.type = 'button'; thumbnail.className = 'asset-thumbnail document-thumb';
        thumbnail.innerHTML = `<b>PDF</b><small>${file.name}</small>`;
        thumbnail.addEventListener('click', () => openAssetPreview(url, 'pdf', file.name));
        const remove = document.createElement('button');
        remove.type = 'button'; remove.className = 'remove-asset'; remove.setAttribute('aria-label', `Remove ${file.name}`); remove.textContent = '×';
        remove.addEventListener('click', (event) => {
          event.stopPropagation();
          const data = new DataTransfer();
          [...documentInput.files].filter((_, fileIndex) => fileIndex !== index).forEach((item) => data.items.add(item));
          documentInput.files = data.files;
          updateDocuments();
        });
        tile.append(thumbnail, remove);
        documentPanel.append(tile);
      });
      documentPanel.hidden = false;
    } else {
      documentPanel.hidden = true;
    }
  };
  documentField.addEventListener('click', (event) => { if (event.target !== documentInput) documentInput.click(); });
  documentField.addEventListener('dragover', (event) => { event.preventDefault(); documentField.classList.add('dragging'); });
  documentField.addEventListener('dragleave', () => documentField.classList.remove('dragging'));
  documentField.addEventListener('drop', (event) => {
    event.preventDefault(); documentField.classList.remove('dragging');
    const files = [...event.dataTransfer.files].filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    if (files.length) { const data = new DataTransfer(); files.forEach((file) => data.items.add(file)); documentInput.files = data.files; updateDocuments(); }
    else { showToast('Please upload PDF documents only'); }
  });
  documentInput.addEventListener('change', () => {
    const invalid = [...documentInput.files].some((file) => file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf'));
    if (invalid) { documentInput.value = ''; showToast('Please upload PDF documents only'); }
    updateDocuments();
  });
}

const assetPreviewModal = document.createElement('dialog');
assetPreviewModal.className = 'asset-preview-modal';
assetPreviewModal.innerHTML = '<form method="dialog"><button class="close" aria-label="Close">×</button><p class="eyebrow" id="assetPreviewName"></p><div class="asset-preview-content"></div></form>';
document.body.append(assetPreviewModal);
closeDialogOnBackdrop(assetPreviewModal);
const openAssetPreview = (url, type, name) => {
  assetPreviewModal.querySelector('#assetPreviewName').textContent = name;
  assetPreviewModal.querySelector('.asset-preview-content').innerHTML = type === 'image' ? `<img src="${url}" alt="${name}" />` : `<iframe src="${url}" title="${name}"></iframe>`;
  assetPreviewModal.showModal();
};

// Account area: profile and billing controls open real workspace dialogs.
const profileModal = document.createElement('dialog');
profileModal.className = 'account-modal';
profileModal.innerHTML = '<form id="profileForm"><button class="close" type="button" aria-label="Close">×</button><p class="eyebrow">PROFILE</p><h2>My profile</h2><p class="modal-intro">Keep your contact details current for listing activity and client communication.</p><div class="account-grid"><label>Full name<input name="name" value="Alex Morgan" required /></label><label>Email address<input name="email" type="email" value="alex@listingstudio.co" required /></label><label>Phone number<input name="phone" placeholder="(000) 000-0000" /></label><label>Brokerage<input name="brokerage" value="Morgan Real Estate" /></label><label class="full">Professional bio<textarea name="bio" placeholder="A short introduction for clients and collaborators."></textarea></label></div><button class="primary-button" type="submit">Save changes <span>→</span></button></form>';
document.body.append(profileModal);
closeDialogOnBackdrop(profileModal);
const billingModal = document.createElement('dialog');
billingModal.className = 'account-modal';
billingModal.innerHTML = '<form method="dialog"><button class="close" aria-label="Close">×</button><p class="eyebrow">ACCOUNT & BILLING</p><h2>Your workspace plan</h2><div class="plan-card"><div><span>PROFESSIONAL</span><strong>$49 <small>/ month</small></strong><p>Up to 50 active listings and team-ready reporting.</p></div><button type="button" data-billing-action="Manage plan">Manage plan</button></div><div class="billing-section"><div class="billing-heading"><strong>Payment method</strong><button type="button" data-billing-action="Update payment method">Update</button></div><p>Visa ending in 4242 · Expires 08/28</p></div><div class="billing-section"><div class="billing-heading"><strong>Recent invoices</strong><button type="button" data-billing-action="View all invoices">View all</button></div><button class="invoice" type="button" data-billing-action="Invoice downloaded">May 2026 <span>Professional plan · $49.00</span><b>↓</b></button><button class="invoice" type="button" data-billing-action="Invoice downloaded">April 2026 <span>Professional plan · $49.00</span><b>↓</b></button></div></form>';
document.body.append(billingModal);
closeDialogOnBackdrop(billingModal);
const profileData = JSON.parse(localStorage.getItem('listingStudioProfile') || '{}');
if (profileData.name) profileModal.querySelector('[name="name"]').value = profileData.name;
if (profileData.email) profileModal.querySelector('[name="email"]').value = profileData.email;
if (profileData.phone) profileModal.querySelector('[name="phone"]').value = profileData.phone;
if (profileData.brokerage) profileModal.querySelector('[name="brokerage"]').value = profileData.brokerage;
if (profileData.bio) profileModal.querySelector('[name="bio"]').value = profileData.bio;
profileModal.querySelector('#profileForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  localStorage.setItem('listingStudioProfile', JSON.stringify(data));
  document.querySelector('.user-card strong').textContent = data.name;
  profileModal.close(); showToast('Profile changes saved');
});
billingModal.querySelectorAll('[data-billing-action]').forEach((control) => control.addEventListener('click', () => showToast(control.dataset.billingAction)));
document.querySelectorAll('#profilePopover button').forEach((button) => button.addEventListener('click', () => {
  if (button.textContent.trim() === 'My profile') profileModal.showModal();
  if (button.textContent.trim() === 'Account & billing') billingModal.showModal();
}));
