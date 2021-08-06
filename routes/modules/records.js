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

// create
router.get('/new', async (req, res) => {
  // 取得類別資料
  const categoryList = await Category.find().lean()
  res.render('new', { today, categoryList })
})

router.post('/new', (req, res) => {
  const record = req.body
  console.log(record)
  const validation = inputValidation(record)
  // 驗證功能
  // 如何處理在顯示錯誤後，再次選擇類別?
  if (Object.values(validation).includes(false)) {
    res.render('new', { validation, today, record })
  } else {
    return Record.create({
      name: record.name,
      category: record.category,
      date: record.date,
      amount: record.amount
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
  }
})

// edit page
router.get('/:id/edit', async (req, res) => {
  const id = req.params.id
  const categoryList = await Category.find().lean()
  return Record.findById(id)
    .lean()
    .then(record => {
      const currentDate = dateToString(record.date) 
      res.render('edit', { record, currentDate, categoryList })
    })
    .catch(error => console.log(error))
})

// edit record
router.put('/:id', (req, res) => {
  const id = req.params.id
  const editedRecord = req.body
  const validation = inputValidation(editedRecord)

  if (Object.values(validation).includes(false)) {
    return Record.findById(id)
      .lean()
      .then(record => {
        const currentDate = dateToString(record.date)
        res.render('edit', { record, currentDate, validation })
      })
      .catch(err => console.error(err))
  } else {
    return Record.findById(id)
      .then(record => {
        [ record.name, record.category, record.date, record.amount ] = [ editedRecord.name, 
        editedRecord.category, 
        editedRecord.date, 
        editedRecord.amount ]
        return record.save()
      })
      .then(() => {
        res.redirect('/')
      })
      .catch(err => console.error(err))
  }
})

// delete
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  // id 不存在則返回首頁
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.redirect('/')
  }
  return Record.findById(_id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router