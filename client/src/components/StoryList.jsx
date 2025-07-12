import React from 'react';
import '../styles/StoryList.css';

function StoryList({ locations, onLocationSelect, selectedLocationId }) {
  return (
    <div className="story-list-container">
      <div className="story-list-header">
        <h2>Literary Locations</h2>
        <p>Explore the real places behind great stories</p>
      </div>
      
      <div className="story-list">
        {locations.map((location) => (
          <div 
            key={location.id}
            className={`story-item ${selectedLocationId === location.id ? 'selected' : ''}`}
            onClick={() => onLocationSelect(location)}
          >
            <div className="story-item-image">
              <img 
                src={location.storyPoints?.[0]?.image || 'https://via.placeholder.com/80x60/6366f1/ffffff?text=Story'} 
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
        ))}
      </div>
    </div>
  );
}

export default StoryList;