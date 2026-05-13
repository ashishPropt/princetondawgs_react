import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Nav.module.css';

export default function Nav() {
  const { player, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo}>
          <span className={styles.paw}>🐾</span>
          <span>Princeton<strong>Dawgs</strong></span>
        </NavLink>

        <button className={styles.hamburger} onClick={() => setOpen(o => !o)} aria-label="Menu">&#9776;</button>

        <nav className={`${styles.nav} ${open ? styles.open : ''}`}>
          <NavLink to="/"          onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/team"      onClick={() => setOpen(false)}>The Pack</NavLink>
          <NavLink to="/leagues"   onClick={() => setOpen(false)}>USTA Leagues</NavLink>
          <NavLink to="/tournament" onClick={() => setOpen(false)}>Tournament</NavLink>
          <NavLink to="/standings" onClick={() => setOpen(false)}>Standings</NavLink>
          <NavLink to="/sponsors"  onClick={() => setOpen(false)}>Sponsors</NavLink>
          <NavLink to="/shop"      onClick={() => setOpen(false)}>Shop</NavLink>
          {player ? (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
              {player.is_admin && <NavLink to="/admin" onClick={() => setOpen(false)} className={styles.cta}>Admin</NavLink>}
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout ({player.name.split(' ')[0]})</button>
            </>
          ) : (
            <>
              <NavLink to="/join"   onClick={() => setOpen(false)}>Join</NavLink>
              <NavLink to="/login"  onClick={() => setOpen(false)} className={styles.cta}>Login</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
