import { useEffect, useRef } from 'react';
import { createBillboard } from '../utils/mapUtils';

// Change the prop name from storyPoints to currentBillboards
function StoryOverlay({ panorama, currentBillboards }) {
  const overlayRef = useRef([]);

  // Add debug logging
  console.log('StoryOverlay received currentBillboards:', currentBillboards);
  console.log('currentBillboards type:', typeof currentBillboards);
  console.log('currentBillboards is array:', Array.isArray(currentBillboards));

  useEffect(() => {
    console.log('StoryOverlay useEffect - currentBillboards:', currentBillboards);
    if (!panorama || !currentBillboards || !window.google) return;

    // Clear existing overlays
    overlayRef.current.forEach(overlay => overlay.setMap(null));
    overlayRef.current = [];

    // Loop through currentBillboards instead of storyPoints
    currentBillboards.forEach((billboard) => {
      const overlay = new window.google.maps.OverlayView();

      overlay.onAdd = function () {
        // Pass the billboard data to createBillboard instead of point data
        this.div = createBillboard(billboard);
        this.div.style.position = 'absolute';
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div);
      };

      overlay.draw = function () {
        if (!this.div) return;

        const projection = this.getProjection();
        if (!projection) return;

        // Use billboard coordinates if they exist, otherwise fall back to panorama position
        const lat = billboard.lat || panorama.getPosition()?.lat();
        const lng = billboard.lng || panorama.getPosition()?.lng();
        
        if (!lat || !lng) return;

        const latLng = new window.google.maps.LatLng(lat, lng);
        const pixel = projection.fromLatLngToDivPixel(latLng);

        if (!pixel) {
          this.div.style.display = 'none';
          return;
        }

        this.div.style.display = 'block';
        this.div.style.left = `${pixel.x}px`;
        this.div.style.top = `${pixel.y}px`;
      };

      overlay.onRemove = function () {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      };

      overlay.setMap(panorama);
      overlayRef.current.push(overlay);

      // Update overlay when POV changes
      panorama.addListener('pov_changed', () => {
        overlay.draw();
      });
    });

    return () => {
      overlayRef.current.forEach(overlay => overlay.setMap(null));
      overlayRef.current = [];
    };
  }, [panorama, currentBillboards]); // Change dependency from storyPoints to currentBillboards

  return null;
}

export default StoryOverlay;