// 用不到 ?

function inputValidation(data) {
  const { name, category, date, amount } = data
  const validationResults = {
    name: true,
    category: true,
    date: true,
    amount: true
  }
  name.trim().length === 0 ? validationResults.name = false : ''
  category.length === 0 ? validationResults.category = false : ''
  date.length === 0 ? validationResults.date = false : ''
  amount.length === 0 ? validationResults.amount = false : ''

  return validationResults
}

module.exports = inputValidation