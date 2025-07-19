// models/bookModel.js

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  genre: String,
  status: { type: String, enum: ["To Read", "Reading", "Read"], default: "To Read" },
  cover: String, // optional field for uploaded image URL or base64 string
});

module.exports = mongoose.model("Book", bookSchema);
