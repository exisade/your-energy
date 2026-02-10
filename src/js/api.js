const BASE_URL = 'https://your-energy.b.goit.study/api';

// ===== QUOTE =====
export async function getQuote() {
  const res = await fetch(`${BASE_URL}/quote`);
  if (!res.ok) throw new Error('Failed to fetch quote');
  return res.json();
}

// ===== FILTERS =====
export async function getFilters(filter) {
  const params = new URLSearchParams({ filter });
  const res = await fetch(`${BASE_URL}/filters?${params}`);
  if (!res.ok) throw new Error('Failed to fetch filters');
  return res.json();
}

// ===== EXERCISES (КЛЮЧЕВОЕ МЕСТО) =====
export async function getExercises(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const res = await fetch(`${BASE_URL}/exercises?${query.toString()}`);

  if (!res.ok) {
    throw new Error('Failed to fetch exercises');
  }

  return res.json();
}

// ===== EXERCISE BY ID =====
export async function getExerciseById(id) {
  if (!id) throw new Error('Exercise id is required');

  const res = await fetch(`${BASE_URL}/exercises/${id}`);
  if (!res.ok) throw new Error('Failed to fetch exercise');
  return res.json();
}

// ===== RATE =====
export async function rateExercise(id, { rate, email, review }) {
  const res = await fetch(`${BASE_URL}/exercises/${id}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rate, email, review }),
  });

  if (!res.ok) throw new Error('Failed to rate exercise');
  return res.json();
}

// ===== SUBSCRIBE =====
export async function subscribe(email) {
  const res = await fetch(`${BASE_URL}/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error('Failed to subscribe');
  return res.json();
}
