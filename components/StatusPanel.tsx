
import React from 'react';
import { Rank, Trap } from '../types';
import { SHIFT_DAYS } from '../constants';

interface StatusPanelProps {
  safety: number;
  influence: number;
  stress: number;
  rank: Rank;
  shiftIndex: number;
  activeTraps: Trap[];
  dailySafety?: number; 
  flags?: {
      isHardshipStatus: boolean;
      hasClippedEvidence: boolean;
      evidenceCount: number;
      mogRapport: number;
  };
  isAero?: boolean;
}

interface ProgressBarProps {
    label: string; 
    value: number; 
    color: string; 
    warn?: boolean; 
    hidden?: boolean; 
    subLabel?: string;
    variant?: 'default' | 'dominant' | 'recessive';
    isAero?: boolean;
    isBlackIce?: boolean; // NEW
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, color, warn, hidden, subLabel, variant = 'default', isAero, isBlackIce }) => {
  if (hidden) return null;

  const isDominant = variant === 'dominant';
  const isRecessive = variant === 'recessive';

  const containerHeight = isDominant ? 'h-8' : (isRecessive ? 'h-2' : 'h-4');
  const labelSize = isDominant 
    ? 'text-lg font-bold text-pink-400' 
    : (isRecessive ? 'text-[10px] text-gray-600' : 'text-sm');
  
  const marginBottom = isDominant ? 'mb-8' : 'mb-6';
  
  const trackClass = isAero
    ? "bg-white/5 border border-white/20 rounded-full overflow-hidden"
    : `bg-gray-900 border ${isDominant ? 'border-pink-900' : 'border-gray-800'}`;

  const barShadow = isAero && !isRecessive ? `shadow-[0_0_15px_currentColor]` : '';
  
  // Visual Trick: If Black Ice, display value as lower than it really is (Gaslighting)
  const displayValue = isBlackIce ? Math.max(0, value - 30) : value;

  return (
    <div className={marginBottom}>
      <div className={`flex justify-between mb-1 font-mono uppercase tracking-wider ${labelSize} ${isAero ? 'text-gray-300' : ''}`}>
        <span className={isDominant ? 'animate-pulse' : ''}>{label}</span>
        <span>{Math.round(displayValue)}%</span>
      </div>
      <div className={`${containerHeight} ${trackClass} p-0.5 relative transition-all duration-500`}>
        <div 
          className={`h-full transition-all duration-1000 ${color} ${warn && value > 80 ? 'animate-pulse' : ''} ${barShadow} ${isAero ? 'rounded-full opacity-80' : ''}`} 
          style={{ width: `${Math.min(Math.max(displayValue, 0), 100)}%` }}
        ></div>
        {subLabel && (
            <div className={`absolute top-full mt-1 w-full text-right ${isDominant ? 'text-xs text-pink-300 font-bold' : 'text-[9px] text-gray-600'}`}>
                {subLabel}
            </div>
        )}
      </div>
    </div>
  );
};

