import { NavLink, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';

export function NavBar() {
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    const last = sessionStorage.getItem("lastMainRoute") ?? "/";
    navigate(last);
  };

  return (
    <nav className={styles.navbar}>
      <a href="/" className={styles.link} onClick={handleHomeClick}>
        Home
      </a>
      <NavLink to="/profile" className={styles.link}>
        👤 Profile
      </NavLink>
    </nav>
  );
}