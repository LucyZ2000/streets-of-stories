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

  const currentBillboards = location?.storyPoints?.[currentStoryPointIndex]?.billboards || [];

  // Initialize panorama
  useEffect(() => {
    if (!isLoaded || !location || !panoramaRef.current) {
      return;
    }

    // Make sure Google Maps API is fully loaded
    if (!window.google?.maps?.StreetViewPanorama) {
      console.error('Google Maps StreetViewPanorama not available');
      return;
    }

    try {
      // Get the target position (current story point or main location)
      const targetPosition = location.storyPoints && location.storyPoints[currentStoryPointIndex]
        ? location.storyPoints[currentStoryPointIndex]
        : location;

      // Create panorama instance
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

      // Add error handling for Street View
      panoramaInstance.addListener('status_changed', () => {
        const status = panoramaInstance.getStatus();
        if (status === 'OK') {
          setIsInitialized(true);
          console.log('Street View loaded successfully');
        } else {
          console.error('Street View failed to load:', status);
          // You could show a fallback message or image here
        }
      });

      panoramaInstance.addListener('position_changed', () => {
        try {
          const position = panoramaInstance.getPosition();
          const pov = panoramaInstance.getPov(); // Get Point of View (camera angle)

          if (position && typeof position.lat === 'function' && typeof position.lng === 'function') {
            const coordinates = {
              lat: position.lat(),
              lng: position.lng()
            };

            const cameraAngle = {
              heading: pov.heading, // Direction facing (0-360 degrees, 0 = North)
              pitch: pov.pitch,     // Up/down tilt (-90 to 90 degrees, 0 = straight ahead)
              zoom: pov.zoom || panoramaInstance.getZoom() // Zoom level
            };

            console.log('Current Street View Position:', coordinates);
            console.log('heading, pitch, zoom:', cameraAngle);
          } else {
            console.warn('Position object is invalid or missing lat/lng methods');
          }
        } catch (error) {
          console.error('Error getting position:', error);
        }
      });

      setPanorama(panoramaInstance);

    } catch (error) {
      console.error('Error initializing Street View:', error);
    }

    // Cleanup function
    return () => {
      if (panorama) {
        // Clear all listeners
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
      // Update position
      panorama.setPosition({
        lat: targetStoryPoint.lat,
        lng: targetStoryPoint.lng
      });

      // Update point of view
      panorama.setPov({
        heading: targetStoryPoint.heading || 0,
        pitch: targetStoryPoint.pitch || 0
      });

      // Update zoom if specified
      if (targetStoryPoint.zoom !== undefined) {
        panorama.setZoom(targetStoryPoint.zoom);
      }

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

      {/* Show loading overlay during transitions */}
      {isTransitioning && (
        <div className="panorama-transition-overlay">
          <div className="loading-spinner"></div>
          <p>Loading new view...</p>
        </div>
      )}

      {/* Only render overlays when panorama is initialized */}
      {isInitialized && panorama && (
        <>
          <StreetViewPins
            panorama={panorama}
            isInitialized={isInitialized}
            currentBillboards={currentBillboards}
            onBillboardClick={onBillboardClick}
          />

          <NavigationIndicators
            panorama={panorama}
            storyPoints={location?.storyPoints}
            containerRef={panoramaRef}
          />
        </>
      )}

      {/* Fallback message if Street View is not available */}
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