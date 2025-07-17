// edytor.js

let tagsData = {};

function renderVisualEditor() {
  const container = document.getElementById('visual-editor');
  container.innerHTML = '';

  Object.entries(tagsData).forEach(([groupName, subgroups], groupIndex) => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('group');
    groupDiv.setAttribute('draggable', true);
    groupDiv.dataset.index = groupIndex;
    groupDiv.innerHTML = `
      <fieldset>
        <legend>
          <span contenteditable="true" onblur="editGroupName(${groupIndex}, this.textContent)">${groupName}</span>
          <button onclick="removeGroup('${groupName}')">❌</button>
        </legend>
        <input placeholder="Dodaj podgrupę" type="text" id="sub-${groupName}" />
        <button onclick="addSubgroup('${groupName}')">+ Podgrupa</button>
        <div id="subs-${groupName}"></div>
      </fieldset>
    `;
    container.appendChild(groupDiv);

    const subsContainer = groupDiv.querySelector(`#subs-${groupName}`);

    Object.entries(subgroups).forEach(([subName, tags], subIndex) => {
      const subDiv = document.createElement('div');
      subDiv.classList.add('subgroup');
      subDiv.setAttribute('draggable', true);
      subDiv.dataset.index = subIndex;
      subDiv.style.margin = '10px 0';
      subDiv.innerHTML = `
        <strong>
          <span contenteditable="true" onblur="editSubgroupName('${groupName}', ${subIndex}, this.textContent)">${subName}</span>
          <button onclick="removeSubgroup('${groupName}', '${subName}')">❌</button>
        </strong><br>
        <input placeholder="Dodaj tag" type="text" id="tag-${groupName}-${subName}" />
        <button onclick="addTag('${groupName}', '${subName}')">+ Tag</button>
        <div class="tag-list">
          ${tags.map((tagObj, i) => `
            <div class="tag-item" draggable="true" data-index="${i}">
              <span contenteditable="true" onblur="editTagName('${groupName}', '${subName}', ${i}, this.textContent)">${tagObj.tag || tagObj}</span>
              <input placeholder="Opis" value="${tagObj.desc || ''}" onchange="editTagDesc('${groupName}', '${subName}', ${i}, this.value)" />
              <button onclick="removeTag('${groupName}', '${subName}', ${i})">❌</button>
            </div>`).join('')}
        </div>
      `;
      subsContainer.appendChild(subDiv);
    });
  });

  addDragAndDropHandlers();
}

function addGroup() {
  const groupName = prompt('Nazwa grupy (np. Czas i Miejsce):');
  if (!groupName) return;
  if (!tagsData[groupName]) {
    tagsData[groupName] = {};
    renderVisualEditor();
    updateJSONEditor();
  }
}

function addSubgroup(groupName) {
  const input = document.getElementById(`sub-${groupName}`);
  const subName = input.value.trim();
  if (!subName) return;
  if (!tagsData[groupName][subName]) {
    tagsData[groupName][subName] = [];
    renderVisualEditor();
    updateJSONEditor();
  }
  input.value = '';
}

function addTag(groupName, subName) {
  const input = document.getElementById(`tag-${groupName}-${subName}`);
  const tag = input.value.trim();
  if (!tag) return;
  const existingTags = tagsData[groupName][subName].map(t => t.tag || t);
  if (!existingTags.includes(tag)) {
    tagsData[groupName][subName].push({ tag: tag, desc: '' });
    renderVisualEditor();
    updateJSONEditor();
  }
  input.value = '';
}

function removeGroup(groupName) {
  delete tagsData[groupName];
  renderVisualEditor();
  updateJSONEditor();
}

function removeSubgroup(groupName, subName) {
  delete tagsData[groupName][subName];
  renderVisualEditor();
  updateJSONEditor();
}

function removeTag(groupName, subName, index) {
  tagsData[groupName][subName].splice(index, 1);
  renderVisualEditor();
  updateJSONEditor();
}

function editTagDesc(groupName, subName, index, desc) {
  if (typeof tagsData[groupName][subName][index] === 'string') {
    tagsData[groupName][subName][index] = { tag: tagsData[groupName][subName][index], desc: desc };
  } else {
    tagsData[groupName][subName][index].desc = desc;
  }
  updateJSONEditor();
}

