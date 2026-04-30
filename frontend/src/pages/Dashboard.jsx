import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import { MdAssignment, MdPendingActions, MdAutorenew, MdCheckCircle, MdWarning } from 'react-icons/md';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ total: 0, todo: 0, inProgress: 0, done: 0, overdue: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, tasksRes] = await Promise.all([
          api.get('/tasks/dashboard/summary'),
          api.get('/tasks'),
        ]);
        setSummary(summaryRes.data);
        setRecentTasks(tasksRes.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, <span className="highlight">{user?.name}</span></p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={<MdAssignment size={24} />} label="Total Tasks" count={summary.total} color="violet" />
        <StatCard icon={<MdPendingActions size={24} />} label="To Do" count={summary.todo} color="cyan" />
        <StatCard icon={<MdAutorenew size={24} />} label="In Progress" count={summary.inProgress} color="amber" />
        <StatCard icon={<MdCheckCircle size={24} />} label="Completed" count={summary.done} color="green" />
        <StatCard icon={<MdWarning size={24} />} label="Overdue" count={summary.overdue} color="red" />
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Recent Tasks</h2>
        </div>
        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <MdAssignment size={48} />
            <h3>No tasks yet</h3>
            <p>Tasks will appear here once they're created.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
