// src/features/StudyPlanner.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext'; // AuthContext exists in src/context/AuthContext.js
import { FiEdit, FiTrash2, FiPlusCircle, FiX, FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi'; // react-icons package must be installed

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudyPlanner = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/planner`, {
        headers: {
          'x-user-id': user?.uid,
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks.');
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchTasks();
    }
  }, [user?.uid]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      status: 'pending',
      priority: 'medium',
    });
    setEditingTaskId(null);
  };

  const handleAddOrUpdateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title || !formData.dueDate) {
      toast.error('Please fill in title and due date.');
      setLoading(false);
      return;
    }

    try {
      if (editingTaskId) {
        await axios.put(`${API_BASE_URL}/planner/${editingTaskId}`, formData, {
          headers: {
            'x-user-id': user?.uid,
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          },
        });
        toast.success('Task updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/planner`, formData, {
          headers: {
            'x-user-id': user?.uid,
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          },
        });
        toast.success('Task added successfully!');
      }
      fetchTasks();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving task:', err);
      setError(`Failed to save task: ${err.response?.data?.message || err.message}`);
      toast.error(`Failed to save task: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (taskItem) => {
    setFormData({
      title: taskItem.title,
      description: taskItem.description,
      dueDate: taskItem.dueDate ? new Date(taskItem.dueDate).toISOString().split('T')[0] : '', // Format for input type="date"
      status: taskItem.status,
      priority: taskItem.priority,
    });
    setEditingTaskId(taskItem._id);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.delete(`${API_BASE_URL}/planner/${id}`, {
        headers: {
          'x-user-id': user?.uid,
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
      });
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task.');
      toast.error('Failed to delete task.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'pending': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 font-semibold';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner text-primary"></span>
        <p className="ml-2 text-gray-600">Loading study tasks...</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA - dateB;
  });

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Study Planner</h1>
      <p className="text-gray-600 mb-6">Plan your study goals, set tasks, and track your progress.</p>

      <button
        onClick={() => { resetForm(); setIsModalOpen(true); }}
        className="px-6 py-3 mb-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
      >
        <FiPlusCircle /> Add New Task
      </button>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No study tasks added yet. Add a new task to get started!</p>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((taskItem) => (
            <div key={taskItem._id} className="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{taskItem.title}</h3>
                {taskItem.description && (
                  <p className="text-gray-600 text-sm mt-1">{taskItem.description}</p>
                )}
                <div className="flex items-center text-gray-500 text-sm mt-2 space-x-3">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    {taskItem.dueDate ? new Date(taskItem.dueDate).toLocaleDateString() : 'No Due Date'}
                  </span>
                  <span className={`flex items-center gap-1 ${getPriorityColor(taskItem.priority)}`}>
                    <FiClock size={14} />
                    {taskItem.priority.charAt(0).toUpperCase() + taskItem.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${getStatusColor(taskItem.status)} text-white font-medium capitalize`}>
                  {taskItem.status}
                </span>
                <button
                  onClick={() => handleEditClick(taskItem)}
                  className="btn btn-sm btn-ghost text-blue-500 hover:text-blue-700 tooltip"
                  data-tip="Edit"
                >
                  <FiEdit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteTask(taskItem._id)}
                  className="btn btn-sm btn-ghost text-red-500 hover:text-red-700 tooltip"
                  data-tip="Delete"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingTaskId ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleAddOrUpdateTask} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Complete Math Homework"
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
                  placeholder="e.g., Pages 45-50, exercises 1-10"
                  className="textarea textarea-bordered w-full rounded-lg"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleFormChange}
                  className="input input-bordered w-full rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="select select-bordered w-full rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                    className="select select-bordered w-full rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-cyan-700 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-800 transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingTaskId ? 'Save Changes' : 'Add Task')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
