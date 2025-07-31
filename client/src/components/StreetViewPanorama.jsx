import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import StreetViewPins from './StreetViewPins';
import NavigationIndicators from './NavigationIndicators';

function StreetViewPanorama({ location, currentStoryPointIndex, isTransitioning, onBillboardClick }) {
  const { isLoaded, error } = useGoogleMaps();
  const panoramaRef = useRef(null);
  const [panorama, setPanorama] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [billboardMarkers, setBillboardMarkers] = useState([]);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [showBackButton, setShowBackButton] = useState(false);

  const currentBillboards = location?.storyPoints?.[currentStoryPointIndex]?.billboards || [];

  // Function to navigate to a specific billboard location
  const handleNavigateToLocation = (billboard) => {
    if (!panorama || !billboard.lat || !billboard.lng) return;

    console.log('Navigating to billboard location:', billboard);

    try {
      // Save current position to history before navigating
      const currentPosition = panorama.getPosition();
      const currentPov = panorama.getPov();
      
      if (currentPosition) {
        const historyEntry = {
          lat: currentPosition.lat(),
          lng: currentPosition.lng(),
          heading: currentPov.heading,
          pitch: currentPov.pitch,
          zoom: panorama.getZoom(),
          timestamp: Date.now(),
          fromLocation: 'Story Point' // You could make this more descriptive
        };
        
        setNavigationHistory(prev => [...prev, historyEntry]);
        setShowBackButton(true);
      }

      // Set the panorama position to the billboard's coordinates
      panorama.setPosition({
        lat: billboard.lat,
        lng: billboard.lng
      });

      // Set the view direction if specified in the billboard
      if (billboard.heading !== undefined || billboard.pitch !== undefined) {
        panorama.setPov({
          heading: billboard.heading || 0,
          pitch: billboard.pitch || 0
        });
      }

      // Set zoom if specified
      if (billboard.zoom !== undefined) {
        panorama.setZoom(billboard.zoom);
      }

      console.log(`Navigated to ${billboard.title}`);
      
    } catch (error) {
      console.error('Error navigating to billboard location:', error);
    }
  };

  // Function to go back to previous location
  const handleGoBack = () => {
    if (navigationHistory.length === 0 || !panorama) return;

    try {
      // Get the last location from history
      const lastLocation = navigationHistory[navigationHistory.length - 1];
      
      // Navigate back to that location
      panorama.setPosition({
        lat: lastLocation.lat,
        lng: lastLocation.lng
      });

      panorama.setPov({
        heading: lastLocation.heading,
        pitch: lastLocation.pitch
      });

      if (lastLocation.zoom !== undefined) {
        panorama.setZoom(lastLocation.zoom);
      }

      // Remove the last entry from history
      setNavigationHistory(prev => prev.slice(0, -1));
      
      // Hide back button if no more history
      if (navigationHistory.length <= 1) {
        setShowBackButton(false);
      }

      console.log('Navigated back to previous location');
      
    } catch (error) {
      console.error('Error navigating back:', error);
    }
  };

  // Initialize panorama
  useEffect(() => {
    if (!isLoaded || !location || !panoramaRef.current) {
      return;
    }

    if (!window.google?.maps?.StreetViewPanorama) {
      console.error('Google Maps StreetViewPanorama not available');
      return;
    }

    try {
      const targetPosition = location.storyPoints && location.storyPoints[currentStoryPointIndex]
        ? location.storyPoints[currentStoryPointIndex]
        : location;

      const panoramaInstance = new window.google.maps.StreetViewPanorama(
        panoramaRef.current,
        {
          position: {
            lat: targetPosition.lat,
            lng: targetPosition.lng
          },
          pov: {
            heading: targetPosition.heading || 0,
            pitch: targetPosition.pitch || 0
          },
          zoom: targetPosition.zoom || 1,
          visible: true,
          addressControl: false,
          linksControl: true,
          panControl: true,
          enableCloseButton: false,
          zoomControl: true,
          fullscreenControl: false,
          motionTracking: false,
          motionTrackingControl: false
        }
      );

      panoramaInstance.addListener('status_changed', () => {
        const status = panoramaInstance.getStatus();
        if (status === 'OK') {
          setIsInitialized(true);
          console.log('Street View loaded successfully');
        } else {
          console.error('Street View failed to load:', status);
        }
      });

      panoramaInstance.addListener('position_changed', () => {
        try {
          const position = panoramaInstance.getPosition();
          const pov = panoramaInstance.getPov();

          if (position && typeof position.lat === 'function' && typeof position.lng === 'function') {
            const coordinates = {
              lat: position.lat(),
              lng: position.lng()
            };

            const cameraAngle = {
              heading: pov.heading,
              pitch: pov.pitch,
              zoom: pov.zoom || panoramaInstance.getZoom()
            };

            console.log('Current Street View Position:', coordinates);
            console.log('heading, pitch, zoom:', cameraAngle);
          }
        } catch (error) {
          console.error('Error getting position:', error);
        }
      });

      setPanorama(panoramaInstance);

    } catch (error) {
      console.error('Error initializing Street View:', error);
    }

    return () => {
      if (panorama) {
        window.google.maps.event.clearInstanceListeners(panorama);
      }
      setPanorama(null);
      setIsInitialized(false);
    };
  }, [isLoaded, location]);

  // Update panorama when story point changes
  useEffect(() => {
    if (!panorama || !location?.storyPoints || isTransitioning) {
      return;
    }

    const targetStoryPoint = location.storyPoints[currentStoryPointIndex];
    if (!targetStoryPoint) {
      return;
    }

    try {
      panorama.setPosition({
        lat: targetStoryPoint.lat,
        lng: targetStoryPoint.lng
      });

      panorama.setPov({
        heading: targetStoryPoint.heading || 0,
        pitch: targetStoryPoint.pitch || 0
      });

      if (targetStoryPoint.zoom !== undefined) {
        panorama.setZoom(targetStoryPoint.zoom);
      }

      // Clear navigation history when moving to a new story point
      setNavigationHistory([]);
      setShowBackButton(false);

    } catch (error) {
      console.error('Error updating panorama:', error);
    }
  }, [panorama, currentStoryPointIndex, location, isTransitioning]);

  // Cleanup markers when component unmounts
  useEffect(() => {
    return () => {
      billboardMarkers.forEach(marker => {
        marker.setMap(null);
      });
    };
  }, []);

  if (error) {
    return (
      <div className="panorama-error">
        <div className="error-message">
          <h3>Error loading Street View</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="panorama-loading">
        <div className="loading-spinner"></div>
        <p>Loading Street View...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="panorama-error">
        <div className="error-message">
          <h3>No location data</h3>
          <p>Unable to load Street View without location information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panorama-wrapper">
      <div
        ref={panoramaRef}
        className="panorama-container"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />

      {isTransitioning && (
        <div className="panorama-transition-overlay">
          <div className="loading-spinner"></div>
          <p>Loading new view...</p>
        </div>
      )}

      {/* Back Navigation Button */}
      {showBackButton && (
        <div className="back-navigation-overlay">
          <button 
            className="back-nav-button"
            onClick={handleGoBack}
            title="Go back to previous location"
          >
            ← Leave ViewPoint
          </button>
        </div>
      )}

      {isInitialized && panorama && (
        <>
          <StreetViewPins
            panorama={panorama}
            isInitialized={isInitialized}
            currentBillboards={currentBillboards}
            onBillboardClick={onBillboardClick}
            onNavigateToLocation={handleNavigateToLocation}
          />

          <NavigationIndicators
            panorama={panorama}
            storyPoints={location?.storyPoints}
            containerRef={panoramaRef}
          />
        </>
      )}

      {isLoaded && !isInitialized && !isTransitioning && (
        <div className="panorama-fallback">
          <div className="fallback-message">
            <h3>Street View not available</h3>
            <p>Street View imagery is not available for this location.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StreetViewPanorama;