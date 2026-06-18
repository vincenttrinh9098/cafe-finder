import { NavLink, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';
import supabase from '../../lib/supabase';

export function NavBar() {
  const navigate = useNavigate();

  const handleProfileClick = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate(`/profile/${session.user.id}`);
    } else {
      navigate('/login');
    }
  };
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
      <NavLink onClick={handleProfileClick} className={styles.link}>
        👤 Profile
      </NavLink>
    </nav>
  );
}