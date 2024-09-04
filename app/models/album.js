const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  photos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo'
  }]
});

module.exports = AlbumSchema;