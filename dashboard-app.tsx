import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie } from 'recharts';
import { Search, Moon, Sun, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    dateFrom: '',
    dateTo: '',
    type: 'all'
  });
  const [payoutRate, setPayoutRate] = useState(() => {
    const saved = localStorage.getItem('payoutRate');
    return saved ? parseFloat(saved) : 50;
  });

  // Simulated news data fetch
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Simulated API call
        const mockData = [
          { id: 1, title: 'Tech News', author: 'John Doe', date: '2024-01-01', type: 'news' },
          { id: 2, title: 'AI Updates', author: 'Jane Smith', date: '2024-01-02', type: 'blog' },
          // Add more mock data as needed
        ];
        setArticles(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news data');
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Save payout rate to localStorage
  useEffect(() => {
    localStorage.setItem('payoutRate', payoutRate.toString());
  }, [payoutRate]);

  const calculateTotalPayout = () => {
    return articles.length * payoutRate;
  };

  const filteredArticles = articles.filter(article => {
    return (
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.author === '' || article.author === filters.author) &&
      (filters.type === 'all' || article.type === filters.type)
    );
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">News Dashboard</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-4 py-2"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="news">News</option>
              <option value="blog">Blog</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Articles</h3>
            <p className="text-3xl font-bold">{articles.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Payout Rate</h3>
            <input
              type="number"
              value={payoutRate}
              onChange={(e) => setPayoutRate(parseFloat(e.target.value))}
              className="text-xl font-bold bg-transparent w-32"
            />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Payout</h3>
            <p className="text-3xl font-bold">${calculateTotalPayout()}</p>
          </div>
        </div>

        {/* Article Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-right">Payout</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id} className="border-t">
                  <td className="px-4 py-2">{article.title}</td>
                  <td className="px-4 py-2">{article.author}</td>
                  <td className="px-4 py-2">{article.type}</td>
                  <td className="px-4 py-2">{article.date}</td>
                  <td className="px-4 py-2 text-right">${payoutRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export Options */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;