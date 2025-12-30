
import React, { useMemo } from 'react';
import { Typewriter } from '../Typewriter';
import { FlickerText } from '../FlickerText';
import { audio } from '../../services/audioService';

interface TerminalScreenProps {
    text: string;
    noiseLevel: number;
    typingComplete: boolean;
    setTypingComplete: (val: boolean) => void;
    onSelectionChange: (count: number) => void;
    highlightCount: number;
    theme: { text: string };
    isGlitchEvent: boolean;
    isRedactionMode: boolean; 
    showWarning: boolean;
    onHoverText: (hover: boolean) => void; 
}

const corruptText = (text: string, noise: number) => {
    if (noise <= 0) return text;
    const corruptionChance = noise / 100;
    return text.split('').map(char => {
        if (char === ' ' || char === '\n') return char;
        if (Math.random() < corruptionChance) {
            const chars = "#@&%$!*?[]{}01";
            return chars[Math.floor(Math.random() * chars.length)];
        }
        return char;
    }).join('');
};

interface SelectableTextProps {
    text: string;
    onSelectionChange: (count: number) => void;
    noiseLevel: number;
    isRedactionMode: boolean;
    onHoverText: (hover: boolean) => void; 
}

const SelectableText: React.FC<SelectableTextProps> = ({ text, onSelectionChange, noiseLevel, isRedactionMode, onHoverText }) => {
    const wordsWithSentenceId = useMemo(() => {
        const words = text.split(/\s+/);
        const result: { word: string, sentenceId: number, id: string }[] = [];
        let currentSentenceId = 0;
        
        words.forEach((word, idx) => {
            result.push({ word, sentenceId: currentSentenceId, id: `w-${idx}` });
            if (/[.!?]$/.test(word)) {
                currentSentenceId++;
            }
        });
        return result;
    }, [text]);

    const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(new Set());
    const [hoveredId, setHoveredId] = React.useState<string | number | null>(null);
    const [detectedAnomalies, setDetectedAnomalies] = React.useState<Set<string>>(new Set()); 

    const toggleSelection = (item: { word: string, sentenceId: number, id: string }) => {
        const key = isRedactionMode ? item.id : item.sentenceId;
        const next = new Set(selectedIds);
        
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        
        setSelectedIds(next);
        onSelectionChange(next.size);
        audio.playKeystroke();
    };

    const handleAnomalyDetected = (wordId: string, sentenceId: number) => {
        setDetectedAnomalies(prev => new Set(prev).add(wordId));
        if (!isRedactionMode) {
            const next = new Set(selectedIds);
            next.add(sentenceId);
            setSelectedIds(next);
            onSelectionChange(next.size);
        }
    };

    return (
        <div 
            className="flex flex-wrap gap-x-1.5 gap-y-1"
            onMouseEnter={() => onHoverText(true)}
            onMouseLeave={() => onHoverText(false)}
        >
            {wordsWithSentenceId.map((item, i) => {
                const key = isRedactionMode ? item.id : item.sentenceId;
                const isSelected = selectedIds.has(key);
                const isHovered = hoveredId === key;
                const isDetected = detectedAnomalies.has(item.id);
                
                let bgClass = '';
                let textClass = '';
                
                if (isRedactionMode) {
                    if (isSelected) {
                        bgClass = 'bg-black text-black select-none'; 
                    } else if (isHovered) {
                        bgClass = 'bg-gray-800 text-gray-500 line-through';
                    }
                } else {
                    if (isDetected) {
                         bgClass = 'bg-purple-900 shadow-[0_0_10px_rgba(168,85,247,0.5)] border border-purple-500';
                         textClass = 'text-purple-200';
                    } else if (isSelected) {
                         bgClass = 'bg-red-900 shadow-sm';
                         textClass = 'text-white';
                    } else if (isHovered) {
                         bgClass = 'bg-red-900/30';
                         textClass = 'text-red-200';
                    }
                }

                return (
                    <span 
                        key={item.id}
                        onMouseEnter={() => setHoveredId(key)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => toggleSelection(item)}
                        className={`cursor-pointer transition-all duration-150 px-0.5 rounded ${bgClass} ${textClass} ${!isSelected && !isDetected && !isHovered ? 'hover:text-opacity-80' : ''}`}
                    >
                        {isSelected && isRedactionMode ? '█████' : (
                            <FlickerText 
                                originalWord={item.word} 
                                onGlitchClick={() => handleAnomalyDetected(item.id, item.sentenceId)}
                            />
                        )}
                    </span>
                );
            })}
        </div>
    );
};

export const TerminalScreen: React.FC<TerminalScreenProps> = ({ 
    text, noiseLevel, typingComplete, setTypingComplete, onSelectionChange, theme, isGlitchEvent, isRedactionMode, onHoverText
}) => {
    
    const displayString = useMemo(() => corruptText(text, noiseLevel), [text, noiseLevel]);
    
    return (
        <div className={`text-sm md:text-lg leading-relaxed mb-8 min-h-[120px] relative z-10 ${theme.text}`}>
            <span className="opacity-70 mr-2 select-none">&gt;</span>
            
            {noiseLevel > 20 ? (
                 <span className="font-mono tracking-widest opacity-80 animate-pulse">
                     {displayString}
                 </span>
            ) : (
                typingComplete ? (
                    <SelectableText 
                        text={text} 
                        onSelectionChange={onSelectionChange}
                        noiseLevel={noiseLevel}
                        isRedactionMode={isRedactionMode}
                        onHoverText={onHoverText}
                    />
                ) : (
                    <Typewriter 
                        text={text} 
                        speed={20} 
                        onComplete={() => setTypingComplete(true)}
                    />
                )
            )}
        </div>
    );
};
