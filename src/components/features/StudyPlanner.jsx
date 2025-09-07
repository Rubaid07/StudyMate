import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { FiEdit, FiTrash2, FiPlusCircle, FiX, FiCheckCircle, FiClock, FiCalendar, FiTarget, FiBookOpen, FiAlertTriangle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Loading from '../common/Loading';

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
      dueDate: taskItem.dueDate ? new Date(taskItem.dueDate).toISOString().split('T')[0] : '',
      status: taskItem.status,
      priority: taskItem.priority,
    });
    setEditingTaskId(taskItem._id);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this task?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : '#ffffff',
      color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#e5e7eb' : '#374151',
      customClass: {
        popup: 'sweet-alert-popup',
        title: 'sweet-alert-title',
        content: 'sweet-alert-content',
        confirmButton: 'sweet-alert-confirm-btn',
        cancelButton: 'sweet-alert-cancel-btn'
      }
    });
    if (!result.isConfirmed) {
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
      await Swal.fire({
        title: 'Deleted!',
        text: 'Task deleted successfully!',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : '#ffffff',
        color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#e5e7eb' : '#374151',
        customClass: {
          popup: 'sweet-alert-popup',
          title: 'sweet-alert-title',
          content: 'sweet-alert-content'
        }
      });
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task.');
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to delete task.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
        background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1f2937' : '#ffffff',
        color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#e5e7eb' : '#374151',
        customClass: {
          popup: 'sweet-alert-popup',
          title: 'sweet-alert-title',
          content: 'sweet-alert-content',
          confirmButton: 'sweet-alert-confirm-btn'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await axios.put(`${API_BASE_URL}/planner/${taskId}`,
        { status: newStatus },
        {
          headers: {
            'x-user-id': user?.uid,
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          },
        }
      );
      toast.success(`Task marked as ${newStatus}!`);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status.');
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          icon: FiAlertTriangle,
          label: 'High Priority'
        };
      case 'medium':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-200',
          icon: FiTarget,
          label: 'Medium Priority'
        };
      case 'low':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200',
          icon: FiClock,
          label: 'Low Priority'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          icon: FiTarget,
          label: 'Medium Priority'
        };
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (dueDate) => {
    return getDaysUntilDue(dueDate) < 0;
  };

  const formatDueDate = (dueDate) => {
    const daysUntil = getDaysUntilDue(dueDate);
    const date = new Date(dueDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    if (daysUntil === 0) return `Due Today - ${formattedDate}`;
    if (daysUntil === 1) return `Due Tomorrow - ${formattedDate}`;
    if (daysUntil > 0) return `Due in ${daysUntil} days - ${formattedDate}`;
    return `Overdue by ${Math.abs(daysUntil)} days - ${formattedDate}`;
  };

  if (loading && tasks.length === 0) {
    return (
     <Loading></Loading>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="budget-tracker min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="budget-header bg-white rounded-3xl shadow border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className='header-content'>
              <h1 className="header-title text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Study Planner
              </h1>
              <p className="header-description text-gray-600 text-lg">Organize your academic goals and track your progress</p>
            </div>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="add-entry-btn group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
            >
              <FiPlusCircle className="group-hover:rotate-90 transition-transform duration-200" size={20} />
              Add New Task
            </button>
          </div>
        </div>

        {error && (
          <div className="error-alert bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-2xl shadow-md">
            <div className="flex items-center">
              <div className="error-icon text-red-500 mr-3">⚠️</div>
              <p className="error-message text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        {totalTasks > 0 && (
          <div className="summary-cards grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="completed-card bg-white rounded-3xl shadow border border-gray-100 p-6 relative overflow-hidden">
              <div className="card-content flex items-center gap-4">
                <div className="icon-container p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                  <FiCheckCircle className="completed-icon text-green-600" size={24} />
                </div>
                <div className="card-text">
                  <p className="card-label text-sm font-medium text-gray-500 uppercase tracking-wide">Completed</p>
                  <p className="card-value text-2xl font-medium text-gray-800">{completedTasks}</p>
                </div>
              </div>
            </div>

            <div className="total-card bg-white rounded-3xl shadow border border-gray-100 p-6 relative overflow-hidden">
              <div className="card-content flex items-center gap-4">
                <div className="icon-container p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
                  <FiBookOpen className="total-icon text-blue-600" size={24} />
                </div>
                <div className="card-text">
                  <p className="card-label text-sm font-medium text-gray-500 uppercase tracking-wide">Total Tasks</p>
                  <p className="card-value text-2xl font-medium text-gray-800">{totalTasks}</p>
                </div>
              </div>
            </div>

            <div className="progress-card bg-white rounded-3xl shadow border border-gray-100 p-6 relative overflow-hidden">
              <div className="card-content flex items-center gap-4">
                <div className="icon-container p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl">
                  <FiTarget className="progress-icon text-purple-600" size={24} />
                </div>
                <div className="card-text">
                  <p className="card-label text-sm font-medium text-gray-500 uppercase tracking-wide">Progress</p>
                  <p className="card-value text-2xl font-medium text-gray-800">{Math.round(completionRate)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Display */}
        {tasks.length === 0 ? (
          <div className="empty-state bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="empty-icon w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBookOpen size={32} className="text-gray-400" />
            </div>
            <h2 className="empty-title text-2xl font-bold text-gray-800 mb-4">Ready to Start Studying?</h2>
            <p className="empty-description text-gray-600 mb-8 max-w-md mx-auto">
              Create your first study task and begin your journey to academic success.
            </p>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="create-first-btn px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
            >
              <FiPlusCircle size={20} />
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="tasks-container bg-white rounded-3xl shadow border border-gray-100 overflow-hidden">
            <div className="tasks-header p-8">
              <div className="flex items-center gap-3 mb-6">
                <FiCalendar className="calendar-icon text-indigo-600" size={24} />
                <h2 className="tasks-title text-2xl font-bold text-gray-800">Your Study Tasks</h2>
                <span className="pending-count text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {tasks.filter(t => t.status === 'pending').length} pending
                </span>
              </div>

              <div className="tasks-list space-y-4">
                {sortedTasks.map((taskItem) => {
                  const priorityConfig = getPriorityConfig(taskItem.priority);
                  const PriorityIcon = priorityConfig.icon;
                  const overdue = isOverdue(taskItem.dueDate);

                  return (
                    <div
                      key={taskItem._id}
                      className={`task-item group relative bg-gradient-to-r from-gray-50 to-white border-l-4 ${taskItem.status === 'completed'
                        ? 'border-green-400 bg-opacity-50'
                        : overdue
                          ? 'border-red-400'
                          : priorityConfig.borderColor.replace('border-', 'border-')
                        } rounded-2xl p-6 hover:shadow-lg transition-all duration-200 ${taskItem.status === 'completed' ? 'opacity-75' : ''
                        }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Status Toggle */}
                          <button
                            onClick={() => toggleTaskStatus(taskItem._id, taskItem.status)}
                            className={`status-toggle flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${taskItem.status === 'completed'
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                              }`}
                          >
                            {taskItem.status === 'completed' && (
                              <FiCheckCircle size={14} />
                            )}
                          </button>

                          <div className="task-content flex-1">
                            <h3 className={`task-title text-xl font-semibold mb-2 ${taskItem.status === 'completed'
                              ? 'text-gray-500 line-through'
                              : 'text-gray-800'
                              }`}>
                              {taskItem.title}
                            </h3>

                            {taskItem.description && (
                              <p className={`task-description text-sm mb-3 ${taskItem.status === 'completed'
                                ? 'text-gray-400'
                                : 'text-gray-600'
                                }`}>
                                {taskItem.description}
                              </p>
                            )}

                            <div className="task-meta flex flex-wrap gap-3 text-sm">
                              <div className={`due-date flex items-center gap-1 ${overdue && taskItem.status !== 'completed'
                                ? 'text-red-600 font-medium'
                                : 'text-gray-500'
                                }`}>
                                <FiCalendar size={14} />
                                {formatDueDate(taskItem.dueDate)}
                              </div>

                              <div className={`priority-badge flex items-center gap-1 px-2 py-1 rounded-full text-xs ${priorityConfig.bgColor} ${priorityConfig.color}`}>
                                <PriorityIcon size={12} />
                                {priorityConfig.label}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons md:opacity-0 md:group-hover:opacity-100 transition-opacity flex gap-2">
                          <button
                            onClick={() => handleEditClick(taskItem)}
                            className="edit-btn p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Edit task"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(taskItem._id)}
                            className="delete-btn p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete task"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-gray-600/70 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="modal-container bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="modal-header sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="modal-title text-3xl font-bold text-gray-800">
                  {editingTaskId ? 'Edit Study Task' : 'Create New Study Task'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="modal-close-btn p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="modal-body px-8 py-6">
              <form onSubmit={handleAddOrUpdateTask} className="space-y-6">
                <div className="form-group">
                  <label className="form-label block text-gray-700 font-semibold mb-2">Task Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g., Complete Math Assignment Chapter 5"
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Add details about your task, specific requirements, or study materials needed..."
                    className="form-textarea w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label block text-gray-700 font-semibold mb-2">Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleFormChange}
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label block text-gray-700 font-semibold mb-3">Status</label>
                    <div className="status-buttons grid grid-cols-2 gap-2">
                      {[
                        { value: 'pending', label: '⏳ Pending', color: 'bg-orange-100 text-orange-800 border-orange-300' },
                        { value: 'completed', label: '✅ Completed', color: 'bg-green-100 text-green-800 border-green-300' }
                      ].map((status) => (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => handleFormChange({ target: { name: 'status', value: status.value } })}
                          className={`status-button py-3 px-4 rounded-xl font-medium transition-all duration-200 border-2 ${formData.status === status.value
                            ? status.color
                            : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
                            }`}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label block text-gray-700 font-semibold mb-3">Priority Level</label>
                    <div className="priority-buttons space-y-2">
                      {[
                        { value: 'high', label: '🔴 High Priority', color: 'bg-red-100 text-red-800 border-red-300' },
                        { value: 'medium', label: '🟡 Medium Priority', color: 'bg-orange-100 text-orange-800 border-orange-300' },
                        { value: 'low', label: '🔵 Low Priority', color: 'bg-blue-100 text-blue-800 border-blue-300' }
                      ].map((priority) => (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() => handleFormChange({ target: { name: 'priority', value: priority.value } })}
                          className={`priority-button w-full py-2 px-3 rounded-lg font-medium transition-all duration-200 border-2 text-sm ${formData.priority === priority.value
                            ? priority.color
                            : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
                            }`}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-actions flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="cancel-btn flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-btn flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editingTaskId ? 'Save Changes' : 'Create Task')}
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

export default StudyPlanner;