import React from 'react';
import { BookOpen, User, PlusCircle, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">LibTracker</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="flex items-center space-x-1 hover:text-indigo-200 transition">
              <LayoutDashboard size={20} />
              <span>Library</span>
            </Link>
            <Link to="/add" className="flex items-center space-x-1 hover:text-indigo-200 transition">
              <PlusCircle size={20} />
              <span>Add Book</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 hover:text-indigo-200 transition">
              <User size={20} />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
