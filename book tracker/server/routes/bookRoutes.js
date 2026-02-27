const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Search Google Books API
router.get('/search-google', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Search query is required' });

  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&key=${process.env.GOOGLE_BOOKS_API_KEY || ''}`);
    const items = response.data.items || [];
    const books = items.map(item => ({
      googleBooksId: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
      genre: item.volumeInfo.categories ? item.volumeInfo.categories[0] : 'Unknown Genre',
      coverImage: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : null,
      description: item.volumeInfo.description,
      pageCount: item.volumeInfo.pageCount,
      publishedDate: item.volumeInfo.publishedDate
    }));
    res.json(books);
  } catch (error) {
    console.error('Error fetching from Google Books:', error.message);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a book
router.post('/', upload.single('coverImage'), async (req, res) => {
  try {
    const bookData = { ...req.body };
    if (req.file) {
      bookData.coverImage = `/uploads/${req.file.filename}`;
    }
    const newBook = new Book(bookData);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a book
router.put('/:id', upload.single('coverImage'), async (req, res) => {
  try {
    const bookData = { ...req.body };
    if (req.file) {
      bookData.coverImage = `/uploads/${req.file.filename}`;
    }
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, bookData, { new: true });
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
