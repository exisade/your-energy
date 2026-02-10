import { renderQuote } from './quote.js';
import { initFilters } from './filters.js';
import { renderExercises, updateFilter } from './exercises.js';
import { initSearch } from './search.js';
import { initPagination } from './pagination.js';
import { initModal } from './modal.js';
import { initSubscription } from './subscription.js';

function init() {
  renderQuote();
  
  initFilters((filter) => {
    updateFilter(filter);
  });

  renderExercises();
  initSearch();
  initPagination();
  initModal();
  initSubscription();
}

init();