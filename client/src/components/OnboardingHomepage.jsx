import { useState } from 'react';
import '../styles/Home.css';

function OnboardingHomepage({ onExplore }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleExplore = () => {
    setIsAnimating(true);
    // Increased timeout to allow for smoother fade out
    setTimeout(() => {
      onExplore();
    }, 500); // Changed from 300ms to 500ms to match CSS animation
  };

  return (
    <div className={`onboarding-container ${isAnimating ? 'onboarding-fade-out' : ''}`}>
      {/* Dimmed background */}
      <div className="onboarding-background"></div>
      
      {/* Subtle pattern overlay */}
      <div className="onboarding-pattern"></div>

      {/* Content */}
      <div className="onboarding-content">
        <h1 className="onboarding-title">
          Streets of Stories
        </h1>
        <p className="onboarding-description">
          Explore the real places behind your favorite books and discover the stories hidden in every street.
        </p>
        
        <button
          onClick={handleExplore}
          disabled={isAnimating}
          className="onboarding-button"
        >
          Explore Now →
        </button>
      </div>
    </div>
  );
}

export default OnboardingHomepage;