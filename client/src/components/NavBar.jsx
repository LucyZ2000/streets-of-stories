import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

function NavBar({ showOnboarding = false }) {
  const location = useLocation();
  const isStreetViewPage = location.pathname.startsWith('/location/');

  // Hide navbar during onboarding
  if (showOnboarding) {
    return null;
  }

  return (
    <nav className={`navbar ${isStreetViewPage ? 'navbar-solid' : 'navbar-transparent'}`}>
      <Link to="/" className="navbar-logo">
        Streets of Stories
      </Link>

    </nav>
  );
}

export default NavBar;