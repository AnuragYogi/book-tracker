import React from 'react';
import { Trash2, Edit2, BookOpen, Clock, CheckCircle, ChevronDown } from 'lucide-react';

const BookCard = ({ book, onEdit, onDelete, onStatusUpdate }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Read': return <CheckCircle size={14} className="text-green-500" />;
      case 'Reading': return <Clock size={14} className="text-blue-500" />;
      default: return <BookOpen size={14} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Read': return 'bg-green-50 text-green-700 border-green-100';
      case 'Reading': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const imageUrl = book.coverImage?.startsWith('http') 
    ? book.coverImage 
    : `http://localhost:5000${book.coverImage}`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl || 'https://via.placeholder.com/150x200?text=No+Cover'} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => onEdit(book)}
            className="p-2 bg-white/95 rounded-full shadow-lg hover:bg-white text-blue-600 transition transform hover:scale-110"
            title="Edit Book"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(book._id)}
            className="p-2 bg-white/95 rounded-full shadow-lg hover:bg-white text-red-600 transition transform hover:scale-110"
            title="Delete Book"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 leading-tight mb-1">{book.title}</h3>
          <p className="text-gray-500 text-sm truncate">by {book.author}</p>
        </div>
        
        <div className="mt-auto pt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
              {book.genre || 'General'}
            </span>
          </div>

          <div className="relative group/status">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${getStatusColor(book.status)}`}>
              {getStatusIcon(book.status)}
              <span className="flex-1">{book.status}</span>
              <ChevronDown size={14} className="opacity-50" />
            </div>
            <select
              value={book.status}
              onChange={(e) => onStatusUpdate(book._id, e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="To Read">To Read</option>
              <option value="Reading">Reading</option>
              <option value="Read">Read</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
