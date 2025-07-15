import { useEffect, useRef } from 'react';
import { createBillboard } from '../utils/mapUtils';

function StoryOverlay({ panorama, storyPoints }) {
  const overlayRef = useRef([]);

  useEffect(() => {
    if (!panorama || !storyPoints || !window.google) return;

    // Clear existing overlays
    overlayRef.current.forEach(overlay => overlay.setMap(null));
    overlayRef.current = [];

    storyPoints.forEach((point) => {
      const overlay = new window.google.maps.OverlayView();

      overlay.onAdd = function () {
        this.div = createBillboard(point);
        this.div.style.position = 'absolute';
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div);
      };

      overlay.draw = function () {
        if (!this.div) return;

        const projection = this.getProjection();
        if (!projection) return;

        const latLng = new window.google.maps.LatLng(point.lat, point.lng);
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

      overlay.setMap(panorama); // panorama here is a valid MapView for OverlayView
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
  }, [panorama, storyPoints]);

  return null;
}

export default StoryOverlay;
