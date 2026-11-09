'use strict';

const root = document.querySelector('#article-root');
const noteId = new URLSearchParams(window.location.search).get('id');

function create(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function showMessage(title, detail) {
  root.replaceChildren();
  const back = create('a', 'back-link', '← 返回所有筆記');
  back.href = './index.html#notes';
  const message = create('div', 'article-message');
  message.append(create('h1', '', title), create('p', '', detail));
  root.append(back, message);
}

function renderArticle(note) {
  document.title = `${note.title}｜STACK NOTE`;
  const back = create('a', 'back-link', '← 返回所有筆記');
  back.href = './index.html#notes';

  const header = create('header', 'article-header');
  const category = create('span', `category-label category-${note.categoryKey}`, note.category);
  const title = create('h1', '', note.title);
  const subtitle = create('p', 'article-summary', note.summary);
  const meta = create('div', 'article-meta');
  meta.append(create('span', '', `⏱ ${note.readMinutes} 分鐘閱讀`), create('span', '', `✳ ${note.updated}`));
  header.append(category, title, subtitle, meta);

  const layout = create('div', 'article-columns');
  const content = create('article', 'article-content');
  note.sections.forEach((section, index) => {
    const wrapper = create('section', 'article-section');
    wrapper.id = `section-${index + 1}`;
    wrapper.append(create('h2', '', section.heading));
    (section.paragraphs || []).forEach(paragraph => wrapper.append(create('p', '', paragraph)));
    if (section.bullets?.length) {
      const list = create('ul', 'article-bullets');
      section.bullets.forEach(bullet => list.append(create('li', '', bullet)));
      wrapper.append(list);
    }
    content.append(wrapper);
  });

  const next = create('div', 'article-bottom');
  next.append(create('span', '', 'ONE CONCEPT AT A TIME  ✳'));
  const home = create('a', 'primary-button', '探索更多筆記 →');
  home.href = './index.html#notes';
  next.append(home);
  content.append(next);

  const aside = create('aside', 'article-sidebar');
  aside.append(create('h2', '', 'IN THIS NOTE'));
  const toc = create('nav', 'toc');
  toc.setAttribute('aria-label', '本頁目錄');
  note.sections.forEach((section, index) => {
    const link = create('a', '', `${String(index + 1).padStart(2, '0')}  ${section.heading}`);
    link.href = `#section-${index + 1}`;
    toc.append(link);
  });
  aside.append(toc);
  const tip = create('div', 'sidebar-tip');
  tip.append(create('span', '', '✳ QUICK TIP'), create('p', '', '學完後可以試著不用看筆記，自己解釋一次這個概念。'));
  aside.append(tip);
  layout.append(content, aside);
  root.replaceChildren(back, header, layout);
}

async function start() {
  if (!noteId) return showMessage('找不到這篇筆記', '網址缺少筆記編號，請返回首頁選擇筆記。');
  try {
    const response = await fetch('./data/notes.json');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const notes = await response.json();
    const note = notes.find(item => item.id === noteId);
    if (!note) return showMessage('找不到這篇筆記', '這篇筆記可能已移除，或網址輸入錯誤。');
    renderArticle(note);
  } catch (error) {
    showMessage('筆記載入失敗', '請確認網站連線正常，或透過本機伺服器開啟網站。');
    console.error(error);
  }
}
start();
