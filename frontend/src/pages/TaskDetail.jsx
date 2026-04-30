import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { MdArrowBack, MdDelete, MdSave } from 'react-icons/md';
import './TaskDetail.css';

export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const [taskRes, usersRes] = await Promise.all([
          api.get(`/tasks/${id}`),
          api.get('/users'),
        ]);
        setTask(taskRes.data);
        setFormData({
          title: taskRes.data.title,
          description: taskRes.data.description || '',
          status: taskRes.data.status,
          priority: taskRes.data.priority,
          assignedTo: taskRes.data.assignedTo || '',
          dueDate: taskRes.data.dueDate ? taskRes.data.dueDate.split('T')[0] : '',
        });
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${id}`, { ...formData, assignedTo: formData.assignedTo || null });
      toast.success('Task updated!');
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted!');
      navigate(-1);
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading task...</p>
      </div>
    );
  }

  if (!task) return <div className="empty-state"><h3>Task not found</h3></div>;

  const isAdmin = user?.role === 'admin';
  const isAssigned = task.assignedTo === user?.id;
  const canEdit = isAdmin || isAssigned;

  return (
    <div className="task-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <MdArrowBack size={18} /> Back
      </button>

      <div className="task-detail-card">
        <div className="task-detail-header">
          <h1>{task.title}</h1>
          <div className="task-badges">
            <span className={`status-badge status-${task.status}`}>
              {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Done'}
            </span>
            <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
          </div>
        </div>

        {canEdit && (
          <form onSubmit={handleUpdate} className="task-edit-form">
            {isAdmin && (
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
            )}

            {isAdmin && (
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {isAdmin && (
                <div className="form-group">
                  <label>Priority</label>
                  <select value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="form-row">
                <div className="form-group">
                  <label>Assign To</label>
                  <select value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}>
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
              </div>
            )}

            <div className="task-actions">
              <button type="submit" className="btn-primary">
                <MdSave size={18} /> Save Changes
              </button>
              {isAdmin && (
                <button type="button" className="btn-danger" onClick={handleDelete}>
                  <MdDelete size={18} /> Delete Task
                </button>
              )}
            </div>
          </form>
        )}

        {!canEdit && (
          <div className="task-readonly">
            <div className="info-row"><span className="info-label">Description</span><p>{task.description || 'No description'}</p></div>
            <div className="info-row"><span className="info-label">Assigned To</span><p>{task.assignee?.name || 'Unassigned'}</p></div>
            <div className="info-row"><span className="info-label">Due Date</span><p>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
