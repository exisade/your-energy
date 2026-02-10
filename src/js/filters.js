import { getFilters } from './api.js';

const filtersContainer = document.querySelector('.filters');
let activeFilter = 'Muscles';
let onFilterChangeCallback = null;

export function initFilters(callback) {
  if (!filtersContainer) return;

  onFilterChangeCallback = callback;

  filtersContainer.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('filters__btn')) return;

    filtersContainer.querySelectorAll('.filters__btn').forEach((btn) => {
      btn.classList.remove('filters__btn--active');
    });

    e.target.classList.add('filters__btn--active');

    activeFilter = e.target.textContent.trim();

    if (onFilterChangeCallback) {
      onFilterChangeCallback(activeFilter);
    }
  });
}

export function getActiveFilter() {
  return activeFilter;
}