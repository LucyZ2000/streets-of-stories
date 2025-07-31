import { useState, useEffect } from 'react';
import Map3D from '../components/Map3D';
import OnboardingHomepage from '../components/OnboardingHomepage';
import { LOCATIONS } from '../data/Locations';
import '../styles/Home.css';

function Home({ showOnboarding, onStartExploring, mapResetRef }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setLocations(LOCATIONS);
  }, []);

  return (
    <div className="map-page">
      <Map3D 
        locations={locations} 
        showOnboarding={showOnboarding}
        resetRef={mapResetRef}
      />
      {showOnboarding && (
        <OnboardingHomepage onExplore={onStartExploring} />
      )}
    </div>
  );
}

export default Home;