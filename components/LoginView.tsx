
import React, { useState } from 'react';
import { Player } from '../types';

interface LoginViewProps {
    players: Player[];
    onLogin: (player: Player) => void;
    updatePlayer: (player: Player) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ players, onLogin, updatePlayer }) => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState<'phone' | 'password' | 'setup'>('phone');
    const [foundPlayer, setFoundPlayer] = useState<Player | null>(null);
    const [error, setError] = useState("");

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const player = players.find(p => p.phone === phone);
        if (!player) {
            setError("Número de telemóvel não encontrado no diretório. Contacte o administrador.");
            return;
        }
        setFoundPlayer(player);
        if (!player.password) {
            setStep('setup');
        } else {
            setStep('password');
        }
    };

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (foundPlayer && foundPlayer.password === password) {
            onLogin(foundPlayer);
        } else {
            setError("Password incorreta.");
        }
    };

    const handleSetupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 4) {
            setError("A password deve ter pelo menos 4 caracteres.");
            return;
        }
        if (foundPlayer) {
            const updated = { ...foundPlayer, password: newPassword };
            updatePlayer(updated);
            onLogin(updated);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-8">
                <div className="text-center">
                    <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center text-slate-950 mx-auto mb-4 shadow-lg shadow-lime-500/20">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">LevelUP Connect</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Acesso à Conta</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs font-bold p-3 rounded-xl text-center">
                        {error}
                    </div>
                )}

                {step === 'phone' && (
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Número de Telemóvel</label>
                            <input 
                                required
                                type="tel"
                                placeholder="9xx xxx xxx"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-lime-500 text-slate-950 font-black uppercase tracking-widest rounded-xl hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/10">
                            Continuar
                        </button>
                    </form>
                )}

                {step === 'password' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-4">
                            <p className="text-slate-400 text-xs">A entrar como:</p>
                            <p className="text-white font-bold">{foundPlayer?.name}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                            <input 
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-lime-500 text-slate-950 font-black uppercase tracking-widest rounded-xl hover:bg-lime-400 transition-all">
                            Entrar
                        </button>
                        <button type="button" onClick={() => setStep('phone')} className="w-full text-slate-500 text-xs font-bold uppercase hover:text-slate-300">
                            Alterar Telemóvel
                        </button>
                    </form>
                )}

                {step === 'setup' && (
                    <form onSubmit={handleSetupSubmit} className="space-y-4">
                        <div className="bg-lime-500/10 p-4 rounded-xl border border-lime-500/20 mb-4">
                            <p className="text-lime-500 text-xs font-bold">Primeiro Acesso Detectado!</p>
                            <p className="text-white text-sm mt-1">Olá <b>{foundPlayer?.name}</b>, defina uma password para os seus próximos acessos.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nova Password</label>
                            <input 
                                required
                                type="password"
                                placeholder="Pelo menos 4 caracteres"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-lime-500 text-slate-950 font-black uppercase tracking-widest rounded-xl hover:bg-lime-400 transition-all">
                            Definir Password e Entrar
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
