import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

function NavBar({ showOnboarding = false, onHomeClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isStreetViewPage = location.pathname.startsWith('/location/');

  // Hide navbar during onboarding
  if (showOnboarding) {
    return null;
  }

  const handleHomeClick = (e) => {
    e.preventDefault();
    
    // Always navigate to home first
    navigate('/');
    
    // Then call the reset function if available
    if (onHomeClick) {
      // Small delay to ensure navigation completes first
      setTimeout(() => {
        onHomeClick();
      }, 100);
    }
  };

  return (
    <nav className={`navbar ${isStreetViewPage ? 'navbar-solid' : 'navbar-transparent'}`}>
      <a href="/" className="navbar-logo" onClick={handleHomeClick}>
        Streets of Stories
      </a>
    </nav>
  );
}

export default NavBar;