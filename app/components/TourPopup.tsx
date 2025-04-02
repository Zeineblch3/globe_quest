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
      className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl text-center border border-gray-300 transition-all duration-500 max-w-md relative"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 px-3 py-1 bg-gray-400 text-white rounded-full hover:bg-gray-600 transition"
      >
        ✕
      </button>

      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{tour.name}</h3>

      {/* Image Carousel */}
      <Carousel
        photos={tour.photo_urls}
        currentIndex={currentImageIndex}
        onNext={onNextImage}
        onPrev={onPrevImage}
      />

      <h3 className="text-lg font-semibold text-gray-800 mt-3">${tour.price}</h3>

      <p className="text-gray-700 my-2">{tour.description}</p>

      <a
        href={tour.tripAdvisor_link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline font-medium hover:text-blue-600 transition"
      >
        Visit TripAdvisor
      </a>
    </div>
  );
};

export default TourPopup;
