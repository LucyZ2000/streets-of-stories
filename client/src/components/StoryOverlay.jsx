import { useEffect, useRef } from 'react';
import { calculateScreenPosition, createBillboard } from '../utils/mapUtils';

function StoryOverlay({ panorama, storyPoints }) {
  const overlayRef = useRef([]);

  useEffect(() => {
    if (!panorama || !storyPoints || !window.google) return;

    // Clear existing overlays
    overlayRef.current.forEach(overlay => overlay.setMap(null));
    overlayRef.current = [];

    // Create story point overlays
    storyPoints.forEach((point) => {
      const overlay = new window.google.maps.OverlayView();

      overlay.onAdd = function () {
        this.div = createBillboard(point);
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div);
      };

      overlay.draw = function () {
        if (!this.div) return;
        
        const position = calculateScreenPosition(panorama, point);
        
        if (!position) {
          this.div.style.display = 'none';
          return;
        }
        
        this.div.style.display = 'block';
        this.div.style.left = `${position.x}px`;
        this.div.style.top = `${position.y}px`;
      };

      overlay.onRemove = function () {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      };

      overlay.setMap(panorama);
      overlayRef.current.push(overlay);

      // Update overlay position when panorama changes
      panorama.addListener('pov_changed', () => {
        overlay.draw();
      });
    });

    // Cleanup function
    return () => {
      overlayRef.current.forEach(overlay => overlay.setMap(null));
      overlayRef.current = [];
    };
  }, [panorama, storyPoints]);

  return null; // This component doesn't render anything directly
}

export default StoryOverlay;
