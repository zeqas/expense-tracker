// 用在 new & edit 
function inputValidation(data) {
  const { name, category, merchant, date, amount } = data
  const validationResults = {
    name: true,
    merchant: true,
    category: true,
    date: true,
    amount: true
  }
  name.trim().length === 0 ? validationResults.name = false : ''
  merchant.trim().length === 0 ? validationResults.merchant = false : ''
  category.length === 0 ? validationResults.category = false : ''
  date.length === 0 ? validationResults.date = false : ''
  amount.length === 0 || amount <= 0 ? validationResults.amount = false : ''

  return validationResults
}

module.exports = inputValidation