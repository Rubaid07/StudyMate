// src/features/BudgetTracker.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext'; // নিশ্চিত করুন এই পাথটি সঠিক এবং ফাইলটি বিদ্যমান আছে
import { FiEdit, FiTrash2, FiPlusCircle, FiX, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi'; // নিশ্চিত করুন react-icons প্যাকেজটি ইনস্টল করা আছে
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'; // নিশ্চিত করুন recharts প্যাকেজটি ইনস্টল করা আছে

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categories = {
  income: ['Salary', 'Allowance', 'Scholarship', 'Freelance', 'Other Income'],
  expense: ['Food', 'Transport', 'Study Materials', 'Entertainment', 'Rent', 'Utilities', 'Personal', 'Other Expense'],
};

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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    return Object.keys(expenseCategories).map(category => ({
      name: category,
      amount: expenseCategories[category],
    }));
  };

  const chartData = getChartData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner text-primary"></span>
        <p className="ml-2 text-gray-600">Loading budget data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Budget Tracker</h1>
      <p className="text-gray-600 mb-6">Manage your income and expenses for better financial planning.</p>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
        >
          <FiPlusCircle /> Add New Entry
        </button>

        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="select select-bordered rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="select select-bordered rounded-lg"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm flex items-center gap-4 border border-blue-200">
          <FiTrendingUp className="text-green-600 text-3xl" />
          <div>
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-gray-800">${totalIncome.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm flex items-center gap-4 border border-blue-200">
          <FiTrendingDown className="text-red-600 text-3xl" />
          <div>
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow-sm flex items-center gap-4 border border-blue-200">
          <FiDollarSign className={`text-3xl ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          <div>
            <p className="text-sm text-gray-600">Balance</p>
            <p className="text-2xl font-bold text-gray-800">${balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {currentMonthEntries.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No budget entries for this month. Add a new entry to get started!</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Breakdown Chart */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Breakdown</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" name="Amount Spent" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No expenses to display for this month.</p>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {currentMonthEntries
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
                .map((entry) => (
                  <div key={entry._id} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-800">{entry.description || entry.category}</p>
                      <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleEditClick(entry)}
                        className="btn btn-sm btn-ghost text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="btn btn-sm btn-ghost text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingEntryId ? 'Edit Budget Entry' : 'Add New Budget Entry'}</h2>
            <form onSubmit={handleAddOrUpdateEntry} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="select select-bordered w-full rounded-lg"
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  placeholder="e.g., 50.00"
                  className="input input-bordered w-full rounded-lg"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="select select-bordered w-full rounded-lg"
                  required
                >
                  {categories[formData.type].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="input input-bordered w-full rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="e.g., Monthly salary, Groceries from superstore"
                  className="textarea textarea-bordered w-full rounded-lg"
                  rows="3"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-cyan-700 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-800 transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingEntryId ? 'Save Changes' : 'Add Entry')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;
