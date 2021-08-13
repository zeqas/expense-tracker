const express = require('express')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/record')

const dateToString = require('../../tools/dateToString')

// const categoryList = new Promise((resolve, reject) => {
//   if (error) {
//     return reject('error happened')
//   }
//   resolve({
//     const categoryData = Category.find().lean()
//     如何使用Promise來回傳 Category.find().lean() 內的資料?
//   })
// })

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const categoryList = await Category.find().lean()
    const categoryData = {}

    categoryList.forEach(category => 
      categoryData[category.categoryName] = category.categoryIcon
    )
    
    const records = await Record.find({ userId }).sort({ date: 'asc' }).lean()
    
    let totalAmount = 0
    records.forEach(record => {
      totalAmount += record.amount
      record.date = dateToString(record.date)
      record.categoryIcon = categoryData[record.category]
    })
    res.render('index', { records, totalAmount, categoryList })
  } catch (error) {
    console.error(error)
  }
})

router.get('/filter', async (req, res) => {
  try {
    const userId = req.user._id
    const filteredCategory = req.query.category ? req.body.category : { $ne: '' }
    const filteredMonth = Number(req.query.month)
    const categoryList = await Category.find().lean()

    const filteredQuery = { userId }
    // 篩選類別和月份
    filteredCategory ? filteredQuery.category = filteredCategory : ''
    filteredMonth ? filteredQuery.month = filteredMonth : ''

    // 用 $project 選取欄位、 $match 篩選
    const records = await Record.aggregate([
      { $project: { name: 1, merchant: 1, category: 1, date: 1, amount: 1, userId: 1, month: { $month: '$date' } } },
      { $match: filteredQuery }
    ])

    const categoryData = {}
    
    categoryList.forEach(category => 
      categoryData[category.categoryName] = category.categoryIcon
    )

    let totalAmount = 0
    records.forEach(record => {
      record.date = dateToString(record.date)
      totalAmount += record.amount
      record.categoryIcon = categoryData[record.category]
    })

    return res.render('index', { records, totalAmount, filteredCategory, categoryList, filteredMonth })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router