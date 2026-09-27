import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function EmailList() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [newEmail, setNewEmail] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState(new Set());
  const limit = 50;

  async function load() {
    const { data } = await api.get(`/emails?page=${page}&limit=${limit}`);
    setItems(data.items);
    setTotal(data.total);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page]);

  async function handleAdd(e) {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/emails', { email: newEmail });
      setNewEmail('');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add');
    }
  }

  async function handleCsvUpload(e) {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    try {
      const { data } = await api.post('/emails/csv', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage(`CSV processed: ${data.totalInCsv} found, ${data.added} added, ${data.duplicatesSkipped} duplicates skipped.`);
      setFile(null);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'CSV upload failed');
    }
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    await api.post('/emails/bulk-delete', { ids: Array.from(selected) });
    setSelected(new Set());
    load();
  }

  function toggleSelect(id) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  return (
    <div className="page-wrap">
      <div className="page-intro">
        <div><span className="eyebrow">YOUR PEOPLE</span><h1>Address book</h1><p>All your important connections, together in one place.</p></div>
        <div className="total-badge"><span className="stat-icon purple-icon">◎</span><span><strong>{total.toLocaleString()}</strong><small>total contacts</small></span></div>
      </div>

      <div className="address-tools">
        <section className="panel add-panel">
          <div className="panel-heading"><span className="panel-icon purple-icon">＋</span><div><h2>Add a contact</h2><p>Grow your audience one person at a time.</p></div></div>
          <form onSubmit={handleAdd} className="inline-form">
            <input aria-label="Email address" type="email" placeholder="name@example.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
            <button className="button button-dark" type="submit">Add contact <span aria-hidden="true">＋</span></button>
          </form>
        </section>
        <section className="panel import-panel">
          <div className="panel-heading"><span className="panel-icon peach-icon">↑</span><div><h2>Bring in a list</h2><p>Import multiple contacts from a CSV.</p></div></div>
          <form onSubmit={handleCsvUpload} className="inline-form import-form">
            <label className="file-picker"><span>⌁</span><input type="file" accept=".csv" onChange={e => setFile(e.target.files[0])} />{file ? file.name : 'Choose a CSV file'}</label>
            <button className="button button-outline" type="submit" disabled={!file}>Import CSV</button>
          </form>
        </section>
      </div>

      {message && <div className="notice" role="status">{message}</div>}

      <section className="panel contacts-panel">
        <div className="contacts-heading">
          <div><span className="eyebrow">YOUR LIST</span><h2>All contacts <span className="count-chip">{total}</span></h2></div>
          <button className="button button-danger-quiet" onClick={handleDeleteSelected} disabled={selected.size === 0}>Delete selected{selected.size > 0 ? ` (${selected.size})` : ''}</button>
        </div>
        <div className="table-scroll">
          <table className="contacts-table">
            <thead><tr><th className="check-col"><span className="sr-only">Select</span></th><th>#</th><th>Email address</th><th>Added via</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td><input aria-label={`Select ${item.email}`} type="checkbox" checked={selected.has(item._id)} onChange={() => toggleSelect(item._id)} /></td>
                  <td><span className="sequence-number">{item.seq}</span></td>
                  <td><div className="contact-cell"><span className="contact-avatar">{item.email.slice(0, 1).toUpperCase()}</span><span>{item.email}</span></div></td>
                  <td><span className="source-chip">{item.source}</span></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="4" className="empty-state"><span>✉</span><strong>Your address book is ready to grow</strong><small>Add a contact above or import your CSV to get started.</small></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Showing {items.length ? (page - 1) * limit + 1 : 0}–{Math.min(page * limit, total)} of {total}</span>
          <div className="pagination-controls">
            <button className="button button-outline button-small" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Previous</button>
            <span>Page {page}</span>
            <button className="button button-outline button-small" disabled={page * limit >= total} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </div>
      </section>
    </div>
  );
}
