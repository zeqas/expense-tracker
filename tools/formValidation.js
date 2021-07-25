// category select
const category = document.querySelector('#category') // CSS選擇器
category.value = category.dataset.value

// validation
const form = document.querySelector('.needs-validation') // 選擇有標籤的class
form.addEventListener('submit', function onFormSubmitted(event) {
  if (!form.checkValidity()) {
    event.preventDefault() // 取消瀏覽器預設行為
    event.stopPropagation() // 停止當前事件繼續冒泡
  }
  form.classList.add('was-validated') // 新增"已驗證"的 classList
}, false)

//////// 不管結果如何都會觸發? 