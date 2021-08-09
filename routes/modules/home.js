const express = require('express')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/record')

const dateToString = require('../../tools/dateToString')


router.get('/', async (req, res) => {
  const userId = req.user._id
  const categoryList = await Category.find().lean()
  const categoryData = {}

  categoryList.forEach(category => {
    // 舉例： '交通出行'　替換成　'fas fa-shuttle-van'，並存放到categoryData內
    categoryData[category.categoryName] = category.categoryIcon
  })

  Record.find({ userId })
    .sort({ date: 'asc' })
    .lean()
    .then(records => {
      let totalAmount = 0
      // console.log(records)
      records.map(record => {
        totalAmount += record.amount
        record.date = dateToString(record.date)
        record.categoryIcon = categoryData[record.category]
      })
      res.render('index', { records, totalAmount, categoryList })
    })
    .catch(err => console.error(err))
})

router.get('/filter', async (req, res) => {
  const categoryName = req.query.category
  const categoryList = await Category.find().lean()

  // 只列出 Category 內符合categoryName的檔案
  const category = await Category.findOne({ categoryName })
  
  if (!category) return res.redirect('/')

  // 列出所有在 Record 內符合的 record(可能要加s) #沒開黃腔
  // 應該可以不用另外設置 filter 就篩選出類別？
  return Record.find({ category: category.categoryName })
    .sort({ date: 'asc' })
    .lean()
    .then(records => {
      let totalAmount = 0
      records.map(record => {
        record.date = dateToString(record.date)
        totalAmount += record.amount
        record.categoryIcon = category.categoryIcon
      })
      res.render('index', { records, totalAmount, theCategory: category.categoryName, categoryList })
    })

})

module.exports = router