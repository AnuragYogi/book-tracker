import axios from 'axios';

const API_URL = 'http://localhost:5000/api/books';

const api = axios.create({
  baseURL: API_URL,
});

export const getBooks = () => api.get('/');
export const addBook = (bookData) => api.post('/', bookData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateBook = (id, bookData) => api.put(`/${id}`, bookData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateBookStatus = (id, status) => api.put(`/${id}`, { status }, {
  headers: { 'Content-Type': 'application/json' }
});
export const deleteBook = (id) => api.delete(`/${id}`);
export const searchGoogleBooks = (query) => api.get(`/search-google?q=${query}`);

export default api;
