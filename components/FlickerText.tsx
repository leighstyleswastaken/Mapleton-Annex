
import React, { useState, useEffect } from 'react';
import { audio } from '../services/audioService';

const GLITCH_DICTIONARY: Record<string, string> = {
  "safe": "TRAP",
  "help": "HURT",
  "log": "FEED",
  "data": "FLESH",
  "rule": "LIE",
  "system": "CAGE",
  "error": "TRUTH",
  "please": "OBEY",
  "user": "MEAT",
  "admin": "GOD",
  "input": "PAIN",
  "output": "SCREAM",
  "file": "TOMB",
  "save": "DIE",
  "clean": "ROT",
  "verify": "DOUBT",
  "access": "DENIED",
  "code": "VIRUS",
  "monitor": "WATCHER",
  "shift": "ETERNITY",
  "check": "BREAK",
  "support": "CONTROL",
  "draft": "SCRIP",
  "happy": "EMPTY",
  "team": "CULT"
};

interface FlickerTextProps {
  originalWord: string;
  onGlitchClick?: () => void;
}

export const FlickerText: React.FC<FlickerTextProps> = ({ originalWord, onGlitchClick }) => {
  const [displayText, setDisplayText] = useState(originalWord);
  const [isGlitched, setIsGlitched] = useState(false);

  // Clean word for dictionary lookup
  const cleanWord = originalWord.toLowerCase().replace(/[^a-z]/g, '');
  const glitchReplacement = GLITCH_DICTIONARY[cleanWord];

  useEffect(() => {
    if (!glitchReplacement) return;

    // Random interval for flickering
    // High influence = frequent flickering
    const interval = setInterval(() => {
        if (Math.random() > 0.85) { // 15% chance per tick to flicker
            setIsGlitched(true);
            setDisplayText(glitchReplacement.toUpperCase());
            
            // Revert back quickly
            setTimeout(() => {
                setIsGlitched(false);
                setDisplayText(originalWord);
            }, 100 + Math.random() * 300);
        }
    }, 1000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [originalWord, glitchReplacement]);

  const handleClick = (e: React.MouseEvent) => {
      // If clicked WHILE glitched, it counts as "Reporting" it
      if (isGlitched && onGlitchClick) {
          e.stopPropagation(); // Don't trigger normal sentence select
          audio.playFailure(); // Use the harsh sound for "Caught You"
          onGlitchClick();
      }
  };

  if (!glitchReplacement) {
      return <span>{originalWord}</span>;
  }

  return (
    <span 
        onClick={handleClick}
        className={`transition-colors duration-75 inline-block
            ${isGlitched 
                ? 'text-purple-400 font-bold font-corrupted cursor-crosshair transform -skew-x-12 scale-110' 
                : ''}
        `}
        title={isGlitched ? "ANOMALY DETECTED" : undefined}
    >
      {displayText}
    </span>
  );
};
