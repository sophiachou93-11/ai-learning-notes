'use strict';

const DATA_URL = './data/notes.json';
const grid = document.querySelector('#notes-grid');
const filters = document.querySelector('#category-filters');
const searchInput = document.querySelector('#search-input');
const counter = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const loadError = document.querySelector('#load-error');
let notes = [];
let selectedCategory = '全部';

function makeElement(tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (value !== undefined) element.textContent = value;
  return element;
}

function renderFilters() {
  const categories = [...new Set(notes.map(note => note.category))];
  categories.forEach(category => {
    const button = makeElement('button', 'filter-chip', category);
    button.type = 'button';
    button.dataset.category = category;
    button.setAttribute('aria-pressed', 'false');
    filters.append(button);
  });
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    selectedCategory = button.dataset.category;
    filters.querySelectorAll('button').forEach(chip => {
      const active = chip.dataset.category === selectedCategory;
      chip.classList.toggle('active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    renderNotes();
  });
}

function makeCard(note, index) {
  const card = makeElement('a', 'note-card');
  card.href = `./note.html?id=${encodeURIComponent(note.id)}`;
  card.style.setProperty('--delay', `${Math.min(index, 8) * 55}ms`);

  const top = makeElement('div', 'card-top');
  const category = makeElement('span', `category-label category-${note.categoryKey}`, note.category);
  const num = makeElement('span', 'card-num', String(index + 1).padStart(2, '0'));
  top.append(category, num);

  const title = makeElement('h3', 'card-title', note.title);
  const summary = makeElement('p', 'card-summary', note.summary);
  const tags = makeElement('div', 'card-tags');
  note.tags.slice(0, 3).forEach(tag => tags.append(makeElement('span', 'tag', `# ${tag}`)));
  const bottom = makeElement('div', 'card-bottom');
  bottom.append(makeElement('span', '', note.readMinutes + ' MIN READ'), makeElement('span', 'card-go', '↗'));
  card.append(top, title, summary, tags, bottom);
  return card;
}

function renderNotes() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const visibleNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === '全部' || note.category === selectedCategory;
    const text = [note.title, note.summary, note.category, ...note.tags].join(' ').toLocaleLowerCase();
    return matchesCategory && text.includes(query);
  });
  grid.replaceChildren(...visibleNotes.map(makeCard));
  counter.textContent = `共 ${visibleNotes.length} 篇筆記`;
  emptyState.hidden = visibleNotes.length !== 0;
}

async function start() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid data');
    notes = data;
    document.querySelector('#stat-notes').textContent = notes.length;
    document.querySelector('#stat-categories').textContent = new Set(notes.map(note => note.category)).size;
    renderFilters();
    renderNotes();
    searchInput.addEventListener('input', renderNotes);
  } catch (error) {
    counter.textContent = '無法載入筆記';
    loadError.hidden = false;
    console.error('Notes loading error:', error);
  }
}
start();
