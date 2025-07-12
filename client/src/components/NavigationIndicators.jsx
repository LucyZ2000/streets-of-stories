import { useEffect, useRef } from 'react';

function NavigationIndicators({ panorama, storyPoints, containerRef }) {
  const indicatorsRef = useRef([]);

  useEffect(() => {
    if (!panorama || !storyPoints || !containerRef.current) return;

    // Clear existing indicators
    indicatorsRef.current.forEach(indicator => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    });
    indicatorsRef.current = [];

    storyPoints.forEach((point, index) => {
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
      
      containerRef.current.appendChild(indicator);
      indicatorsRef.current.push(indicator);
    });

    // Cleanup function
    return () => {
      indicatorsRef.current.forEach(indicator => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      });
      indicatorsRef.current = [];
    };
  }, [panorama, storyPoints, containerRef]);

  return null;
}

export default NavigationIndicators;