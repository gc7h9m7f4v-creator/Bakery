'use strict';

// Product objects keep the display names in one place; the saved ID array is persisted.
const bakeryProducts = [
  { id: 'breads', name: 'Breads' },
  { id: 'signature-loaf', name: 'Signature Loaf' },
  { id: 'pastries', name: 'Pastries' },
  { id: 'cakes', name: 'Cakes and celebrations' }
];
const favoriteIds = loadFavorites();

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem('northStarFavorites') || '[]');
    return Array.isArray(saved) ? saved.filter(id => bakeryProducts.some(product => product.id === id)) : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem('northStarFavorites', JSON.stringify(favoriteIds));
}

function renderFavorites() {
  const count = document.querySelector('#favorite-count');
  const message = document.querySelector('#favorites-message');
  const list = document.querySelector('#favorite-list');
  const clearButton = document.querySelector('#clear-favorites');
  if (!count || !message || !list || !clearButton) return;

  const savedProducts = bakeryProducts.filter(product => favoriteIds.includes(product.id));
  count.textContent = String(savedProducts.length);
  message.textContent = savedProducts.length
    ? 'Saved for your next visit:'
    : 'Tap “Save favorite” on a bake to keep it here for your next visit.';
  list.replaceChildren(...savedProducts.map(product => {
    const item = document.createElement('li');
    item.textContent = product.name;
    return item;
  }));
  clearButton.hidden = savedProducts.length === 0;

  document.querySelectorAll('.favorite-button').forEach(button => {
    const isSaved = favoriteIds.includes(button.dataset.productId);
    button.setAttribute('aria-pressed', String(isSaved));
    button.textContent = isSaved ? 'Saved to favorites' : 'Save favorite';
  });
}

function toggleFavorite(productId) {
  const index = favoriteIds.indexOf(productId);
  if (index >= 0) favoriteIds.splice(index, 1);
  else if (bakeryProducts.some(product => product.id === productId)) favoriteIds.push(productId);
  saveFavorites();
  renderFavorites();
}

function clearFavorites() {
  favoriteIds.splice(0, favoriteIds.length);
  saveFavorites();
  renderFavorites();
}

function setFieldError(field, errorId, message) {
  const error = document.getElementById(errorId);
  error.textContent = message;
  field.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

function validateRequestForm(form) {
  const name = form.elements.name;
  const email = form.elements.email;
  const date = form.elements['pickup-date'];
  const type = form.elements['request-type'];
  const details = form.elements['item-details'];
  let valid = true;
  const check = (field, errorId, message) => {
    valid = setFieldError(field, errorId, message) && valid;
  };

  check(name, 'name-error', name.value.trim().length < 2 ? 'Enter your name (at least 2 characters).' : '');
  check(email, 'email-error', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? 'Enter a valid email address, such as name@example.com.' : '');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = date.value ? new Date(`${date.value}T00:00:00`) : null;
  check(date, 'date-error', !selectedDate ? 'Choose a preferred pickup date.' : selectedDate < today ? 'Choose today or a future pickup date.' : '');
  check(type, 'type-error', !type.value ? 'Choose a request type.' : '');
  check(details, 'details-error', details.value.trim().length < 5 ? 'Add at least 5 characters about the item or question.' : '');
  return valid;
}

function setupFavorites() {
  if (!document.querySelector('.product-grid')) return;
  document.querySelectorAll('.favorite-button').forEach(button => {
    button.addEventListener('click', () => toggleFavorite(button.dataset.productId));
  });
  document.querySelector('#clear-favorites')?.addEventListener('click', clearFavorites);
  renderFavorites();
}

function setupRequestForm() {
  const form = document.querySelector('#request-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = '';
    if (!validateRequestForm(form)) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    status.textContent = 'Your request is ready. In a live bakery site, the team would receive it to confirm availability and pickup details.';
  });
  form.addEventListener('input', event => {
    const field = event.target;
    if (field.matches('[aria-invalid="true"]')) validateRequestForm(form);
  });
  form.addEventListener('change', event => {
    if (event.target.matches('[aria-invalid="true"]')) validateRequestForm(form);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupFavorites();
  setupRequestForm();
});
