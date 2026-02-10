import { updatePage } from './exercises.js';

const paginationContainer = document.querySelector('.pagination');
let currentPage = 1;
let totalPages = 1;

export function initPagination() {
  if (!paginationContainer) return;

  paginationContainer.addEventListener('click', (e) => {
    const target = e.target;

    if (target.tagName === 'BUTTON') {
      const text = target.textContent.trim();

      if (text === '<' && currentPage > 1) {
        currentPage--;
        updatePage(currentPage);
        renderPagination();
      } else if (text === '>' && currentPage < totalPages) {
        currentPage++;
        updatePage(currentPage);
        renderPagination();
      }
    }
  });
}

export function updatePaginationData(page, total) {
  currentPage = page;
  totalPages = total;
  renderPagination();
}

function renderPagination() {
  if (!paginationContainer) return;

  paginationContainer.innerHTML = `
    <button ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>
    <span>${currentPage} / ${totalPages}</span>
    <button ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>
  `;
}