
import React from 'react';
import { MatchSuggestion } from '../types';

interface MatchSuggestionUIProps {
    suggestion: MatchSuggestion;
    onClose: () => void;
}

export const MatchSuggestionUI: React.FC<MatchSuggestionUIProps> = ({ suggestion, onClose }) => {
    return (
        <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-lime-500/30 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-white">Sugestão de Jogo (IA)</h2>
                    <p className="text-lime-400 font-medium">Equilíbrio da Partida: {suggestion.balanceScore * 10}%</p>
                </div>
                <button onClick={onClose} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-12 relative">
                {/* VS Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <div className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_30px_rgba(132,204,22,0.4)]">
                        VS
                    </div>
                </div>

                {/* Team 1 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-center text-blue-400 mb-6 uppercase tracking-widest">Equipa A</h3>
                    <div className="grid gap-4">
                        {suggestion.team1.map(player => (
                            <div key={player.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-blue-500/20">
                                <img src={player.avatar || `https://picsum.photos/seed/${player.id}/100`} className="w-12 h-12 rounded-full border border-blue-400" alt="" />
                                <div>
                                    <p className="font-bold text-white">{player.name}</p>
                                    <p className="text-xs text-slate-400">{player.level} • {player.side}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team 2 */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-center text-orange-400 mb-6 uppercase tracking-widest">Equipa B</h3>
                    <div className="grid gap-4">
                        {suggestion.team2.map(player => (
                            <div key={player.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-orange-500/20">
                                <img src={player.avatar || `https://picsum.photos/seed/${player.id}/100`} className="w-12 h-12 rounded-full border border-orange-400" alt="" />
                                <div>
                                    <p className="font-bold text-white">{player.name}</p>
                                    <p className="text-xs text-slate-400">{player.level} • {player.side}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 bg-slate-800/40 p-6 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-lime-400 uppercase tracking-wider mb-2">Análise da IA</h4>
                <p className="text-slate-300 italic leading-relaxed">{suggestion.reasoning}</p>
            </div>
        </div>
    );
};
