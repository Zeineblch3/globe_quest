
import { useEffect, useState } from 'react';

const Stars = () => {
  const [stars, setStars] = useState<{ left: string; top: string; animationDelay: string }[]>([]);

  useEffect(() => {
    // Generate 100 stars with random positions and animation delays
    const newStars = [...Array(100)].map(() => ({
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="stars">
      {/* Render the stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.animationDelay,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Stars;
