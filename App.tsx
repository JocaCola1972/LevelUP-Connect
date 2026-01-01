
import React, { useState, useEffect } from 'react';
import { Player, MatchSuggestion, SlotTime, Booking } from './types';
import { PlayerCard } from './components/PlayerCard';
import { PlayerListItem } from './components/PlayerListItem';
import { PlayerForm } from './components/PlayerForm';
import { MatchSuggestionUI } from './components/MatchSuggestionUI';
import { ScheduleView } from './components/ScheduleView';
import { getMatchSuggestions } from './services/geminiService';

const App: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>(() => {
        const saved = localStorage.getItem('padel_players');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [bookings, setBookings] = useState<Booking[]>(() => {
        const saved = localStorage.getItem('padel_bookings');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeTab, setActiveTab] = useState<'directory' | 'schedule'>('directory');
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

    const addPlayer = (player: Player) => {
        setPlayers([...players, player]);
    };

    const deletePlayer = (id: string) => {
        const playerToDelete = players.find(p => p.id === id);
        if (playerToDelete) {
            const isBooked = bookings.some(b => b.playerIds.includes(id));
            const msg = isBooked 
                ? `O atleta ${playerToDelete.name} tem reservas ativas. Remover o atleta irá cancelar todas as suas inscrições. Continuar?`
                : `Tem a certeza que deseja remover o atleta ${playerToDelete.name}?`;

            if (window.confirm(msg)) {
                setPlayers(players.filter(p => p.id !== id));
                setBookings(bookings.filter(b => !b.playerIds.includes(id)));
            }
        }
    };

    const handleMatchmaking = async () => {
        if (players.length < 4) {
            alert("São necessários pelo menos 4 jogadores para sugerir um jogo.");
            return;
        }
        setLoadingAI(true);
        const result = await getMatchSuggestions(players);
        setSuggestion(result);
        setLoadingAI(false);
    };

    const filteredPlayers = players.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.level.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search)
    );

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header / Nav */}
            <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-lime-500 rounded-lg flex items-center justify-center text-slate-950">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">LevelUP Connect</h1>
                            <p className="text-[10px] text-lime-500 font-bold uppercase tracking-widest">Padel Management</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <nav className="flex items-center gap-1">
                            <button 
                                onClick={() => setActiveTab('directory')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'directory' ? 'bg-lime-500/10 text-lime-400' : 'text-slate-400 hover:text-white'}`}
                            >
                                Diretório
                            </button>
                            <button 
                                onClick={() => setActiveTab('schedule')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'schedule' ? 'bg-lime-500/10 text-lime-400' : 'text-slate-400 hover:text-white'}`}
                            >
                                Agenda de Turnos
                            </button>
                        </nav>
                        
                        <div className="flex items-center bg-slate-800 rounded-full px-4 py-2 w-64">
                            <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            <input 
                                type="text" 
                                placeholder="Procurar..." 
                                className="bg-transparent border-none text-sm text-white focus:outline-none w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={handleMatchmaking}
                            disabled={loadingAI || players.length < 4}
                            className={`hidden sm:flex px-5 py-2.5 rounded-full text-sm font-bold items-center gap-2 transition-all ${
                                loadingAI ? 'bg-slate-800 text-slate-500' : 'bg-lime-500 text-slate-950 hover:bg-lime-400'
                            }`}
                        >
                            {loadingAI ? <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>}
                            Sugestão IA
                        </button>
                        <button 
                            onClick={() => setShowForm(true)}
                            className="bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition-all"
                        >
                            Novo Atleta
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Mobile Tab Nav */}
                <div className="md:hidden flex bg-slate-900 p-1 rounded-xl mb-6 border border-slate-800">
                    <button 
                        onClick={() => setActiveTab('directory')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeTab === 'directory' ? 'bg-slate-800 text-white shadow' : 'text-slate-500'}`}
                    >
                        DIRETÓRIO
                    </button>
                    <button 
                        onClick={() => setActiveTab('schedule')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg ${activeTab === 'schedule' ? 'bg-slate-800 text-white shadow' : 'text-slate-500'}`}
                    >
                        AGENDA
                    </button>
                </div>

                {activeTab === 'directory' ? (
                    <div className="space-y-6">
                        {suggestion && (
                            <div className="mb-12">
                                <MatchSuggestionUI suggestion={suggestion} onClose={() => setSuggestion(null)} />
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                Atletas Registados
                                <span className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-full text-slate-400 uppercase">
                                    {filteredPlayers.length}
                                </span>
                            </h2>
                            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-lime-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                </button>
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-800 text-lime-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                </button>
                            </div>
                        </div>

                        {filteredPlayers.length > 0 ? (
                            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3"}>
                                {filteredPlayers.map(player => viewMode === 'grid' 
                                    ? <PlayerCard key={player.id} player={player} onDelete={deletePlayer} /> 
                                    : <PlayerListItem key={player.id} player={player} onDelete={deletePlayer} />
                                )}
                            </div>
                        ) : (
                            <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center text-slate-500">
                                <h3 className="text-xl font-bold text-white mb-2">Sem atletas encontrados</h3>
                                <p>Tente ajustar a sua pesquisa ou adicione um novo atleta.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <ScheduleView 
                        players={players} 
                        bookings={bookings} 
                        setBookings={setBookings} 
                    />
                )}
            </main>

            {showForm && <PlayerForm onAdd={addPlayer} onClose={() => setShowForm(false)} />}
        </div>
    );
};

export default App;
