import { updateKeyword } from './exercises.js';

const searchInput = document.querySelector('.search');

function debounce(fn, delay = 500) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

export function initSearch() {
  if (!searchInput) return;

  const handler = debounce(e => {
    const value = e.target.value.trim().toLowerCase();

    // пусто — сброс
    if (!value) {
      updateKeyword('');
      return;
    }

    // меньше 2 символов — не ищем
    if (value.length < 2) return;

    updateKeyword(value);
  }, 600);

  searchInput.addEventListener('input', handler);
}
