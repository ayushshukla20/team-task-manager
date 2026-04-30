import './StatCard.css';

export default function StatCard({ icon, label, count, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3 className="stat-count">{count}</h3>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}
