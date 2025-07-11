import { Link } from 'react-router-dom';
import '../styles/NavBar.css'; 

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Streets of Stories</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

export default NavBar;