function editTagName(groupName, subName, index, newTag) {
  const tag = tagsData[groupName][subName][index];
  tagsData[groupName][subName][index] = { tag: newTag, desc: tag.desc || '' };
  updateJSONEditor();
}

function editGroupName(groupIndex, newName) {
  const keys = Object.keys(tagsData);
  const oldKey = keys[groupIndex];
  if (oldKey !== newName) {
    tagsData[newName] = tagsData[oldKey];
    delete tagsData[oldKey];
    renderVisualEditor();
    updateJSONEditor();
  }
}

function editSubgroupName(groupName, subIndex, newName) {
  const subs = Object.keys(tagsData[groupName]);
  const oldSub = subs[subIndex];
  if (oldSub !== newName) {
    tagsData[groupName][newName] = tagsData[groupName][oldSub];
    delete tagsData[groupName][oldSub];
    renderVisualEditor();
    updateJSONEditor();
  }
}

function updateJSONEditor() {
  document.getElementById('tag-editor').value = JSON.stringify(tagsData, null, 2);
  renderVisualPreview();
}

function renderVisualPreview() {
  const preview = document.getElementById('visual-preview');
  let output = '';
  let index = 1;
  Object.entries(tagsData).forEach(([group, subs]) => {
    output += `${index}. ${group}\n`;
    let subIndex = 1;
    Object.entries(subs).forEach(([sub, tags]) => {
      output += `  ${index}.${subIndex} ${sub}\n`;
      tags.forEach(tagObj => {
        const tagText = tagObj.tag || tagObj;
        const desc = tagObj.desc ? ` [${tagObj.desc}]` : '';
        output += `    - ${tagText}${desc}\n`;
      });
      subIndex++;
    });
    index++;
  });
  preview.textContent = output;
}

function saveTags() {
  try {
    const json = JSON.parse(document.getElementById('tag-editor').value);
    localStorage.setItem('backup-tags', JSON.stringify(json));
    tagsData = json;
    renderVisualEditor();
    document.getElementById('status').textContent = 'Zapisano.';
  } catch (e) {
    alert('Nieprawidłowy JSON');
  }
}

function loadBackup() {
  const backup = localStorage.getItem('backup-tags');
  if (backup) {
    tagsData = JSON.parse(backup);
    document.getElementById('tag-editor').value = JSON.stringify(tagsData, null, 2);
    renderVisualEditor();
    renderVisualPreview();
    document.getElementById('status').textContent = 'Przywrócono z backupu';
  } else {
    alert('Brak backupu');
  }
}

function formatJSON() {
  try {
    const json = JSON.parse(document.getElementById('tag-editor').value);
    document.getElementById('tag-editor').value = JSON.stringify(json, null, 2);
  } catch (e) {
    alert('Nieprawidłowy JSON');
  }
}

function exportJSON() {
  const blob = new Blob([document.getElementById('tag-editor').value], {
    type: 'application/json;charset=utf-8'
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'tagi.json';
  link.click();
}

function resetToDefault() {
  fetch('https://raw.githubusercontent.com/BlueGalaxySlime/anime-manga-tags/main/tagi.json')
    .then(res => res.json())
    .then(data => {
      tagsData = data;
      document.getElementById('tag-editor').value = JSON.stringify(data, null, 2);
      renderVisualEditor();
      renderVisualPreview();
      document.getElementById('status').textContent = 'Załadowano z GitHub';
    });
}

function addDragAndDropHandlers() {
  const draggables = document.querySelectorAll('[draggable=true]');
  draggables.forEach(el => {
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', el.dataset.index);
      e.dataTransfer.effectAllowed = 'move';
    });

    el.addEventListener('dragover', e => e.preventDefault());
    el.addEventListener('drop', e => {
      e.preventDefault();
      const fromIndex = +e.dataTransfer.getData('text/plain');
      const toIndex = +el.dataset.index;
      const parent = el.parentElement;

      const items = [...parent.children];
      const item = items[fromIndex];
      if (!item) return;

      if (fromIndex < toIndex) {
        parent.insertBefore(item, items[toIndex + 1]);
      } else {
        parent.insertBefore(item, items[toIndex]);
      }

      // TODO: Sync order back into tagsData if needed
    });
  });
}

window.onload = () => {
  try {
    tagsData = JSON.parse(document.getElementById('tag-editor').value);
  } catch (e) {
    tagsData = {};
  }
  renderVisualEditor();
  renderVisualPreview();
};
