
import React from 'react';
import { Email, EmailOption } from '../types';
import { audio } from '../services/audioService';

interface EmailClientProps {
    email: Email;
    onClose: (option?: EmailOption) => void;
}

export const EmailClient: React.FC<EmailClientProps> = ({ email, onClose }) => {
    
    const handleAction = (option?: EmailOption) => {
        audio.playKeystroke();
        onClose(option);
    };

    const hasOptions = email.options && email.options.length > 0;

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#050510] font-sans p-4 relative overflow-hidden">
             {/* CRT Scanline */}
             <div className="scanline absolute inset-0 z-0 opacity-20 pointer-events-none"></div>
             
             <div className="w-full max-w-3xl bg-gray-200 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 shadow-2xl z-10 text-black">
                {/* Title Bar */}
                <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center select-none">
                    <span className="font-bold text-sm tracking-wide">Mapleton Mail - [Inbox]</span>
                    <button onClick={() => handleAction()} className="bg-gray-300 text-black px-2 border border-black text-xs font-bold shadow-sm hover:bg-red-500 hover:text-white">X</button>
                </div>

                {/* Toolbar */}
                <div className="bg-gray-200 border-b border-gray-400 p-1 flex space-x-2 text-xs">
                    <div className="border border-transparent hover:border-gray-400 px-2 py-1 cursor-pointer">File</div>
                    <div className="border border-transparent hover:border-gray-400 px-2 py-1 cursor-pointer">Edit</div>
                    <div className="border border-transparent hover:border-gray-400 px-2 py-1 cursor-pointer">View</div>
                </div>

                {/* Headers */}
                <div className="bg-white p-4 border-b border-gray-400 text-sm font-mono">
                    <div className="grid grid-cols-[80px_1fr] gap-2 mb-2">
                        <span className="text-gray-500 text-right">From:</span>
                        <span className="font-bold text-blue-800">{email.sender}</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-2 mb-2">
                        <span className="text-gray-500 text-right">Subject:</span>
                        <span className="font-bold border border-gray-300 bg-gray-50 px-2">{email.subject}</span>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-2">
                        <span className="text-gray-500 text-right">Date:</span>
                        <span className="text-gray-700">{new Date().toLocaleDateString()} 08:59 AM</span>
                    </div>
                </div>

                {/* Body */}
                <div className="bg-white h-64 p-6 overflow-y-auto text-sm font-serif leading-relaxed text-gray-900 shadow-inner">
                    {email.body.map((line, idx) => (
                        <p key={idx} className="mb-4">{line}</p>
                    ))}
                    
                    <div className="mt-8 border-t border-gray-300 pt-4 text-xs text-gray-500 font-mono">
                        CONFIDENTIALITY NOTICE: The contents of this email are legally privileged. If you are not the intended recipient, please contain yourself immediately.
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-gray-200 p-2 flex justify-end space-x-2 border-t border-white">
                    {hasOptions ? (
                        email.options!.map((opt, i) => (
                             <button 
                                key={i}
                                onClick={() => handleAction(opt)}
                                className={`px-6 py-1 border-t-2 border-l-2 border-b-2 border-r-2 text-sm font-bold active:border-t-black active:border-l-black active:border-b-white active:border-r-white
                                    ${opt.style === 'danger' ? 'bg-red-100 border-red-300 text-red-900' : ''}
                                    ${opt.style === 'safe' ? 'bg-green-100 border-green-300 text-green-900' : ''}
                                    ${!opt.style || opt.style === 'default' ? 'bg-gray-200 border-white border-b-gray-600 border-r-gray-600' : ''}
                                `}
                            >
                                {opt.label}
                            </button>
                        ))
                    ) : (
                        <button 
                            onClick={() => handleAction()}
                            className="px-6 py-1 bg-gray-200 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black text-sm active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
                        >
                            Mark as Read
                        </button>
                    )}
                </div>
             </div>
        </div>
    );
};
