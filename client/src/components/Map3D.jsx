import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { useSessionState } from '../hooks/SessionStateContext';

import StoryList from './StoryList';
import '../styles/App.css';
import '../styles/StoryList.css';
import '../styles/InfoOverlay.css';


function Map3D({ locations = [], showOnboarding = false }) {
  const { isLoaded, error } = useGoogleMaps();
  const { sessionState, updateSessionState } = useSessionState();
  const containerRef = useRef(null);
  const map3DRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const markersRef = useRef(new Map());

  // State
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStoryList, setShowStoryList] = useState(false);
  const [viewMode, setViewMode] = useState('globe');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentStoryPointIndex, setCurrentStoryPointIndex] = useState(0);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const showInfo = sessionState.isInfoExpanded;
  const setShowInfo = (value) => updateSessionState({ isInfoExpanded: value });

  // Constants
  const defaultGlobeView = {
    center: { lat: 46.717, lng: 7.075, altitude: 2175.130 },
    range: 5814650,
    tilt: 33,
    heading: 0,
  };
  
  const onboardingGlobeView = {
    center: { lat: 20.0, lng: 0.0, altitude: 0 },
    range: 25000000, // Much more zoomed out
    tilt: 0,
    heading: 0,
  };
  
  const defaultExplorationRange = 500;

  // Watch for onboarding state changes to trigger zoom animation
  useEffect(() => {
    if (!showOnboarding && map3DRef.current) {
      // When onboarding ends, animate to the normal globe view
      setIsAnimating(true);
      map3DRef.current.flyCameraTo({
        endCamera: defaultGlobeView,
        durationMillis: 3000, // 3 second smooth zoom in
      });
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
    }
  }, [showOnboarding]);

  // Navigation state handler
  useEffect(() => {
    if (location.state?.selectedLocationId && location.state?.shouldExplore && locations.length > 0) {
      const targetLocation = locations.find(loc => loc.id === location.state.selectedLocationId);
      if (targetLocation) {
        const storyPointIndex = location.state.storyPointIndex || 0;
        if (map3DRef.current) {
          executeNavigationState(targetLocation, storyPointIndex);
        } else {
          setPendingNavigation({ targetLocation, storyPointIndex });
        }
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, locations]);

  // Execute pending navigation
  useEffect(() => {
    if (pendingNavigation && map3DRef.current) {
      executeNavigationState(pendingNavigation.targetLocation, pendingNavigation.storyPointIndex);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, map3DRef.current]);

  // Helper functions
  const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return 15;
    const R = 6371;
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const flyToStoryPoint = (storyPoint, location, duration = 2000) => {
    if (!map3DRef.current || !storyPoint) return Promise.resolve();

    return new Promise((resolve) => {
      map3DRef.current.flyCameraTo({
        endCamera: {
          center: {
            lat: storyPoint.lat,
            lng: storyPoint.lng,
            altitude: location.altitude || 500
          },
          tilt: storyPoint.pitch ? Math.abs(storyPoint.pitch) + 65 : 75,
          range: storyPoint.range || 500,
          heading: storyPoint.heading || 0,
        },
        durationMillis: duration,
      });
      setTimeout(resolve, duration);
    });
  };

  const clearStoryPointMarkers = () => {
    markersRef.current.forEach((marker, key) => {
      if (key.startsWith('storypoint-')) {
        if (marker.remove) marker.remove();
        else if (marker.setMap) marker.setMap(null);
        markersRef.current.delete(key);
      }
    });
  };

  const addStoryPointMarkers = (location) => {
    if (!map3DRef.current || !location.storyPoints) return;
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
      markersRef.current.set(`storypoint-${location.id}-${index}`, billboard);
    });
  };
  const calculateScreenPosition = (panorama, point) => {
  const povHeading = panorama.getPov().heading;
  const povPitch = panorama.getPov().pitch;
  const zoom = panorama.getZoom();
  
  // Calculate relative position based on heading difference
  const headingDiff = point.heading - povHeading;
  const normalizedHeading = ((headingDiff + 540) % 360) - 180;
  
  // Only show if within view
  if (Math.abs(normalizedHeading) > 90) {
    return null;
  }
  
  // Calculate screen position
  const container = panorama.getDiv();
  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;
  
  // Convert heading to screen X position
  const fov = 90 / Math.pow(2, zoom - 1);
  const x = centerX + (normalizedHeading / fov) * (container.offsetWidth / 2);
  
  // Convert pitch to screen Y position
  const pitchDiff = point.pitch - povPitch;
  const y = centerY - (pitchDiff / fov) * (container.offsetHeight / 2);
  
  return { x, y };
};

  const createBillboard = (billboard) => {
    const billboardDiv = document.createElement('div');
    billboardDiv.className = 'story-billboard';
    
    const arrow = document.createElement('div');
    arrow.className = 'billboard-arrow';
    
    // Use the correct billboard properties
    billboardDiv.innerHTML = `
      ${billboard.image ? `<img src="${billboard.image}" alt="${billboard.title}" class="billboard-image">` : ''}
      <div class="billboard-icon">${billboard.icon || '📋'}</div>
      <h3 class="billboard-title">${billboard.title}</h3>
      <p class="billboard-description">${billboard.content}</p>
      ${billboard.quote ? `<blockquote class="billboard-quote">"${billboard.quote}"</blockquote>` : ''}
      ${billboard.details ? `<div class="billboard-details">${billboard.details}</div>` : ''}
    `;
    
    billboardDiv.appendChild(arrow);
    return billboardDiv;
  };

  const executeNavigationState = (targetLocation, storyPointIndex) => {
    setSelectedLocationId(targetLocation.id);
    setCurrentLocation(targetLocation);
    setCurrentStory(targetLocation);
    setCurrentStoryPointIndex(storyPointIndex);
    setViewMode('zoomed');
    setTimeout(() => handleExploreFromState(targetLocation, storyPointIndex), 200);
  };

  const handleExploreFromState = async (targetLocation, storyPointIndex = 0) => {
    if (!map3DRef.current || isAnimating) return;

    setIsAnimating(true);
    try {
      const targetStoryPoint = targetLocation.storyPoints?.[storyPointIndex] || targetLocation.storyPoints?.[0];
      const targetPoint = targetStoryPoint || targetLocation;
      
      map3DRef.current.flyCameraTo({
        endCamera: {
          center: {
            lat: targetPoint.lat,
            lng: targetPoint.lng,
            altitude: targetLocation.altitude || 200
          },
          tilt: targetStoryPoint?.pitch ? Math.abs(targetStoryPoint.pitch) + 65 : 75,
          range: targetStoryPoint?.range || defaultExplorationRange,
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

  const handleLocationSelect = async (location, storyPointIndex = null) => {
    if (!map3DRef.current || isAnimating) return;

    setIsAnimating(true);
    setSelectedLocationId(location.id);
    setShowStoryList(false);

    if (storyPointIndex !== null) {
      setCurrentLocation(location);
      setCurrentStory(location);
      setCurrentStoryPointIndex(storyPointIndex);
      setViewMode('zoomed');
      clearStoryPointMarkers();

      try {
        const targetStoryPoint = location.storyPoints?.[storyPointIndex] || location.storyPoints?.[0];
        const targetPoint = targetStoryPoint || location;

        map3DRef.current.flyCameraTo({
          endCamera: {
            center: {
              lat: targetPoint.lat,
              lng: targetPoint.lng,
              altitude: location.altitude || 200
            },
            tilt: targetStoryPoint?.pitch ? Math.abs(targetStoryPoint.pitch) + 65 : 75,
            range: targetStoryPoint?.range || defaultExplorationRange,
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
      return;
    }

    // Regular location selection
    setCurrentLocation(null);
    setCurrentStory(null);
    setCurrentStoryPointIndex(0);
    setViewMode('globe');
    clearStoryPointMarkers();

    try {
      map3DRef.current.flyCameraTo({
        endCamera: {
          center: { lat: location.lat, lng: location.lng, altitude: location.altitude || 60 },
          tilt: 30,
          range: 2500000,
          heading: 0,
        },
        durationMillis: 2000,
      });

      setTimeout(() => {
        setIsAnimating(false);
        const marker = markersRef.current.get(location.id);
        if (marker) {
          marker.dispatchEvent(new CustomEvent('gmp-click', { bubbles: true, cancelable: true }));
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
      const firstStoryPoint = location.storyPoints?.[0];
      const targetLocation = firstStoryPoint || location;

      map3DRef.current.flyCameraTo({
        endCamera: {
          center: {
            lat: targetLocation.lat,
            lng: targetLocation.lng,
            altitude: location.altitude || 500
          },
          tilt: firstStoryPoint?.pitch ? Math.abs(firstStoryPoint.pitch) + 65 : 75,
          range: firstStoryPoint?.range || 500,
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

  const handleViewToggle = () => {
    if (!currentLocation) return;
    if (viewMode === 'street') {
      setViewMode('zoomed');
      handleReturnFromStreetView(currentLocation, currentStoryPointIndex);
    } else {
      setViewMode('street');
      navigate(`/location/${currentLocation.id}?point=${currentStoryPointIndex}`);
    }
  };

  const handleStoryPointNavigation = async (direction) => {
    if (!currentStory?.storyPoints || isAnimating) return;

    const nextIndex = direction === 'next' 
      ? (currentStoryPointIndex + 1) % currentStory.storyPoints.length
      : currentStoryPointIndex === 0 ? currentStory.storyPoints.length - 1 : currentStoryPointIndex - 1;

    if (viewMode === 'street') {
      navigate(`/location/${currentStory.id}?point=${nextIndex}`);
    } else {
      setIsAnimating(true);
      setCurrentStoryPointIndex(nextIndex);
      
      try {
        const currentPoint = currentStory.storyPoints[currentStoryPointIndex];
        const targetPoint = currentStory.storyPoints[nextIndex];
        const distance = calculateDistance(currentPoint, targetPoint);
        const duration = Math.min(Math.max(distance * 100, 1500), 4000);
        
        await flyToStoryPoint(targetPoint, currentStory, duration);
      } catch (error) {
        console.error('Error navigating story point:', error);
      } finally {
        setIsAnimating(false);
      }
    }
  };

  const handleJumpToStoryPoint = async (index) => {
    if (!currentLocation?.storyPoints || isAnimating || index === currentStoryPointIndex) return;

    setIsAnimating(true);
    setCurrentStoryPointIndex(index);

    try {
      await flyToStoryPoint(currentLocation.storyPoints[index], currentLocation, 2000);
    } catch (error) {
      console.error('Error jumping to story point:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  // Initialize map
  const initializeMap = async () => {
    if (!isLoaded || !containerRef.current) return;

    try {
      const { Map3DElement, Marker3DInteractiveElement, PopoverElement } = await google.maps.importLibrary("maps3d");
      const { PinElement } = await google.maps.importLibrary("marker");

      const map3D = new Map3DElement(showOnboarding ? onboardingGlobeView : defaultGlobeView);
      map3D.mode = 'SATELLITE';

      map3D.addEventListener('gmp-click', () => {
        setSelectedLocationId(null);
        map3D.stopCameraAnimation();
      });

      locations.forEach((location) => {
        if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
          console.warn("Skipping invalid location:", location);
          return;
        }

        const pin = new PinElement({
          scale: 3,
          glyphColor: "#FFFFFF",
          background: "#3b82f6",
          borderColor: "#1d4ed8",
        });

        const popover = new PopoverElement();
        const popoverContent = document.createElement('div');
        popoverContent.className = 'story-popover-content';
        
        // Determine button text and action based on view mode
        const isZoomedIn = viewMode === 'zoomed' && currentLocation?.id === location.id;
        const buttonText = isZoomedIn ? 'Street View' : 'Explore';
        const buttonAction = isZoomedIn ? 'street-view' : 'explore';
        
        popoverContent.innerHTML = `
          <div class="popover-header">
            <img src="${location.image}" alt="${location.title}" class="popover-image">
            <div class="popover-title-section">
              <h3 class="popover-title">${location.title}</h3>
              <p class="popover-author">by ${location.author} (${location.year})</p>
              <span class="popover-genre">${location.genre}</span>
            </div>
            <button class="popover-close-btn" data-location-id="${location.id}" title="Close">×</button>
          </div>
          <p class="popover-description">${location.description}</p>
          <button class="popover-explore-btn" data-location-id="${location.id}" data-action="${buttonAction}">
            ${buttonText}
          </button>
        `;

        // Add event listeners
        const exploreBtn = popoverContent.querySelector('.popover-explore-btn');
        exploreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = e.target.dataset.action;
          if (action === 'street-view') {
            // Navigate to street view
            navigate(`/location/${location.id}?point=${currentStoryPointIndex}`);
          } else {
            // Regular explore action
            handleExplore(location);
          }
        });

        popoverContent.querySelector('.popover-close-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          popover.open = false;
        });

        popover.append(popoverContent);

        const interactiveMarker = new Marker3DInteractiveElement({
          title: `${location.title} - ${location.author}`,
          position: { lat: location.lat, lng: location.lng, altitude: location.altitude || 60 },
          altitudeMode: "ABSOLUTE",
          extruded: false,
          label: location.title,
          gmpPopoverTargetElement: popover
        });

        interactiveMarker.append(pin);
        map3D.append(interactiveMarker);
        map3D.append(popover);

        markersRef.current.set(location.id, interactiveMarker);

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

  // Update popover content when view mode changes
  useEffect(() => {
    if (!map3DRef.current) return;
    
    // Update all popovers to reflect current view mode
    markersRef.current.forEach((marker, locationId) => {
      const location = locations.find(loc => loc.id === locationId);
      if (!location) return;
      
      const popover = marker.gmpPopoverTargetElement;
      if (popover) {
        const exploreBtn = popover.querySelector('.popover-explore-btn');
        if (exploreBtn) {
          const isZoomedIn = viewMode === 'zoomed' && currentLocation?.id === location.id;
          const buttonText = isZoomedIn ? 'Street View' : 'Explore';
          const buttonAction = isZoomedIn ? 'street-view' : 'explore';
          
          exploreBtn.textContent = buttonText;
          exploreBtn.dataset.action = buttonAction;
          
          // Update the click handler
          const newBtn = exploreBtn.cloneNode(true);
          newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.dataset.action;
            if (action === 'street-view') {
              navigate(`/location/${location.id}?point=${currentStoryPointIndex}`);
            } else {
              handleExplore(location);
            }
          });
          exploreBtn.parentNode.replaceChild(newBtn, exploreBtn);
        }
      }
    });
  }, [viewMode, currentLocation]);

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
      markersRef.current.clear();
    };
  }, [isLoaded, locations]);

  if (error) return <div className="loading">Error loading Google Maps: {error}</div>;
  if (!isLoaded) return <div className="loading">Loading Google Maps...</div>;

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

      {/* Controls - Hidden during onboarding */}
      {!showOnboarding && (
        <div className="map-controls">
          <button className="control-button" onClick={() => setShowStoryList(!showStoryList)}>
            <span className="material-icons">book</span>
            <span>Stories</span>
          </button>

          {(viewMode === 'zoomed' || viewMode === 'street') && currentLocation && (
            <button
              className="control-button view-toggle pulse"
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
      )}

      {/* Story Navigation - Hidden during onboarding */}
      {!showOnboarding && currentStory?.storyPoints?.length > 1 && (
        <div className="story-navigation">
          <button
            className="story-nav-button prev-button"
            onClick={() => handleStoryPointNavigation('prev')}
            disabled={isAnimating}
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
            onClick={() => handleStoryPointNavigation('next')}
            disabled={isAnimating}
          >
            Next Story Point →
          </button>
        </div>
      )}

      {/* Story List - Hidden during onboarding */}
      {!showOnboarding && showStoryList && (
        <div className="story-list-overlay">
          <StoryList
            locations={locations}
            onLocationSelect={handleLocationSelect}
            selectedLocationId={selectedLocationId}
            onClose={() => setShowStoryList(false)}
          />
        </div>
      )}

      {/* Location Info - Hidden during onboarding */}
      {!showOnboarding && viewMode !== 'globe' && currentLocation && (
        <div className={`location-info-overlay ${showInfo ? 'expanded' : ''}`}>
          <div className="info-header" onClick={() => setShowInfo(!showInfo)}>
            <h1 className="location-title">{currentLocation.title}</h1>
            <p className="location-author">by {currentLocation.author} ({currentLocation.year})</p>
            <span className="location-genre">{currentLocation.genre}</span>
            <button
              className="info-collapse-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
              title={showInfo ? 'Collapse info panel' : 'Expand info panel'}
            >
              <span className="collapse-arrow"></span>
            </button>
          </div>

          <div className="info-collapsible-content">
            <div className="location-description">
              <p>{currentLocation.description}</p>
            </div>

            {currentStory?.storyPoints?.[currentStoryPointIndex] && (
              <div className="current-story-point">
                <h3 className="story-point-title">
                  {currentStory.storyPoints[currentStoryPointIndex].text}
                </h3>
                <p className="story-point-description">
                  {currentStory.storyPoints[currentStoryPointIndex].description}
                </p>
              </div>
            )}

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

      {/* Loading indicator - Hidden during onboarding */}
      {!showOnboarding && isAnimating && (
        <div className="transition-indicator">
          <div className="loading-spinner"></div>
          <p>Flying to story point...</p>
        </div>
      )}
    </div>
  );
}

export default Map3D;