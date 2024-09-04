const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: String
});

module.exports = PhotoSchema;