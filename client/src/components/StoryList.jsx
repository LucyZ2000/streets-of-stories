import React, { useState, useMemo, useRef, useEffect } from 'react';
import '../styles/StoryList.css';

function StoryList({ locations, onLocationSelect, selectedLocationId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

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
      // Add matching titles
      if (location.title.toLowerCase().includes(query)) {
        suggestionSet.add({
          type: 'title',
          text: location.title,
          location: location
        });
      }
      
      // Add matching authors
      if (location.author.toLowerCase().includes(query)) {
        suggestionSet.add({
          type: 'author',
          text: location.author,
          location: location
        });
      }
      
      // Add matching genres
      if (location.genre.toLowerCase().includes(query)) {
        suggestionSet.add({
          type: 'genre',
          text: location.genre,
          location: location
        });
      }
      
      // Add matching years
      if (location.year.toString().includes(query)) {
        suggestionSet.add({
          type: 'year',
          text: location.year.toString(),
          location: location
        });
      }
    });
    
    return Array.from(suggestionSet).slice(0, 8); // Limit to 8 suggestions
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
          onLocationSelect(filteredLocations[0]);
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
    onLocationSelect(suggestion.location);
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

  // Get suggestion icon based on type
  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'title': return '📖';
      case 'author': return '👤';
      case 'genre': return '🏷️';
      case 'year': return '📅';
      default: return '🔍';
    }
  };

  return (
    <div className="story-list-container">
      <div className="story-list-header">
        <h2>Literary Locations</h2>
        <p>Explore the real places behind great stories</p>
        
        {/* Search Container */}
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
          
          <div className="search-icon">🔍</div>
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.type}-${suggestion.text}-${suggestion.location.id}`}
                  className={`suggestion-item ${selectedSuggestionIndex === index ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">
                    {getSuggestionIcon(suggestion.type)}
                  </span>
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
        
        {/* Search Results Info */}
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
              onClick={() => onLocationSelect(location)}
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