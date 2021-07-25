const express = require('express')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/record')

const dateToString = require('../../tools/dateToString')

// 目前時間 = today

let today = new Date()
today = dateToString(today)

// create
router.get('/new', async (req, res) => {
  const categories = await Category.find().lean()
  res.render('new', { today, categories })
})

router.post('/', (req, res) => {
  Record.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 如果要驗證表單?

// router.post('/new', (req, res) => {
//   const record = req.body
//   const validation = inputValidation(record)

//   if (Object.values(validation).includes(false)) {
//     res.render('new', { validation, today, record })
//   } else {
//     return Record.create({
//       name: record.name,
//       date: record.date,
//       category: record.category,
//       amount: record.amount
//     })
//       .then(() => res.redirect('/'))
//       .catch(err => console.error(err))
//   }
// })


// edit page
router.get('/:id/edit', async (req, res) => {
  const id = req.params.id
  const categories = await Category.find().lean()
  return Record.findById(id)
    .lean()
    .then(record => {
      const currentDate = dateToString(record.date) 
      res.render('edit', { record, currentDate, categories })
    })
    .catch(error => console.log(error))
})

// edit record
router.put('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => {
      // 合併 record 和 req.body
      Object.assign(record, req.body)
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))

  
  // const updatedRecord = req.body
  // const validation = inputValidation(updatedRecord) 
  // if (Object.values(validation).includes(false)) {
  //   return Record.findById(id)
  //     .lean()
  //     .then(record => {
  //       const currentDate = dateToString(record.date)
  //       res.render('edit', { record, currentDate, validation })
  //     })
  //     .catch(err => console.error(err))
  // } else {
  //   return Record.findById(id)
  //     .then(record => {
  //       record.name = updatedRecord.name
  //       record.category = updatedRecord.category
  //       record.date = updatedRecord.date
  //       record.amount = updatedRecord.amount
  //       return record.save()
  //     })
  //     .then(() => res.redirect(`/records/${id}`))
  //     .catch(error => console.error(error))
  // }
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