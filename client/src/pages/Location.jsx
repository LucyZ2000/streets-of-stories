// Enhanced Location.jsx with music support for atmospheric audio
import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { LOCATIONS } from '../data/Locations';
import StreetViewPanorama from '../components/StreetViewPanorama';
import StoryList from '../components/StoryList';
import '../styles/Toggle.css';
import '../styles/Location.css';

function Location() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [currentStoryPointIndex, setCurrentStoryPointIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [activeBillboard, setActiveBillboard] = useState(null);
  const [showStoryList, setShowStoryList] = useState(false);
  
  // Music-related state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showMusicControls, setShowMusicControls] = useState(false);
  const audioRef = useRef(null);

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

    // Initialize music if location has music
    if (found && found.music) {
      initializeMusic(found.music);
    }

    // Cleanup music when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [id, searchParams]);

  // Initialize and manage background music
  const initializeMusic = (musicSrc) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(musicSrc);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Show music controls if music is available
    setShowMusicControls(true);

    // Auto-play music with a slight delay (respecting browser autoplay policies)
    setTimeout(() => {
      playMusic();
    }, 1000);

    // Handle audio events
    audio.addEventListener('canplaythrough', () => {
      console.log('Music loaded and ready to play');
    });

    audio.addEventListener('error', (e) => {
      console.error('Error loading music:', e);
      setShowMusicControls(false);
    });
  };

  const playMusic = async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Autoplay blocked. User interaction required.');
        // Music will be played when user clicks the play button
      }
    }
  };

  const pauseMusic = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMusic = async () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      await playMusic();
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

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

  const handleHomeReset = () => {
    // Pause music when leaving
    pauseMusic();
    navigate('/');
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

  const [isExpanded, setIsExpanded] = useState(true);

  const toggleInfo = () => {
    setIsExpanded(!isExpanded);
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
    // Pause music when switching to 3D view
    pauseMusic();
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

  const handleBillboardClick = (index) => {
    setActiveBillboard(activeBillboard === index ? null : index);
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
        onBillboardClick={handleBillboardClick}
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

      {/* Consistent Top Navigation Controls */}
      <div className="map-controls">
        {/* Home Button */}
        <button
          className="control-button"
          onClick={handleHomeReset}
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

        {/* Back to 3D View Button (replaces view toggle) */}
        <button
          className="control-button view-toggle pulse" /* Add 'pulse' class if you want the animation */
          onClick={handleBackTo3D}
          disabled={isTransitioning}
          title="Back to 3D View"
        >
          <span className="material-icons">public</span> {/* or "3d_rotation" */}
          <span>Back to 3D View</span>
        </button>

        {/* Music Controls - Only show if location has music */}
        {showMusicControls && (
          <div className="music-controls">
            <button
              className={`control-button music-toggle ${isPlaying ? 'playing' : 'paused'}`}
              onClick={toggleMusic}
              disabled={isTransitioning}
              title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              <span className="material-icons">
                {isPlaying ? 'volume_up' : 'volume_off'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Music Status Indicator */}
      {showMusicControls && isPlaying && (
        <div className="music-status-indicator">
          <div className="music-visualizer">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          <span className="music-title">
            {location.title} - Atmospheric Music
          </span>
        </div>
      )}


      {/* Story Navigation Controls - Bottom Position (like Map3D) */}
      {location.storyPoints && location.storyPoints.length > 1 && (
        <div className="story-navigation">
          <button
            className="story-nav-button prev-button"
            onClick={handlePrevStoryPoint}
            disabled={isTransitioning}
            title="Previous Story Point"
          >
            ← Previous Story Point
          </button>

          <div className="story-point-indicator">
            {currentStoryPointIndex + 1} / {location.storyPoints.length}
            <div className="story-point-title">
              {location.storyPoints[currentStoryPointIndex]?.text}
            </div>
          </div>

          <button
            className="story-nav-button next-button"
            onClick={handleNextStoryPoint}
            disabled={isTransitioning}
            title="Next Story Point"
          >
            Next Story Point→
          </button>
        </div>
      )}

      {/* Story List - appears when showStoryList is true */}
      {showStoryList && (
        <div className="story-list-overlay">
          <StoryList
            locations={LOCATIONS}
            onLocationSelect={(location) => {
              navigate(`/location/${location.id}`);
              setShowStoryList(false);
            }}
          />
        </div>
      )}


      {/* Collapsible Info Overlay - Always visible but expandable */}
        <div className={`location-info-overlay ${isExpanded ? 'expanded' : ''}`}>
          {/* Header - always visible but clickable */}
          <div className="info-header" onClick={toggleInfo}>
            <h1 className="location-title">{location.title}</h1>
            <p className="location-author">by {location.author} ({location.year})</p>
            <span className="location-genre">{location.genre}</span>
            
            {/* Your original toggle button with arrows */}
            <button
              className="info-collapse-toggle"
              onClick={(e) => {
                e.stopPropagation(); // Prevent double trigger
                toggleInfo();
              }}
              title={isExpanded ? 'Collapse info panel' : 'Expand info panel'}
            >
              <span className="collapse-arrow"></span>
            </button>
          </div>

          {/* Collapsible content */}
          <div className="info-collapsible-content">
            {/* All your existing content here */}
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
                    <h4>Available Information</h4>
                    <div className="billboards-list">
                      {currentBillboards.map((billboard, index) => (
                        <button
                          key={index}
                          className={`billboard-summary-item ${activeBillboard === index ? 'active' : ''}`}
                          onClick={() => handleBillboardClick(billboard, index)}
                          disabled={isTransitioning}
                        >
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

            {/* Story Points Quick Navigation */}
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
                                {`${distance.toFixed(1)}km`}
                              </div>
                            )}
                            {billboardCount > 0 && (
                              <div className="story-point-billboards">
                                {billboardCount}
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
          </div>
        </div>

      {/* Loading indicator for transitions (like Map3D) */}
      {isTransitioning && (
        <div className="transition-indicator">
          <div className="loading-spinner"></div>
          <p>Transitioning to story point...</p>
        </div>
      )}
    </div>
  );
}

export default Location;