const editor = document.getElementById('tag-editor');
const status = document.getElementById('status');

fetch('tagi.json')
  .then(res => res.json())
  .then(data => {
    editor.value = JSON.stringify(data, null, 2);
  });

function saveTags() {
  try {
    const json = JSON.parse(editor.value);
    localStorage.setItem('tagi.json-backup', JSON.stringify(json));
    status.textContent = 'Zapisano lokalnie. Skopiuj zawartość i wklej ręcznie do GitHuba.';
    status.style.color = 'green';
  } catch (e) {
    status.textContent = 'Błąd: Niepoprawny JSON';
    status.style.color = 'red';
  }
}
