import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Location from './pages/Location';
import About from './pages/About';
import NavBar from './components/NavBar';
import './styles/App.css'; 


function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element = {<Home />}/>
        <Route path="/about" element = {<About />}/>
        <Route path="/location/:id" element = {<Location />} />
      </Routes>
    </Router>
  );
}

export default App;