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

export const createBillboard = (point) => {
  const billboard = document.createElement('div');
  billboard.className = 'story-billboard';
  
  const arrow = document.createElement('div');
  arrow.className = 'billboard-arrow';
  
  billboard.innerHTML = `
    <img src="${point.image}" alt="${point.text}" class="billboard-image">
    <h3 class="billboard-title">${point.text}</h3>
    <p class="billboard-description">${point.description}</p>
  `;
  
  billboard.appendChild(arrow);
  return billboard;
};
