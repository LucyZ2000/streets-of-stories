import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { LOCATIONS } from '../data/Locations';
import StreetViewPanorama from '../components/StreetViewPanorama';
import StoryList from '../components/StoryList';
import { useSessionState } from '../hooks/SessionStateContext';
import '../styles/InfoOverlay.css';
import '../styles/Location.css';

function Location() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const { sessionState, updateSessionState } = useSessionState();
  
  const [state, setState] = useState({
    location: null,
    currentStoryPointIndex: 0,
    isTransitioning: false,
    transitionMessage: '',
    activeBillboard: null,
    showStoryList: false,
    isPlaying: sessionState.isMusicPlaying,
    volume: sessionState.musicVolume,
    showMusicControls: false,
    isExpanded: sessionState.isInfoExpanded
  });

  const setPartialState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
    
    // Update session state for persistent values
    const sessionUpdates = {};
    if ('isPlaying' in updates) sessionUpdates.isMusicPlaying = updates.isPlaying;
    if ('volume' in updates) sessionUpdates.musicVolume = updates.volume;
    if ('isExpanded' in updates) sessionUpdates.isInfoExpanded = updates.isExpanded;
    
    if (Object.keys(sessionUpdates).length > 0) {
      updateSessionState(sessionUpdates);
    }
  };

  useEffect(() => {
    const found = LOCATIONS.find(loc => loc.id === id);
    setPartialState({ location: found });
    
    const pointIndex = searchParams.get('point');
    if (pointIndex !== null) {
      const index = parseInt(pointIndex, 10);
      if (!isNaN(index) && found?.storyPoints?.[index]) {
        setPartialState({ currentStoryPointIndex: index });
      }
    }

    if (found?.music) initializeMusic(found.music);
    
    return () => audioRef.current?.pause();
  }, [id, searchParams]);

  const initializeMusic = (musicSrc) => {
    if (!sessionState.isMusicEnabled) return;
    
    audioRef.current?.pause();
    const audio = new Audio(musicSrc);
    audio.loop = true;
    audio.volume = sessionState.musicVolume;
    audioRef.current = audio;
    setPartialState({ showMusicControls: true, isPlaying: false });
    
    // Auto-play if music was playing in the session
    if (sessionState.isMusicPlaying) {
      setTimeout(async () => {
        try {
          await audio.play();
          setPartialState({ isPlaying: true });
        } catch (error) {
          console.log('Autoplay blocked');
          // Reset session state if autoplay fails
          updateSessionState({ isMusicPlaying: false });
        }
      }, 1000);
    }
  };

  const playMusic = async () => {
    if (audioRef.current && !state.isPlaying) {
      try {
        await audioRef.current.play();
        setPartialState({ isPlaying: true });
      } catch (error) {
        console.log('Autoplay blocked');
      }
    }
  };

  const toggleMusic = async () => {
    if (state.isPlaying) {
      audioRef.current?.pause();
      setPartialState({ isPlaying: false });
    } else {
      await playMusic();
    }
  };

  const performTransition = async (newIndex) => {
    if (!state.location || !state.location.storyPoints || state.isTransitioning) return;
    
    setPartialState({
      isTransitioning: true,
      activeBillboard: null,
      transitionMessage: `Transitioning to ${state.location.storyPoints[newIndex].text}...`
    });

    setPartialState({ currentStoryPointIndex: newIndex });
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPartialState({ isTransitioning: false, transitionMessage: '' });
  };

  const handleNextStoryPoint = () => {
    const nextIndex = (state.currentStoryPointIndex + 1) % state.location.storyPoints.length;
    performTransition(nextIndex);
  };

  const handlePrevStoryPoint = () => {
    const prevIndex = state.currentStoryPointIndex === 0
      ? state.location.storyPoints.length - 1
      : state.currentStoryPointIndex - 1;
    performTransition(prevIndex);
  };

  const handleJumpToStoryPoint = (index) => {
    if (index !== state.currentStoryPointIndex) {
      performTransition(index);
    }
  };

  const handleBackTo3D = () => {
    audioRef.current?.pause();
    navigate('/', {
      state: {
        selectedLocationId: id,
        viewMode: 'zoomed',
        shouldExplore: true,
        storyPointIndex: state.currentStoryPointIndex
      }
    });
  };

  if (!state.location) return <div className="loading">Location not found...</div>;

  const currentStoryPoint = state.location.storyPoints?.[state.currentStoryPointIndex];

  return (
    <div className="location-fullscreen-container">
      <StreetViewPanorama
        location={state.location}
        currentStoryPointIndex={state.currentStoryPointIndex}
        isTransitioning={state.isTransitioning}
      />
      
      {/* Controls */}
      <div className="map-controls">
        <button className="control-button" onClick={() => setPartialState({ showStoryList: !state.showStoryList })}>
          <span className="material-icons">book</span>
          <span>Stories</span>
        </button>
        
        <button className="control-button view-toggle pulse" onClick={handleBackTo3D}>
          <span className="material-icons">public</span>
          <span>Back to 3D View</span>
        </button>
        
        {state.showMusicControls && (
          <button className="control-button music-toggle" onClick={toggleMusic}>
            <span className="material-icons">{state.isPlaying ? 'volume_up' : 'volume_off'}</span>
          </button>
        )}
      </div>
      
      {/* Story Navigation */}
      {state.location.storyPoints?.length > 1 && (
        <div className="story-navigation">
          <button 
            className="story-nav-button prev-button" 
            onClick={handlePrevStoryPoint}
            disabled={state.isTransitioning}
          >
            ← Previous Story Point
          </button>
          <div className="story-point-indicator">
            {state.currentStoryPointIndex + 1} / {state.location.storyPoints.length}
          </div>
          <button 
            className="story-nav-button next-button" 
            onClick={handleNextStoryPoint}
            disabled={state.isTransitioning}
          >
            Next Story Point→
          </button>
        </div>
      )}
      
      {/* Story List */}
      {state.showStoryList && (
        <div className="story-list-overlay">
          <StoryList
            locations={LOCATIONS}
            onLocationSelect={(location) => {
              navigate(`/location/${location.id}`);
              setPartialState({ showStoryList: false });
            }}
            onClose={() => setPartialState({ showStoryList: false })}
          />
        </div>
      )}

      {/* Info Overlay */}
      <div className={`location-info-overlay ${state.isExpanded ? 'expanded' : ''}`}>
        <div className="info-header" onClick={() => setPartialState({ isExpanded: !state.isExpanded })}>
          <h1 className="location-title">{state.location.title}</h1>
          <p className="location-author">by {state.location.author} ({state.location.year})</p>
          <span className="location-genre">{state.location.genre}</span>
          <button
            className="info-collapse-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setPartialState({ isExpanded: !state.isExpanded });
            }}
            title={state.isExpanded ? 'Collapse info panel' : 'Expand info panel'}
          >
            <span className="collapse-arrow"></span>
          </button>
        </div>

        {state.isExpanded && (
          <div className="info-collapsible-content">
            <div className="location-description">
              <p>{state.location.description}</p>
            </div>

            {currentStoryPoint && (
              <div className="current-story-point">
                <h3 className="story-point-title">{currentStoryPoint.text}</h3>
                <p className="story-point-description">{currentStoryPoint.description}</p>
              </div>
            )}

            {state.location.storyPoints?.length > 1 && (
              <div className="story-points-quick-nav-enhanced">
                <div className="story-points-grid">
                  {state.location.storyPoints.map((point, index) => (
                    <button
                      key={index}
                      className={`story-point-card ${index === state.currentStoryPointIndex ? 'active' : ''}`}
                      onClick={() => handleJumpToStoryPoint(index)}
                      disabled={state.isTransitioning}
                    >
                      <div className="story-point-number">{index + 1}</div>
                      <div className="story-point-info">
                        <div className="story-point-name">{point.text}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Location;