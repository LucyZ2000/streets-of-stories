import { useEffect, useState } from 'react';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
      } else {
        setError('Google Maps not loaded');
      }
    };

    checkGoogleMaps();
    
    // Set up an interval to check if Google Maps loads later
    const interval = setInterval(checkGoogleMaps, 100);
    
    // Clear interval after 10 seconds to avoid infinite checking
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!isLoaded) {
        setError('Google Maps failed to load');
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoaded]);

  return { isLoaded, error };
};