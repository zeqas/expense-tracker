const db = require('../../config/mongoose')
const Category = require('../category')
const Record = require('../record')

const data = [
  {
    name: '買菜',
    categoryName: '餐飲食品',
    date: '2021-07-20',
    amount: 1300
  },
  {
    name: '95跳停',
    categoryName: '交通出行',
    date: '2021-07-20',
    amount: 1000
  },
  {
    name: '冷氣修理',
    categoryName: '家居物業',
    date: '2021-07-20',
    amount: 3000
  },
  {
    name: 'RimWorld',
    categoryName: '休閒娛樂',
    date: '2021-07-20',
    amount: 598
  }
]

db.once('open', () => {
  const categoryList = {}

  Category.find()
    .lean()
    .then(categories => {
      categories.forEach(category => {
        // 將 Category 每一項 categoryName 當作 category 的 id
        categoryList[category.categoryName] = category._id
      })
      return data.map(record => ({
        name: record.name,
        categoryName: categoryList[record.categoryName],
        date: record.date,
        amount: record.amount
      }))
    })
    .then(data => {
      Record.create(data)
        .then(() => {
          console.log('Record seeder added successfully!')
          db.close()
        })
  })
  .catch(err => console.error(err))
})