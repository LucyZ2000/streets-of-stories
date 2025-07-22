import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

function NavBar() {
  const location = useLocation();
  const isStreetViewPage = location.pathname.startsWith('/location/');

  return (
    <nav className={`navbar ${isStreetViewPage ? 'navbar-solid' : 'navbar-transparent'}`}>
      <div className="navbar-logo">Streets of Stories</div>
    </nav>
  );
}

export default NavBar;