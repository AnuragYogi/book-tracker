import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/add" element={<BookForm />} />
            <Route path="/edit/:id" element={<BookForm />} />
            <Route path="/profile" element={<Dashboard />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-indigo-50 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-indigo-400 font-medium">© 2026 LibTracker. Your personal literary sanctuary.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
