const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Record = require('../record')
const User = require('../user')

const db = require('../../config/mongoose')

const SEED_USER =  {
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678',
}
  // {
  //   name: 'user2',
  //   email: 'user2@example.com',
  //   password: '12345678',
  //   ownedRecords: [3, 4]
  // }

const recordData = [
  {
    name: '買菜',
    merchant: '市場',
    category: '餐飲食品',
    date: '2021-07-20',
    amount: 1300
  },
  {
    name: '95跳停',
    merchant: '中油',
    category: '交通出行',
    date: '2021-07-20',
    amount: 1000
  },
  {
    name: '冷氣修理',
    merchant: '家電商',
    category: '家居物業',
    date: '2021-07-20',
    amount: 3000
  },
  {
    name: 'RimWorld',
    merchant: 'Steam',
    category: '休閒娛樂',
    date: '2021-07-20',
    amount: 598
  }
]

db.once('open', () => { 
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => 
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash
      })
    ) 
    .then(user => {
      const userId = user._id
      return Promise.all(
        Array.from({ length: recordData.length }, (_, i) => 
          Record.create({
            name: recordData[i].name,
            merchant: recordData[i].merchant,
            category: recordData[i].category,
            date: recordData[i].date,
            amount: recordData[i].amount,
            userId
          })
        )
      )
    })
    .then(() => {
      console.log('Record seeder added successfully!')
      db.close()
      process.exit()
    })
    .catch((error) => console.error(error))
})