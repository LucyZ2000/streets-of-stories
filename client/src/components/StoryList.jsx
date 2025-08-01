import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StoryList.css';

function StoryList({ locations, onLocationSelect, selectedLocationId, onClose }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [expandedStoryId, setExpandedStoryId] = useState(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Toggle story points visibility
  const toggleStoryPoints = (storyId) => {
    setExpandedStoryId(expandedStoryId === storyId ? null : storyId);
  };

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    
    const query = searchQuery.toLowerCase().trim();
    return locations.filter(location => 
      location.title.toLowerCase().includes(query) ||
      location.author.toLowerCase().includes(query) ||
      location.genre.toLowerCase().includes(query) ||
      location.year.toString().includes(query) ||
      location.description.toLowerCase().includes(query)
    );
  }, [locations, searchQuery]);

  // Generate autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const suggestionSet = new Set();
    
    locations.forEach(location => {
      if (location.title.toLowerCase().includes(query)) {
        suggestionSet.add({
          type: 'title',
          text: location.title,
          location: location
        });
      }
      
      if (location.author.toLowerCase().includes(query)) {
        suggestionSet.add({
          type: 'author',
          text: location.author,
          location: location
        });
      }
      
      if (location.genre.toLowerCase().includes(query)) {
        suggestionSet.add({
          type: 'genre',
          text: location.genre,
          location: location
        });
      }
      
      if (location.year.toString().includes(query)) {
        suggestionSet.add({
          type: 'year',
          text: location.year.toString(),
          location: location
        });
      }
    });
    
    return Array.from(suggestionSet).slice(0, 8);
  }, [locations, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else if (filteredLocations.length > 0) {
          // Navigate to location without story point (will start from beginning)
          handleLocationNavigation(filteredLocations[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    // Navigate to location without story point (will start from beginning)
    handleLocationNavigation(suggestion.location);
  };

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    searchInputRef.current?.focus();
  };

  // Navigate to location - this function handles the routing properly
  const handleLocationNavigation = (location, storyPointIndex = null) => {
    if (onClose) onClose(); // Close the story list if onClose is provided
    
    // Always use onLocationSelect if available (for 3D view navigation)  
    if (onLocationSelect) {
      onLocationSelect(location, storyPointIndex);
    } else {
      // Fallback to direct navigation (for when there's no parent to handle selection)
      if (storyPointIndex !== null) {
        navigate(`/location/${location.id}?point=${storyPointIndex}`);
      } else {
        navigate(`/location/${location.id}`);
      }
    }
  };

  // Handle main story item click
  const handleMainStoryClick = (location) => {
    handleLocationNavigation(location);
  };

  // Handle story point click
  const handleStoryPointClick = (location, index, e) => {
    e.stopPropagation(); // Prevent triggering parent clicks
    handleLocationNavigation(location, index);
  };

  return (
    <div className="story-list-container">
      <div className="story-list-header">
        <div className="story-list-title-row">
          <h2>Stories</h2>
          {onClose && (
            <button 
              className="story-list-close-btn"
              onClick={onClose}
              aria-label="Close story list"
              title="Close story list"
            >
              <span className="material-icons">close</span>
            </button>
          )}
        </div>
        
        <div className="search-container" ref={suggestionsRef}>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search by title, author, genre..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
          />
          
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
          
          <span className="search-icon material-icons">search</span>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.text}-${suggestion.location.id}`}
                  className={`suggestion-item ${selectedSuggestionIndex === index ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-content">
                    <div className="suggestion-text">{suggestion.text}</div>
                    <div className="suggestion-meta">
                      {suggestion.type} • {suggestion.location.title}
                      {suggestion.type !== 'title' && ` • ${suggestion.location.author}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {searchQuery && (
          <p className="search-results-info">
            {filteredLocations.length} of {locations.length} stories
          </p>
        )}
      </div>
      
      <div className="story-list">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => (
            <div 
              key={location.id}
              className={`story-item ${selectedLocationId === location.id ? 'selected' : ''}`}
            >
              <div 
                className="story-item-main"
                onClick={() => handleMainStoryClick(location)}
              >
                <div className="story-item-image">
                  <img 
                    src={location.image} 
                    alt={location.title}
                  />
                </div>
                
                <div className="story-item-content">
                  <h3 className="story-title">{location.title}</h3>
                  <p className="story-author">by {location.author}</p>
                  <p className="story-year">{location.year}</p>
                  <span className="story-genre">{location.genre}</span>
                </div>
              </div>
              
              {location.storyPoints && location.storyPoints.length > 0 && (
                <div className="story-points-list-section">
                  <button 
                    className="story-points-list-toggle"
                    onClick={() => toggleStoryPoints(location.id)}
                  >
                    Jump to Specific Point
                    <span className="toggle-icon">
                      {expandedStoryId === location.id ? '▲' : '▼'}
                    </span>
                  </button>
                  
                  {expandedStoryId === location.id && (
                    <div className="story-points-list">
                      {location.storyPoints.map((point, index) => (
                        <div 
                          key={`${location.id}-${index}`}
                          className="story-point"
                          onClick={(e) => handleStoryPointClick(location, index, e)}
                        >
                          <h4 className="story-point-list-title">
                            {point.text}
                          </h4>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No stories found</p>
            <p className="no-results-hint">
              Try searching for "{searchQuery.length > 0 ? 'a different term' : 'titles, authors, or genres'}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryList;