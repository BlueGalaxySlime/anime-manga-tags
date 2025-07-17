const STORAGE_KEY = 'last-selected-tags';

fetch('tagi.json')
  .then(response => response.json())
  .then(data => {
    generateTagSelector(data);
    addSearchFilter();
  });

function generateTagSelector(data) {
  const container = document.getElementById('tag-selector');
  container.innerHTML = '';

  data.forEach(group => {
    const groupEl = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = group.nazwa;
    groupEl.appendChild(legend);

    group.podgrupy.forEach(sub => {
      const subLabel = document.createElement('h4');
      subLabel.textContent = sub.nazwa;
      groupEl.appendChild(subLabel);

      sub.tagi.forEach(tagObj => {
        const id = `tag-${group.nazwa}-${sub.nazwa}-${tagObj.tag}`.replace(/\s+/g, '-');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.dataset.group = group.nazwa;
        checkbox.dataset.subgroup = sub.nazwa;
        checkbox.value = tagObj.tag;

        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = tagObj.tag;
        label.title = tagObj.desc || '';

        groupEl.appendChild(checkbox);
        groupEl.appendChild(label);
      });
    });

    container.appendChild(groupEl);
  });

  loadPreviousSelection();
}

function addSearchFilter() {
  const input = document.getElementById('tag-search');
  input.addEventListener('input', () => {
    const term = input.value.toLowerCase();
    document.querySelectorAll('#tag-selector label').forEach(label => {
      const text = label.textContent.toLowerCase();
      label.style.display = text.includes(term) ? 'inline-block' : 'none';

      const checkbox = document.getElementById(label.getAttribute('for'));
      if (checkbox) checkbox.style.display = label.style.display;
    });
  });
}

function submitTags() {
  const selected = [...document.querySelectorAll('#tag-selector input[type=checkbox]:checked')]
    .map(cb => ({
      groupName: cb.dataset.group,
      subgroupName: cb.dataset.subgroup,
      tag: cb.value
    }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  window.location.href = 'wyniki.html';
}

function clearTags() {
  document.querySelectorAll('#tag-selector input[type=checkbox]').forEach(cb => cb.checked = false);
  localStorage.removeItem(STORAGE_KEY);
}

function loadPreviousSelection() {
  const selected = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  selected.forEach(sel => {
    const selector = `#tag-selector input[data-group="${sel.groupName}"][data-subgroup="${sel.subgroupName}"][value="${sel.tag}"]`;
    const cb = document.querySelector(selector);
    if (cb) cb.checked = true;
  });
}
