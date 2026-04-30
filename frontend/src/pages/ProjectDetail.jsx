import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Modal from '../components/Modal';
import TaskCard from '../components/TaskCard';
import toast from 'react-hot-toast';
import { MdAdd, MdPersonAdd, MdClose } from 'react-icons/md';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '', projectId: id,
  });

  const fetchProject = async () => {
    try {
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}${statusFilter ? `&status=${statusFilter}` : ''}`),
        api.get('/users'),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id, statusFilter]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...taskForm, assignedTo: taskForm.assignedTo || null });
      toast.success('Task created!');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '', projectId: id });
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      toast.success('Member added!');
      setShowMemberModal(false);
      setMemberEmail('');
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) return <div className="empty-state"><h3>Project not found</h3></div>;

  return (
    <div className="project-detail">
      <div className="page-header">
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p className="page-subtitle">{project.description || 'No description'}</p>
        </div>
        <div className="header-actions">
          {user?.role === 'admin' && (
            <>
              <button className="btn-secondary" onClick={() => setShowMemberModal(true)}>
                <MdPersonAdd size={18} /> Add Member
              </button>
              <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
                <MdAdd size={18} /> New Task
              </button>
            </>
          )}
        </div>
      </div>

      {/* Members Section */}
      <div className="members-section">
        <h3>Team Members ({project.members?.length || 0})</h3>
        <div className="members-list">
          {project.members?.map((member) => (
            <div key={member.id} className="member-chip">
              <div className="member-avatar">{member.name.charAt(0).toUpperCase()}</div>
              <span className="member-name">{member.name}</span>
              <span className={`member-role role-${member.role}`}>{member.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks Section */}
      <div className="section">
        <div className="section-header">
          <h2>Tasks ({tasks.length})</h2>
          <div className="filter-tabs">
            <button className={`filter-tab ${statusFilter === '' ? 'active' : ''}`} onClick={() => setStatusFilter('')}>All</button>
            <button className={`filter-tab ${statusFilter === 'todo' ? 'active' : ''}`} onClick={() => setStatusFilter('todo')}>To Do</button>
            <button className={`filter-tab ${statusFilter === 'in-progress' ? 'active' : ''}`} onClick={() => setStatusFilter('in-progress')}>In Progress</button>
            <button className={`filter-tab ${statusFilter === 'done' ? 'active' : ''}`} onClick={() => setStatusFilter('done')}>Done</button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Create a task to get started.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <Modal title="Create Task" onClose={() => setShowTaskModal(false)}>
          <form onSubmit={handleCreateTask} className="auth-form">
            <div className="form-group">
              <label>Title</label>
              <input type="text" placeholder="Task title" value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Describe the task..." value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} rows={3} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Assign To</label>
              <select value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary btn-full">Create Task</button>
          </form>
        </Modal>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <Modal title="Add Team Member" onClose={() => setShowMemberModal(false)}>
          <form onSubmit={handleAddMember} className="auth-form">
            <div className="form-group">
              <label>Member Email</label>
              <input type="email" placeholder="user@example.com" value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary btn-full">Add Member</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
