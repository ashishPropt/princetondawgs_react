import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>Princeton<strong>Dawgs</strong></span>
          <p>Princeton, NJ · USTA Mid-Atlantic Section</p>
          <p>Free membership. Competitive play.</p>
        </div>
        <div className={styles.links}>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/leagues">USTA Leagues</Link>
          <Link to="/tournament">Tournament</Link>
          <Link to="/standings">Standings</Link>
          <Link to="/team">The Pack</Link>
          <Link to="/join">Join Us</Link>
        </div>
        <div className={styles.links}>
          <h4>Member Area</h4>
          <Link to="/login">Player Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/shop">Dawgs Shop</Link>
          <Link to="/sponsors">Sponsorship</Link>
        </div>
        <div className={styles.usta}>
          <span>🎾 USTA Registered</span>
          <p>Mid-Atlantic Section</p>
          <p style={{ marginTop: '1rem' }}>Questions?</p>
          <a href="mailto:info@princetondawgs.com" style={{ color: 'var(--orange)' }}>Contact us</a>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Princeton Dawgs Tennis. All rights reserved.</p>
        <div>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}
