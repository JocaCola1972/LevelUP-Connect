
import React from 'react';
import { Player, PreferredSide } from '../types';

interface PlayerListItemProps {
    player: Player;
    onDelete: (id: string) => void;
    isAdmin?: boolean;
    onResetPassword?: (id: string) => void;
}

export const PlayerListItem: React.FC<PlayerListItemProps> = ({ player, onDelete, isAdmin, onResetPassword }) => {
    const sideColor = player.side === PreferredSide.DRIVE ? 'text-blue-400' : player.side === PreferredSide.REVES ? 'text-orange-400' : 'text-purple-400';

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-all group">
            <div className="flex items-center gap-4 flex-1">
                <img 
                    src={player.avatar || `https://picsum.photos/seed/${player.id}/100`} 
                    alt={player.name} 
                    className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 flex-1">
                    <div>
                        <h3 className="font-bold text-white group-hover:text-lime-400 transition-colors">{player.name}</h3>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                            {player.phone}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-800 rounded text-lime-400 border border-lime-500/20">
                            {player.level}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${sideColor}`}>
                            {player.side.split(' ')[0]}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                {isAdmin && (
                    <button 
                        onClick={() => onResetPassword?.(player.id)}
                        className="p-2 text-slate-600 hover:text-lime-500 hover:bg-lime-500/10 rounded-lg transition-all"
                        title="Reset Password"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                        </svg>
                    </button>
                )}
                <button 
                    onClick={() => onDelete(player.id)}
                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Remover Atleta"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
