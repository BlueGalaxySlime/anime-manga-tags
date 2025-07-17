document.addEventListener('DOMContentLoaded', () => {
  const tagElements = document.querySelectorAll('.post-tag[data-tag]');
  tagElements.forEach(el => {
    el.style.cursor = 'pointer';
    el.style.padding = '3px 8px';
    el.style.borderRadius = '4px';
    el.style.backgroundColor = '#ddd';
    el.style.marginRight = '6px';
    el.style.display = 'inline-block';
    el.style.userSelect = 'none';

    el.addEventListener('mouseenter', () => {
      el.style.backgroundColor = '#bbb';
    });
    el.addEventListener('mouseleave', () => {
      el.style.backgroundColor = '#ddd';
    });

    el.addEventListener('click', () => {
      const tag = encodeURIComponent(el.dataset.tag);
      const baseUrl = 'https://bluegalaxyslime.github.io/anime-manga-tags/wyniki.html';
      // Przekierowanie do strony wyników z wybranym tagiem w localStorage
      const selectedTags = [{ tag, groupName: '', subgroupName: '' }];
      localStorage.setItem('last-selected-tags', JSON.stringify(selectedTags));
      window.location.href = baseUrl;
    });
  });
});
