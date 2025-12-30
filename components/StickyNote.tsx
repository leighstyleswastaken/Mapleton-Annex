
import React from 'react';

interface StickyNoteProps {
    text: string;
    color?: 'yellow' | 'pink' | 'blue';
    rotation?: number;
    top?: string;
    left?: string;
    hidden?: boolean;
    onClick?: () => void;
}

export const StickyNote: React.FC<StickyNoteProps> = ({ 
    text, 
    color = 'yellow', 
    rotation = -2, 
    top = '-10px', 
    left = '10px',
    hidden = false,
    onClick
}) => {
    if (hidden) return null;

    const colors = {
        yellow: 'bg-[#fef3c7] text-gray-800 border-b-4 border-[#fcd34d]',
        pink: 'bg-[#fce7f3] text-gray-800 border-b-4 border-[#fbcfe8]',
        blue: 'bg-[#dbeafe] text-gray-800 border-b-4 border-[#bfdbfe]'
    };

    return (
        <div 
            onClick={onClick}
            className={`absolute z-30 p-4 w-48 shadow-[5px_5px_15px_rgba(0,0,0,0.5)] font-corrupted text-sm leading-tight transform transition-transform duration-500 hover:scale-110 cursor-pointer ${colors[color]}`}
            style={{ 
                top, 
                left, 
                transform: `rotate(${rotation}deg)`,
                zIndex: hidden ? -1 : 30 + Math.floor(rotation * 10)
            }}
            title="Click to remove note"
        >
            {/* Pin/Tape visual */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/30 backdrop-blur-sm rotate-2"></div>
            
            <p>{text}</p>
            
            <div className="mt-2 text-[10px] text-right opacity-60 font-mono">
                - O.
            </div>
        </div>
    );
};
