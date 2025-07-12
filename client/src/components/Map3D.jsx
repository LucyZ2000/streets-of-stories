// Enhanced Map3D.jsx with view toggle and story navigation
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import StoryList from './StoryList';

function Map3D({ locations = [] }) {
  const { isLoaded, error } = useGoogleMaps();
  const containerRef = useRef(null);
  const map3DRef = useRef(null);
  const navigate = useNavigate();
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStoryList, setShowStoryList] = useState(false);
  const [viewMode, setViewMode] = useState('globe'); // 'globe', 'zoomed', 'street'
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [currentStoryPointIndex, setCurrentStoryPointIndex] = useState(0);
  const markersRef = useRef(new Map());

  // Default globe view settings
  const defaultGlobeView = {
    center: { lat: 46.717, lng: 7.075, altitude: 2175.130 },
    range: 5814650,
    tilt: 33,
    heading: 0,
  };

  const handleLocationSelect = async (location) => {
    if (!map3DRef.current || isAnimating) return;

    setIsAnimating(true);
    setSelectedLocationId(location.id);
    setShowStoryList(false);

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
      // Fly to a closer, more detailed view
      map3DRef.current.flyCameraTo({
        endCamera: {
          center: { lat: location.lat, lng: location.lng, altitude: location.altitude || 60 },
          tilt: 75,
          range: 150,
          heading: 0,
        },
        durationMillis: 2000,
      });

      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);

    } catch (error) {
      console.error('Error during explore animation:', error);
      setIsAnimating(false);
    }
  };

  const handleHomeReset = () => {
    if (!map3DRef.current || isAnimating) return;

    setIsAnimating(true);
    setSelectedLocationId(null);
    setCurrentLocation(null);
    setCurrentStory(null);
    setCurrentStoryPointIndex(0);
    setViewMode('globe');

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

  const handleViewToggle = () => {
    if (!currentLocation) return;

    if (viewMode === 'street') {
      // Switch back to zoomed aerial view
      setViewMode('zoomed');
      handleExplore(currentLocation);
    } else {
      // Switch to street view
      setViewMode('street');
      navigate(`/location/${currentLocation.id}`);
    }
  };

  const handleNextStoryPoint = () => {
    if (!currentStory || !currentStory.storyPoints) return;
    
    const nextIndex = (currentStoryPointIndex + 1) % currentStory.storyPoints.length;
    setCurrentStoryPointIndex(nextIndex);
    
    const nextPoint = currentStory.storyPoints[nextIndex];
    
    if (viewMode === 'street') {
      // If in street view, navigate to the story point
      navigate(`/location/${currentStory.id}?point=${nextIndex}`);
    } else {
      // If in 3D view, just update the view
      // This could be enhanced to show different camera angles for different story points
      console.log('Navigating to story point:', nextPoint);
    }
  };

  const handlePrevStoryPoint = () => {
    if (!currentStory || !currentStory.storyPoints) return;
    
    const prevIndex = currentStoryPointIndex === 0 
      ? currentStory.storyPoints.length - 1 
      : currentStoryPointIndex - 1;
    setCurrentStoryPointIndex(prevIndex);
    
    const prevPoint = currentStory.storyPoints[prevIndex];
    
    if (viewMode === 'street') {
      // If in street view, navigate to the story point
      navigate(`/location/${currentStory.id}?point=${prevIndex}`);
    } else {
      // If in 3D view, just update the view
      console.log('Navigating to story point:', prevPoint);
    }
  };

  const initializeMap = async () => {
    if (!isLoaded || !containerRef.current) return;

    try {
      const { Map3DElement, Marker3DInteractiveElement, PopoverElement } = await google.maps.importLibrary("maps3d");
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
          glyph: `${index + 1}`,
          scale: 1.5,
          glyphColor: "#FFFFFF",
          background: "#3b82f6",
          borderColor: "#1d4ed8",
        });

        // Create popover with story information
        const popover = new PopoverElement();

        // Create popover content - simplified with just explore button
        const popoverContent = document.createElement('div');
        popoverContent.className = 'story-popover-content';
        popoverContent.innerHTML = `
          <div class="popover-header">
            <img src="${location.storyPoints?.[0]?.image || 'https://via.placeholder.com/200x120/6366f1/ffffff?text=Story'}" 
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

        // Create interactive marker
        const interactiveMarker = new Marker3DInteractiveElement({
          title: `${location.title} - ${location.author}`,
          position: { lat: location.lat, lng: location.lng, altitude: location.altitude || 60 },
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
          className="control-button home-button"
          onClick={handleHomeReset}
          disabled={isAnimating}
        >
          🏠 Home
        </button>

        {/* Story List Toggle Button */}
        <button 
          className="control-button story-list-toggle"
          onClick={() => setShowStoryList(!showStoryList)}
        >
          {showStoryList ? '✕' : '📚'} Stories
        </button>

        {/* View Toggle Button - show when exploring a location */}
        {(viewMode === 'zoomed' || viewMode === 'street') && currentLocation && (
          <button 
            className="control-button view-toggle"
            onClick={handleViewToggle}
            disabled={isAnimating}
            title={viewMode === 'street' ? 'Switch to 3D View' : 'Switch to Street View'}
          >
            {viewMode === 'street' ? '🌍 3D View' : '🚶 Street View'}
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
            ← Previous
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
            Next →
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

      {/* View Mode Indicator */}
      {viewMode !== 'globe' && currentLocation && (
        <div className="view-mode-indicator">
          <div className="location-info">
            <h3>{currentLocation.title}</h3>
            <p>by {currentLocation.author} ({currentLocation.year})</p>
            <div className="view-mode-badge">
              {viewMode === 'street' ? '🚶 Street View' : '🌍 3D View'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Map3D;