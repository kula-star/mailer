import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ensureCode, setEnsureCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/signup', { email, password, ensureCode });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '60px auto' }}>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <div><input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} /></div>
        <div><input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} /></div>
        <div><input placeholder="Ensure code" value={ensureCode} onChange={e => setEnsureCode(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} /></div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%' }}>Sign up</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
