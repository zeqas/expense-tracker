const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

// create
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const { name, category, date, amount } = req.body

  if (!name || !category || !date || !amount) {
    return res.redirect('/records/new')
  }
  return Record.create({ name, category, date, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// edit 
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const updatedRecord = req.body
  return Record.findById(id)
    .then(record => {
      record.name = updatedRecord.name
      record.category = updatedRecord.category
      record.date = updatedRecord.date
      record.amount = updatedRecord.amount
      return record.save()
    })
    .then(() => res.redirect(`/records/${id}`))
    .catch(error => console.error(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router