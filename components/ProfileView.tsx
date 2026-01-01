
import React, { useState } from 'react';
import { Player, PadelLevel, PreferredSide } from '../types';

interface ProfileViewProps {
    player: Player;
    players: Player[];
    onUpdate: (updated: Player) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ player, players, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: player.name,
        phone: player.phone,
        password: player.password || "",
        level: player.level,
        side: player.side
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // Check if phone is taken by another player
        const isTaken = players.some(p => p.phone === formData.phone && p.id !== player.id);
        if (isTaken) {
            setError("Este número de telemóvel já está associado a outra conta.");
            return;
        }

        if (formData.password.length < 4) {
            setError("A password deve ter pelo menos 4 caracteres.");
            return;
        }

        onUpdate({
            ...player,
            name: formData.name,
            phone: formData.phone,
            password: formData.password,
            level: formData.level,
            side: formData.side
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-800 bg-slate-800/30">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">O Meu Perfil</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Gere os teus dados de acesso e preferências</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {success && (
                        <div className="bg-lime-500/10 border border-lime-500/50 text-lime-500 text-sm font-bold p-4 rounded-xl flex items-center gap-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Perfil atualizado com sucesso!
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-bold p-4 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
                            <input 
                                required
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Telemóvel</label>
                            <input 
                                required
                                type="tel"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password de Acesso</label>
                        <input 
                            required
                            type="password"
                            placeholder="Altera a tua password aqui"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">O Teu Nível</label>
                            <select 
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                                value={formData.level}
                                onChange={e => setFormData({...formData, level: e.target.value as PadelLevel})}
                            >
                                {Object.values(PadelLevel).map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lado Preferido</label>
                            <select 
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                                value={formData.side}
                                onChange={e => setFormData({...formData, side: e.target.value as PreferredSide})}
                            >
                                {Object.values(PreferredSide).map(side => (
                                    <option key={side} value={side}>{side}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 bg-white text-slate-950 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5"
                    >
                        Guardar Alterações
                    </button>
                </form>
            </div>
        </div>
    );
};
