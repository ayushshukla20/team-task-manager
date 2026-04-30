import './TaskCard.css';
import { useNavigate } from 'react-router-dom';
import { MdCalendarToday, MdPerson } from 'react-icons/md';

export default function TaskCard({ task }) {
  const navigate = useNavigate();

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`} onClick={() => navigate(`/tasks/${task.id}`)}>
      <div className="task-card-header">
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
        <span className={`status-badge status-${task.status}`}>
          {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Done'}
        </span>
      </div>

      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description.substring(0, 80)}...</p>
      )}

      <div className="task-card-footer">
        {task.assignee && (
          <div className="task-meta">
            <MdPerson size={14} />
            <span>{task.assignee.name}</span>
          </div>
        )}
        {task.dueDate && (
          <div className={`task-meta ${isOverdue ? 'text-red' : ''}`}>
            <MdCalendarToday size={14} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
