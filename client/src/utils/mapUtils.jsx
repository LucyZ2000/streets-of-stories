export const calculateScreenPosition = (panorama, point) => {
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

export const createBillboard = (billboard) => {
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


export const handleHomeReset = (map3DRef, setIsAnimating, setSelectedLocationId, setCurrentLocation, setCurrentStory, setCurrentStoryPointIndex, setViewMode, clearStoryPointMarkers, defaultGlobeView) => {
  if (!map3DRef.current || isAnimating) return;

  setIsAnimating(true);
  setSelectedLocationId(null);
  setCurrentLocation(null);
  setCurrentStory(null);
  setCurrentStoryPointIndex(0);
  setViewMode('globe');

  // Clear story point markers when returning to globe view
  clearStoryPointMarkers();

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