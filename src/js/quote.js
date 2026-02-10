import { getQuote } from './api.js';

const quoteText = document.querySelector('.quote__text');
const quoteAuthor = document.querySelector('.quote__author');

export async function renderQuote() {
  if (!quoteText) return;

  try {
    const data = await getQuote();
    quoteText.textContent = data.quote;
    quoteAuthor.textContent = `— ${data.author}`;
  } catch (error) {
    quoteText.textContent = 'Could not load quote';
  }
}