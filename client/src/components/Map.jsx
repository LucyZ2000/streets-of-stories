import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// hardcoded locations right now
function Map({ locations = [] }) {
    const containerRef = useRef(null);
    const map3DRef = useRef(null);
    const navigate = useNavigate();

    async function init() {

        const { Map3DElement, MapMode, Marker3DInteractiveElement } = await google.maps.importLibrary("maps3d");
        const { PinElement } = await google.maps.importLibrary('marker');

        const map3D = new Map3DElement({
            center: { lat: 46.717, lng: 7.075, altitude: 2175.130 },
            range: 5814650,
            tilt: 33,
            mode: MapMode.SATELLITE,
        });

        map3D.addEventListener('gmp-click', (event) => {
            console.log(
                `camera: { center: { lat: ${map3D.center.lat}, lng : ${map3D.center.lng}, altitude: ${map3D.center.altitude} }, range: ${map3D.range}, tilt: ${map3D.tilt}, heading: ${map3D.heading} }`
            );
            console.log(`{ lat: ${event.position.lat}, lng : ${event.position.lng}, altitude: ${event.position.altitude} }`);
            map3D.stopCameraAnimation();
        });

        map3D.append(testMarker);

        console.log('Locations array:', locations);
        console.log('Locations length:', locations.length);

        locations.forEach((location) => {
            console.log('Rendering marker for: ', location);
            if (
                !location ||
                typeof location.lat !== "number" ||
                typeof location.lng !== "number"
            ) {
                console.warn("Skipping invalid location:", location);
                return;
            }

            const { id, lat, lng, altitude, title } = location;

            const marker = new Marker3DInteractiveElement({
                position: { lat: lat, lng: lng, altitude: altitude || 60 },
                label: title || `ID: ${id}` || "Untitled",
                altitudeMode: 'ABSOLUTE',
                extruded: true,
            });

            map3D.append(marker);
            console.log("Appended marker to map");

            marker.addEventListener('gmp-click', (event) => {
                map3D.flyCameraTo({
                    endCamera: {
                        center: marker.position,
                        tilt: 65,
                        range: 500,
                        heading: 0,
                    },
                    durationMillis: 6000,
                });

                // i don't think this part is working
                map3D.addEventListener('gmp-animationend', () => {
                    map3D.flyCameraAround({
                        camera: {
                            center: marker.position,
                            tilt: 65,
                            range: 500,
                            heading: 0,
                        },
                        durationMillis: 4000,
                        rounds: 1
                    });
                }, { once: true });
                event.stopPropagation();
                navigate(`/location/${location.id}`);
            });
        });

        if (containerRef.current) {
            containerRef.current.appendChild(map3D);
            map3DRef.current = map3D;
        }
    }

    useEffect(() => {
        if (locations.length > 0 && window.google && window.google.maps) {
            console.log('Initializing map with locations:', locations);
            init();
        } else {
            console.log('Not initializing map yet. Locations:', locations.length, 'Google Maps loaded:', !!window.google?.maps);
        }

        return () => {
            if (map3DRef.current && containerRef.current) {
                containerRef.current.removeChild(map3DRef.current);
                map3DRef.current = null;
            }
        };
    }, [locations]);

    return <div ref={containerRef} style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }} />
}

export default Map;