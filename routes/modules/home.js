const express = require('express')
const dayjs = require('dayjs')
const localeData = require('dayjs/plugin/localeData')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/record')

dayjs.extend(localeData)
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
    const month = dayjs.months()
    const categoryList = await Category.find().lean()
    const categoryData = {}
    
    categoryList.forEach(category => 
      categoryData[category.categoryName] = category.categoryIcon
    )
    
    const records = await Record.find({ userId }).sort({ date: 'asc' }).lean()
    
    let totalAmount = 0
    records.forEach(record => {
      totalAmount += record.amount
      record.date = dayjs(record.date).format('YYYY-MM-DD')
      record.categoryIcon = categoryData[record.category]
    })
    res.render('index', { records, totalAmount, categoryList, month })
  } catch (error) {
    console.error(error)
  }
})

router.get('/filter', async (req, res) => {
  try {
    const userId = req.user._id
    const { filteredCategory, filteredMonth } = req.query
    // const filteredMonth = Number(req.query.month)
    const month = dayjs.months()
    const categoryList = await Category.find().lean()

    const filteredQuery = { userId }
    // 篩選類別和月份
    filteredCategory ? filteredQuery.category = filteredCategory : ''
    
    const selectMonth = dayjs().month(month.indexOf(filteredMonth))
    filteredMonth ? filteredQuery.date = {
      $gte: dayjs(selectMonth).startOf('month').toDate(),
      $lte: dayjs(selectMonth).endOf('month').toDate()
    } : ''

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
      record.date = dayjs(record.date).format('YYYY-MM-DD')
      totalAmount += record.amount
      record.categoryIcon = categoryData[record.category]
    })

    return res.render('index', { records, totalAmount, categoryList, month, filteredCategory, filteredMonth })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router