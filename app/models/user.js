const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  firstName: {
    type : String,
    require : true
  },
  lastName: String,
  role: String,
  avatar: String,
  age : Number
}, {
  collection: 'users',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
})

module.exports = Schema