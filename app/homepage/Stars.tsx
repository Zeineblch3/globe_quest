import { useEffect, useRef } from 'react';

const Stars = () => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    // Create stars
    const starsContainer = starsRef.current;
    starsContainer.innerHTML = '';

    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      // Random size between 1px and 3px
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      // Random opacity
      star.style.opacity = `${Math.random() * 0.8 + 0.2}`;

      // Random animation delay
      star.style.animationDelay = `${Math.random() * 50}s`;

      // Random animation duration
      star.style.animationDuration = `${Math.random() * 100 + 50}s`;

      starsContainer.appendChild(star);
    }

    // Create nebula effects
    const nebulaCount = 5;
    for (let i = 0; i < nebulaCount; i++) {
      const nebula = document.createElement('div');
      nebula.className = 'nebula';

      // Random size
      const size = Math.random() * 30 + 20;
      nebula.style.width = `${size}vw`;
      nebula.style.height = `${size}vw`;

      // Random position
      nebula.style.left = `${Math.random() * 100}%`;
      nebula.style.top = `${Math.random() * 100}%`;

      // Random hue
      const hue = Math.random() * 60 + 220; // Blue to purple range
      nebula.style.backgroundColor = `hsla(${hue}, 70%, 30%, 0.1)`;

      // Random animation delay and duration
      nebula.style.animationDelay = `${Math.random() * 20}s`;
      nebula.style.animationDuration = `${Math.random() * 40 + 60}s`;

      starsContainer.appendChild(nebula);
    }

    return () => {
      starsContainer.innerHTML = '';
    };
  }, []);

  return <div ref={starsRef} className="stars" />;
};

export default Stars;
