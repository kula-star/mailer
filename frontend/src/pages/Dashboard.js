import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [total, setTotal] = useState(0);
  const [todaySent, setTodaySent] = useState(0);

  useEffect(() => {
    api.get('/emails?page=1&limit=1').then(({ data }) => setTotal(data.total));
    api.get('/stats/daily?days=1').then(({ data }) => {
      const today = data.days[data.days.length - 1];
      setTodaySent(today ? today.emailsSent : 0);
    });
  }, []);

  return (
    <div className="page-wrap">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow">YOUR EMAIL, IN GOOD COMPANY</span>
          <h1>A little more connected.</h1>
          <p>Bring your people together with thoughtful messages that make a difference.</p>
          <Link className="button button-light" to="/compose">Compose an email <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-envelope"><span>✉</span></div>
          <span className="art-spark spark-one">✦</span>
          <span className="art-spark spark-two">✧</span>
          <span className="art-dot dot-one" />
          <span className="art-dot dot-two" />
        </div>
      </section>

      <div className="section-heading">
        <div>
          <span className="eyebrow">AT A GLANCE</span>
          <h2>Your workspace</h2>
        </div>
        <span className="live-pill"><span /> All systems ready</span>
      </div>

      <div className="stat-grid">
        <article className="stat-card">
          <div className="stat-card-top"><span className="stat-icon purple-icon">◎</span><span className="stat-note">YOUR AUDIENCE</span></div>
          <strong className="stat-value">{total.toLocaleString()}</strong>
          <span className="stat-label">Addresses on file</span>
          <Link className="stat-link" to="/emails">Manage address book <span aria-hidden="true">→</span></Link>
        </article>
        <article className="stat-card">
          <div className="stat-card-top"><span className="stat-icon peach-icon">↗</span><span className="stat-note">TODAY</span></div>
          <strong className="stat-value">{todaySent.toLocaleString()}</strong>
          <span className="stat-label">Emails sent today</span>
          <Link className="stat-link" to="/stats">See your activity <span aria-hidden="true">→</span></Link>
        </article>
        <article className="action-card">
          <span className="action-card-icon">✦</span>
          <span className="eyebrow">READY WHEN YOU ARE</span>
          <h3>Make someone's inbox a little brighter.</h3>
          <Link className="button button-dark" to="/compose">Start writing <span aria-hidden="true">↗</span></Link>
        </article>
      </div>

      <section className="bottom-callout">
        <div className="callout-icon">✉</div>
        <div><strong>Your audience is waiting.</strong><p>Add new contacts or import a CSV to grow your address book.</p></div>
        <Link className="button button-outline" to="/emails">Explore addresses <span aria-hidden="true">→</span></Link>
      </section>
    </div>
  );
}
