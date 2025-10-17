// Minimal JS placeholder for future interactivity
document.addEventListener('DOMContentLoaded', () => {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.endsWith(here)) a.style.fontWeight = '700';
  });
});

