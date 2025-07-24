import { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import StoryOverlay from './StoryOverlay';
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
  // Add billboard markers effect with distance-based scaling
  useEffect(() => {
    if (!panorama || !isInitialized || !currentBillboards.length) {
      return;
    }

    // Clear existing markers
    billboardMarkers.forEach(marker => {
      marker.setMap(null);
    });

    // Function to calculate distance between two lat/lng points (in meters)
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3; // Earth's radius in meters
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lng2 - lng1) * Math.PI / 180;

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in meters
    };

    // Function to calculate marker size based on distance
    const calculateMarkerSize = (distance) => {
      // Define your scaling parameters
      const minSize = 20;  // Minimum marker size (pixels)
      const maxSize = 80;  // Maximum marker size (pixels)
      const minDistance = 10;  // Distance at which marker is largest (meters)
      const maxDistance = 500; // Distance at which marker is smallest (meters)

      // Clamp distance to our range
      const clampedDistance = Math.max(minDistance, Math.min(maxDistance, distance));

      // Calculate size using inverse relationship (closer = bigger)
      const normalizedDistance = (clampedDistance - minDistance) / (maxDistance - minDistance);
      const size = maxSize - (normalizedDistance * (maxSize - minSize));

      return Math.round(size);
    };

    // Function to update marker sizes based on current position
    const updateMarkerSizes = () => {
      const currentPosition = panorama.getPosition();
      if (!currentPosition) return;

      const currentLat = currentPosition.lat();
      const currentLng = currentPosition.lng();

      newMarkers.forEach((marker, index) => {
        const billboard = currentBillboards[index];
        const distance = calculateDistance(
          currentLat,
          currentLng,
          billboard.lat,
          billboard.lng
        );

        const newSize = calculateMarkerSize(distance);

        // Update the marker icon with new size
        const updatedIcon = {
          url: billboard.icon,
          scaledSize: new window.google.maps.Size(newSize, newSize),
          anchor: new window.google.maps.Point(newSize / 2, newSize / 2)
        };

        marker.setIcon(updatedIcon);
      });
    };

    // Create new markers for current billboards
    const newMarkers = currentBillboards.map((billboard, index) => {
      // Get current Street View position
      const currentPosition = panorama.getPosition();
      let initialSize = 36; // Default size

      if (currentPosition) {
        const distance = calculateDistance(
          currentPosition.lat(),
          currentPosition.lng(),
          billboard.lat,
          billboard.lng
        );
        initialSize = calculateMarkerSize(distance);
      }

      // Create custom icon for billboard markers with calculated size
      const billboardIcon = {
        url: billboard.icon,
        scaledSize: new window.google.maps.Size(initialSize, initialSize),
        anchor: new window.google.maps.Point(initialSize / 2, initialSize / 2)
      };

      const marker = new window.google.maps.Marker({
        position: {
          lat: billboard.lat,
          lng: billboard.lng
        },
        map: panorama,
        title: billboard.title || billboard.name || `Billboard ${index + 1}`,
        icon: billboardIcon,
        zIndex: 1000 + index
      });

      // Add click listener for billboard interaction
      marker.addListener('click', () => {
        console.log('Billboard clicked:', billboard);

        if (onBillboardClick) {
          onBillboardClick(index);
        }

        if (billboard.onClick && typeof billboard.onClick === 'function') {
          billboard.onClick(billboard);
        }
      });

      return marker;
    });

    setBillboardMarkers(newMarkers);

    // Listen for Street View position changes to update marker sizes
    const positionChangedListener = panorama.addListener('position_changed', () => {
      updateMarkerSizes();
    });

    // Optional: Also listen for POV changes for more responsive updates
    const povChangedListener = panorama.addListener('pov_changed', () => {
      updateMarkerSizes();
    });

    // Cleanup function
    return () => {
      // Remove listeners
      window.google.maps.event.removeListener(positionChangedListener);
      window.google.maps.event.removeListener(povChangedListener);

      // Remove markers
      newMarkers.forEach(marker => {
        marker.setMap(null);
      });
    };
  }, [panorama, isInitialized, currentBillboards]);

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
          <StoryOverlay
            panorama={panorama}
            panoramaElement={panoramaRef.current}
            currentBillboards={currentBillboards}
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