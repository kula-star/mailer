import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Stats() {
  const [days, setDays] = useState([]);

  useEffect(() => {
    api.get('/stats/daily?days=30').then(({ data }) => setDays(data.days));
  }, []);

  const maxSent = Math.max(1, ...days.map(d => d.emailsSent));

  return (
    <div className="page-wrap">
      <div className="page-intro">
        <div><span className="eyebrow">THE BIG PICTURE</span><h1>Sending activity</h1><p>A look at your email conversations over the last 30 days.</p></div>
        <div className="total-badge"><span className="stat-icon purple-icon">▥</span><span><strong>{days.reduce((sum, day) => sum + day.emailsSent, 0).toLocaleString()}</strong><small>emails delivered</small></span></div>
      </div>
      <section className="panel analytics-panel">
        <div className="contacts-heading"><div><span className="eyebrow">LAST 30 DAYS</span><h2>Your sending rhythm</h2></div><span className="analytics-legend"><i /> Delivered</span></div>
        {days.length === 0 ? <div className="empty-state"><span>▥</span><strong>Your story starts with your first email</strong><small>Send a message to see your activity here.</small></div> : (
          <div className="activity-list">
            {days.map(d => (
              <div className="activity-row" key={d.date}>
                <span className="activity-date">{d.date}</span>
                <div className="activity-track"><div className="activity-bar" style={{ width: `${Math.max(d.emailsSent ? 3 : 0, (d.emailsSent / maxSent) * 100)}%` }} /></div>
                <span className="activity-total">{d.emailsSent} <small>sent</small></span>
                {d.emailsFailed > 0 && <span className="activity-failed">{d.emailsFailed} failed</span>}
              </div>
            ))}
          </div>
        )}
      </section>
      <p className="footnote">Daily totals are based on your local server date.</p>
    </div>
  );
}
