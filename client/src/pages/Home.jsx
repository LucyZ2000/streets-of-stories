import { useState, useEffect } from 'react';
import Map3D from '../components/Map3D';
import { LOCATIONS } from '../data/locations';

function Home() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setLocations(LOCATIONS);
  }, []);

  return (
    <div className="map-page">
      <Map3D locations={locations} />
    </div>
  );
}

export default Home;