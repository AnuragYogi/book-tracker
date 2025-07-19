const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/books.json');

// GET all books
router.get('/', (req, res) => {
  fs.readFile(dataFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read books file' });
    res.json(JSON.parse(data));
  });
});

// POST add a book
router.post('/', (req, res) => {
  const newBook = req.body;
  fs.readFile(dataFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read books file' });

    const books = JSON.parse(data);
    books.push({ ...newBook, id: Date.now().toString() });

    fs.writeFile(dataFile, JSON.stringify(books, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to write to books file' });
      res.status(201).json({ message: 'Book added successfully' });
    });
  });
});

// PUT edit a book
router.put('/:id', (req, res) => {
  const bookId = req.params.id;
  const updatedData = req.body;

  fs.readFile(dataFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read books file' });

    let books = JSON.parse(data);
    books = books.map(book => (book.id === bookId ? { ...book, ...updatedData } : book));

    fs.writeFile(dataFile, JSON.stringify(books, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to update book' });
      res.json({ message: 'Book updated successfully' });
    });
  });
});

// DELETE a book
router.delete('/:id', (req, res) => {
  const bookId = req.params.id;

  fs.readFile(dataFile, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read books file' });

    let books = JSON.parse(data);
    books = books.filter(book => book.id !== bookId);

    fs.writeFile(dataFile, JSON.stringify(books, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to delete book' });
      res.json({ message: 'Book deleted successfully' });
    });
  });
});

module.exports = router;
