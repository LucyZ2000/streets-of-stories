import React from 'react';

function LocationCard({ location, onClose }) {
  if (!location) return null;

  const { title, lat, lng } = location;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <h3>{title || 'Unknown Location'}</h3>
      <p>Latitude: {lat}</p>
      <p>Longitude: {lng}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default LocationCard;
