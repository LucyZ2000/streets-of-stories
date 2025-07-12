import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import StoryOverlay from './StoryOverlay';
import NavigationIndicators from './NavigationIndicators';

function StreetViewPanorama({ location }) {
  const { isLoaded, error } = useGoogleMaps();
  const panoramaRef = useRef(null);
  const [panorama, setPanorama] = useState(null);

  useEffect(() => {
    if (!isLoaded || !location || !panoramaRef.current) return;

    const panoramaInstance = new window.google.maps.StreetViewPanorama(panoramaRef.current, {
      position: { lat: location.lat, lng: location.lng },
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
      visible: true,
      addressControl: false,
      linksControl: false,
      panControl: false,
      enableCloseButton: false,
    });

    setPanorama(panoramaInstance);

    return () => {
      setPanorama(null);
    };
  }, [isLoaded, location]);

  if (error) {
    return <div className="loading">Error loading Google Maps: {error}</div>;
  }

  if (!isLoaded) {
    return <div className="loading">Loading Google Maps...</div>;
  }

  return (
    <div ref={panoramaRef} className="panorama-container">
      <StoryOverlay panorama={panorama} storyPoints={location?.storyPoints} />
      <NavigationIndicators 
        panorama={panorama} 
        storyPoints={location?.storyPoints} 
        containerRef={panoramaRef}
      />
    </div>
  );
}

export default StreetViewPanorama;