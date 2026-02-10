import { getExerciseById, rateExercise } from './api.js';

let modalContainer = null;
let currentExercise = null;

export function initModal() {
  modalContainer = document.createElement('div');
  modalContainer.className = 'modal-overlay';
  modalContainer.style.display = 'none';
  document.body.appendChild(modalContainer);

  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('card__btn')) {
      const exerciseId = e.target.dataset.id;
      await openExerciseModal(exerciseId);
    }
  });

  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer || e.target.classList.contains('modal__close')) {
      closeModal();
    }

    if (e.target.classList.contains('modal__give-rating')) {
      openRatingModal();
    }

    if (e.target.classList.contains('modal__add-favorite')) {
      addToFavorites(currentExercise);
    }
  });

  modalContainer.addEventListener('submit', async (e) => {
    if (e.target.classList.contains('rating-form')) {
      e.preventDefault();
      await handleRatingSubmit(e.target);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.style.display === 'flex') {
      closeModal();
    }
  });
}

async function openExerciseModal(id) {
  try {
    const exercise = await getExerciseById(id);
    currentExercise = exercise;

    modalContainer.innerHTML = `
      <div class="modal">
        <button class="modal__close">&times;</button>
        
        <div class="modal__content">
          <div class="modal__image">
            ${exercise.gifUrl ? `<img src="${exercise.gifUrl}" alt="${exercise.name}" loading="lazy" />` : ''}
          </div>
          
          <div class="modal__info">
            <h2 class="modal__title">${exercise.name}</h2>
            
            <div class="modal__rating-display">
              <span class="modal__rating-value">${exercise.rating}</span>
              <div class="modal__stars">
                ${renderStars(exercise.rating)}
              </div>
            </div>
            
            <div class="modal__details">
              <div class="modal__detail">
                <span class="modal__detail-label">Target</span>
                <span class="modal__detail-value">${exercise.target}</span>
              </div>
              <div class="modal__detail">
                <span class="modal__detail-label">Body Part</span>
                <span class="modal__detail-value">${exercise.bodyPart}</span>
              </div>
              <div class="modal__detail">
                <span class="modal__detail-label">Equipment</span>
                <span class="modal__detail-value">${exercise.equipment}</span>
              </div>
              <div class="modal__detail">
                <span class="modal__detail-label">Popular</span>
                <span class="modal__detail-value">${exercise.popularity || 'N/A'}</span>
              </div>
              <div class="modal__detail">
                <span class="modal__detail-label">Burned Calories</span>
                <span class="modal__detail-value">${exercise.burnedCalories} /${exercise.time} min</span>
              </div>
            </div>
            
            <p class="modal__description">${exercise.description || ''}</p>
            
            <div class="modal__actions">
              <button class="modal__add-favorite">
                Add to favorites ♡
              </button>
              <button class="modal__give-rating">
                Give a rating
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modalContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } catch (error) {
    alert('Could not load exercise details');
  }
}

function openRatingModal() {
  if (!currentExercise) return;

  modalContainer.innerHTML = `
    <div class="modal modal--rating">
      <button class="modal__close">&times;</button>
      
      <h3 class="modal__rating-title">Rating</h3>
      
      <form class="rating-form" data-id="${currentExercise._id}">
        <div class="rating-stars">
          <span class="rating-value">0.0</span>
          <div class="rating-stars-input">
            <input type="radio" name="rate" value="1" id="star1" required>
            <label for="star1">☆</label>
            <input type="radio" name="rate" value="2" id="star2">
            <label for="star2">☆</label>
            <input type="radio" name="rate" value="3" id="star3">
            <label for="star3">☆</label>
            <input type="radio" name="rate" value="4" id="star4">
            <label for="star4">☆</label>
            <input type="radio" name="rate" value="5" id="star5">
            <label for="star5">☆</label>
          </div>
        </div>
        
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          class="rating-email"
          required 
        />
        
        <textarea 
          name="review" 
          placeholder="Your comment" 
          class="rating-comment"
          rows="4"
        ></textarea>
        
        <button type="submit" class="rating-submit">Send</button>
      </form>
    </div>
  `;

  const ratingInputs = modalContainer.querySelectorAll('input[name="rate"]');
  const ratingValue = modalContainer.querySelector('.rating-value');
  
  ratingInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      ratingValue.textContent = `${e.target.value}.0`;
    });
  });
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '★';
  if (halfStar) stars += '⯨';
  for (let i = 0; i < emptyStars; i++) stars += '☆';
  
  return stars;
}

async function handleRatingSubmit(form) {
  const formData = new FormData(form);
  const exerciseId = form.dataset.id;

  try {
    await rateExercise(exerciseId, {
      rate: Number(formData.get('rate')),
      email: formData.get('email'),
      review: formData.get('review') || ''
    });
    
    alert('Thank you for your rating!');
    closeModal();
  } catch (error) {
    alert('Failed to submit rating. Please try again.');
  }
}

function addToFavorites(exercise) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  
  if (favorites.find(item => item._id === exercise._id)) {
    alert('Already in favorites');
    return;
  }
  
  favorites.push(exercise);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Added to favorites!');
}

function closeModal() {
  if (!modalContainer) return;
  modalContainer.style.display = 'none';
  document.body.style.overflow = '';
  currentExercise = null;
}