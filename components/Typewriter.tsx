import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../services/audioService';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 30, 
  onComplete,
  className = "" 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update ref when onComplete changes to avoid re-triggering the effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      if (indexRef.current < text.length) {
        const char = text.charAt(indexRef.current);
        setDisplayedText((prev) => prev + char);
        indexRef.current++;
        
        // Play sound for non-space characters
        if (char !== ' ') {
            audio.playKeystroke();
        }
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]); // Removed onComplete from dependencies

  // Click to skip
  const handleSkip = () => {
      if (indexRef.current < text.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          setDisplayedText(text);
          indexRef.current = text.length;
          if (onCompleteRef.current) onCompleteRef.current();
      }
  };

  return (
    <div className={`cursor-pointer ${className}`} onClick={handleSkip}>
      {displayedText}
      <span className={`animate-pulse ml-1 inline-block w-2 h-4 bg-green-500 align-middle ${indexRef.current === text.length ? 'hidden' : ''}`}></span>
    </div>
  );
};