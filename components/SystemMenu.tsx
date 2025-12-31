
import React, { useState } from 'react';
import { audio } from '../services/audioService';
import { GAME_VERSION } from '../constants';

interface SystemMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onRestart: () => void;
}

export const SystemMenu: React.FC<SystemMenuProps> = ({ isOpen, onClose, onRestart }) => {
    const [volume, setVolume] = useState(50);
    const [confirmRestart, setConfirmRestart] = useState(false);

    if (!isOpen) return null;

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setVolume(val);
        audio.setVolume(val / 100);
        
        // If they drag it to 0, treat as mute
        if (val === 0) audio.toggleMute(true);
        else audio.toggleMute(false);
    };

    const handleRestartClick = () => {
        if (confirmRestart) {
            onRestart();
            setConfirmRestart(false);
            onClose();
        } else {
            setConfirmRestart(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#0a0a0a] border-2 border-green-800 shadow-[0_0_30px_rgba(0,255,0,0.1)] p-8 font-mono text-green-500 relative">
                
                {/* Decorative Header */}
                <div className="absolute top-0 left-0 bg-green-900 text-black text-[10px] px-2 py-0.5 font-bold">
                    BIOS_CONFIG_UTIL_v{GAME_VERSION}
                </div>
                
                <h2 className="text-xl font-bold mb-8 text-center border-b border-green-800 pb-4 tracking-widest">
                    SYSTEM CONFIGURATION
                </h2>

                {/* Audio Section */}
                <div className="mb-8">
                    <label className="block text-xs uppercase tracking-widest mb-2 flex justify-between">
                        <span>Master Volume</span>
                        <span>{volume}%</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full h-2 bg-green-900 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                    
                    {/* The Horror Warning */}
                    <div className="mt-4 p-3 border border-red-900 bg-red-900/10 text-red-400 text-xs leading-relaxed">
                        <span className="font-bold block mb-1">⚠ ADVISORY:</span>
                        Disabling auditory feedback compromises signal tuning precision. 
                        <br/>
                        <span className="opacity-70 italic">The entities are quieter than you think.</span>
                    </div>
                </div>

                {/* Game Control Section */}
                <div className="space-y-3 pt-4 border-t border-green-800">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 border border-green-600 hover:bg-green-900 hover:text-white uppercase font-bold tracking-widest transition-colors"
                    >
                        Resume Session
                    </button>

                    <a 
                        href="https://github.com/leighstyleswastaken/Mapleton-Annex/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 border border-green-900 text-green-700 hover:bg-green-900/30 hover:text-green-400 uppercase font-bold tracking-widest transition-colors text-center text-xs"
                    >
                        Report Anomaly [Feedback]
                    </a>
                    
                    <button 
                        onClick={handleRestartClick}
                        className={`w-full py-3 border uppercase font-bold tracking-widest transition-colors
                            ${confirmRestart 
                                ? 'bg-red-900 border-red-500 text-white hover:bg-red-700 animate-pulse' 
                                : 'border-red-900 text-red-800 hover:bg-red-900/20'}
                        `}
                    >
                        {confirmRestart ? 'CONFIRM: WIPE ALL DATA?' : 'TERMINATE RUN (RESTART)'}
                    </button>
                    {confirmRestart && (
                        <div className="text-center text-[10px] text-red-500 mt-1">
                            THIS ACTION CANNOT BE UNDONE.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-[10px] text-green-900 border-t border-green-900/30 pt-2">
                    <div className="flex justify-between opacity-50">
                        <span>MAPLETON ANNEX // HARDWARE ID: 49221</span>
                        <span>v{GAME_VERSION} // RELEASE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
