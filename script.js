const saveButton = document.getElementById('save-button');
const titleInput = document.getElementById('title-input');
const linkInput = document.getElementById('link-input');
const outputDiv = document.getElementById('output');
const tableBody = document.getElementById('table-body');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmDeleteButton = document.getElementById('confirm-delete');
const cancelDeleteButton = document.getElementById('cancel-delete');

let editingIndex = -1;

// Mengambil data dari local storage saat halaman dimuat
const savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];

// Menampilkan data yang sudah disimpan
savedLinks.forEach((linkData, index) => {
  const linkItem = createLinkItem(linkData, index);
  tableBody.appendChild(linkItem);
});

saveButton.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const link = linkInput.value.trim();

  if (title === '' || link === '') {
    alert('Mohon masukkan judul dan link Google Drive.');
    return;
  }

  if (editingIndex === -1) {
    const linkData = { title, link };
    const linkItem = createLinkItem(linkData, savedLinks.length);
    tableBody.appendChild(linkItem);

    savedLinks.push(linkData);
  } else {
    const linkItem = tableBody.children[editingIndex];
    const linkData = savedLinks[editingIndex];

    linkData.title = title;
    linkData.link = link;

    const linkTitleCell = linkItem.querySelector('.link-title-cell');
    const linkAnchor = linkItem.querySelector('a');

    linkTitleCell.textContent = title;
    linkAnchor.href = link;
    linkAnchor.textContent = link;

    editingIndex = -1;
  }

  localStorage.setItem('savedLinks', JSON.stringify(savedLinks));

  titleInput.value = '';
  linkInput.value = '';
  saveButton.textContent = 'Simpan';
});

function createLinkItem(linkData, index) {
  const linkItem = document.createElement('tr');

  const linkTitleCell = document.createElement('td');
  linkTitleCell.textContent = linkData.title;
  linkTitleCell.classList.add('link-title-cell');
  linkItem.appendChild(linkTitleCell);

  const linkAnchorCell = document.createElement('td');
  const linkAnchor = document.createElement('a');
  linkAnchor.href = linkData.link;
  linkAnchor.textContent = linkData.link;
  linkAnchor.target = '_blank';
  linkAnchorCell.appendChild(linkAnchor);
  linkItem.appendChild(linkAnchorCell);

  const actionsCell = document.createElement('td');
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    titleInput.value = linkData.title;
    linkInput.value = linkData.link;
    saveButton.textContent = 'Update';
    editingIndex = index;
  });
  actionsCell.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Hapus';
  deleteButton.addEventListener('click', () => {
    confirmDialog.style.display = 'flex';

    confirmDeleteButton.addEventListener('click', () => {
      linkItem.remove();
      savedLinks.splice(index, 1);
      localStorage.setItem('savedLinks', JSON.stringify(savedLinks));
      confirmDialog.style.display = 'none';
    });

    cancelDeleteButton.addEventListener('click', () => {
      confirmDialog.style.display = 'none';
    });
  });
  actionsCell.appendChild(deleteButton);

  linkItem.appendChild(actionsCell);

  return linkItem;
}