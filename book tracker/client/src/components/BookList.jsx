import React, { useState, useEffect } from 'react';
import { getBooks, deleteBook, updateBookStatus } from '../services/api';
import BookCard from './BookCard';
import { Search, Filter, Plus, BookOpen, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, statusFilter, books]);

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await updateBookStatus(id, newStatus);
      // Update local state
      setBooks(books.map(book => 
        book._id === id ? { ...book, status: newStatus } : book
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filterBooks = () => {
    let result = books;
    
    if (statusFilter !== 'All') {
      result = result.filter(book => book.status === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term)
      );
    }
    
    setFilteredBooks(result);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        setBooks(books.filter(book => book._id !== id));
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleEdit = (book) => {
    navigate(`/edit/${book._id}`, { state: { book } });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-indigo-900 font-medium">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-950 mb-2">My Library</h1>
          <p className="text-indigo-600 font-medium">Manage and track your reading journey</p>
        </div>
        <button 
          onClick={() => navigate('/add')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-100 w-fit"
        >
          <Plus size={24} /> Add New Book
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-indigo-50 flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="text-indigo-600" size={20} />
          <select 
            className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none bg-white font-medium text-indigo-900"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="To Read">To Read</option>
            <option value="Reading">Reading</option>
            <option value="Read">Read</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map(book => (
            <BookCard 
              key={book._id} 
              book={book} 
              onDelete={handleDelete}
              onEdit={handleEdit}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-indigo-50 rounded-3xl p-16 text-center border-4 border-dashed border-indigo-100">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <BookOpen className="text-indigo-600" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-indigo-900 mb-2">No books found</h3>
          <p className="text-indigo-600 mb-8 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'All' 
              ? "We couldn't find any books matching your filters. Try adjusting your search." 
              : "Your library is empty. Start adding books to track your reading journey!"}
          </p>
          {(searchTerm || statusFilter !== 'All') && (
            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookList;
