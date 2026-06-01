import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { getLastPlaceRoute } from '../place-details/placeNav';
import styles from './NavBar.module.css';

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

    const handlePlacesClick = (e) => {
    e.preventDefault();

    const last = getLastPlaceRoute();

    // always restore last viewed place
    navigate(last);
    };


  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.link}>
        Home
      </NavLink>

      <NavLink to="/profile" className={styles.link}>
        Profile
      </NavLink>
    </nav>
  );
}