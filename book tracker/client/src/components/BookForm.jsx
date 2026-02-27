import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook, updateBook } from '../services/api';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';
import GoogleBooksSearch from './GoogleBooksSearch';

const BookForm = ({ bookToEdit, onComplete }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'To Read',
    coverImage: null,
    description: '',
    pageCount: '',
    publishedDate: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        genre: bookToEdit.genre || '',
        status: bookToEdit.status || 'To Read',
        description: bookToEdit.description || '',
        pageCount: bookToEdit.pageCount || '',
        publishedDate: bookToEdit.publishedDate || ''
      });
      if (bookToEdit.coverImage) {
        setImagePreview(bookToEdit.coverImage.startsWith('http') 
          ? bookToEdit.coverImage 
          : `http://localhost:5000${bookToEdit.coverImage}`);
      }
    }
  }, [bookToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSelectFromGoogle = (googleBook) => {
    setFormData(prev => ({
      ...prev,
      title: googleBook.title || prev.title,
      author: googleBook.author || prev.author,
      genre: googleBook.genre || prev.genre,
      description: googleBook.description || prev.description,
      pageCount: googleBook.pageCount || prev.pageCount,
      publishedDate: googleBook.publishedDate || prev.publishedDate,
    }));
    if (googleBook.coverImage) {
      setImagePreview(googleBook.coverImage);
      // We store the URL if it's from Google, but the backend can handle both URL or file
      setFormData(prev => ({ ...prev, coverImage: googleBook.coverImage }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      if (bookToEdit) {
        await updateBook(bookToEdit._id, data);
      } else {
        await addBook(data);
      }
      onComplete ? onComplete() : navigate('/');
    } catch (err) {
      setError('Failed to save book. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-indigo-900 flex items-center gap-2">
          {bookToEdit ? 'Edit Book' : 'Add New Book'}
        </h1>
      </div>

      {!bookToEdit && <GoogleBooksSearch onSelectBook={handleSelectFromGoogle} />}

      <div className="bg-white rounded-2xl shadow-xl border border-indigo-50 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Form Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Book Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                  placeholder="Enter book title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                  placeholder="Enter author name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                    placeholder="Genre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none bg-white"
                  >
                    <option value="To Read">To Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Read">Read</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none resize-none"
                  placeholder="Short description of the book..."
                />
              </div>
            </div>

            {/* Right Column - Image Upload & Stats */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Book Cover</label>
                <div className="relative group">
                  {imagePreview ? (
                    <div className="relative aspect-[3/4] w-full max-w-[240px] mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-indigo-50">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, coverImage: null }));
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[3/4] w-full max-w-[240px] mx-auto rounded-2xl border-4 border-dashed border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition cursor-pointer">
                      <Upload size={48} className="text-indigo-200 mb-4 group-hover:text-indigo-400 transition" />
                      <span className="text-indigo-400 font-medium group-hover:text-indigo-600 transition">Upload Cover</span>
                      <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Page Count</label>
                  <input
                    type="number"
                    name="pageCount"
                    value={formData.pageCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                    placeholder="Pages"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Published Date</label>
                  <input
                    type="text"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition outline-none"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
            </div>

            {error && <div className="col-span-full text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

            <div className="col-span-full flex gap-4 pt-6 border-t border-indigo-50">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                {bookToEdit ? 'Update Book' : 'Save Book'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-4 rounded-xl font-bold border-2 border-indigo-50 text-indigo-600 hover:bg-indigo-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
