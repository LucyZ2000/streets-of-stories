// Enhanced Location.jsx with story point navigation
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { LOCATIONS } from '../data/locations';
import StreetViewPanorama from '../components/StreetViewPanorama';
import '../styles/Location.css';

function Location() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [currentStoryPointIndex, setCurrentStoryPointIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const found = LOCATIONS.find((loc) => loc.id === id);
    setLocation(found);
    
    // Check if there's a story point index in the URL
    const pointIndex = searchParams.get('point');
    if (pointIndex !== null) {
      const index = parseInt(pointIndex, 10);
      if (!isNaN(index) && found && found.storyPoints && index < found.storyPoints.length) {
        setCurrentStoryPointIndex(index);
      }
    }
  }, [id, searchParams]);

  const handleNextStoryPoint = () => {
    if (!location || !location.storyPoints || isTransitioning) return;
    
    setIsTransitioning(true);
    const nextIndex = (currentStoryPointIndex + 1) % location.storyPoints.length;
    setCurrentStoryPointIndex(nextIndex);
    
    // Update URL with new story point index
    setSearchParams({ point: nextIndex.toString() });
    
    // Add a small delay to allow for smooth transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrevStoryPoint = () => {
    if (!location || !location.storyPoints || isTransitioning) return;
    
    setIsTransitioning(true);
    const prevIndex = currentStoryPointIndex === 0 
      ? location.storyPoints.length - 1 
      : currentStoryPointIndex - 1;
    setCurrentStoryPointIndex(prevIndex);
    
    // Update URL with new story point index
    setSearchParams({ point: prevIndex.toString() });
    
    // Add a small delay to allow for smooth transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleBackTo3D = () => {
    // Navigate back to the home page with the current location selected
    navigate('/', { state: { selectedLocationId: id, viewMode: 'zoomed' } });
  };

  if (!location) {
    return <div className="loading">Location not found...</div>;
  }

  const currentStoryPoint = location.storyPoints?.[currentStoryPointIndex];

  return (
    <div className="location-container">
      {/* Header with location info and navigation */}
      <div className="location-header">
        <div className="location-info">
          <h1 className="location-title">{location.title}</h1>
          <p className="location-author">by {location.author} ({location.year})</p>
          <p className="location-description">{location.description}</p>
        </div>
        
        <div className="location-controls">
          <button 
            className="control-button back-to-3d-button"
            onClick={handleBackTo3D}
            title="Back to 3D View"
          >
            3D View
          </button>
        </div>
      </div>

      {/* Story Point Navigation - only show if there are multiple story points */}
      {location.storyPoints && location.storyPoints.length > 1 && (
        <div className="story-navigation-header">
          <button 
            className="story-nav-button prev-button"
            onClick={handlePrevStoryPoint}
            disabled={isTransitioning}
            title="Previous Story Point"
          >
            ← Previous
          </button>
          
          <div className="story-point-info">
            <div className="story-point-counter">
              {currentStoryPointIndex + 1} / {location.storyPoints.length}
            </div>
            <h2 className="story-point-title">
              {currentStoryPoint?.text || 'Story Point'}
            </h2>
            <p className="story-point-description">
              {currentStoryPoint?.description}
            </p>
          </div>
          
          <button 
            className="story-nav-button next-button"
            onClick={handleNextStoryPoint}
            disabled={isTransitioning}
            title="Next Story Point"
          >
            Next →
          </button>
        </div>
      )}

      {/* Street View Panorama */}
      <StreetViewPanorama 
        location={location} 
        currentStoryPointIndex={currentStoryPointIndex}
        isTransitioning={isTransitioning}
      />

      {/* Instructions Panel */}
      <div className="instructions-panel">
        <strong>Instructions:</strong> 
        {location.storyPoints && location.storyPoints.length > 1 
          ? 'Use the navigation buttons to move between story points, or use the numbered indicators to jump to specific points. '
          : 'Use the numbered indicators to navigate between story points. '
        }
        Click and drag to explore the panoramic view.
      </div>

      {/* Story Points List - for quick navigation */}
      {location.storyPoints && location.storyPoints.length > 1 && (
        <div className="story-points-list">
          <h3>Story Points</h3>
          <div className="story-points-grid">
            {location.storyPoints.map((point, index) => (
              <div 
                key={index}
                className={`story-point-card ${index === currentStoryPointIndex ? 'active' : ''}`}
                onClick={() => {
                  if (!isTransitioning) {
                    setCurrentStoryPointIndex(index);
                    setSearchParams({ point: index.toString() });
                  }
                }}
              >
                <div className="story-point-number">{index + 1}</div>
                <div className="story-point-content">
                  <h4>{point.text}</h4>
                  <p>{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Location;