// Enhanced Location.jsx with billboard support
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { LOCATIONS } from '../data/Locations';
import StreetViewPanorama from '../components/StreetViewPanorama';
import '../styles/Location.css';

function Location() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [currentStoryPointIndex, setCurrentStoryPointIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [activeBillboard, setActiveBillboard] = useState(null);
  const [billboardsVisible, setBillboardsVisible] = useState(true);


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

  // Helper function to calculate distance between two points
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

  // Enhanced transition with user feedback
  const performTransition = async (newIndex, direction = 'next') => {
    if (!location || !location.storyPoints || isTransitioning) return;

    const currentPoint = location.storyPoints[currentStoryPointIndex];
    const nextPoint = location.storyPoints[newIndex];

    if (!nextPoint) return;

    setIsTransitioning(true);
    setActiveBillboard(null); // Close any active billboard during transition

    // Calculate distance and provide appropriate feedback
    const distance = calculateDistance(currentPoint, nextPoint);
    let message = '';
    let duration = 1000; // Base duration

    if (distance > 50) {
      message = `Traveling to ${nextPoint.text}...`;
      duration = 2000; // Longer for far distances
    } else if (distance > 5) {
      message = `Moving to ${nextPoint.text}...`;
      duration = 1500; // Medium duration
    } else {
      message = `Transitioning to ${nextPoint.text}...`;
      duration = 1000; // Quick transition
    }

    setTransitionMessage(message);

    // Update the story point index and URL
    setCurrentStoryPointIndex(newIndex);
    setSearchParams({ point: newIndex.toString() });

    // Simulate transition time based on distance
    await new Promise(resolve => setTimeout(resolve, duration));

    setTransitionMessage('');
    setIsTransitioning(false);
  };

  const handleNextStoryPoint = async () => {
    if (!location || !location.storyPoints || isTransitioning) return;

    const nextIndex = (currentStoryPointIndex + 1) % location.storyPoints.length;
    await performTransition(nextIndex, 'next');
  };

  const handlePrevStoryPoint = async () => {
    if (!location || !location.storyPoints || isTransitioning) return;

    const prevIndex = currentStoryPointIndex === 0
      ? location.storyPoints.length - 1
      : currentStoryPointIndex - 1;
    await performTransition(prevIndex, 'prev');
  };

  const handleJumpToStoryPoint = async (index) => {
    if (!location || !location.storyPoints || isTransitioning || index === currentStoryPointIndex) return;

    await performTransition(index, 'jump');
  };

  const handleBackTo3D = () => {
    // Navigate back to the home page with the current location selected
    navigate('/', {
      state: {
        selectedLocationId: id,
        viewMode: 'zoomed',
        shouldExplore: true,
        storyPointIndex: currentStoryPointIndex
      }
    });
  };



  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const toggleBillboards = () => {
    setBillboardsVisible(!billboardsVisible);
    if (!billboardsVisible) {
      setActiveBillboard(null); // Close active billboard when hiding all
    }
  };

  const handleBillboardClick = (index) => {
    setActiveBillboard(activeBillboard === index ? null : index);
  };

  const closeBillboard = () => {
    setActiveBillboard(null);
  };

  if (!location) {
    return <div className="loading">Location not found...</div>;
  }

  const currentStoryPoint = location.storyPoints?.[currentStoryPointIndex];
  const currentBillboards = currentStoryPoint?.billboards || [];

  return (
    <div className="location-fullscreen-container">
      {/* Full Screen Street View Panorama */}
      <StreetViewPanorama
        location={location}
        currentStoryPointIndex={currentStoryPointIndex}
        isTransitioning={isTransitioning}
      />

      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="transition-overlay">
          <div className="transition-content">
            <div className="transition-spinner"></div>
            <p className="transition-message">{transitionMessage}</p>
            <div className="transition-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="map-controls">
        <button
          className="control-button back-to-3d-button"
          onClick={handleBackTo3D}
          title="Back to 3D View"
          disabled={isTransitioning}
        >
          ← 3D View
        </button>

        <button
          className="control-button info-toggle-button"
          onClick={toggleInfo}
          title={showInfo ? 'Hide Info' : 'Show Info'}
          disabled={isTransitioning}
        >
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>

        <button
          className={`control-button billboards-toggle-button ${billboardsVisible ? 'active' : ''}`}
          onClick={toggleBillboards}
          title={billboardsVisible ? 'Hide Billboards' : 'Show Billboards'}
          disabled={isTransitioning}
        >
          📋 Billboards
        </button>
      </div>

      {/* Billboard Indicators */}
      {billboardsVisible && currentBillboards.length > 0 && (
        <div className="billboard-indicators">
          {currentBillboards.map((billboard, index) => (
            <button
              key={index}
              className={`billboard-indicator ${activeBillboard === index ? 'active' : ''}`}
              onClick={() => handleBillboardClick(index)}
              title={billboard.title}
              disabled={isTransitioning}
              style={{
                transform: `rotate(${billboard.heading || 0}deg)`,
                right: `${20 + (index * 70)}px`,
                top: '35px',
                position: 'absolute',
                zIndex: 1000 + index,                 
              }}
            >
              <div className="billboard-icon">
                {billboard.icon || '📋'}
              </div>
              <div className="billboard-pulse"></div>
            </button>
          ))}
        </div>
      )}

      {/* Active Billboard Modal */}
      {activeBillboard !== null && currentBillboards[activeBillboard] && (
        <div className="billboard-modal-overlay" onClick={closeBillboard}>
          <div className="billboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="billboard-header">
              <h3 className="billboard-title">
                {currentBillboards[activeBillboard].icon && (
                  <span className="billboard-title-icon">
                    {currentBillboards[activeBillboard].icon}
                  </span>
                )}
                {currentBillboards[activeBillboard].title}
              </h3>
              <button
                className="billboard-close-button"
                onClick={closeBillboard}
                title="Close Billboard"
              >
                ×
              </button>
            </div>

            <div className="billboard-content">
              {currentBillboards[activeBillboard].image && (
                <div className="billboard-image">
                  <img
                    src={currentBillboards[activeBillboard].image}
                    alt={currentBillboards[activeBillboard].title}
                  />
                </div>
              )}

              <div className="billboard-text">
                <p className="billboard-description">
                  {currentBillboards[activeBillboard].content}
                </p>

                {currentBillboards[activeBillboard].details && (
                  <div className="billboard-details">
                    {/* This part looks correct, but make sure your data structure matches */}
                    {typeof currentBillboards[activeBillboard].details === 'string' ? (
                      <div className="billboard-detail-item">
                        {currentBillboards[activeBillboard].details}
                      </div>
                    ) : (
                      currentBillboards[activeBillboard].details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="billboard-detail-item">
                          <strong>{detail.label}:</strong> {detail.value}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {currentBillboards[activeBillboard].quote && (
                  <blockquote className="billboard-quote">
                    "{currentBillboards[activeBillboard].quote}"
                    {currentBillboards[activeBillboard].quoteAuthor && (
                      <cite>— {currentBillboards[activeBillboard].quoteAuthor}</cite>
                    )}
                  </blockquote>
                )}
              </div>
            </div>

            {currentBillboards[activeBillboard].actions && (
              <div className="billboard-actions">
                {currentBillboards[activeBillboard].actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    className="billboard-action-button"
                    onClick={() => {
                      if (action.onClick) action.onClick();
                      if (action.closeAfter) closeBillboard();
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Story Navigation Controls */}
      {location.storyPoints && location.storyPoints.length > 1 && (
        <div className="story-navigation-street">
          <button
            className="story-nav-button-street prev-button"
            onClick={handlePrevStoryPoint}
            disabled={isTransitioning}
            title="Previous Story Point"
          >
            ← Previous
          </button>

          <div className="story-point-counter-street">
            <span className="current-point">{currentStoryPointIndex + 1}</span>
            <span className="separator">/</span>
            <span className="total-points">{location.storyPoints.length}</span>
            {currentBillboards.length > 0 && (
              <span className="billboard-count" title={`${currentBillboards.length} billboards available`}>
                📋 {currentBillboards.length}
              </span>
            )}
          </div>

          <button
            className="story-nav-button-street next-button"
            onClick={handleNextStoryPoint}
            disabled={isTransitioning}
            title="Next Story Point"
          >
            Next →
          </button>
        </div>
      )}

      {/* Corner Info Box */}
      {showInfo && (
        <div className="location-info-overlay">
          <div className="info-header">
            <h1 className="location-title">{location.title}</h1>
            <p className="location-author">by {location.author} ({location.year})</p>
            <span className="location-genre">{location.genre}</span>
          </div>

          <div className="location-description">
            <p>{location.description}</p>
          </div>

          {/* Current Story Point Info */}
          {currentStoryPoint && (
            <div className="current-story-point">
              <h3 className="story-point-title">{currentStoryPoint.text}</h3>
              <p className="story-point-description">{currentStoryPoint.description}</p>

              {/* Billboard Summary */}
              {currentBillboards.length > 0 && (
                <div className="billboards-summary">
                  <h4>📋 Available Information</h4>
                  <div className="billboards-list">
                    {currentBillboards.map((billboard, index) => (
                      <button
                        key={index}
                        className={`billboard-summary-item ${activeBillboard === index ? 'active' : ''}`}
                        onClick={() => handleBillboardClick(billboard, index)}
                        disabled={isTransitioning}
                      >
                        <span className="billboard-summary-icon">
                          {billboard.icon || '📋'}
                        </span>
                        <span className="billboard-summary-title">
                          {billboard.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Distance indicator for context */}
              {location.storyPoints.length > 1 && (
                <div className="story-point-context">
                  <span className="story-point-badge">
                    Point {currentStoryPointIndex + 1} of {location.storyPoints.length}
                  </span>
                  {currentBillboards.length > 0 && (
                    <span className="billboard-badge">
                      {currentBillboards.length} info {currentBillboards.length === 1 ? 'point' : 'points'}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Enhanced Story Points Quick Navigation */}
          {location.storyPoints && location.storyPoints.length > 1 && (
            <div className="story-points-quick-nav-enhanced">
              <div className="nav-header">
                <h4>Story Points</h4>
              </div>
              <div className="story-points-grid">
                {location.storyPoints.map((point, index) => {
                  const distance = index !== currentStoryPointIndex ?
                    calculateDistance(currentStoryPoint, point) : 0;
                  const billboardCount = point.billboards?.length || 0;

                  return (
                    <button
                      key={index}
                      className={`story-point-card ${index === currentStoryPointIndex ? 'active' : ''}`}
                      onClick={() => handleJumpToStoryPoint(index)}
                      disabled={isTransitioning || index === currentStoryPointIndex}
                      title={`${point.text}${distance > 0 ? ` (${distance.toFixed(1)}km away)` : ''}${billboardCount > 0 ? ` • ${billboardCount} info points` : ''}`}
                    >
                      <div className="story-point-number">{index + 1}</div>
                      <div className="story-point-info">
                        <div className="story-point-name">{point.text}</div>
                        <div className="story-point-meta">
                          {distance > 0 && (
                            <div className="story-point-distance">
                              {distance > 1 ? `${distance.toFixed(1)}km` : `${(distance * 1000).toFixed(0)}m`}
                            </div>
                          )}
                          {billboardCount > 0 && (
                            <div className="story-point-billboards">
                              📋 {billboardCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compact Navigation - also enhanced */}
          {location.storyPoints && location.storyPoints.length > 1 && (
            <div className="story-navigation-compact">
              <button
                className="story-nav-button-compact prev-button"
                onClick={handlePrevStoryPoint}
                disabled={isTransitioning}
                title="Previous Story Point"
              >
                ←
              </button>

              <div className="story-point-counter">
                {currentStoryPointIndex + 1} / {location.storyPoints.length}
              </div>

              <button
                className="story-nav-button-compact next-button"
                onClick={handleNextStoryPoint}
                disabled={isTransitioning}
                title="Next Story Point"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Instructions Panel */}
      <div className="instructions-overlay">
        <div className="instructions-content">
          <strong>Instructions:</strong> Click and drag to explore the panoramic view.
          {location.storyPoints && location.storyPoints.length > 1 && (
            <span> Use navigation controls to travel between story points.</span>
          )}
          {currentBillboards.length > 0 && (
            <span> Click billboard icons (📋) for detailed information.</span>
          )}
          {isTransitioning && (
            <div className="instructions-status">
              <span className="status-dot"></span> Transitioning...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Location;