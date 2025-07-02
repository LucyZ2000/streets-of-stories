import React, { useEffect, useRef } from 'react';

// hardcoded locations right now
function Map() {
    const containerRef = useRef(null);
    const map3DRef = useRef(null);

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

        const marker = new Marker3DInteractiveElement({
            position: { lat: 40.8287377346249, lng: -73.44819177401407, altitude: 60 },
            label: 'The Great Gatsby',
            altitudeMode: 'ABSOLUTE',
            extruded: true,
        });

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
            map3D.addEventListener('gmp-animationed', () => {
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
        });

        const base = document.location.href.substr(0, document.location.href.lastIndexOf("/"));

        const markerPin = new PinElement({
            "background": 'white',
            "scale": 1.0,
        });

        marker.append(markerPin);

        map3D.append(marker);

        if (containerRef.current) {
            containerRef.current.appendChild(map3D);
            map3DRef.current = map3D;
        }
    }

    useEffect(() => {
        if (window.google && window.google.maps) {
            init();
        } else {
            console.error("Google Maps API not loaded!");
        }

        return () => {
            if (map3DRef.current && containerRef.current) {
                containerRef.current.removeChild(map3DRef.current);
                map3DRef.current = null;
            }
        };
    }, []);

    return <div ref={containerRef} style = {{ width: '100vw', height: '100vh', margin: 0, padding: 0 }} />
}

export default Map;