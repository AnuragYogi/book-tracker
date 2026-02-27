import React, { useState } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import { searchGoogleBooks } from '../services/api';

const GoogleBooksSearch = ({ onSelectBook }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await searchGoogleBooks(query);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch books from Google Books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 mb-8">
      <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
        <Search className="text-indigo-600" size={24} />
        Search Google Books to Autofill
      </h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          className="flex-1 px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mb-4 text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {results.map((book) => (
            <div 
              key={book.googleBooksId} 
              className="flex gap-4 p-4 border border-indigo-50 rounded-xl hover:bg-indigo-50/50 cursor-pointer transition group"
              onClick={() => onSelectBook(book)}
            >
              <img 
                src={book.coverImage || 'https://via.placeholder.com/80x120?text=No+Cover'} 
                alt={book.title} 
                className="w-16 h-24 object-cover rounded shadow-sm group-hover:scale-105 transition"
              />
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-sm text-indigo-900 truncate">{book.title}</h4>
                <p className="text-xs text-indigo-600 truncate mb-2">by {book.author}</p>
                <button 
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-indigo-200 transition"
                >
                  <Plus size={12} /> Use Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleBooksSearch;
