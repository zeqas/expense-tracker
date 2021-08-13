const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Category = require('../../models/category')
const Record = require('../../models/record')

const dateToString = require('../../tools/dateToString')
const inputValidation = require('../../tools/inputValidation')

// 目前時間 = today

let today = new Date()
today = dateToString(today)

// 類別資料
// 如何用 Promise.all 只拿一次資料
// const categoryList = Promise.all(Array.from({length: Category.length }, (_, i)=> Category.find().lean()))
// console.log(categoryList)

// create
router.get('/new', async (req, res) => {
  const categoryList = await Category.find().lean()
  res.render('new', { today, categoryList })
})

router.post('/', async (req, res) => {
  const record = req.body
  const userId = req.user._id
  const validation = inputValidation(record)
  const categoryList = await Category.find().lean()
  // 驗證功能
  // 如何處理在顯示錯誤後，再次選擇類別?
  if (Object.values(validation).includes(false)) {
    res.render('new', { validation, today, record, categoryList})
  } else {
    await Record.create({
      name: record.name,
      merchant: record.merchant,
      category: record.category,
      date: record.date,
      amount: record.amount,
      userId
    })
    .then(() => {
      req.flash('success_msg', '建立支出紀錄：成功')
      res.redirect('/')
    })
    .catch(error => console.log(error))
  }
})

// edit page
router.get('/:id/edit', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const categoryList = await Category.find().lean()
  return Record.findOne({ _id, userId })
    .lean()
    .then(record => {
      if ((!record) || (!mongoose.Types.ObjectId.isValid(_id))){
        return res.redirect('back')
      }
      
      const currentDate = dateToString(record.date) 
      res.render('edit', { record, currentDate, categoryList })
    })
    .catch(error => console.log(error))
})

// edit record
router.put('/:id',async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const editedRecord = req.body
  const categoryList = await Category.find().lean()
  const validation = inputValidation(editedRecord)

  if (Object.values(validation).includes(false)) {
    
    return Record.findOne({ _id, userId })
      .lean()
      .then(record => {
        const currentDate = dateToString(record.date)
        res.render('edit', { record, currentDate, validation, categoryList })
      })
      .catch(error => console.error(error))
  } else {
    return Record.findOne({ _id, userId })
      .then(record => {
        record.name = editedRecord.name
        record.merchant = editedRecord.merchant
        record.category = editedRecord.category
        record.date = editedRecord.date
        record.amount = editedRecord.amount
        return record.save()
      })
      .then(() => {
        req.flash('success_msg', '修改支出紀錄：成功')
        res.redirect('/')
      })
      .catch(error => console.error(error))
  }
})

// delete
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.redirect('/')
  }
  return Record.findOne({ _id, userId })
    .then(record => {
      if ((!record) || (!mongoose.Types.ObjectId.isValid(_id))) {
        return res.redirect('back')
      }
      record.remove()
    })
    .then(() => {
      req.flash('success_msg', '刪除支出紀錄：成功')
      res.redirect('/')
    })
    .catch(error => console.log(error))
})

module.exports = router