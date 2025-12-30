
import React from 'react';
import { GameState, Rank } from '../types';
import { GAME_EVENTS, TRAPS } from '../constants';

interface CheatMenuProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const CheatMenu: React.FC<CheatMenuProps> = ({ isOpen, onClose, gameState, setGameState }) => {
  if (!isOpen) return null;

  const toggleUpgrade = (upgrade: string) => {
      setGameState(prev => {
          const has = prev.activeUpgrades.includes(upgrade);
          return {
              ...prev,
              activeUpgrades: has 
                ? prev.activeUpgrades.filter(u => u !== upgrade)
                : [...prev.activeUpgrades, upgrade]
          };
      });
  };

  const triggerEvent = (eventId: string) => {
      const event = GAME_EVENTS.find(e => e.id === eventId);
      if (event) {
          setGameState(prev => ({
              ...prev,
              activeEvent: event,
              activeEventDurationRemaining: event.durationActions
          }));
      }
  };
  
  const clearEvent = () => {
       setGameState(prev => ({ ...prev, activeEvent: null, activeEventDurationRemaining: 0 }));
  };

  const toggleTrap = (trapId: string) => {
      setGameState(prev => {
          const has = prev.activeTraps.find(t => t.id === trapId);
          if (has) {
              return { ...prev, activeTraps: prev.activeTraps.filter(t => t.id !== trapId) };
          }
          const trap = TRAPS.find(t => t.id === trapId);
          return trap ? { ...prev, activeTraps: [...prev.activeTraps, trap] } : prev;
      });
  };

