// routes/bookRoutes.js

const express = require("express");
const router = express.Router();
const Book = require("../models/bookModel");

// POST /api/books - Add a new book
router.post("/", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
