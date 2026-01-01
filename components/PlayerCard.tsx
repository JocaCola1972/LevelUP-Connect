
import React from 'react';
import { Player, PreferredSide } from '../types';

interface PlayerCardProps {
    player: Player;
    onDelete: (id: string) => void;
    isAdmin?: boolean;
    onResetPassword?: (id: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onDelete, isAdmin, onResetPassword }) => {
    const sideColor = player.side === PreferredSide.DRIVE ? 'bg-blue-500' : player.side === PreferredSide.REVES ? 'bg-orange-500' : 'bg-purple-500';

    return (
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-lime-500 transition-all shadow-lg group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <img 
                        src={player.avatar || `https://picsum.photos/seed/${player.id}/200`} 
                        alt={player.name} 
                        className="w-14 h-14 rounded-full border-2 border-lime-500 object-cover"
                    />
                    <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-lime-400 transition-colors">{player.name}</h3>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            {player.phone}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {isAdmin && (
                        <button 
                            onClick={() => onResetPassword?.(player.id)}
                            className="text-slate-500 hover:text-lime-500 transition-colors p-1"
                            title="Reset Password"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                            </svg>
                        </button>
                    )}
                    <button 
                        onClick={() => onDelete(player.id)}
                        className="text-slate-500 hover:text-red-500 transition-colors p-1"
                        title="Remover Atleta"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Classificação</span>
                    <span className="font-medium px-2 py-0.5 bg-slate-700 rounded text-lime-400">{player.level}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Posição</span>
                    <span className={`font-medium px-2 py-0.5 rounded text-white ${sideColor}`}>{player.side}</span>
                </div>
            </div>
        </div>
    );
};
