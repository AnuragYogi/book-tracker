import React, { useState, useEffect } from 'react';
import { getBooks } from '../services/api';
import { BookOpen, CheckCircle, Clock, Star, Trophy, Target, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    reading: 0,
    toRead: 0,
    genres: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getBooks();
        const books = response.data;
        
        const newStats = {
          total: books.length,
          read: books.filter(b => b.status === 'Read').length,
          reading: books.filter(b => b.status === 'Reading').length,
          toRead: books.filter(b => b.status === 'To Read').length,
          genres: books.reduce((acc, b) => {
            const genre = b.genre || 'Uncategorized';
            acc[genre] = (acc[genre] || 0) + 1;
            return acc;
          }, {})
        };
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return null;

  const topGenre = Object.entries(stats.genres).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-950 mb-4">Reading Dashboard</h1>
        <p className="text-indigo-600 text-lg font-medium">Tracking your literary journey and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={<BookOpen className="text-indigo-600" />} 
          label="Total Books" 
          value={stats.total} 
          color="bg-indigo-50"
        />
        <StatCard 
          icon={<CheckCircle className="text-green-600" />} 
          label="Books Read" 
          value={stats.read} 
          color="bg-green-50"
        />
        <StatCard 
          icon={<Clock className="text-blue-600" />} 
          label="Currently Reading" 
          value={stats.reading} 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<Star className="text-amber-600" />} 
          label="Favorite Genre" 
          value={topGenre} 
          color="bg-amber-50"
          isString
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-indigo-50">
          <h2 className="text-2xl font-bold text-indigo-950 mb-8 flex items-center gap-3">
            <TrendingUp className="text-indigo-600" /> Reading Progress
          </h2>
          <div className="space-y-8">
            <ProgressBar label="Read" count={stats.read} total={stats.total} color="bg-green-500" />
            <ProgressBar label="Reading" count={stats.reading} total={stats.total} color="bg-blue-500" />
            <ProgressBar label="To Read" count={stats.toRead} total={stats.total} color="bg-indigo-300" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-indigo-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-indigo-700 rounded-2xl flex items-center justify-center mb-6 border-2 border-indigo-500 shadow-xl">
              <span className="text-3xl font-bold">JD</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">John Doe</h3>
            <p className="text-indigo-300 mb-8">Avid Reader & Collector</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-indigo-800/50 p-4 rounded-xl border border-indigo-700">
                <Trophy className="text-amber-400" size={24} />
                <div>
                  <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider">Level 12</p>
                  <p className="font-bold">Master Librarian</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-indigo-800/50 p-4 rounded-xl border border-indigo-700">
                <Target className="text-rose-400" size={24} />
                <div>
                  <p className="text-xs text-indigo-300 uppercase font-bold tracking-wider">2026 Goal</p>
                  <p className="font-bold">{stats.read} / 50 Books</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, isString = false }) => (
  <div className={`${color} p-6 rounded-3xl border border-white shadow-sm transition hover:shadow-md`}>
    <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
      {icon}
    </div>
    <p className="text-gray-600 font-medium mb-1">{label}</p>
    <p className={`font-black text-gray-900 ${isString ? 'text-xl' : 'text-3xl'}`}>{value}</p>
  </div>
);

const ProgressBar = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="font-bold text-indigo-950">{label}</span>
        <span className="text-sm font-bold text-indigo-600">{Math.round(percentage)}% ({count})</span>
      </div>
      <div className="w-full bg-indigo-50 h-4 rounded-full overflow-hidden border border-indigo-100 p-0.5">
        <div 
          className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Dashboard;
