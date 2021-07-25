function showDeleteModal(e) {
  const id = e.target.dataset.id
  const deleteButton = document.querySelector('#modal-delete-button')
  deleteButton.action = `./records/${id}?_method=DELETE`
}

const recordPanel = document.querySelector('.record-section')

recordPanel.addEventListener('click', (e) => {
  if (e.target.matches('#modal-button')) {
    showDeleteModal(e)
  }
})

// 分類：父層為 form 所以能夠使其重新顯示資料
const categoryFilter = document.querySelector('#category-filter')
categoryFilter.value = categoryFilter.dataset.value
categoryFilter.addEventListener('change', () => categoryFilter.parentElement.submit())