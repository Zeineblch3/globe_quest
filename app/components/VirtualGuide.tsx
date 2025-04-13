'use client';

import { useEffect, useState } from 'react';

interface VirtualGuideProps {
  sceneUrl: string;              // e.g., 'https://prod.spline.design/3fdvh2pVAuLQRYqP/scene.splinecode'
  description: string;           // Tour description to be spoken
  visible: boolean;              // Controlled externally (e.g., on pin click)
  style?: React.CSSProperties;  // Added style prop to support inline styles
}

export const VirtualGuide: React.FC<VirtualGuideProps> = ({
  sceneUrl,
  description,
  visible,
  style,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (visible && description) {
      // Start speaking the description when the guide becomes visible
      const utterance = new SpeechSynthesisUtterance(description);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  }, [visible, description]);

  if (!visible) return null;

  return (
    <div
  style={{
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    width: '350px',         // Adjusted width to fit the content better
    height: '350px',        // Adjusted height to fit the content better
    zIndex: 10,
    pointerEvents: 'auto',
    overflow: 'hidden',
    ...style,
  }}
>
  <iframe
  src={sceneUrl}
  style={{
    width: '100%',
    height: '100%',
    border: 'none',
    padding: '0',
    margin: '0',
    objectFit: 'contain',
    transform: 'scale(0.8)', // Scales only the content inside the iframe
    transformOrigin: 'center', // Keeps scaling centered
  }}
  allowFullScreen
/>

</div>

  );
};