  return (
    <div className="fixed bottom-8 left-8 bg-black/95 border-2 border-green-500 p-4 z-50 shadow-[0_0_50px_rgba(0,255,0,0.2)] w-80 text-green-500 font-mono text-xs max-h-[80vh] overflow-y-auto backdrop-blur-md">
        <div className="flex justify-between items-center mb-4 border-b border-green-700 pb-2 sticky top-0 bg-black/95 z-10 pt-1">
            <h3 className="font-bold text-sm tracking-widest text-green-400">DEV_CONSOLE // GOD_MODE</h3>
            <button onClick={onClose} className="text-red-500 hover:text-red-300 font-bold border border-red-900 px-2 bg-black hover:bg-red-900/30 transition-colors">[X]</button>
        </div>

        {/* SECTION: CORE STATE */}
        <div className="mb-6 space-y-3">
            <h4 className="text-green-700 font-bold uppercase tracking-wider text-[10px] border-b border-green-900/50 pb-1">01. METRICS & TIME</h4>
            
            <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase">Shift Index</span>
                    <input type="number" value={gameState.shiftIndex} onChange={(e) => setGameState(p => ({...p, shiftIndex: parseInt(e.target.value)}))} className="bg-black border border-green-800 text-green-400 px-1 py-0.5 focus:outline-none focus:border-green-500 transition-colors"/>
                </label>
                <label className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase">Rank</span>
                    <select value={gameState.rank} onChange={(e) => setGameState(p => ({...p, rank: e.target.value as Rank}))} className="bg-black border border-green-800 text-green-400 text-[10px] px-1 py-1 focus:outline-none focus:border-green-500">
                        {Object.values(Rank).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </label>
            </div>

            <div className="space-y-2 pt-2">
                <div className="space-y-0.5">
                    <div className="flex justify-between text-[10px] uppercase text-blue-400"><span>Integrity (Safety)</span> <span>{gameState.safety}%</span></div>
                    <input type="range" min="0" max="100" value={gameState.safety} onChange={(e) => setGameState(p => ({...p, safety: parseInt(e.target.value)}))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                </div>
                <div className="space-y-0.5">
                    <div className="flex justify-between text-[10px] uppercase text-purple-400"><span>Influence</span> <span>{gameState.influence}%</span></div>
                    <input type="range" min="0" max="100" value={gameState.influence} onChange={(e) => setGameState(p => ({...p, influence: parseInt(e.target.value)}))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                </div>
                <div className="space-y-0.5">
                    <div className="flex justify-between text-[10px] uppercase text-red-400"><span>Stress</span> <span>{gameState.stress}%</span></div>
                    <input type="range" min="0" max="100" value={gameState.stress} onChange={(e) => setGameState(p => ({...p, stress: parseInt(e.target.value)}))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500"/>
                </div>
            </div>
        </div>

        {/* SECTION: NARRATIVE RAILS */}
        <div className="mb-6 space-y-3 border-t border-green-900/50 pt-4">
            <h4 className="text-blue-600 font-bold uppercase tracking-wider text-[10px] border-b border-green-900/50 pb-1">02. NARRATIVE RAILS</h4>
            
            <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" checked={gameState.flags.isHardshipStatus} onChange={(e) => setGameState(p => ({...p, flags: {...p.flags, isHardshipStatus: e.target.checked}}))} 
                    className="appearance-none w-3 h-3 border border-blue-500 checked:bg-blue-500 rounded-sm cursor-pointer"
                />
                <span className="text-gray-400 group-hover:text-blue-400 transition-colors">Rail B: Hardship (Debt)</span>
            </label>
            
            <div className="flex items-center space-x-3 group">
                <input type="checkbox" checked={gameState.flags.hasClippedEvidence} onChange={(e) => setGameState(p => ({...p, flags: {...p.flags, hasClippedEvidence: e.target.checked}}))} 
                    className="appearance-none w-3 h-3 border border-red-500 checked:bg-red-500 rounded-sm cursor-pointer"
                />
                <span className="text-gray-400 group-hover:text-red-400 transition-colors">Rail C: Archivist</span>
                <input type="number" value={gameState.flags.evidenceCount} onChange={(e) => setGameState(p => ({...p, flags: {...p.flags, evidenceCount: parseInt(e.target.value)}}))} className="w-12 bg-black border border-gray-700 text-right text-gray-300"/>
            </div>

            <div className="space-y-1">
                 <div className="flex justify-between text-[10px] text-purple-400">
                     <span>Rail D: Mog Rapport</span>
                     <span>{gameState.flags.mogRapport}</span>
                 </div>
                 <input type="range" min="0" max="10" value={gameState.flags.mogRapport} onChange={(e) => setGameState(p => ({...p, flags: {...p.flags, mogRapport: parseInt(e.target.value)}}))} className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
            </div>
            
            <label className="flex items-center space-x-3 cursor-pointer group mt-2">
                <input type="checkbox" checked={gameState.flags.isOllieMode} onChange={(e) => setGameState(p => ({...p, flags: {...p.flags, isOllieMode: e.target.checked}}))} 
                    className="appearance-none w-3 h-3 border border-amber-600 checked:bg-amber-600 rounded-sm cursor-pointer"
                />
                <span className="text-amber-700 group-hover:text-amber-500 transition-colors font-bold">Endgame: Ollie Mode</span>
            </label>
        </div>

        {/* SECTION: EVENTS & TRAPS */}
        <div className="mb-4 space-y-3 border-t border-green-900/50 pt-4">
            <h4 className="text-red-500 font-bold uppercase tracking-wider text-[10px] border-b border-green-900/50 pb-1">03. CHAOS ENGINE</h4>
            
            <div className="flex justify-between items-center bg-green-900/10 p-2 border border-green-900/30 rounded">
                <span className="text-[10px] uppercase text-gray-500">Active Event:</span>
                <span className="font-bold text-white text-[10px]">{gameState.activeEvent?.name || "NONE"}</span>
                <button onClick={clearEvent} className="text-red-500 hover:text-white hover:bg-red-900 px-2 text-[9px] border border-red-900 transition-all">CLR</button>
            </div>
            
            <div className="grid grid-cols-2 gap-1">
                {GAME_EVENTS.map(evt => (
                    <button key={evt.id} onClick={() => triggerEvent(evt.id)} className="text-[9px] border border-green-900/50 text-green-700 hover:text-green-300 hover:bg-green-900/20 text-left px-1 py-0.5 transition-all truncate" title={evt.name}>
                        {evt.name}
                    </button>
                ))}
            </div>

            <div className="pt-4">
                <div className="mb-2 text-purple-400 text-[10px] uppercase tracking-wider">Active Traps / Upgrades:</div>
                <div className="grid grid-cols-2 gap-1">
                    {TRAPS.map(trap => (
                        <button 
                            key={trap.id} 
                            onClick={() => toggleTrap(trap.id)}
                            className={`text-[9px] border text-left px-1 py-0.5 transition-all truncate ${gameState.activeTraps.find(t => t.id === trap.id) ? 'bg-purple-900 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-gray-800 text-gray-600 hover:border-gray-600'}`}
                            title={trap.name}
                        >
                            {trap.name}
                        </button>
                    ))}
                    <button 
                        onClick={() => toggleUpgrade('MOG_BEAUTIFICATION')}
                        className={`text-[9px] border text-left px-1 py-0.5 transition-all ${gameState.activeUpgrades.includes('MOG_BEAUTIFICATION') ? 'bg-pink-900 border-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'border-gray-800 text-gray-600 hover:border-gray-600'}`}
                    >
                        [VISUAL: BEAUTY]
                    </button>
                    <button 
                         onClick={() => toggleUpgrade('AUTO_TUNER')}
                         className={`text-[9px] border text-left px-1 py-0.5 transition-all ${gameState.activeUpgrades.includes('AUTO_TUNER') ? 'bg-blue-900 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'border-gray-800 text-gray-600 hover:border-gray-600'}`}
                    >
                        [MECH: AUTO-TUNER]
                    </button>
                    <button 
                         onClick={() => toggleUpgrade('SYS_AERO')}
                         className={`text-[9px] border text-left px-1 py-0.5 transition-all ${gameState.activeUpgrades.includes('SYS_AERO') ? 'bg-cyan-900 border-cyan-500 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'border-gray-800 text-gray-600 hover:border-gray-600'}`}
                    >
                        [VISUAL: AERO]
                    </button>
                </div>
            </div>
        </div>
        
        <div className="pt-4 mt-4 border-t border-green-900/50 text-[9px] text-gray-600 flex justify-between uppercase tracking-wider">
            <label className="flex items-center space-x-1 cursor-pointer hover:text-green-500">
                <input type="checkbox" checked={gameState.useLLM} onChange={(e) => setGameState(p => ({...p, useLLM: e.target.checked}))} className="accent-green-500"/>
                <span>ENABLE LLM</span>
            </label>
            <div className="flex space-x-2">
                <span>API: {gameState.stats.apiCalls}</span>
                <span>ERR: {gameState.stats.apiErrors}</span>
            </div>
        </div>
    </div>
  );
};
