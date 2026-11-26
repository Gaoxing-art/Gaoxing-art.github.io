(() => {
  'use strict';
  // Optional, private aggregate analytics; never prevent navigation or read identities.
  if (location.hostname !== 'gaoxing-art.github.io' || navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  function track(name, data) {
    try {
      const tracker = window.umami;
      if (!tracker || typeof tracker.track !== 'function') return false;
      const request = data ? tracker.track(name, data) : tracker.track(name);
      if (request && typeof request.catch === 'function') request.catch(() => {});
      return true;
    } catch (_) { return false; }
  }

  function onLink(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target && event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (link.dataset.analytics === 'cv') track('cv-open');
    else if (href.startsWith('mailto:')) track('email-click');
    else if (/^https:\/\/github\.com\/Gaoxing-art(?:[/?#]|$)/i.test(href)) track('github-click');
  }
  document.addEventListener('click', onLink);
  document.addEventListener('auxclick', onLink);

  // One exposure per section per page load, after two continuous visible seconds.
  const seen = new Set(), visible = new Set(), pending = new Map();
  function cancel(section) {
    if (pending.has(section)) clearTimeout(pending.get(section));
    pending.delete(section);
  }
  function schedule(section) {
    if (document.visibilityState !== 'visible' || seen.has(section.id) || pending.has(section)) return;
    pending.set(section, setTimeout(() => {
      pending.delete(section);
      if (document.visibilityState === 'visible' && visible.has(section) && track('section-view', { section: section.id })) seen.add(section.id);
    }, 2000));
  }
  if (typeof IntersectionObserver === 'function') {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= .2) {
          visible.add(entry.target);
          schedule(entry.target);
        } else {
          visible.delete(entry.target);
          cancel(entry.target);
        }
      }
    }, { threshold: [0, .2] });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
  document.addEventListener('visibilitychange', () => {
    for (const section of pending.keys()) cancel(section);
    if (document.visibilityState === 'visible') for (const section of visible) schedule(section);
  });

  // A coarse engagement indicator, not a claim that the visitor read the content.
  let foregroundSeconds = 0;
  function engagementTick() {
    if (document.visibilityState === 'visible' && document.hasFocus()) foregroundSeconds += 1;
    if (foregroundSeconds >= 30) {
      if (track('engaged-30s')) return;
    }
    setTimeout(engagementTick, 1000);
  }
  setTimeout(engagementTick, 1000);
})();