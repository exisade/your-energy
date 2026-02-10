import { getFilters, getExercises } from './api.js';
import { updatePaginationData } from './pagination.js';

const cardsContainer = document.querySelector('.cards');
const searchWrapper = document.querySelector('.search-wrapper');

let currentPage = 1;
let currentFilter = 'Muscles';
let currentKeyword = '';
let selectedCategory = null;
let mode = 'categories';

// ===== UI =====
function showSearch() {
  if (searchWrapper) searchWrapper.style.display = 'block';
}

function hideSearch() {
  if (searchWrapper) searchWrapper.style.display = 'none';
  const input = document.querySelector('.search');
  if (input) input.value = '';
  currentKeyword = '';
}

// ===== MAIN =====
export async function renderExercises() {
  if (!cardsContainer) return;

  if (mode === 'categories') {
    await renderCategories();
  } else {
    await renderExercisesList();
  }
}

// ===== CATEGORIES =====
async function renderCategories() {
  hideSearch();

  try {
    const data = await getFilters(currentFilter);
    const results = data.results || [];

    if (!results.length) {
      cardsContainer.innerHTML = '<p>No categories found</p>';
      updatePaginationData(1, 1);
      return;
    }

    cardsContainer.innerHTML = results
      .map(
        cat => `
        <div class="category-card" data-category="${cat.name}">
          <div class="category-card__image" style="background-image:url('${cat.imgURL}')">
            <div class="category-card__overlay">
              <h3 class="category-card__title">${cat.name}</h3>
              <p class="category-card__subtitle">${cat.filter}</p>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    updatePaginationData(1, data.totalPages || 1);
  } catch (e) {
    console.error(e);
    cardsContainer.innerHTML = '<p>Failed to load categories</p>';
  }
}

// ===== EXERCISES =====
async function renderExercisesList() {
  // ⛔ API ЗАПРЕЩАЕТ ЗАПРОС БЕЗ ФИЛЬТРА
  if (!selectedCategory) {
    cardsContainer.innerHTML = '<p>Select a category first</p>';
    updatePaginationData(1, 1);
    return;
  }

  showSearch();

  try {
    const params = {
      page: currentPage,
      limit: 10,
    };

    // обязательный фильтр
    const filterParam = getParamName();
    params[filterParam] = selectedCategory;

    // keyword — ТОЛЬКО как дополнение
    if (currentKeyword && currentKeyword.length >= 2) {
      params.keyword = currentKeyword;
    }

    const data = await getExercises(params);
    const results = data.results || [];

    if (!results.length) {
      cardsContainer.innerHTML = '<p>No exercises found</p>';
      updatePaginationData(1, 1);
      return;
    }

    cardsContainer.innerHTML = results
      .map(
        ex => `
        <div class="exercise-card-item">
          <div class="exercise-card-header">
            <span class="exercise-badge">WORKOUT</span>
            <span class="exercise-rating">${(ex.rating || 0).toFixed(1)} ★</span>
            <button class="card__btn" data-id="${ex._id}">Start →</button>
          </div>

          <div class="exercise-card-body">
            <h3 class="exercise-name">${ex.name}</h3>
          </div>
        </div>
      `
      )
      .join('');

    updatePaginationData(currentPage, data.totalPages || 1);
  } catch (e) {
    console.error(e);
    cardsContainer.innerHTML = '<p>Failed to load exercises</p>';
  }
}

// ===== HELPERS =====
function getParamName() {
  if (currentFilter === 'Muscles') return 'muscles';
  if (currentFilter === 'Body parts') return 'bodypart';
  if (currentFilter === 'Equipment') return 'equipment';
  return 'muscles';
}

// ===== EVENTS =====
document.addEventListener('click', e => {
  const card = e.target.closest('.category-card');
  if (!card) return;

  selectedCategory = card.dataset.category;
  currentPage = 1;
  currentKeyword = '';
  mode = 'exercises';
  renderExercises();
});

// ===== EXPORTS =====
export function updateFilter(filter) {
  currentFilter = filter;
  selectedCategory = null;
  currentKeyword = '';
  mode = 'categories';
  renderExercises();
}

export function updateKeyword(keyword) {
  // ⛔ БЕЗ КАТЕГОРИИ — НИКАКИХ ЗАПРОСОВ
  if (!selectedCategory) return;

  currentKeyword = keyword.trim().toLowerCase();
  currentPage = 1;
  mode = 'exercises';
  renderExercises();
}

export function updatePage(page) {
  currentPage = page;
  renderExercises();
}
