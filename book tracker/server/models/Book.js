const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  status: { 
    type: String, 
    enum: ['To Read', 'Reading', 'Read'], 
    default: 'To Read' 
  },
  coverImage: { type: String },
  googleBooksId: { type: String },
  description: { type: String },
  pageCount: { type: Number },
  publishedDate: { type: String },
  user: { type: String, default: 'default_user' } // Simple for now, can expand later
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
