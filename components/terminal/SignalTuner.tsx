
import React from 'react';

interface SignalTunerProps {
    value: number;
    onDrag: (val: number) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    targetFreq: number; // The visual target (might be spoofed)
    isInZone: boolean; // The real logic check
    isBeautified: boolean;
}

export const SignalTuner: React.FC<SignalTunerProps> = ({ 
    value, 
    onDrag, 
    onDragStart, 
    onDragEnd, 
    targetFreq, 
    isInZone, 
    isBeautified 
}) => {
    
    // Visual colors
    const lockedColor = isBeautified ? 'bg-purple-400' : 'bg-green-500';
    const driftColor = isBeautified ? 'bg-purple-900' : 'bg-amber-700';
    const zoneColor = isBeautified ? 'bg-purple-500/20' : 'bg-green-500/20';

    return (
        <div className={`w-full mb-4 p-2 border relative select-none ${isBeautified ? 'border-purple-800 bg-purple-900/10' : 'border-amber-900/50 bg-[#1a1205]'}`}>
            <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-mono uppercase tracking-widest ${isBeautified ? 'text-purple-400' : 'text-amber-600'}`}>
                    Frequency Tuner
                </span>
                <span className={`text-[10px] font-mono transition-colors duration-300 ${isInZone ? (isBeautified ? 'text-purple-300' : 'text-green-500') : 'text-red-500'}`}>
                    {isInZone ? "LOCKED" : "DRIFTING"}
                </span>
            </div>
            
            <div className="relative h-8 bg-black border border-gray-800 overflow-hidden">
                {/* Static Background Texture */}
                <div className="absolute inset-0 opacity-20" 
                     style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #333 2px, #333 4px)' }}>
                </div>

                {/* The Target Zone (Visual hint of where to tune) */}
                <div 
                    className={`absolute top-0 bottom-0 w-12 -ml-6 ${zoneColor} border-x border-white/10 transition-all duration-500`}
                    style={{ left: `${targetFreq}%` }}
                >
                    {/* Center line of target */}
                    <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-white/20"></div>
                </div>

                {/* The Input Slider (Invisible, captures events) */}
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={value} 
                    onMouseDown={onDragStart}
                    onTouchStart={onDragStart}
                    onChange={(e) => onDrag(parseInt(e.target.value))}
                    onMouseUp={onDragEnd}
                    onTouchEnd={onDragEnd}
                    className="w-full h-full opacity-0 cursor-col-resize absolute z-20 top-0 left-0"
                />

                {/* The Physical Tuning Needle/Thumb */}
                <div 
                    className={`absolute top-0 bottom-0 w-1 -ml-0.5 z-10 transition-all duration-75 ${isInZone ? lockedColor : driftColor} shadow-[0_0_10px_currentColor]`}
                    style={{ left: `${value}%` }}
                >
                    <div className={`absolute -top-1 -left-1.5 w-4 h-2 ${isInZone ? lockedColor : driftColor}`}></div>
                    <div className={`absolute -bottom-1 -left-1.5 w-4 h-2 ${isInZone ? lockedColor : driftColor}`}></div>
                </div>
            </div>
            
            <div className="flex justify-between text-[8px] text-gray-600 font-mono mt-1 px-1">
                <span>0Hz</span>
                <span>50Hz</span>
                <span>100Hz</span>
            </div>
        </div>
    );
};
