import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { FiEdit, FiTrash2, FiPlusCircle, FiX, FiClock, FiUser, FiCalendar, FiBookOpen } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Loading from '../common/Loading';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const defaultColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const ClassTracker = () => {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    instructor: '',
    day: '',
    startTime: '',
    endTime: '',
    color: defaultColors[0],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingClassId, setEditingClassId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/classes`, {
        headers: {
          'x-user-id': user?.uid,
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
      });
      setClasses(response.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes.');
      toast.error('Failed to load classes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchClasses();
    }
  }, [user?.uid]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      instructor: '',
      day: '',
      startTime: '',
      endTime: '',
      color: defaultColors[0],
    });
    setEditingClassId(null);
  };

  const handleAddOrUpdateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.subject || !formData.day || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in subject, day, and time.');
      setLoading(false);
      return;
    }
    if (formData.startTime >= formData.endTime) {
      toast.error('Start time must be before end time.');
      setLoading(false);
      return;
    }

    try {
      if (editingClassId) {
        await axios.put(`${API_BASE_URL}/classes/${editingClassId}`, formData, {
          headers: {
            'x-user-id': user?.uid,
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          },
        });
        toast.success('Class updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/classes`, formData, {
          headers: {
            'x-user-id': user?.uid,
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          },
        });
        toast.success('Class added successfully!');
      }
      fetchClasses();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving class:', err);
      setError(`Failed to save class: ${err.response?.data?.message || err.message}`);
      toast.error(`Failed to save class: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (classItem) => {
    setFormData({
      subject: classItem.subject,
      instructor: classItem.instructor,
      day: classItem.day,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      color: classItem.color,
    });
    setEditingClassId(classItem._id);
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
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
      await axios.delete(`${API_BASE_URL}/classes/${id}`, {
        headers: {
          'x-user-id': user?.uid,
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        },
      });
      await Swal.fire({
        title: 'Deleted!',
        text: 'Class has been deleted successfully.',
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
      fetchClasses();
    } catch (err) {
      console.error('Error deleting class:', err);
      setError('Failed to delete class.');
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to delete class. Please try again.',
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

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading && classes.length === 0) {
    return (
      <Loading></Loading>
    );
  }

  return (
    <div className="min-h-screen budget-tracker bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="schedule-header bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="header-content flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="header-text">
              <h1 className="header-title md:text-4xl text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Class Schedule Tracker
              </h1>
              <p className="header-description text-gray-600 text-lg">Organize and manage your academic schedule with ease</p>
            </div>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="add-class-btn group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-3 w-max"
            >
              <FiPlusCircle className="add-icon group-hover:rotate-90 transition-transform duration-200" size={20} />
              Add New Class
            </button>
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

        {/* Classes Display */}
        {classes.length === 0 ? (
          <div className="empty-state bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="empty-icon w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBookOpen size={32} className="text-gray-400" />
            </div>
            <h2 className="empty-title text-2xl font-bold text-gray-800 mb-4">No Classes Yet</h2>
            <p className="empty-description text-gray-600 mb-8 max-w-md mx-auto">
              Get started by adding your first class to keep track of your academic schedule.
            </p>
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="add-first-class-btn px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
            >
              <FiPlusCircle size={20} />
              Add Your First Class
            </button>
          </div>
        ) : (
          <div className="classes-container bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop View */}
            <div className="desktop-view hidden lg:block">
              <div className="table-header bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                <div className="grid grid-cols-6 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  <div>Subject</div>
                  <div>Instructor</div>
                  <div>Schedule</div>
                  <div>Time</div>
                  <div>Color</div>
                  <div className="text-center">Actions</div>
                </div>
              </div>
              <div className="table-body divide-y divide-gray-100">
                {classes.map((classItem, index) => (
                  <div key={classItem._id} className="class-row px-8 py-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="grid grid-cols-6 gap-4 items-center">
                      <div>
                        <h3 className="subject-name font-bold text-gray-900 text-lg">{classItem.subject}</h3>
                      </div>
                      <div className="instructor flex items-center gap-2">
                        <FiUser size={16} className="instructor-icon text-gray-400" />
                        <span className="instructor-name text-gray-700">{classItem.instructor || 'N/A'}</span>
                      </div>
                      <div className="schedule flex items-center gap-2">
                        <FiCalendar size={16} className="calendar-icon text-gray-400" />
                        <span className="day text-gray-700 font-medium">{classItem.day}</span>
                      </div>
                      <div className="time flex items-center gap-2">
                        <FiClock size={16} className="clock-icon text-gray-400" />
                        <span className="time-range text-gray-700">
                          {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                        </span>
                      </div>
                      <div className="color-indicator">
                        <div
                          className="color-dot w-8 h-8 rounded-full shadow-md border-2 border-white"
                          style={{ backgroundColor: classItem.color }}
                          title={classItem.color}
                        ></div>
                      </div>
                      <div className="actions flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(classItem)}
                          className="edit-btn p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors duration-150 group"
                          title="Edit class"
                        >
                          <FiEdit size={18} className="edit-icon group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(classItem._id)}
                          className="delete-btn p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-150 group"
                          title="Delete class"
                        >
                          <FiTrash2 size={18} className="delete-icon group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View */}
            <div className="mobile-view lg:hidden space-y-4 p-6">
              {classes.map((classItem, index) => (
                <div
                  key={classItem._id}
                  className="mobile-class-card bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md"
                >
                  <div className="card-header flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="color-indicator-mobile w-4 h-4 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: classItem.color }}
                      ></div>
                      <h3 className="subject-name-mobile font-bold text-gray-900 text-xl">{classItem.subject}</h3>
                    </div>
                    <div className="actions-mobile flex gap-2">
                      <button
                        onClick={() => handleEditClick(classItem)}
                        className="edit-btn-mobile p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem._id)}
                        className="delete-btn-mobile p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="card-details space-y-3">
                    <div className="detail-item flex items-center gap-2 text-gray-600">
                      <FiUser size={16} className="detail-icon" />
                      <span className="detail-text">{classItem.instructor || 'No instructor assigned'}</span>
                    </div>
                    <div className="detail-item flex items-center gap-2 text-gray-600">
                      <FiCalendar size={16} className="detail-icon" />
                      <span className="detail-text font-medium">{classItem.day}</span>
                    </div>
                    <div className="detail-item flex items-center gap-2 text-gray-600">
                      <FiClock size={16} className="detail-icon" />
                      <span className="detail-text">{formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-gray-600/70 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 md:p-4">
          <div className="modal-container bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="modal-header sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="modal-title text-3xl font-bold text-gray-800">
                  {editingClassId ? 'Edit Class' : 'Add New Class'}
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
              <form onSubmit={handleAddOrUpdateClass} className="space-y-6">
                <div className="form-group">
                  <label className="form-label block text-gray-700 font-semibold mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    placeholder="e.g., Advanced Mathematics, Physics Lab"
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label block text-gray-700 font-semibold mb-2">Instructor</label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleFormChange}
                    placeholder="e.g., Dr. Sarah Johnson"
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label block text-gray-700 font-semibold mb-2">Day *</label>
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleFormChange}
                    className="form-select w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="" disabled>Select a day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="time-inputs grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label block text-gray-700 font-semibold mb-2">Start Time *</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleFormChange}
                      className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label block text-gray-700 font-semibold mb-2">End Time *</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleFormChange}
                      className="form-input w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label block text-gray-700 font-semibold mb-3">Class Color</label>
                  <div className="color-picker flex flex-wrap gap-3 items-center">
                    {defaultColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, color }))}
                        className={`color-option w-10 h-10 rounded-full border-4 transition-all duration-200 ${formData.color === color
                            ? 'border-gray-800 scale-110 shadow-lg'
                            : 'border-gray-300 hover:scale-105'
                          }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      ></button>
                    ))}
                    <div className="custom-color relative">
                      <input
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleFormChange}
                        className="color-input w-10 h-10 rounded-full border-4 border-gray-300 cursor-pointer overflow-hidden"
                        title="Custom Color"
                      />
                      <div className="color-badge absolute -bottom-1 -right-1 bg-gray-600 text-white text-xs px-1 py-0.5 rounded">+</div>
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
                    className="submit-btn flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editingClassId ? 'Save Changes' : 'Add Class')}
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

export default ClassTracker;