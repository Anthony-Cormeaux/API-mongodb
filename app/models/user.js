const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: [30, 'First name cannot exceed 30 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z]+$/.test(v);
      },
      message: props => `${props.value} is not a valid first name! Only letters are allowed.`
    }
  },
  lastName: {
    type: String,
    required: false,
    maxlength: [30, 'Last name cannot exceed 30 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z]+$/.test(v);
      },
      message: props => `${props.value} is not a valid last name! Only letters are allowed.`
    }
  },
  role: String,
  avatar: String,
  age: Number
}, {
  collection: 'users',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = Schema;