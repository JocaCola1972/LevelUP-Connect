
import React, { useState, useEffect, useMemo } from 'react';
import { Player, MatchSuggestion, SlotTime, Booking, PadelLevel, PreferredSide } from './types';
import { PlayerCard } from './components/PlayerCard';
import { PlayerListItem } from './components/PlayerListItem';
import { PlayerForm } from './components/PlayerForm';
import { MatchSuggestionUI } from './components/MatchSuggestionUI';
import { ScheduleView } from './components/ScheduleView';
import { LoginView } from './components/LoginView';
import { ProfileView } from './components/ProfileView';
import { getMatchSuggestions } from './services/geminiService';

const App: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>(() => {
        const saved = localStorage.getItem('padel_players');
        const initialPlayers = saved ? JSON.parse(saved) : [];
        
        // Seed Admin JocaCola if doesn't exist
        const adminPhone = "917772010";
        const adminExists = initialPlayers.some((p: Player) => p.phone === adminPhone);
        
        if (!adminExists) {
            const admin: Player = {
                id: 'admin-jocacola',
                name: 'JocaCola',
                phone: adminPhone,
                level: PadelLevel.LEVEL_1,
                side: PreferredSide.AMBOS,
                matchesPlayed: 0,
                role: 'admin',
                password: 'admin' // Senha inicial padrão
            };
            return [...initialPlayers, admin];
        }
        return initialPlayers;
    });
    
    const [bookings, setBookings] = useState<Booking[]>(() => {
        const saved = localStorage.getItem('padel_bookings');
        return saved ? JSON.parse(saved) : [];
    });

    const [loggedPlayer, setLoggedPlayer] = useState<Player | null>(() => {
        const saved = localStorage.getItem('padel_logged_player');
        return saved ? JSON.parse(saved) : null;
    });

    const [activeTab, setActiveTab] = useState<'directory' | 'schedule' | 'profile'>('directory');
    const [showForm, setShowForm] = useState(false);
    const [suggestion, setSuggestion] = useState<MatchSuggestion | null>(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        localStorage.setItem('padel_players', JSON.stringify(players));
    }, [players]);

    useEffect(() => {
        localStorage.setItem('padel_bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        if (loggedPlayer) {
            localStorage.setItem('padel_logged_player', JSON.stringify(loggedPlayer));
        } else {
            localStorage.removeItem('padel_logged_player');
        }
    }, [loggedPlayer]);

    const isAdmin = loggedPlayer?.role === 'admin';

    // Data filtering based on Role
    const visiblePlayers = useMemo(() => {
        if (!loggedPlayer) return [];
        if (isAdmin) return players;
        return players.filter(p => p.id === loggedPlayer.id);
    }, [players, loggedPlayer, isAdmin]);

    const visibleBookings = useMemo(() => {
        if (!loggedPlayer) return [];
        if (isAdmin) return bookings;
        return bookings.filter(b => b.playerIds.includes(loggedPlayer.id));
    }, [bookings, loggedPlayer, isAdmin]);

    const updatePlayer = (updated: Player) => {
        setPlayers(prev => prev.map(p => p.id === updated.id ? updated : p));
        if (loggedPlayer?.id === updated.id) {
            setLoggedPlayer(updated);
        }
    };

    const addPlayer = (player: Player) => {
        setPlayers([...players, { ...player, role: 'player' }]);
    };

    const deletePlayer = (id: string) => {
        if (!isAdmin && id !== loggedPlayer?.id) {
            alert("Não tens permissões para remover outros atletas.");
            return;
        }

        const playerToDelete = players.find(p => p.id === id);
        if (playerToDelete) {
            if (window.confirm(`Tem a certeza que deseja remover o atleta ${playerToDelete.name}?`)) {
                setPlayers(players.filter(p => p.id !== id));
                setBookings(bookings.filter(b => !b.playerIds.includes(id)));
                if (loggedPlayer?.id === id) handleLogout();
            }
        }
    };

    const handleMatchmaking = async () => {
        if (!isAdmin) return;
        if (players.length < 4) {
            alert("São necessários pelo menos 4 jogadores para sugerir um jogo.");
            return;
        }
        setLoadingAI(true);
        const result = await getMatchSuggestions(players);
        setSuggestion(result);
        setLoadingAI(false);
    };

    const handleLogout = () => {
        setLoggedPlayer(null);
        setActiveTab('directory');
    };

    const filteredPlayers = visiblePlayers.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.phone.includes(search)
    );

    if (!loggedPlayer) {
        return <LoginView players={players} onLogin={setLoggedPlayer} updatePlayer={updatePlayer} />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-lime-500 rounded-lg flex items-center justify-center text-slate-950 font-black">
                            {isAdmin ? 'A' : 'P'}
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white uppercase italic leading-none">LevelUP</h1>
                            <p className="text-[10px] text-lime-500 font-bold uppercase tracking-widest mt-1">
                                {isAdmin ? 'ADMINISTRADOR' : `Olá, ${loggedPlayer.name.split(' ')[0]}`}
                            </p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-6">
                        <nav className="flex items-center gap-1">
                            <button onClick={() => setActiveTab('directory')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'directory' ? 'bg-lime-500/10 text-lime-400' : 'text-slate-400 hover:text-white'}`}>
                                {isAdmin ? 'Diretório Total' : 'Os Meus Dados'}
                            </button>
                            <button onClick={() => setActiveTab('schedule')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'schedule' ? 'bg-lime-500/10 text-lime-400' : 'text-slate-400 hover:text-white'}`}>
                                {isAdmin ? 'Agenda Geral' : 'As Minhas Reservas'}
                            </button>
                            <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-lime-500/10 text-lime-400' : 'text-slate-400 hover:text-white'}`}>
                                Perfil
                            </button>
                        </nav>
                        
                        {isAdmin && (
                            <div className="flex items-center bg-slate-800 rounded-full px-4 py-2 w-48">
                                <input 
                                    type="text" 
                                    placeholder="Pesquisar..." 
                                    className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <>
                                <button 
                                    onClick={handleMatchmaking}
                                    disabled={loadingAI}
                                    className="hidden md:flex px-4 py-2 bg-lime-500 text-slate-950 rounded-full text-xs font-bold items-center gap-2 hover:bg-lime-400 transition-all"
                                >
                                    {loadingAI ? <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div> : 'IA Matchmaker'}
                                </button>
                                <button 
                                    onClick={() => setShowForm(true)}
                                    className="bg-white text-slate-950 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-200 transition-all hidden sm:block"
                                >
                                    Novo Atleta
                                </button>
                            </>
                        )}
                        <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500 transition-colors" title="Sair">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Mobile Navigation */}
                <div className="lg:hidden flex bg-slate-900 p-1 rounded-xl mb-6 border border-slate-800">
                    <button onClick={() => setActiveTab('directory')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg ${activeTab === 'directory' ? 'bg-slate-800 text-lime-400 shadow' : 'text-slate-500'}`}>
                        {isAdmin ? 'Diretório' : 'Dados'}
                    </button>
                    <button onClick={() => setActiveTab('schedule')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg ${activeTab === 'schedule' ? 'bg-slate-800 text-lime-400 shadow' : 'text-slate-500'}`}>
                        Agenda
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg ${activeTab === 'profile' ? 'bg-slate-800 text-lime-400 shadow' : 'text-slate-500'}`}>
                        Perfil
                    </button>
                </div>

                {activeTab === 'directory' && (
                    <div className="space-y-6">
                        {isAdmin && suggestion && (
                            <div className="mb-12">
                                <MatchSuggestionUI suggestion={suggestion} onClose={() => setSuggestion(null)} />
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 italic">
                                {isAdmin ? 'Diretório de Atletas' : 'A Minha Ficha de Atleta'}
                                {isAdmin && (
                                    <span className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-full text-slate-400 uppercase not-italic">
                                        {filteredPlayers.length}
                                    </span>
                                )}
                            </h2>
                            {isAdmin && (
                                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-slate-800 text-lime-400 shadow' : 'text-slate-500'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h4v4H4V6zm10 0h4v4h-4V6zM4 16h4v4H4v-4zm10 0h4v4h-4v-4z"></path></svg>
                                    </button>
                                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-slate-800 text-lime-400 shadow' : 'text-slate-500'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3"}>
                            {filteredPlayers.map(player => viewMode === 'grid' 
                                ? <PlayerCard key={player.id} player={player} onDelete={deletePlayer} /> 
                                : <PlayerListItem key={player.id} player={player} onDelete={deletePlayer} />
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <ScheduleView 
                        players={players} 
                        bookings={visibleBookings} 
                        setBookings={setBookings}
                        loggedPlayer={loggedPlayer}
                        isAdmin={isAdmin}
                    />
                )}

                {activeTab === 'profile' && (
                    <ProfileView 
                        player={loggedPlayer} 
                        players={players}
                        onUpdate={updatePlayer}
                    />
                )}
            </main>

            {isAdmin && showForm && <PlayerForm onAdd={addPlayer} onClose={() => setShowForm(false)} />}
        </div>
    );
};

export default App;
