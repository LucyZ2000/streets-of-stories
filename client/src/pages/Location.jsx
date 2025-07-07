
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';

function Location() {
    const { id } = useParams();
    const [location, setLocation] = useState(null);
    const panoramaRef = useRef(null);

    useEffect(() => {

        const locations = [
            {
                id: '1',
                title: 'The Great Gatsby',
                lat: 40.8287377,
                lng: -73.4481917,
                description: 'Long Island mansion',
            },
            {
                id: '2',
                title: 'Harry Potter',
                lat: 51.531,
                lng: -0.124,
                description: 'King’s Cross Station',
            },
        ];

        const found = locations.find((loc) => loc.id === id);
        setLocation(found);
    }, [id]);

    useEffect(() => {
        if (location && window.google) {
            const panorama = new window.google.maps.StreetViewPanorama(panoramaRef.current, {
                position: { lat: location.lat, lng: location.lng },
                pov: { heading: 165, pitch: 0 },
                zoom: 1,
            });
        }
    }, [location]);

    if (!location) return <p>Loading...</p>;


    return (
        <div style={{ padding: '20px' }}>
            <h1>{location.title}</h1>
            <p>{location.description}</p>
            <div
                ref={panoramaRef}
                style={{ width: '100%', height: '500px', marginTop: '20px' }}
            ></div>
        </div>
    );
}

export default Location;