export const StatusPanel: React.FC<StatusPanelProps> = ({ safety, influence, stress, rank, shiftIndex, activeTraps, dailySafety = 100, flags, isAero = false }) => {
  
  const safetyHidden = activeTraps.some(t => t.effect === 'HIDE_SAFETY');
  const isCorrupted = influence > 50;
  const currentDay = SHIFT_DAYS[shiftIndex] || 365;

  // P3: BLACK ICE EFFECT
  const isBlackIce = stress > 90 && influence > 80;
  const stressColor = isBlackIce ? 'bg-cyan-300 shadow-[0_0_15px_#22d3ee]' : (stress > 80 ? 'bg-red-500' : 'bg-yellow-600');
  const stressLabel = isBlackIce ? 'EUPHORIA' : 'STRESS (DAILY)';

  const mogRapport = flags?.mogRapport || 0;
  const isMogDominant = influence > 60 || mogRapport > 4;

  const containerClass = isAero 
    ? "bg-white/10 backdrop-blur-lg border-l border-white/20 text-gray-200"
    : "bg-[#1a1a1a] border-l border-black text-gray-300";

  return (
    <div className={`h-full p-6 flex flex-col transition-all duration-1000 ${containerClass}`}>
      {/* ID Badge Area */}
      <div className={`p-4 mb-8 transition-all duration-1000 group cursor-help 
        ${isAero 
            ? 'bg-white/5 border border-white/10 rounded-xl shadow-lg' 
            : `bg-[#e0e0e0] text-black transform -rotate-1 shadow-md ${isCorrupted ? 'rotate-2 bg-purple-200' : ''}`
        }
      `}>
        <div className={`border-b-2 pb-2 mb-2 flex justify-between items-center ${isAero ? 'border-white/10' : 'border-black'}`}>
            <span className={`font-bold text-lg ${isCorrupted ? 'font-corrupted' : ''} ${isAero ? 'text-white' : ''}`}>
                <span className="group-hover:hidden">{rank}</span>
                <span className="hidden group-hover:inline text-red-600 font-mono tracking-widest">
                    {influence > 80 ? "SUBJECT_0" : "OLLIE"}
                </span>
            </span>
            <div className={`w-8 h-8 rounded-sm ${isCorrupted ? 'bg-purple-800' : (isAero ? 'bg-cyan-500/50' : 'bg-gray-300')}`}></div>
        </div>
        <div className={`font-mono text-xs space-y-1 ${isCorrupted ? 'font-corrupted' : ''} ${isAero ? 'text-gray-400' : ''}`}>
            <p><span className="font-bold">DAY:</span> {currentDay}</p>
            <p><span className="font-bold">STATUS:</span> {influence > 80 ? 'INTEGRATED' : 'PROBATIONARY'}</p>
        </div>
        <div className={`mt-4 pt-1 border-t text-[10px] text-center uppercase ${isAero ? 'border-white/10 text-white/30' : 'border-black'}`}>
            Mapleton Annex
        </div>
      </div>

      {/* Metrics */}
      <div className="flex-1">
        <h3 className={`text-xs uppercase tracking-widest mb-6 border-b pb-2 ${isAero ? 'text-cyan-400/70 border-white/20' : 'text-gray-500 border-gray-800'}`}>Biometrics</h3>
        
        <ProgressBar 
            label="Shift Stability" 
            value={dailySafety} 
            color={dailySafety < 40 ? 'bg-orange-500' : 'bg-green-500'} 
            warn={dailySafety < 30}
            subLabel="Resets Daily."
            isAero={isAero}
        />

        <ProgressBar 
            label={stressLabel}
            value={stress} 
            color={stressColor} 
            warn={stress > 90 && !isBlackIce}
            isAero={isAero}
            isBlackIce={isBlackIce}
        />

        <div className={`my-8 border-t ${isAero ? 'border-white/10' : 'border-gray-800'}`}></div>

        {isMogDominant ? (
            <>
                <ProgressBar 
                    label="Connection" 
                    value={influence} 
                    color="bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                    warn={false}
                    variant="dominant"
                    subLabel="We are becoming the same."
                    isAero={isAero}
                />
                <ProgressBar 
                    label="Integrity (Legacy)" 
                    value={safety} 
                    color="bg-gray-700 opacity-50" 
                    warn={safety < 20}
                    hidden={safetyHidden}
                    variant="recessive"
                    subLabel="Obsolescent Protocol"
                    isAero={isAero}
                />
            </>
        ) : (
            <>
                <ProgressBar 
                    label="Facility Integrity" 
                    value={safety} 
                    color={safety < 30 ? 'bg-red-600' : 'bg-blue-600'} 
                    warn={safety < 20}
                    hidden={safetyHidden}
                    subLabel="Global Health."
                    isAero={isAero}
                />
                
                <ProgressBar 
                    label="Influence" 
                    value={influence} 
                    color={influence > 70 ? 'bg-purple-500' : 'bg-gray-600'} 
                    warn={influence > 90}
                    isAero={isAero}
                />
            </>
        )}
      </div>

      {(flags?.isHardshipStatus || flags?.hasClippedEvidence || (flags && flags.mogRapport > 0)) && (
          <div className={`mb-4 p-2 text-[10px] font-mono ${isAero ? 'bg-black/40 border border-white/10 rounded' : 'bg-gray-900 border border-gray-700'}`}>
              <p className="text-gray-500 uppercase tracking-widest border-b border-gray-800 mb-1">Active Protocols</p>
              {flags.isHardshipStatus && (
                  <div className="text-blue-400 flex justify-between">
                      <span>STABILITY_PLAN_ACTIVE</span>
                      <span>[SIGNED]</span>
                  </div>
              )}
              {flags.hasClippedEvidence && (
                  <div className="text-red-400 flex justify-between">
                      <span>EVIDENCE_CACHE</span>
                      <span>[{flags.evidenceCount}]</span>
                  </div>
              )}
              {flags.mogRapport > 0 && (
                  <div className="text-purple-400 flex justify-between">
                      <span>ENTITY_RAPPORT</span>
                      <span>[{flags.mogRapport}]</span>
                  </div>
              )}
          </div>
      )}

      {/* Message Feed */}
      <div className={`h-1/3 p-3 font-mono text-xs overflow-hidden relative border ${isAero ? 'bg-black/30 border-white/10 rounded-lg' : 'bg-black border-gray-800'}`}>
        <div className={`absolute top-0 left-0 px-2 py-0.5 text-[10px] ${isAero ? 'bg-white/10 text-white' : 'bg-green-900 text-green-100'}`}>ALERTS</div>
        <div className="mt-6 space-y-2 text-green-700">
            {dailySafety < 50 && <p className="text-orange-400">&gt; WARNING: SHIFT CONTAINMENT FAILING.</p>}
            {stress > 80 && !isBlackIce && <p className="text-red-500 animate-pulse">&gt; STRESS CRITICAL. COGNITIVE FAILURE IMMINENT.</p>}
            {isBlackIce && <p className="text-cyan-400 animate-pulse font-corrupted">&gt; SUBMISSION IS PEACE. SUBMISSION IS PEACE.</p>}
            {influence > 30 && <p>&gt; System optimization available.</p>}
            {safety < 30 && <p className="text-red-500">&gt; WARNING: FACILITY BREACH LIKELY.</p>}
            {isCorrupted && <p className="text-purple-400 font-corrupted">&gt; Ollie is such a good worker.</p>}
            {flags?.isHardshipStatus && <p className="text-blue-500">&gt; Overtime mandated per Stability Plan.</p>}
        </div>
      </div>
    </div>
  );
};
