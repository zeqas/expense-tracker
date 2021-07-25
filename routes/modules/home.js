const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res) => {
  const category = req.query.category
  const filter = {}
  
  // 假設 category 存在
  // filter 陣列放入 req.query.category

  if (category) { filter.category = category }

  // async & await
  // 等待 Category 執行完畢，確保categories 包含所有資料
  const categories = await Category.find().lean()

  Record.find(filter)
    .populate('category') // 引用文檔
    .lean()
    .then(records => {
      // // 轉換日期為字串

      // records.forEach(record => record.date = dateToString(record.date))
      
      let totalAmount = 0
      records.forEach(record => totalAmount += record.amount)
      res.render('index', { categories, category, records, totalAmount })
    })
    .catch(err => console.error(err))
})

module.exports = router