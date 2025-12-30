
import React from 'react';

type MobileTab = 'TERMINAL' | 'RULES' | 'STATUS';

interface MobileNavProps {
    activeTab: MobileTab;
    onTabChange: (tab: MobileTab) => void;
    hasAlerts: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange, hasAlerts }) => {
    
    const getTabClass = (tab: MobileTab) => {
        const isActive = activeTab === tab;
        return `flex-1 py-3 text-xs font-bold tracking-widest uppercase border-t-2 border-r transition-all
            ${isActive 
                ? 'bg-green-900/50 text-white border-green-500 border-t-4' 
                : 'bg-black text-gray-500 border-gray-800 border-t-gray-800 hover:text-gray-300'}
        `;
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50 flex bg-black border-t border-gray-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] safe-area-pb">
            <button 
                onClick={() => onTabChange('RULES')} 
                className={getTabClass('RULES')}
            >
                PROTOCOLS
            </button>
            <button 
                onClick={() => onTabChange('TERMINAL')} 
                className={`${getTabClass('TERMINAL')} border-l`}
            >
                TERMINAL
            </button>
            <button 
                onClick={() => onTabChange('STATUS')} 
                className={`${getTabClass('STATUS')} border-l relative`}
            >
                BIOS
                {hasAlerts && (
                    <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
            </button>
        </div>
    );
};
