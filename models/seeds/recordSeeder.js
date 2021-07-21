const Record = require('../record')
const db = require('../../config/mongoose')

const data = [
  {
    name: '買菜',
    category: '餐飲食品',
    date: '2021-07-20',
    amount: 1300
  },
  {
    name: '95跳停',
    category: '交通出行',
    date: '2021-07-20',
    amount: 1000
  },
  {
    name: '冷氣修理',
    category: '家居物業',
    date: '2021-07-20',
    amount: 3000
  },
  {
    name: 'RimWorld',
    category: '休閒娛樂',
    date: '2021-07-20',
    amount: 598
  }
]

db.once('open', () => {
  Record.create(data)
    .then(() => {
      console.log('Record seeder added successfully!')
      db.close()
    })
    .catch(err => console.error(err))
})