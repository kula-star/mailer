import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Compose() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [fromName, setFromName] = useState('');
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(10);
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get('/emails?page=1&limit=1').then(({ data }) => setTotal(data.total));
    api.get('/settings').then(({ data }) => {
      setFromName(data.fromName || '');
      setSubject(data.defaultSubject || '');
      setBody(data.defaultBody || '');
    });
  }, []);

  async function handleSend(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setSending(true);
    try {
      const { data } = await api.post('/send', { subject, body, fromName, rangeStart, rangeEnd });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Send failed');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-intro">
        <div><span className="eyebrow">SAY SOMETHING GREAT</span><h1>Compose a message</h1><p>A good email can make someone's day. Let's write one.</p></div>
        <div className="total-badge"><span className="stat-icon peach-icon">↗</span><span><strong>{total.toLocaleString()}</strong><small>contacts available</small></span></div>
      </div>

      <div className="compose-layout">
        <form className="panel compose-panel" onSubmit={handleSend}>
          <div className="panel-heading"><span className="panel-icon purple-icon">✎</span><div><h2>Your message</h2><p>Make it personal, make it yours.</p></div></div>
          <div className="field-grid">
            <div className="field"><label htmlFor="fromName">From name</label><input id="fromName" value={fromName} onChange={e => setFromName(e.target.value)} placeholder="Your name or team" /></div>
            <div className="field"><label>Send to contacts</label><div className="range-fields"><span>#</span><input aria-label="First contact number" type="number" min="1" value={rangeStart} onChange={e => setRangeStart(e.target.value)} required /><span>to</span><span>#</span><input aria-label="Last contact number" type="number" min="1" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} required /></div><small>Choose a numbered range from your address book.</small></div>
          </div>
          <div className="field"><label htmlFor="subject">Subject line</label><input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="A little something for you..." required /></div>
          <div className="field"><label htmlFor="body">Your email <span className="label-hint">HTML is supported</span></label><textarea id="body" value={body} onChange={e => setBody(e.target.value)} rows={12} placeholder="Write something thoughtful..." required /></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="compose-footer"><span className="muted-text">Your message will be sent to the selected contacts.</span><button className="button button-dark" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span></button></div>
        </form>
        <aside className="compose-aside">
          <div className="aside-note">
            <span className="note-spark">✦</span><span className="eyebrow">A SMALL REMINDER</span>
            <h3>Thoughtful beats frequent.</h3>
            <p>A personal note goes a long way. Make sure your audience wants to hear from you.</p>
          </div>
          <div className="aside-note aside-tip"><span className="tip-number">01</span><div><strong>Need a starting point?</strong><p>Set a default subject and email body in Settings to save for later.</p><a href="/settings">Go to settings <span aria-hidden="true">→</span></a></div></div>
        </aside>
      </div>

      {result && <div className="notice result-notice" role="status"><strong>Send complete.</strong> {result.successCount} of {result.total} delivered successfully{result.failCount ? `, ${result.failCount} failed` : ''}.</div>}
    </div>
  );
}
