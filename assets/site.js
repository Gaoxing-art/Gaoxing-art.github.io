(() => {
  // Compose email links in the browser so HTML preview services keep the visible addresses.
  document.querySelectorAll('[data-email-user]').forEach(link => {
    const address = link.dataset.emailUser + '@' + link.dataset.emailDomain;
    link.href = 'mailto:' + address;
  });
  const root = document.documentElement;
  const menu = document.querySelector('#menu');
  const mobile = document.querySelector('#mobile-nav');
  const dialog = document.querySelector('#figure-dialog');
  const languageKey = 'zzm-homepage-language';
  const themeKey = 'zzm-homepage-theme';
  function preference(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (_) { /* The page also works when local storage is unavailable. */ }
  }
  function setLanguage(lang) {
    const zh = lang === 'zh';
    root.lang = zh ? 'zh-CN' : 'en';
    root.className = zh ? 'lang-zh' : 'lang-en';
    document.title = zh ? '张致铭 | 中国科学技术大学' : 'Zhiming Zhang | USTC';
    document.querySelectorAll('[data-label-en]').forEach(node => {
      node.setAttribute('aria-label', zh ? node.dataset.labelZh : node.dataset.labelEn);
      node.title = node.getAttribute('aria-label');
    });
    document.querySelectorAll('img[data-alt-zh]').forEach(img => {
      if (!img.dataset.altEn) img.dataset.altEn = img.alt;
      img.alt = zh ? img.dataset.altZh : img.dataset.altEn;
    });
    preference(languageKey, lang);
  }
  function setTheme(mode) {
    root.dataset.theme = mode;
    document.querySelector('#theme').setAttribute('aria-pressed', String(mode === 'dark'));
    preference(themeKey, mode);
  }
  function closeMenu() {
    mobile.hidden = true;
    menu.setAttribute('aria-expanded', 'false');
  }
  setLanguage(preference(languageKey) === 'zh' ? 'zh' : 'en');
  setTheme(preference(themeKey) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  document.querySelector('#lang').addEventListener('click', () => setLanguage(root.lang === 'en' ? 'zh' : 'en'));
  document.querySelector('#theme').addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  menu.addEventListener('click', () => {
    mobile.hidden = !mobile.hidden;
    menu.setAttribute('aria-expanded', String(!mobile.hidden));
  });
  document.addEventListener('click', event => {
    if (!mobile.hidden && !menu.contains(event.target) && (!mobile.contains(event.target) || event.target.closest('a'))) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobile.hidden) { closeMenu(); menu.focus(); }
  });
  matchMedia('(min-width: 1021px)').addEventListener('change', closeMenu);

  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  function updateNavigation() {
    const boundary = Math.max(105, innerHeight * .18);
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= boundary) current = section;
    }
    if (Math.ceil(scrollY + innerHeight) >= root.scrollHeight) current = sections[sections.length - 1];
    for (const a of navLinks) {
      if (a.hash === '#' + current.id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    }
  }
  addEventListener('scroll', updateNavigation, { passive: true });
  new ResizeObserver(updateNavigation).observe(document.body);
  updateNavigation();

  for (const [id, record] of Object.entries(window.publicationRecords || {})) {
    const article = document.getElementById(id);
    if (!article) continue;
    const authors = article.querySelector('[data-authors]');
    if (record.authors.length) { authors.hidden = false; authors.textContent = record.authors.join(', '); }
    if (record.arxiv) {
      const a = document.createElement('a');
      a.href = record.arxiv;
      a.textContent = 'arXiv ↗';
      article.querySelector('[data-arxiv]').replaceWith(a);
    }
  }
  document.querySelectorAll('[data-preview]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !dialog.showModal) return;
      event.preventDefault();
      const thumbnail = link.querySelector('img');
      const image = document.querySelector('#figure-large');
      image.src = thumbnail.src;
      image.alt = thumbnail.alt;
      document.querySelector('#figure-title').textContent = link.closest('article').querySelector('h3').textContent;
      document.querySelector('#figure-original').href = link.href;
      dialog.showModal();
      document.querySelector('#close-figure').focus();
    });
  });
  document.querySelector('#close-figure').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
})();
