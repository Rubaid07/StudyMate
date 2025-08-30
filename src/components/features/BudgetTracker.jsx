// src/features/BudgetTracker.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { FiEdit, FiTrash2, FiPlusCircle, FiX, FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart, FiCalendar, FiFilter } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categories = {
  income: ['Salary', 'Allowance', 'Scholarship', 'Freelance', 'Other Income'],
  expense: ['Food', 'Transport', 'Study Materials', 'Entertainment', 'Rent', 'Utilities', 'Personal', 'Other Expense'],
};

const expenseColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];

const BudgetTracker = () => {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: categories.expense[0],
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/budget`, {
        headers: {
          'x-user-id': user?.uid,
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
      });
      setEntries(response.data);
    } catch (err) {
      console.error('Error fetching budget entries:', err);
      setError('Failed to load budget entries.');
      toast.error('Failed to load budget entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchEntries();
    }
  }, [user?.uid]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value,
      // Update category when type changes
      ...(name === 'type' && { category: categories[value][0] })
    }));
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category: categories.expense[0],
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setEditingEntryId(null);
  };

  const handleAddOrUpdateEntry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.amount || !formData.category || !formData.date) {
      toast.error('Please fill in amount, category, and date.');
      setLoading(false);
      return;
    }
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error('Amount must be a positive number.');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (editingEntryId) {
        await axios.put(`${API_BASE_URL}/budget/${editingEntryId}`, dataToSend, {
          headers: {
            'x-user-id': user?.uid,
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          },
        });
        toast.success('Entry updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/budget`, dataToSend, {
          headers: {
            'x-user-id': user?.uid,
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          },
        });
        toast.success('Entry added successfully!');
      }
      fetchEntries();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving entry:', err);
      setError(`Failed to save entry: ${err.response?.data?.message || err.message}`);
      toast.error(`Failed to save entry: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (entryItem) => {
    setFormData({
      type: entryItem.type,
      amount: entryItem.amount,
      category: entryItem.category,
      date: entryItem.date ? new Date(entryItem.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: entryItem.description,
    });
    setEditingEntryId(entryItem._id);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.delete(`${API_BASE_URL}/budget/${id}`, {
        headers: {
          'x-user-id': user?.uid,
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
      });
      toast.success('Entry deleted successfully!');
      fetchEntries();
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete entry.');
      toast.error('Failed to delete entry.');
    } finally {
      setLoading(false);
    }
  };

  const filterEntriesByMonth = (entry) => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() + 1 === selectedMonth && entryDate.getFullYear() === selectedYear;
  };

  const currentMonthEntries = entries.filter(filterEntriesByMonth);

  const totalIncome = currentMonthEntries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = currentMonthEntries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  const getChartData = () => {
    const expenseCategories = {};
    currentMonthEntries
      .filter(e => e.type === 'expense')
      .forEach(e => {
        expenseCategories[e.category] = (expenseCategories[e.category] || 0) + e.amount;
      });

    return Object.keys(expenseCategories).map((category, index) => ({
      name: category,
      amount: expenseCategories[category],
      color: expenseColors[index % expenseColors.length],
    }));
  };

  const chartData = getChartData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                Budget Tracker
              </h1>
              <p className="text-gray-600 text-lg">Take control of your finances with smart expense tracking</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => { resetForm(); setIsModalOpen(true); }}
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                <FiPlusCircle className="group-hover:rotate-90 transition-transform duration-200" size={20} />
                Add Entry
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-2xl shadow-md">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">⚠️</div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-10 transform translate-x-6 -translate-y-6"></div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                <FiTrendingUp className="text-green-600" size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Income</p>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-10 transform translate-x-6 -translate-y-6"></div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl">
                <FiTrendingDown className="text-red-600" size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 ${balance >= 0 ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-orange-400 to-orange-600'} rounded-full opacity-10 transform translate-x-6 -translate-y-6`}></div>
            <div className="flex items-center gap-4">
              <div className={`p-4 ${balance >= 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 'bg-gradient-to-br from-orange-100 to-orange-200'} rounded-2xl`}>
                <FiDollarSign className={balance >= 0 ? 'text-blue-600' : 'text-orange-600'} size={32} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Net Balance</p>
                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-orange-600'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {currentMonthEntries.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiDollarSign size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Entries This Month</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start tracking your finances by adding your first income or expense entry for {new Date(selectedYear, selectedMonth - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}.
            </p>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
            >
              <FiPlusCircle size={20} />
              Add Your First Entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Expense Breakdown Chart */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FiPieChart className="text-purple-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Expense Breakdown</h2>
              </div>
              {chartData.length > 0 ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="amount"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2">
                    {chartData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600 truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FiPieChart size={48} className="mb-4 opacity-50" />
                  <p className="text-center">No expenses to display for this month.</p>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FiFilter className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {currentMonthEntries.length} entries
                </span>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {currentMonthEntries
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((entry, index) => (
                    <div 
                      key={entry._id} 
                      className="group bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${entry.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <h4 className="font-semibold text-gray-800">
                              {entry.description || entry.category}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">{entry.category}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`font-bold text-lg ${
                              entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={() => handleEditClick(entry)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                              title="Edit entry"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteEntry(entry._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              title="Delete entry"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600/70 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">
                  {editingEntryId ? 'Edit Budget Entry' : 'Add New Budget Entry'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>
            
            <div className="px-8 py-6">
              <form onSubmit={handleAddOrUpdateEntry} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Transaction Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['income', 'expense'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleFormChange({ target: { name: 'type', value: type } })}
                          className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                            formData.type === type
                              ? type === 'income'
                                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                : 'bg-red-100 text-red-800 border-2 border-red-300'
                              : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                          }`}
                        >
                          {type === 'income' ? '💰 Income' : '💸 Expense'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Amount *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleFormChange}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        required
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    >
                      {categories[formData.type].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Add a note about this transaction..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                    rows="3"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editingEntryId ? 'Save Changes' : 'Add Entry')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;