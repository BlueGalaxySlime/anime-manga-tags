const TAG_SOURCE = 'tagi.json';
const STORAGE_KEY = 'last-selected-tags';

let allTags = [];

fetch(TAG_SOURCE)
  .then(res => res.json())
  .then(data => {
    const selected = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const container = document.getElementById('tag-selector');
    const searchInput = document.getElementById('tag-search');
    container.innerHTML = '';

    Object.entries(data).forEach(([groupName, subgroups]) => {
      const groupWrapper = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = groupName;
      groupWrapper.appendChild(legend);

      Object.entries(subgroups).forEach(([subgroupName, tags]) => {
        const subgroupHeader = document.createElement('h3');
        subgroupHeader.textContent = subgroupName;
        groupWrapper.appendChild(subgroupHeader);

        const tagsContainer = document.createElement('div');

        tags.forEach(tagObj => {
          const tag = typeof tagObj === 'string' ? tagObj : tagObj.name;
          const desc = typeof tagObj === 'object' && tagObj.desc ? tagObj.desc : '';
          
          const id = `tag-${groupName}-${subgroupName}-${tag}`;
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.id = id;
          input.value = tag;

          const isSelected = selected.find(sel => sel.tag === tag);
          if (isSelected) input.checked = true;

          const label = document.createElement('label');
          label.setAttribute('for', id);
          label.textContent = tag;

          if (desc) {
          label.title = desc; // Desktop tooltip
          label.addEventListener('click', e => {
          if (window.innerWidth <= 768) {
          e.preventDefault();
          alert(`${tag}: ${desc}`); // Mobile fallback
              }
            });
          }
  
          tagsContainer.appendChild(input);
          tagsContainer.appendChild(label);

          allTags.push({ tag, id, groupName, subgroupName });
        });

        groupWrapper.appendChild(tagsContainer);
      });

      container.appendChild(groupWrapper);
    });

    searchInput.addEventListener('input', () => {
      const val = searchInput.value.toLowerCase();
      allTags.forEach(({ tag, id }) => {
        const label = document.querySelector(`label[for='${id}']`);
        if (label) {
          label.style.display = tag.toLowerCase().includes(val) ? 'inline-block' : 'none';
        }
      });
    });
  });

function submitTags() {
  const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => {
      const tag = cb.value;
      const tagData = allTags.find(t => t.tag === tag);
      return tagData;
    });
  if (!selected.length) return alert('Wybierz tagi!');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  window.location.href = 'wyniki.html';
}

function clearTags() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}
