import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionStateProvider } from './hooks/SessionStateContext';

import Home from './pages/Home';
import Location from './pages/Location';
import About from './pages/About';
import NavBar from './components/NavBar';
import './styles/App.css';

function App() {
  // Lift onboarding state to App level
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user has seen onboarding before (stored in memory for this session)
    return !window.hasSeenOnboarding;
  });

  const handleStartExploring = () => {
    // Mark that user has seen onboarding
    window.hasSeenOnboarding = true;
    setShowOnboarding(false);
  };

  return (
    <SessionStateProvider>
    <Router>
      <NavBar showOnboarding={showOnboarding} />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              showOnboarding={showOnboarding} 
              onStartExploring={handleStartExploring} 
            />
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="/location/:id" element={<Location />} />
      </Routes>
    </Router>
    </SessionStateProvider>
  );
}

export default App;