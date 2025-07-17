const editor = document.getElementById('tag-editor');
const preview = document.getElementById('json-preview');
let backup = '';

fetch('tagi.json')
  .then(res => res.json())
  .then(data => {
    editor.value = JSON.stringify(data, null, 2);
    backup = editor.value;
    renderVisualEditor(data);
    updatePreview();
  });

editor.addEventListener('input', () => {
  updatePreview();
});

function updatePreview() {
  try {
    const parsed = JSON.parse(editor.value);
    preview.textContent = JSON.stringify(parsed, null, 2);
    document.getElementById('status').textContent = '✓ JSON poprawny';
    document.getElementById('status').style.color = 'green';
  } catch (e) {
    document.getElementById('status').textContent = '✗ Błąd JSON: ' + e.message;
    document.getElementById('status').style.color = 'red';
  }
}

function saveTags() {
  if (confirm('Na pewno zapisać?')) {
    backup = editor.value;
    alert('Zapisano lokalnie (symulacja).');
  }
}

function loadBackup() {
  if (backup) {
    editor.value = backup;
    updatePreview();
  }
}

function formatJSON() {
  try {
    const obj = JSON.parse(editor.value);
    editor.value = JSON.stringify(obj, null, 2);
    updatePreview();
  } catch (e) {
    alert('Nieprawidłowy JSON!');
  }
}

function exportJSON() {
  const blob = new Blob([editor.value], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'tagi-export.json';
  link.click();
}

document.getElementById('importFile').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    editor.value = e.target.result;
    updatePreview();
  };
  reader.readAsText(file);
});

// === Wizualny formularz edycji tagów ===

function renderVisualEditor(data) {
  const container = document.getElementById('visual-editor');
  container.innerHTML = '';
  data.forEach((group, gIndex) => {
    const groupDiv = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = group.nazwa;
    groupDiv.appendChild(legend);

    group.podgrupy.forEach((sub, sIndex) => {
      const subDiv = document.createElement('div');
      const title = document.createElement('h4');
      title.textContent = sub.nazwa;
      subDiv.appendChild(title);

      sub.tagi.forEach((tag, tIndex) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = tag.tag;
        input.placeholder = 'tag';
        input.oninput = () => updateFromVisual();
        subDiv.appendChild(input);

        const desc = document.createElement('input');
        desc.type = 'text';
        desc.value = tag.desc || '';
        desc.placeholder = 'opis (opcjonalny)';
        desc.oninput = () => updateFromVisual();
        subDiv.appendChild(desc);
      });

      groupDiv.appendChild(subDiv);
    });

    container.appendChild(groupDiv);
  });
}

function updateFromVisual() {
  // Możliwość w przyszłości automatycznej synchronizacji JSON z formularza.
}
