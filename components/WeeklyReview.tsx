
import React from 'react';
import { GameState, DecisionMemo, MemoOption } from '../types';
import { audio } from '../services/audioService';

interface WeeklyReviewProps {
    gameState: GameState;
    onMakeDecision: (option: MemoOption) => void;
}

const StatBar: React.FC<{ label: string; value: number; inverse?: boolean }> = ({ label, value, inverse }) => {
    // Normal: Green > Red. Inverse: Red > Green (e.g. Scrutiny)
    let colorClass = 'bg-blue-600';
    if (value > 70) colorClass = inverse ? 'bg-red-500' : 'bg-green-500';
    else if (value < 30) colorClass = inverse ? 'bg-green-500' : 'bg-red-500';
    else colorClass = 'bg-yellow-500';

    return (
        <div className="mb-3">
            <div className="flex justify-between text-xs font-mono mb-1 uppercase text-gray-600">
                <span>{label}</span>
                <span>{value}/100</span>
            </div>
            <div className="h-2 bg-gray-300 border border-gray-400">
                <div 
                    className={`h-full ${colorClass} transition-all duration-1000`} 
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                ></div>
            </div>
        </div>
    );
};

export const WeeklyReview: React.FC<WeeklyReviewProps> = ({ gameState, onMakeDecision }) => {
    const { weeklyStats, pendingReview, stress } = gameState;

    if (!pendingReview) return null;

    const handleSelect = (opt: MemoOption) => {
        audio.playKeystroke();
        onMakeDecision(opt);
    };

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-4xl w-full bg-[#f0f0f0] text-black shadow-2xl flex flex-col md:flex-row min-h-[600px] border-4 border-gray-400">
                
                {/* LEFT PANEL: METRICS REPORT */}
                <div className="w-full md:w-1/3 bg-[#e0e0e0] p-8 border-r-2 border-gray-400 flex flex-col relative">
                    <div className="absolute top-4 left-4 border-2 border-black px-2 py-1 text-xs font-bold font-mono tracking-widest transform -rotate-2">
                        CONFIDENTIAL
                    </div>
                    
                    <h2 className="mt-12 mb-6 font-bold text-xl uppercase tracking-widest text-gray-800 border-b-2 border-gray-600 pb-2">
                        Performance Audit
                    </h2>

                    <div className="space-y-4">
                        <StatBar label="Throughput" value={weeklyStats.throughput} />
                        <StatBar label="Auditability" value={weeklyStats.auditability} />
                        <StatBar label="Variance" value={weeklyStats.variance} inverse />
                        <StatBar label="Scrutiny" value={weeklyStats.scrutiny} inverse />
                        <StatBar label="Personal Stability" value={weeklyStats.stability} />
                        
                        {gameState.flags.evidenceCount > 0 && (
                             <StatBar label="Dossier Size" value={gameState.flags.evidenceCount * 20} inverse />
                        )}
                        {gameState.flags.mogRapport > 0 && (
                             <StatBar label="Entity Rapport" value={gameState.flags.mogRapport * 20} inverse />
                        )}
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="text-xs font-mono text-gray-500 mb-1">CURRENT RANK</div>
                        <div className="text-2xl font-bold uppercase">{gameState.rank}</div>
                        <div className="text-xs font-mono text-gray-500 mt-4">ID: 49221</div>
                    </div>
                </div>

                {/* RIGHT PANEL: DECISION MEMO */}
                <div className="w-full md:w-2/3 bg-[#f8f8f8] p-10 flex flex-col relative">
                     {/* Paper Texture Overlay */}
                     <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=")' }}></div>

                     <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
                        <div>
                            <h1 className="text-3xl font-bold font-serif mb-1">MEMORANDUM</h1>
                            <p className="font-mono text-sm text-gray-600 uppercase">REF: {pendingReview.id.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                             <div className="bg-black text-white px-3 py-1 font-bold text-sm">ACTION REQUIRED</div>
                        </div>
                     </div>

                     <div className="mb-8 font-mono text-sm space-y-1">
                        <p><span className="font-bold w-16 inline-block">TO:</span> Operator 49221</p>
                        <p><span className="font-bold w-16 inline-block">FROM:</span> {pendingReview.from}</p>
                        <p><span className="font-bold w-16 inline-block">RE:</span> {pendingReview.title}</p>
                     </div>

                     <div className="flex-1 font-serif text-lg leading-relaxed space-y-4 pr-4">
                        {pendingReview.body.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                     </div>

                     <div className="mt-8 border-t-2 border-dashed border-gray-400 pt-6">
                        <p className="font-bold text-sm uppercase mb-4 text-gray-500">Select Response:</p>
                        <div className="grid grid-cols-1 gap-4">
                            {pendingReview.options.map((opt, i) => {
                                // Calculate if this option adds stress
                                let stressCost = 0;
                                // Stability reduction = Stress increase
                                if (opt.statsDelta?.stability && opt.statsDelta.stability < 0) {
                                    stressCost = Math.abs(opt.statsDelta.stability);
                                }
                                
                                const disabled = stressCost > 0 && (stress + stressCost > 100);

                                return (
                                    <button
                                        key={i}
                                        onClick={() => !disabled && handleSelect(opt)}
                                        disabled={disabled}
                                        className={`text-left border-2 border-black p-4 transition-colors group flex justify-between items-center
                                            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-200' : 'hover:bg-black hover:text-white'}
                                        `}
                                    >
                                        <div>
                                            <div className="font-bold text-md mb-1 group-hover:text-yellow-400">
                                                [ ] {opt.label}
                                            </div>
                                            {opt.description && (
                                                <div className="text-xs font-mono opacity-60 ml-6 group-hover:opacity-100">
                                                    Effect: {opt.description}
                                                </div>
                                            )}
                                        </div>
                                        {disabled && (
                                            <div className="text-xs font-bold text-red-600 uppercase">
                                                [TOO MUCH STRESS]
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                     </div>
                </div>

            </div>
        </div>
    );
};
