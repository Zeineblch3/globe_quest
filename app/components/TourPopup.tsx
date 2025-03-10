// TourPopup.tsx

import React from 'react';
import Carousel from './Carousel';

interface TourPopupProps {
  tour: any;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onClose: () => void;
}

const TourPopup: React.FC<TourPopupProps> = ({
  tour,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onClose,
}) => {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-lg text-center transition-all duration-500"
      style={{
        width: '500px',
        height: '600px',
        overflowY: 'auto',
        pointerEvents: 'auto', // Ensure pointer events are enabled
        zIndex: 1000, // Ensure the popup is on top
      }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">{tour.name}</h3>

      {/* Image carousel */}
      <Carousel
        photos={tour.photo_urls}
        currentIndex={currentImageIndex}
        onNext={onNextImage}
        onPrev={onPrevImage}
      />

      <h3 className="text-xl font-bold text-gray-900 mb-4">${tour.price}</h3>

      <p className="text-gray-700 mb-4">
        <a
          href={tour.tripAdvisor_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
          onClick={(e) => {
            e.stopPropagation(); // Prevents the click from closing the popup
          }}
          style={{ pointerEvents: 'auto' }} // Ensure pointer events are enabled on the link
        >
          Visit TripAdvisor
        </a>
      </p>

      <p className="text-gray-700 mb-4">{tour.description}</p>
      <button
        onClick={onClose}
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Close
      </button>
    </div>
  );
};

export default TourPopup;
