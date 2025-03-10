// Carousel.tsx

import React from 'react';

interface CarouselProps {
  photos: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

const Carousel: React.FC<CarouselProps> = ({ photos, currentIndex, onNext, onPrev }) => (
  <div className="relative w-full overflow-hidden">
    <div
      className="flex transition-transform duration-500 ease-in-out"
      style={{
        transform: `translateX(-${currentIndex * 100}%)`,
      }}
    >
      {photos.map((url, index) => (
        <div key={index} className="flex-shrink-0 w-full mx-1">
          <img
            src={url}
            alt={`image ${index}`}
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
        </div>
      ))}
    </div>
    {/* Left arrow */}
    <button
      onClick={onPrev}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gray-300 bg-opacity-5 text-gray-800 flex items-center justify-center backdrop-blur-sm hover:bg-gray-500 hover:bg-opacity-70 hover:text-white transition duration-300"
    >
      &lt;
    </button>
    {/* Right arrow */}
    <button
      onClick={onNext}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gray-300 bg-opacity-30 text-gray-800 flex items-center justify-center backdrop-blur-sm hover:bg-gray-500 hover:bg-opacity-70 hover:text-white transition duration-300"
    >
      &gt;
    </button>
  </div>
);

export default Carousel;
