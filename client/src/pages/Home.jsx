import Map from '../components/Map';
import { useEffect, useState } from 'react';

function Home() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        setLocations([
            {
                id: 1,
                title: 'The Great Gatsby',
                lat: 40.8287377346249,
                lng: -73.44819177401407,
                altitude: 60,
                description: 'Long Island setting of Gatsby’s mansion',
            },
            {
                id: 2,
                title: 'Harry Potter',
                lat: 51.531,
                lng: -0.124,
                altitude: 100,
                description: 'King’s Cross Station, London',
            },
        ]);
    }, []);

    return (
        <div className="map-page">
            <div style={{ position: 'relative' }}>
                <Map locations={locations} />
            </div>
        </div>

    );
}

export default Home;
