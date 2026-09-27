import { useEffect, useState } from 'react';
import api from '../api/axios';

const pageStyle = {
  minHeight: 'calc(100vh - 110px)',
  padding: '32px 24px 48px',
  background: 'radial-gradient(circle at top left, rgba(137, 92, 246, 0.16), transparent 28%), linear-gradient(180deg, #f5f7ff 0%, #eef4ff 100%)'
};

const cardStyle = {
  maxWidth: 860,
  margin: '0 auto',
  background: 'rgba(255,255,255,0.9)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: 28,
  boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
  backdropFilter: 'blur(8px)',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '28px 28px 18px',
  background: 'linear-gradient(135deg, #1f2a44 0%, #2d4f8d 100%)',
  color: '#fff'
};

const eyebrowStyle = {
  fontSize: 12,
  letterSpacing: 2,
  textTransform: 'uppercase',
  opacity: 0.82,
  marginBottom: 10,
  fontWeight: 700
};

const titleStyle = {
  margin: 0,
  fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
  fontWeight: 800,
  letterSpacing: '-0.04em'
};

const subtitleStyle = {
  margin: '12px 0 0',
  fontSize: 17,
  color: 'rgba(255,255,255,0.8)',
  lineHeight: 1.6,
  maxWidth: 620
};

const formStyle = {
  padding: 28,
  display: 'grid',
  gap: 22
};

const noteStyle = {
  padding: '16px 18px',
  borderRadius: 18,
  background: 'linear-gradient(135deg, #f8f5ff 0%, #eef6ff 100%)',
  border: '1px solid #dfe7ff',
  color: '#44506d',
  fontSize: 16,
  lineHeight: 1.7
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 18
};

const fieldStyle = {
  display: 'grid',
  gap: 8,
  gridColumn: 'span 1'
};

const fullWidthField = {
  ...fieldStyle,
  gridColumn: '1 / -1'
};

const labelStyle = {
  fontSize: 15,
  fontWeight: 700,
  color: '#334155',
  letterSpacing: '0.02em'
};

const inputStyle = {
  width: '100%',
  border: '1px solid #dfe7f5',
  borderRadius: 14,
  background: '#f8fbff',
  padding: '14px 16px',
  fontSize: 17,
  color: '#0f172a',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxShadow: 'inset 0 1px 2px rgba(148, 163, 184, 0.08)'
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 160
};

const footerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 14,
  paddingTop: 6,
  flexWrap: 'wrap'
};

const buttonStyle = {
  border: 'none',
  borderRadius: 14,
  padding: '14px 24px',
  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
  color: '#fff',
  fontSize: 17,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 12px 24px rgba(79, 70, 229, 0.28)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

const savedStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderRadius: 999,
  background: '#e8fff1',
  color: '#0f7a4f',
  fontWeight: 700,
  fontSize: 16,
  border: '1px solid #c8f0d7'
};

export default function Settings() {
  const [form, setForm] = useState({ fromName: '', fromEmail: '', defaultSubject: '', defaultBody: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setForm(data));
  }, []);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    await api.put('/settings', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={eyebrowStyle}>Workspace settings</div>
          <h2 style={titleStyle}>Mail preferences</h2>
          <p style={subtitleStyle}>
            Personalize the sender details and default message content used throughout your email workflow.
          </p>
        </div>

        <form onSubmit={handleSave} style={formStyle}>
          <div style={noteStyle}>
            Note: with Gmail SMTP, the actual sending account is fixed by your server&apos;s GMAIL_USER credential.
            &quot;From email&quot; here is for display/reference. Only &quot;From name&quot; changes what recipients see,
            unless fromEmail is set up as a verified &quot;Send As&quot; alias in Gmail.
          </div>

          <div style={gridStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>From name</label>
              <input
                value={form.fromName}
                onChange={e => update('fromName', e.target.value)}
                style={inputStyle}
                placeholder="Your company / team name"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>From email (reference)</label>
              <input
                value={form.fromEmail}
                onChange={e => update('fromEmail', e.target.value)}
                style={inputStyle}
                placeholder="hello@yourdomain.com"
              />
            </div>

            <div style={fullWidthField}>
              <label style={labelStyle}>Default subject</label>
              <input
                value={form.defaultSubject}
                onChange={e => update('defaultSubject', e.target.value)}
                style={inputStyle}
                placeholder="Hello there"
              />
            </div>

            <div style={fullWidthField}>
              <label style={labelStyle}>Default body</label>
              <textarea
                value={form.defaultBody}
                onChange={e => update('defaultBody', e.target.value)}
                rows={8}
                style={textareaStyle}
                placeholder="Write your default email message..."
              />
            </div>
          </div>

          <div style={footerStyle}>
            <button type="submit" style={buttonStyle}>Save changes</button>
            {saved && <span style={savedStyle}>✓ Saved</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
