// Enhanced Map3D.jsx with location-info-overlay instead of view-mode-indicator
import { createBillboard } from '../utils/mapUtils';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

import StoryList from './StoryList';
import '../styles/App.css';
import '../styles/StoryList.css';
import '../styles/Toggle.css';


function Map3D({ locations = [] }) {
  const { isLoaded, error } = useGoogleMaps();
  const containerRef = useRef(null);
  const map3DRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get navigation state
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStoryList, setShowStoryList] = useState(false);
  const [viewMode, setViewMode] = useState('globe'); // 'globe', 'zoomed', 'street'
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentStoryPointIndex, setCurrentStoryPointIndex] = useState(0);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [showInfo, setShowInfo] = useState(true); // Add showInfo state for info panel toggle
  const markersRef = useRef(new Map());

  // Default globe view settings
  const defaultGlobeView = {
    center: { lat: 46.717, lng: 7.075, altitude: 2175.130 },
    range: 5814650,
    tilt: 33,
    heading: 0,
  };

  // Handle navigation state from Location component
  useEffect(() => {
    if (location.state && locations.length > 0) {
      const { selectedLocationId, viewMode, shouldExplore, storyPointIndex } = location.state;
      
      if (selectedLocationId && shouldExplore) {
        const targetLocation = locations.find(loc => loc.id === selectedLocationId);
        if (targetLocation) {
          if (map3DRef.current) {
            // Map is ready, execute immediately
            executeNavigationState(targetLocation, storyPointIndex || 0);
          } else {
            // Map not ready, store for later
            setPendingNavigation({
              targetLocation,
              storyPointIndex: storyPointIndex || 0
            });
          }
        }
      }

      // Clear the navigation state to prevent re-triggering
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, locations]);

  // Execute pending navigation when map becomes available
  useEffect(() => {
    if (pendingNavigation && map3DRef.current) {
      executeNavigationState(pendingNavigation.targetLocation, pendingNavigation.storyPointIndex);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, map3DRef.current]);

const handleHomeReset = () => {
    if (!map3DRef.current || isAnimating) return;

    setIsAnimating(true);
    setSelectedLocationId(null);
    setCurrentLocation(null);
    setCurrentStory(null);
    setCurrentStoryPointIndex(0);
    setViewMode('globe');

    // Clear story point markers when returning to globe view
    clearStoryPointMarkers();

    try {
      // Reset to default globe view
      map3DRef.current.flyCameraTo({
        endCamera: defaultGlobeView,
        durationMillis: 2000,
      });

      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);

    } catch (error) {
      console.error('Error during home reset:', error);
      setIsAnimating(false);
    }
  };

// Add this new function to Map3D.jsx
const handleImmediatePosition = (targetLocation, storyPointIndex) => {
  // Set the state immediately
  setSelectedLocationId(targetLocation.id);
  setCurrentLocation(targetLocation);
  setCurrentStory(targetLocation);
  setCurrentStoryPointIndex(storyPointIndex);
  setViewMode('zoomed');

  // Position camera immediately without animation using flyCameraTo with 0 duration
  const targetStoryPoint = targetLocation.storyPoints?.[storyPointIndex] || targetLocation.storyPoints?.[0];
  const targetPoint = targetStoryPoint || targetLocation;
  
  // Use flyCameraTo with 0 duration for instant positioning
  try {
    map3DRef.current.flyCameraTo({
      endCamera: {
        center: { 
          lat: targetPoint.lat, 
          lng: targetPoint.lng, 
          altitude: targetLocation.altitude || 60 
        },
        tilt: targetStoryPoint?.pitch ? Math.abs(targetStoryPoint.pitch) + 65 : 75,
        range: targetStoryPoint?.range || 150,
        heading: targetStoryPoint?.heading || 0,
      },
      durationMillis: 0, // Instant positioning
    });

    // Add story point markers immediately
    setTimeout(() => {
      addStoryPointMarkers(targetLocation);
    }, 100); // Small delay to ensure camera is positioned

  } catch (error) {
    console.error('Error setting immediate position:', error);
    // Fallback to animated transition if immediate fails
    executeNavigationState(targetLocation, storyPointIndex);
  }
};

  // Function to execute the navigation state
  const executeNavigationState = (targetLocation, storyPointIndex) => {
    // Set the state first
    setSelectedLocationId(targetLocation.id);
    setCurrentLocation(targetLocation);
    setCurrentStory(targetLocation);
    setCurrentStoryPointIndex(storyPointIndex);
    setViewMode('zoomed');

    // Then perform the exploration with a small delay to ensure state is set
    setTimeout(() => {
      handleExploreFromState(targetLocation, storyPointIndex);
    }, 200);
  };

  // Special explore function for handling state navigation
  const handleExploreFromState = async (targetLocation, storyPointIndex = 0) => {
    if (!map3DRef.current || isAnimating) return;

    setIsAnimating(true);

    try {
      // Determine which story point to fly to
      const targetStoryPoint = targetLocation.storyPoints?.[storyPointIndex] || targetLocation.storyPoints?.[0];
      const targetPoint = targetStoryPoint || targetLocation;
      console.log(targetPoint.lat)
      console.log(targetPoint.lng)
      map3DRef.current.flyCameraTo({
        endCamera: {
          center: { 
            lat: targetPoint.lat, 
            lng: targetPoint.lng, 
            altitude: targetLocation.altitude || 60 
          },
          tilt: targetStoryPoint?.pitch ? Math.abs(targetStoryPoint.pitch) + 65 : 75,
          range: targetStoryPoint?.range || 150,
          heading: targetStoryPoint?.heading || 0,
        },
        durationMillis: 2000,
      });

      setTimeout(() => {
        addStoryPointMarkers(targetLocation);
        setIsAnimating(false);
      }, 2000);

    } catch (error) {
      console.error('Error during explore from state animation:', error);
      setIsAnimating(false);
    }
  };

  // Updated handleLocationSelect to accept optional storyPointIndex
  const handleLocationSelect = async (location, storyPointIndex = null) => {
    if (!map3DRef.current || isAnimating) return;

    setIsAnimating(true);
    setSelectedLocationId(location.id);
    setShowStoryList(false);
    
    // If a specific story point is selected, go directly to exploration mode
    if (storyPointIndex !== null) {
      setCurrentLocation(location);
      setCurrentStory(location);
      setCurrentStoryPointIndex(storyPointIndex);
      setViewMode('zoomed');
      
      // Clear any existing story point markers
      clearStoryPointMarkers();

      try {
        // Fly directly to the specific story point
        const targetStoryPoint = location.storyPoints?.[storyPointIndex] || location.storyPoints?.[0];
        const targetPoint = targetStoryPoint || location;
        
        map3DRef.current.flyCameraTo({
          endCamera: {
            center: { 
              lat: targetPoint.lat, 
              lng: targetPoint.lng, 
              altitude: location.altitude || 60 
            },
            tilt: targetStoryPoint?.pitch ? Math.abs(targetStoryPoint.pitch) + 65 : 75,
            range: targetStoryPoint?.range || 150,
            heading: targetStoryPoint?.heading || 0,
          },
          durationMillis: 2000,
        });

        setTimeout(() => {
          addStoryPointMarkers(location);
          setIsAnimating(false);
        }, 2000);

      } catch (error) {
        console.error('Error during story point navigation:', error);
        setIsAnimating(false);
      }
      
      return; // Exit early since we handled the story point navigation
    }
    
    // Original logic for location selection (without specific story point)
    // Reset exploration state when selecting a new location from the list
    setCurrentLocation(null);
    setCurrentStory(null);
    setCurrentStoryPointIndex(0);
    setViewMode('globe');
    
    // Clear any existing story point markers
    clearStoryPointMarkers();

    try {
      // Fly to the location but keep it in global view - higher altitude and range
      map3DRef.current.flyCameraTo({
        endCamera: {
          center: { lat: location.lat, lng: location.lng, altitude: location.altitude || 60 },
          tilt: 30,
          range: 2500000, // Much more zoomed out - global view
          heading: 0,
        },
        durationMillis: 2000,
      });

      setTimeout(() => {
        setIsAnimating(false);

        // Trigger the popup by programmatically clicking the marker
        const marker = markersRef.current.get(location.id);
        if (marker) {
          const clickEvent = new CustomEvent('gmp-click', {
            bubbles: true,
            cancelable: true
          });
          marker.dispatchEvent(clickEvent);
        }
      }, 2000);

    } catch (error) {
      console.error('Error during flyto animation:', error);
      setIsAnimating(false);
    }
  };

  const handleExplore = (location) => {
    if (!map3DRef.current || isAnimating) return;

    setIsAnimating(true);
    setCurrentLocation(location);
    setCurrentStory(location);
    setCurrentStoryPointIndex(0);
    setViewMode('zoomed');

    try {
      // Fly to the first story point
      const firstStoryPoint = location.storyPoints?.[0];
      const targetLocation = firstStoryPoint || location;
      
      map3DRef.current.flyCameraTo({
        endCamera: {
          center: { 
            lat: targetLocation.lat, 
            lng: targetLocation.lng, 
            altitude: location.altitude || 60 
          },
          tilt: firstStoryPoint?.pitch ? Math.abs(firstStoryPoint.pitch) + 65 : 75,
          range: 150,
          heading: firstStoryPoint?.heading || 0,
        },
        durationMillis: 2000,
      });

      setTimeout(() => {
        addStoryPointMarkers(location);
        setIsAnimating(false);
      }, 2000);

    } catch (error) {
      console.error('Error during explore animation:', error);
      setIsAnimating(false);
    }
  };

  // Enhanced function to fly to specific story point
  const flyToStoryPoint = (storyPoint, location, duration = 2000) => {
    if (!map3DRef.current || !storyPoint) return;

    return new Promise((resolve) => {
      map3DRef.current.flyCameraTo({
        endCamera: {
          center: { 
            lat: storyPoint.lat, 
            lng: storyPoint.lng, 
            altitude: location.altitude || 60 
          },
          tilt: storyPoint.pitch ? Math.abs(storyPoint.pitch) + 65 : 75,
          range: storyPoint.range || 150,
          heading: storyPoint.heading || 0,
        },
        durationMillis: duration,
      });

      setTimeout(() => {
        resolve();
      }, duration);
    });
  };

  // Function to add story point markers using createBillboard
  const addStoryPointMarkers = (location) => {
    if (!map3DRef.current || !location.storyPoints) return;

    // Clear existing story point markers
    clearStoryPointMarkers();

    location.storyPoints.forEach((storyPoint, index) => {
      const billboard = createBillboard({
        map: map3DRef.current,
        position: { lat: storyPoint.lat, lng: storyPoint.lng },
        title: storyPoint.text,
        content: `
        <div class="story-point-billboard">
          <div class="billboard-number">${index + 1}</div>
          <div class="billboard-content">
            <h4>${storyPoint.text}</h4>
            <p>${storyPoint.description}</p>
          </div>
        </div>
      `,
        className: 'story-point-marker',
        onClick: async () => {
          if (isAnimating) return;
          
          setIsAnimating(true);
          setCurrentStoryPointIndex(index);

          try {
            await flyToStoryPoint(storyPoint, location, 1500);
          } catch (error) {
            console.error('Error flying to story point:', error);
          } finally {
            setIsAnimating(false);
          }
        }
      });

      // Store billboard reference for cleanup
      markersRef.current.set(`storypoint-${location.id}-${index}`, billboard);
    });
  };

  // Function to clear story point markers
  const clearStoryPointMarkers = () => {
    markersRef.current.forEach((marker, key) => {
      if (key.startsWith('storypoint-')) {
        if (marker.remove) {
          marker.remove();
        } else if (marker.setMap) {
          marker.setMap(null);
        }
        markersRef.current.delete(key);
      }
    });
  };

  const handleViewToggle = () => {
    if (!currentLocation) return;

    if (viewMode === 'street') {
      // Now uses the new smooth transition
      setViewMode('zoomed');
      handleReturnFromStreetView(currentLocation, currentStoryPointIndex);
    } else {
      // Switch to street view (unchanged)
      setViewMode('street');
      navigate(`/location/${currentLocation.id}?point=${currentStoryPointIndex}`);
    }
  };

  const handleNextStoryPoint = async () => {
    if (!currentStory || !currentStory.storyPoints || isAnimating) return;

    const nextIndex = (currentStoryPointIndex + 1) % currentStory.storyPoints.length;
    const nextPoint = currentStory.storyPoints[nextIndex];

    if (viewMode === 'street') {
      // If in street view, navigate to the story point
      navigate(`/location/${currentStory.id}?point=${nextIndex}`);
    } else {
      // If in 3D view, fly to the next story point
      setIsAnimating(true);
      setCurrentStoryPointIndex(nextIndex);

      try {
        // Calculate duration based on distance between points
        const currentPoint = currentStory.storyPoints[currentStoryPointIndex];
        const distance = calculateDistance(currentPoint, nextPoint);
        const duration = Math.min(Math.max(distance * 100, 1500), 4000); // 1.5-4 seconds based on distance

        await flyToStoryPoint(nextPoint, currentStory, duration);
      } catch (error) {
        console.error('Error navigating to next story point:', error);
      } finally {
        setIsAnimating(false);
      }
    }
  };

  const handlePrevStoryPoint = async () => {
    if (!currentStory || !currentStory.storyPoints || isAnimating) return;

    const prevIndex = currentStoryPointIndex === 0
      ? currentStory.storyPoints.length - 1
      : currentStoryPointIndex - 1;
    const prevPoint = currentStory.storyPoints[prevIndex];

    if (viewMode === 'street') {
      // If in street view, navigate to the story point
      navigate(`/location/${currentStory.id}?point=${prevIndex}`);
    } else {
      // If in 3D view, fly to the previous story point
      setIsAnimating(true);
      setCurrentStoryPointIndex(prevIndex);

      try {
        // Calculate duration based on distance between points
        const currentPoint = currentStory.storyPoints[currentStoryPointIndex];
        const distance = calculateDistance(currentPoint, prevPoint);
        const duration = Math.min(Math.max(distance * 100, 1500), 4000); // 1.5-4 seconds based on distance

        await flyToStoryPoint(prevPoint, currentStory, duration);
      } catch (error) {
        console.error('Error navigating to previous story point:', error);
      } finally {
        setIsAnimating(false);
      }
    }
  };

  // Helper function to calculate distance between two points (approximate)
  const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return 15; // Default medium distance
    
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Add toggle function for info panel
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  // Add function to handle jumping to story points
  const handleJumpToStoryPoint = async (index) => {
    if (!currentLocation || !currentLocation.storyPoints || isAnimating || index === currentStoryPointIndex) return;

    setIsAnimating(true);
    setCurrentStoryPointIndex(index);

    try {
      const targetPoint = currentLocation.storyPoints[index];
      await flyToStoryPoint(targetPoint, currentLocation, 2000);
    } catch (error) {
      console.error('Error jumping to story point:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const initializeMap = async () => {
    if (!isLoaded || !containerRef.current) return;

    try {
      const { Map3DElement, Marker3DElement, Marker3DInteractiveElement, PopoverElement } = await google.maps.importLibrary("maps3d");
      const { PinElement } = await google.maps.importLibrary("marker");

      const map3D = new Map3DElement(defaultGlobeView);
      map3D.mode = 'SATELLITE';

      map3D.addEventListener('gmp-click', (event) => {
        setSelectedLocationId(null);
        map3D.stopCameraAnimation();
      });

      // Add markers for each location
      locations.forEach((location, index) => {
        if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
          console.warn("Skipping invalid location:", location);
          return;
        }

        // Create custom pin with story number
        const pin = new PinElement({
          scale: 3,
          glyphColor: "#FFFFFF",
          background: "#3b82f6",
          borderColor: "#1d4ed8",
        });

        // Create popover with story information
        const popover = new PopoverElement();

        // Create popover content
        const popoverContent = document.createElement('div');
        popoverContent.className = 'story-popover-content';
        popoverContent.innerHTML = `
          <div class="popover-header">
            <img src="${location.image}" 
                alt="${location.title}" class="popover-image">
            <div class="popover-title-section">
              <h3 class="popover-title">${location.title}</h3>
              <p class="popover-author">by ${location.author} (${location.year})</p>
              <span class="popover-genre">${location.genre}</span>
            </div>
          </div>
          <p class="popover-description">${location.description}</p>
          <button class="popover-explore-btn" data-location-id="${location.id}">
            Explore
          </button>
        `;

        // Add click handler for explore button
        const exploreBtn = popoverContent.querySelector('.popover-explore-btn');
        exploreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleExplore(location);
        });

        popover.append(popoverContent);

        // Create interactive marker with label
        const interactiveMarker = new Marker3DInteractiveElement({
          title: `${location.title} - ${location.author}`,
          position: { lat: location.lat, lng: location.lng, altitude: location.altitude || 60 },
          altitudeMode: "ABSOLUTE",
          extruded: false,
          label: location.title, // Add the label here
          gmpPopoverTargetElement: popover
        });

        interactiveMarker.append(pin);
        map3D.append(interactiveMarker);
        map3D.append(popover);

        // Store marker reference for programmatic access
        markersRef.current.set(location.id, interactiveMarker);

        // Add click handler for marker selection
        interactiveMarker.addEventListener('gmp-click', (event) => {
          event.stopPropagation();
          setSelectedLocationId(location.id);
        });
      });

      containerRef.current.appendChild(map3D);
      map3DRef.current = map3D;

    } catch (error) {
      console.error('Error initializing 3D map:', error);
    }
  };

  useEffect(() => {
    if (isLoaded && locations.length > 0) {
      initializeMap();
    }

    return () => {
      if (map3DRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(map3DRef.current);
        } catch (e) {
          // Map already removed
        }
        map3DRef.current = null;
      }
      // Clear marker references
      markersRef.current.clear();
    };
  }, [isLoaded, locations]);

  if (error) {
    return <div className="loading">Error loading Google Maps: {error}</div>;
  }

  if (!isLoaded) {
    return <div className="loading">Loading Google Maps...</div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        style={{
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      />

      {/* Navigation Controls */}
      <div className="map-controls">
        {/* Home Button */}
        <button
          className="control-button"
          onClick={handleHomeReset}
          disabled={isAnimating}
        >
          <span className="material-icons">home</span>
          <span>Home</span>
        </button>

        {/* Story List Toggle Button */}
        <button
          className="control-button"
          onClick={() => setShowStoryList(!showStoryList)}
        >
          <span className="material-icons">menu</span>
          <span>Stories</span>
        </button>

        {/* View Toggle Button - show when exploring a location */}
        {(viewMode === 'zoomed' || viewMode === 'street') && currentLocation && (
          <button
            className="control-button view-toggle pulse" /* Make sure this matches */
            onClick={handleViewToggle}
            disabled={isAnimating}
            title={viewMode === 'street' ? 'Switch to 3D View' : 'Switch to Street View'}
          >
            <span className="material-icons">
              {viewMode === 'street' ? 'public' : 'streetview'}
            </span>
            <span>{viewMode === 'street' ? '3D View' : 'Walk the Streets'}</span>
          </button>
        )}
      </div>

      {/* Story Navigation Controls - only show when exploring a story */}
      {currentStory && currentStory.storyPoints && currentStory.storyPoints.length > 1 && (
        <div className="story-navigation">
          <button
            className="story-nav-button prev-button"
            onClick={handlePrevStoryPoint}
            disabled={isAnimating}
            title="Previous Story Point"
          >
            ← Previous Story Point
          </button>

          <div className="story-point-indicator">
            {currentStoryPointIndex + 1} / {currentStory.storyPoints.length}
            <div className="story-point-title">
              {currentStory.storyPoints[currentStoryPointIndex]?.text}
            </div>
          </div>

          <button
            className="story-nav-button next-button"
            onClick={handleNextStoryPoint}
            disabled={isAnimating}
            title="Next Story Point"
          >
            Next Story Point→
          </button>
        </div>
      )}

      {/* Story List Panel */}
      {showStoryList && (
        <div className="story-list-overlay">
          <StoryList
            locations={locations}
            onLocationSelect={handleLocationSelect}
            selectedLocationId={selectedLocationId}
          />
        </div>
      )}


      {/* Location Info Overlay - Replaces view-mode-indicator */}
      {viewMode !== 'globe' && currentLocation && (
  <div className={`location-info-overlay ${showInfo ? 'expanded' : ''}`}>
    {/* Header - always visible */}
    <div className="info-header" onClick={toggleInfo}>
      <h1 className="location-title">{currentLocation.title}</h1>
      <p className="location-author">by {currentLocation.author} ({currentLocation.year})</p>
      <span className="location-genre">{currentLocation.genre}</span>
      
      {/* Toggle button with arrows */}
      <button
        className="info-collapse-toggle"
        onClick={(e) => {
          e.stopPropagation();
          toggleInfo();
        }}
        title={showInfo ? 'Collapse info panel' : 'Expand info panel'}
      >
        <span className="collapse-arrow"></span>
      </button>
    </div>

    {/* Collapsible content area */}
    <div className="info-collapsible-content">
      {/* Location description */}
      <div className="location-description">
        <p>{currentLocation.description}</p>
      </div>

      {/* Current story point */}
      {currentStory?.storyPoints?.[currentStoryPointIndex] && (
        <div className="current-story-point">
          <h3 className="story-point-title">
            {currentStory.storyPoints[currentStoryPointIndex].text}
          </h3>
          <p className="story-point-description">
            {currentStory.storyPoints[currentStoryPointIndex].description}
          </p>
          <div className="story-point-context">
            <span className="story-point-badge">
              Point {currentStoryPointIndex + 1} of {currentStory.storyPoints.length}
            </span>
          </div>
        </div>
      )}

      {/* Story points navigation */}
      {currentLocation?.storyPoints?.length > 1 && (
        <div className="story-points-quick-nav-enhanced">
          <div className="nav-header">
            <h4>Story Points</h4>
          </div>
          <div className="story-points-grid">
            {currentLocation.storyPoints.map((point, index) => {
              const currentPoint = currentLocation.storyPoints[currentStoryPointIndex];
              const distance = index !== currentStoryPointIndex 
                ? calculateDistance(currentPoint, point) 
                : 0;

              return (
                <button
                  key={index}
                  className={`story-point-card ${index === currentStoryPointIndex ? 'active' : ''}`}
                  onClick={() => handleJumpToStoryPoint(index)}
                  disabled={isAnimating || index === currentStoryPointIndex}
                  title={`${point.text}${distance > 0 ? ` (${distance.toFixed(1)}km away)` : ''}`}
                >
                  <div className="story-point-number">{index + 1}</div>
                  <div className="story-point-info">
                    <div className="story-point-name">{point.text}</div>
                    {distance > 0 && (
                      <div className="story-point-distance">
                        {`${distance.toFixed(1)}km`}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  </div>
)}
      {/* Loading indicator for transitions */}
      {isAnimating && (
        <div className="transition-indicator">
          <div className="loading-spinner"></div>
          <p>Flying to story point...</p>
        </div>
      )}
    </div>
  );
}

export default Map3D;