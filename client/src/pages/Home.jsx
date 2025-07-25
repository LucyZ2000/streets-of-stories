import { useState, useEffect } from 'react';
import Map3D from '../components/Map3D';
import OnboardingHomepage from '../components/OnboardingHomepage';
import { LOCATIONS } from '../data/Locations';
import '../styles/Home.css';

function Home() {
  const [locations, setLocations] = useState([]);
  // Initialize showOnboarding based on whether user has seen it before
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user has seen onboarding before (stored in memory for this session)
    return !window.hasSeenOnboarding;
  });

  useEffect(() => {
    setLocations(LOCATIONS);
  }, []);

  const handleStartExploring = () => {
    // Mark that user has seen onboarding
    window.hasSeenOnboarding = true;
    setShowOnboarding(false);
  };

  return (
    <div className="map-page">
      <Map3D locations={locations} />
      {showOnboarding && (
        <OnboardingHomepage onExplore={handleStartExploring} />
      )}
    </div>
  );
}

export default Home;