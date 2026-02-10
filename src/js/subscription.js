import { subscribe } from './api.js';

const subscriptionForm = document.querySelector('.footer-form');
const emailInput = document.querySelector('.footer-input');

export function initSubscription() {
  if (!subscriptionForm) return;

  subscriptionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      await subscribe(email);
      alert('Successfully subscribed!');
      emailInput.value = '';
    } catch (error) {
      alert('Subscription failed. Please try again.');
    }
  });
}