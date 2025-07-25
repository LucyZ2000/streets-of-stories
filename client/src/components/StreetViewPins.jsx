import { useEffect, useState, useRef } from 'react';
import '../styles/StreetViewPins.css';

const StreetViewPins = ({ 
  panorama, 
  isInitialized, 
  currentBillboards
}) => {
  const [billboardMarkers, setBillboardMarkers] = useState([]);
  const activeDialogsRef = useRef(new Map()); // Use ref for immediate access

  useEffect(() => {
    if (!panorama || !isInitialized || !currentBillboards.length) {
      return;
    }

    // Clear existing markers
    billboardMarkers.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });

    // Function to calculate distance between two lat/lng points (in meters)
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3; // Earth's radius in meters
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Function to calculate marker size based on distance
    const calculateMarkerSize = (distance) => {
      const minSize = 20;
      const maxSize = 60;
      const minDistance = 10;
      const maxDistance = 500;
      
      const clampedDistance = Math.max(minDistance, Math.min(maxDistance, distance));
      const normalizedDistance = (clampedDistance - minDistance) / (maxDistance - minDistance);
      const size = maxSize - (normalizedDistance * (maxSize - minSize));
      return Math.round(size);
    };

    // Function to calculate bearing from current position to billboard
    const calculateBearing = (lat1, lng1, lat2, lng2) => {
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δλ = (lng2 - lng1) * Math.PI / 180;
      
      const y = Math.sin(Δλ) * Math.cos(φ2);
      const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
      
      let bearing = Math.atan2(y, x) * 180 / Math.PI;
      return (bearing + 360) % 360;
    };

    // Custom overlay class for Street View pins
    class CustomMarkerOverlay extends window.google.maps.OverlayView {
      constructor(position, content, title, clickHandler) {
        super();
        this.position = position;
        this.content = content;
        this.title = title;
        this.clickHandler = clickHandler;
        this.div = null;
      }

      onAdd() {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.cursor = 'pointer';
        div.style.pointerEvents = 'auto';
        div.innerHTML = this.content;
        
        div.addEventListener('click', this.clickHandler);
        
        this.div = div;
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(div);
      }

      draw() {
        if (!this.div) return;
        
        const overlayProjection = this.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(this.position);
        
        if (position) {
          this.div.style.left = position.x + 'px';
          this.div.style.top = position.y + 'px';
        }
      }

      onRemove() {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }

      setVisible(visible) {
        if (this.div) {
          this.div.style.display = visible ? 'block' : 'none';
        }
      }

      updateContent(newContent) {
        if (this.div) {
          this.div.innerHTML = newContent;
        }
      }

      getPosition() {
        return this.position;
      }

      setPosition(newPosition) {
        this.position = newPosition;
        this.draw();
      }
    }

    // Location-anchored dialog class that stays in physical location
    class LocationDialog extends window.google.maps.OverlayView {
      constructor(position, content, billboardId, onClose) {
        super();
        this.position = position;
        this.content = content;
        this.billboardId = billboardId;
        this.onClose = onClose;
        this.div = null;
      }

      onAdd() {
        const div = document.createElement('div');
        div.className = 'location-dialog';
        div.innerHTML = this.content;

        // Add close functionality
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'dialog-close-btn';
        
        closeBtn.onclick = (e) => {
          e.stopPropagation();
          this.close();
        };

        div.appendChild(closeBtn);

        // Add pointer arrow
        const arrow = document.createElement('div');
        arrow.className = 'dialog-arrow';
        div.appendChild(arrow);

        this.div = div;
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(div);
      }

      draw() {
        if (!this.div) return;
        
        const overlayProjection = this.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(this.position);
        
        if (position) {
          this.div.style.left = position.x + 'px';
          this.div.style.top = position.y + 'px';
        }
      }

      close() {
        if (this.div) {
          this.div.classList.add('closing');
          setTimeout(() => {
            this.onClose(this.billboardId);
            this.setMap(null);
          }, 300);
        }
      }

      onRemove() {
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
      }
    }

    const markersRef = [];

    // Function to update marker sizes and visibility
    const updateMarkers = () => {
      const currentPosition = panorama.getPosition();
      const currentPov = panorama.getPov();
      
      if (!currentPosition || !currentPov) return;

      const currentLat = currentPosition.lat();
      const currentLng = currentPosition.lng();

      markersRef.forEach((markerData, index) => {
        const billboard = currentBillboards[index];
        const distance = calculateDistance(
          currentLat,
          currentLng,
          billboard.lat,
          billboard.lng
        );

        const bearing = calculateBearing(currentLat, currentLng, billboard.lat, billboard.lng);
        
        let relativeBearing = bearing - currentPov.heading;
        if (relativeBearing > 180) relativeBearing -= 360;
        if (relativeBearing < -180) relativeBearing += 360;

        const isVisible = Math.abs(relativeBearing) <= 90 && distance <= 500;

        if (isVisible) {
          const newSize = calculateMarkerSize(distance);
          
          const iconContent = `
            <div class="marker-pin" style="width: ${newSize}px; height: ${newSize}px;">
              <div class="marker-pin-circle" style="width: ${newSize}px; height: ${newSize}px;"></div>
            </div>
          `;

          markerData.marker.updateContent(iconContent);
          markerData.marker.setVisible(true);
        } else {
          markerData.marker.setVisible(false);
        }
      });
    };

    // Create markers for current billboards
    currentBillboards.forEach((billboard, index) => {
      const currentPosition = panorama.getPosition();
      let initialSize = 36;
      
      if (currentPosition) {
        const distance = calculateDistance(
          currentPosition.lat(),
          currentPosition.lng(),
          billboard.lat,
          billboard.lng
        );
        initialSize = calculateMarkerSize(distance);
      }

      const iconContent = `
        <div class="marker-pin" style="width: ${initialSize}px; height: ${initialSize}px;">
          <div class="marker-pin-circle" style="width: ${initialSize}px; height: ${initialSize}px;"></div>
        </div>
      `;

      // Create click handler for this pin
      const clickHandler = (event) => {
        event.stopPropagation();
        console.log('Story point pin clicked:', billboard);
        
        // Create unique ID for this billboard
        const billboardId = billboard.id || `billboard-${billboard.title}-${index}`;
        console.log('Billboard ID:', billboardId);
        console.log('Active dialogs:', Array.from(activeDialogsRef.current.keys()));
        
        // Check if dialog is already open for this billboard
        if (activeDialogsRef.current.has(billboardId)) {
          console.log('Closing existing dialog for:', billboardId);
          // Close existing dialog
          const existingDialog = activeDialogsRef.current.get(billboardId);
          existingDialog.close();
          return;
        }

        console.log('Opening new dialog for:', billboardId);

        // Create dialog content based on your data structure
        const dialogContent = `
          <div class="dialog-content">
            <div class="dialog-header">
              <h3 class="dialog-title">${billboard.title}</h3>
            </div>
            
            ${billboard.type ? `
              <div class="dialog-type-badge">${billboard.type}</div>
            ` : ''}
            
            <p class="dialog-description">${billboard.content}</p>
                        
            ${billboard.details ? `
              <div class="dialog-details">
                <span class="dialog-details-label">Details:</span><br>
                ${billboard.details}
              </div>
            ` : ''}
          </div>
        `;

        // Create location-anchored dialog
        const dialog = new LocationDialog(
          new window.google.maps.LatLng(billboard.lat, billboard.lng),
          dialogContent,
          billboardId,
          (closedBillboardId) => {
            // Remove from active dialogs when closed
            activeDialogsRef.current.delete(closedBillboardId);
            console.log('Dialog removed from active dialogs:', closedBillboardId);
          }
        );

        dialog.setMap(panorama);
        
        // Add to active dialogs immediately
        activeDialogsRef.current.set(billboardId, dialog);
        console.log('Dialog added to active dialogs:', billboardId);
      };

      // Create custom overlay marker
      const marker = new CustomMarkerOverlay(
        new window.google.maps.LatLng(billboard.lat, billboard.lng),
        iconContent,
        '',
        clickHandler
      );

      marker.setMap(panorama);
      markersRef.push({ marker, billboard });
    });

    setBillboardMarkers(markersRef.map(m => m.marker));

    // Listen for Street View changes
    const positionChangedListener = panorama.addListener('position_changed', updateMarkers);
    const povChangedListener = panorama.addListener('pov_changed', updateMarkers);

    // Initial update
    updateMarkers();

    // Cleanup function
    return () => {
      window.google.maps.event.removeListener(positionChangedListener);
      window.google.maps.event.removeListener(povChangedListener);
      
      // Close all active dialogs
      activeDialogsRef.current.forEach(dialog => {
        dialog.setMap(null);
      });
      activeDialogsRef.current.clear();
      
      markersRef.forEach(markerData => {
        if (markerData.marker && markerData.marker.setMap) {
          markerData.marker.setMap(null);
        }
      });
    };
  }, [panorama, isInitialized, currentBillboards]);

  return null; // This component doesn't render anything visible
};

export default StreetViewPins;