
import React, { useState } from 'react';
import { Player, PadelLevel, PreferredSide } from '../types';

interface PlayerFormProps {
    onAdd: (player: Player) => void;
    onClose: () => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onAdd, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        level: PadelLevel.LEVEL_6,
        side: PreferredSide.AMBOS
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation check for safety, though 'required' attribute handles this in modern browsers
        if (!formData.name.trim() || !formData.phone.trim()) {
            return;
        }

        const newPlayer: Player = {
            ...formData,
            id: crypto.randomUUID(),
            matchesPlayed: 0
        };
        onAdd(newPlayer);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-700 p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Novo Atleta</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                Nome Completo <span className="text-red-500">*</span>
                            </label>
                            <input 
                                required
                                type="text"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500 placeholder:text-slate-600"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="Ex: João Silva"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                                Telemóvel <span className="text-red-500">*</span>
                            </label>
                            <input 
                                required
                                type="tel"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500 placeholder:text-slate-600"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                placeholder="912 345 678"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Nível (1-Melhor, 6-Iniciante)</label>
                            <select 
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                                value={formData.level}
                                onChange={e => setFormData({...formData, level: e.target.value as PadelLevel})}
                            >
                                {Object.values(PadelLevel).map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Lado Preferido</label>
                            <select 
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                                value={formData.side}
                                onChange={e => setFormData({...formData, side: e.target.value as PreferredSide})}
                            >
                                {Object.values(PreferredSide).map(side => (
                                    <option key={side} value={side}>{side}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-3 bg-lime-500 text-slate-950 rounded-lg font-bold hover:bg-lime-400 transition-colors shadow-lg shadow-lime-500/20"
                        >
                            Registar Atleta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
