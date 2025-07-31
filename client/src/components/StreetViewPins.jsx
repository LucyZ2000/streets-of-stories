import { useEffect, useState, useRef } from 'react';
import binoculars from '../assets/img/binoculars.png';
import books from '../assets/img/books.png';
import '../styles/StreetViewPins.css';

const StreetViewPins = ({ 
  panorama, 
  isInitialized, 
  currentBillboards,
  onNavigateToLocation // Add this new prop
}) => {
  const [billboardMarkers, setBillboardMarkers] = useState([]);
  const activeDialogsRef = useRef(new Map());

  // Function to create marker content with custom images
  const createMarkerContent = (billboard, size) => {
    const hasViewpointTag = billboard.tags && billboard.tags.includes('viewpoint');
    const hasCoordinates = billboard.lat && billboard.lng;
    const isViewpoint = hasViewpointTag && hasCoordinates;
    
    if (isViewpoint) {
      // Custom image for billboards with viewpoints
      return `
        <div class="marker-pin" style="width: ${size}px; height: ${size}px;">
          <img src=${binoculars}
               class="marker-image viewpoint-marker" 
               style="width: ${size}px; height: ${size}px; background-color: white; padding: 4px; box-sizing: border-box; border-radius: 50%; object-fit: contain;"
               alt="${billboard.title} (viewpoint)" />
        </div>
      `;
    } else {
      // Custom image for regular billboards
      return `
        <div class="marker-pin" style="width: ${size}px; height: ${size}px;">
          <img src=${books}
               class="marker-image regular-marker" 
               style="width: ${size}px; height: ${size}px; background-color: white; padding: 4px; box-sizing: border-box; border-radius: 50%; object-fit: cover;"
               alt="${billboard.title}" />
        </div>
      `;
    }
  };

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
      const R = 6371e3;
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

    // Location-anchored dialog class
    class LocationDialog extends window.google.maps.OverlayView {
      constructor(position, content, billboardId, billboard, onClose, onNavigate) {
        super();
        this.position = position;
        this.content = content;
        this.billboardId = billboardId;
        this.billboard = billboard;
        this.onClose = onClose;
        this.onNavigate = onNavigate;
        this.div = null;
      }

      onAdd() {
        const div = document.createElement('div');
        div.className = 'location-dialog';
        div.innerHTML = this.content;

        // Add navigation button ONLY if billboard has 'viewpoint' tag and coordinates
        const hasViewpointTag = this.billboard.tags && this.billboard.tags.includes('viewpoint');
        const hasCoordinates = this.billboard.lat && this.billboard.lng;
        
        if (hasViewpointTag && hasCoordinates && this.onNavigate) {
          const navBtn = document.createElement('button');
          navBtn.innerHTML = 'Visit Viewpoint';
          navBtn.className = 'dialog-nav-btn viewpoint-btn';
          navBtn.title = 'Navigate to this special viewpoint';
          
          navBtn.onclick = (e) => {
            e.stopPropagation();
            this.onNavigate(this.billboard);
            this.close();
          };

          div.appendChild(navBtn);
        }

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
          const iconContent = createMarkerContent(billboard, newSize);
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

      const iconContent = createMarkerContent(billboard, initialSize);

      // Create click handler for this pin
      const clickHandler = (event) => {
        event.stopPropagation();
        console.log('Story point pin clicked:', billboard);
        
        const billboardId = billboard.id || `billboard-${billboard.title}-${index}`;
        
        if (activeDialogsRef.current.has(billboardId)) {
          const existingDialog = activeDialogsRef.current.get(billboardId);
          existingDialog.close();
          return;
        }

        // Create dialog content
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

        // Create location-anchored dialog with navigation capability
        const dialog = new LocationDialog(
          new window.google.maps.LatLng(billboard.lat, billboard.lng),
          dialogContent,
          billboardId,
          billboard,
          (closedBillboardId) => {
            activeDialogsRef.current.delete(closedBillboardId);
          },
          onNavigateToLocation // Pass the navigation callback
        );

        dialog.setMap(panorama);
        activeDialogsRef.current.set(billboardId, dialog);
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
  }, [panorama, isInitialized, currentBillboards, onNavigateToLocation]);

  return null;
};

export default StreetViewPins;