const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

const dateToString = require('../../tools/dateToString')
const inputValidation = require('../../tools/inputValidation')

let today = new Date()
today = dateToString(today)

// filter category
router.get('/filter', (req, res) => {
  const categoryEngName = req.query.category
  const categoryData = {
    'home': '家居物業',
    'transportation': '交通出行',
    'entertainment': '休閒娛樂',
    'food': '餐飲食品',
    'others': '其他'
  }
  const category = categoryData[categoryEngName] 

  if (!category) return res.redirect('/')

  return Record.find({ category })
    .lean()
    .then(records => {
      records.forEach(record => record.date = dateToString(record.date))
      let totalAmount = 0
      records.forEach(record => totalAmount += record.amount)
      res.render('index', { records, totalAmount, category })
    })
})

// create
router.get('/new', (req, res) => {
  res.render('new', { today })
})

router.post('/new', (req, res) => {
  const record = req.body
  const validation = inputValidation(record)

  if (Object.values(validation).includes(false)) {
    res.render('new', { validation, today, record })
  } else {
    return Record.create({
      name: record.name,
      date: record.date,
      category: record.category,
      amount: record.amount
    })
      .then(() => res.redirect('/'))
      .catch(err => console.error(err))
  }
})


// edit  page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => {
      const currentDate = dateToString(record.date) 
      res.render('edit', { record, currentDate })
    })
    .catch(error => console.log(error))
})

// edit record
router.put('/:id', (req, res) => {
  const id = req.params.id
  const updatedRecord = req.body
  const validation = inputValidation(updatedRecord) 
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
        record.name = updatedRecord.name
        record.category = updatedRecord.category
        record.date = updatedRecord.date
        record.amount = updatedRecord.amount
        return record.save()
      })
      .then(() => res.redirect('/'))
      .catch(error => console.error(error))
  }
})

// delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router