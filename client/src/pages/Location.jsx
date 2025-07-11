import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Location.css';

function Location() {
    const { id } = useParams();
    const [location, setLocation] = useState(null);
    const panoramaRef = useRef(null);
    const overlayRef = useRef([]);
    const indicatorsRef = useRef([]);

    useEffect(() => {
        const locations = [
            {
                id: '1',
                title: 'The Great Gatsby',
                lat: 40.8287377,
                lng: -73.4481917,
                description: 'Long Island mansion where Jay Gatsby threw his legendary parties',
                storyPoints: [
                    { 
                        heading: 165, 
                        pitch: 0, 
                        text: 'Gatsby\'s Mansion View',
                        description: 'The opulent mansion where Jay Gatsby threw his legendary parties, hoping to catch the attention of his lost love.',
                        image: 'https://via.placeholder.com/200x120/4f46e5/ffffff?text=Gatsby+Mansion'
                    },
                    { 
                        heading: 95, 
                        pitch: -5, 
                        text: 'The Green Light',
                        description: 'The mysterious green light at the end of Daisy\'s dock, symbolizing hope and the American Dream.',
                        image: 'https://via.placeholder.com/200x120/10b981/ffffff?text=Green+Light'
                    },
                ],
            },
            {
                id: '2',
                title: 'Harry Potter',
                lat: 51.531,
                lng: -0.124,
                description: 'King\'s Cross Station - Gateway to the wizarding world',
                storyPoints: [
                    { 
                        heading: 45, 
                        pitch: 0, 
                        text: 'Platform 9¾',
                        description: 'The magical platform where young witches and wizards board the Hogwarts Express to begin their journey.',
                        image: 'https://via.placeholder.com/200x120/dc2626/ffffff?text=Platform+9%C2%BE'
                    },
                    { 
                        heading: 180, 
                        pitch: -10, 
                        text: 'Entrance to Hogwarts Express',
                        description: 'The legendary scarlet steam engine that transports students to the magical world of Hogwarts.',
                        image: 'https://via.placeholder.com/200x120/7c2d12/ffffff?text=Hogwarts+Express'
                    },
                ],
            },
        ];

        const found = locations.find((loc) => loc.id === id);
        setLocation(found);
    }, [id]);

    const createBillboard = (point) => {
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

    const calculateScreenPosition = (panorama, point) => {
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
        const container = panoramaRef.current;
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

    const createNavigationIndicators = (panorama) => {
        // Clear existing indicators
        indicatorsRef.current.forEach(indicator => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        });
        indicatorsRef.current = [];

        location.storyPoints?.forEach((point, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'story-indicator';
            indicator.style.right = `${20 + (index * 60)}px`;
            indicator.textContent = index + 1;
            
            indicator.addEventListener('click', () => {
                panorama.setPov({
                    heading: point.heading,
                    pitch: point.pitch
                });
            });
            
            panoramaRef.current.appendChild(indicator);
            indicatorsRef.current.push(indicator);
        });
    };

    useEffect(() => {
        if (location && window.google && panoramaRef.current) {
            const panorama = new window.google.maps.StreetViewPanorama(panoramaRef.current, {
                position: { lat: location.lat, lng: location.lng },
                pov: { heading: 165, pitch: 0 },
                zoom: 1,
                visible: true,
                addressControl: false,
                linksControl: false,
                panControl: false,
                enableCloseButton: false,
            });

            // Clear existing overlays
            overlayRef.current.forEach(overlay => overlay.setMap(null));
            overlayRef.current = [];

            // Create story point overlays
            location.storyPoints?.forEach((point, index) => {
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

            // Create navigation indicators
            createNavigationIndicators(panorama);
        }

        // Cleanup function
        return () => {
            overlayRef.current.forEach(overlay => overlay.setMap(null));
            overlayRef.current = [];
            
            indicatorsRef.current.forEach(indicator => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            });
            indicatorsRef.current = [];
        };
    }, [location]);

    if (!location) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="location-container">
            <div className="location-selector">
            </div>
            
            <h1 className="location-title">{location.title}</h1>
            <p className="location-description">{location.description}</p>
            
            <div ref={panoramaRef} className="panorama-container"></div>
            
            <div className="instructions-panel">
                <strong>Instructions:</strong> Place holder
            </div>
        </div>
    );
}

export default Location;