const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  // 載入 Category的Schema, 並且將type設定為 ObjectId
  categoryName: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema)