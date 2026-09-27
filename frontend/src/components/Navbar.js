import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Overview', icon: '◫', end: true },
  { to: '/emails', label: 'Address book', icon: '◎' },
  { to: '/compose', label: 'Compose', icon: '↗' },
  { to: '/stats', label: 'Analytics', icon: '▥' },
  { to: '/settings', label: 'Settings', icon: '⚙' }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const currentPage = links.find(link => link.to === location.pathname)?.label || 'Overview';
  const initials = (user.email || 'U').slice(0, 1).toUpperCase();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">m</span>
          <span>mail<span className="brand-light">flow</span></span>
        </div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
              {link.to === '/compose' && <span className="nav-link-arrow">↗</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-spark">✦</span>
            <strong>Keep in touch</strong>
            <p>Your next great conversation starts with a thoughtful email.</p>
            <NavLink to="/compose">Write a message <span aria-hidden="true">→</span></NavLink>
          </div>
          <div className="sidebar-foot">MADE FOR BETTER CONNECTIONS</div>
        </div>
      </aside>
      <header className="topbar">
        <div className="topbar-heading">
          <span className="topbar-eyebrow">YOUR WORKSPACE</span>
          <strong>{currentPage}</strong>
        </div>
        <div className="topbar-user">
          <div className="user-copy">
            <strong>{user.email}</strong>
            <span>Workspace admin</span>
          </div>
          <span className="user-avatar" aria-hidden="true">{initials}</span>
          <button className="button-quiet logout-button" onClick={handleLogout}>Log out</button>
        </div>
      </header>
    </>
  );
}
