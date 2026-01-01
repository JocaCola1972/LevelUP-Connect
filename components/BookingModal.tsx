
import React, { useState, useMemo } from 'react';
import { Player, SlotTime, Booking } from '../types';

interface BookingModalProps {
    slot: SlotTime;
    players: Player[];
    bookings: Booking[];
    editBooking: Booking | null;
    loggedPlayer: Player;
    isAdmin: boolean;
    onClose: () => void;
    onSave: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ slot, players, bookings, editBooking, loggedPlayer, isAdmin, onClose, onSave }) => {
    const [bookingType, setBookingType] = useState<'solo' | 'dupla'>(editBooking ? 'dupla' : 'solo');
    const [selectedIds, setSelectedIds] = useState<string[]>(editBooking ? editBooking.playerIds : (isAdmin ? [] : [loggedPlayer.id]));
    const [search, setSearch] = useState("");

    const busyIds = useMemo(() => {
        const slotBookings = bookings.filter(b => b.slotTime === slot && b.id !== editBooking?.id);
        return slotBookings.flatMap(b => b.playerIds);
    }, [bookings, slot, editBooking]);

    const availablePlayers = useMemo(() => {
        // Se for admin, vê todos os disponíveis. Se for jogador, tecnicamente só se vê a si mesmo para solo, 
        // ou vê outros para convidar se souber o nome (respeitando a regra de "vê os seus dados" no diretório).
        // Para simplificar a regra de "apenas vê os seus dados", restringimos a seleção de jogadores a quem o admin pode ver.
        if (!isAdmin) {
            // Um jogador comum só pode inscrever-se a si mesmo ou a sua dupla se ele for um dos membros.
            // Aqui permitimos procurar outros apenas para formar a dupla.
            return players.filter(p => !busyIds.includes(p.id) && p.name.toLowerCase().includes(search.toLowerCase()));
        }
        return players.filter(p => !busyIds.includes(p.id) && p.name.toLowerCase().includes(search.toLowerCase()));
    }, [players, busyIds, search, isAdmin]);

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(x => x !== id));
        } else {
            if (bookingType === 'solo') {
                setSelectedIds([id]);
            } else if (selectedIds.length < 2) {
                setSelectedIds([...selectedIds, id]);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white italic">{editBooking ? 'Adicionar Parceiro' : 'Nova Inscrição'}</h2>
                        <p className="text-lime-500 font-bold text-xs uppercase tracking-widest">{slot}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>

                {!editBooking && isAdmin && (
                    <div className="p-4 bg-slate-800/50 flex gap-2">
                        <button onClick={() => { setBookingType('solo'); setSelectedIds([]); }} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${bookingType === 'solo' ? 'bg-lime-500 text-slate-950 border-lime-500' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>Solo</button>
                        <button onClick={() => { setBookingType('dupla'); setSelectedIds([]); }} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${bookingType === 'dupla' ? 'bg-lime-500 text-slate-950 border-lime-500' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>Dupla</button>
                    </div>
                )}

                <div className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <input 
                        type="text" 
                        placeholder="Pesquisar atleta..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {availablePlayers.map(p => {
                            const isSelected = selectedIds.includes(p.id);
                            return (
                                <button key={p.id} onClick={() => handleSelect(p.id)} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected ? 'bg-lime-500/10 border-lime-500' : 'bg-slate-800 border-slate-700'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white overflow-hidden">{p.avatar ? <img src={p.avatar} /> : p.name.charAt(0)}</div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-white">{p.name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">{p.level.split(' ')[0]}</p>
                                        </div>
                                    </div>
                                    {isSelected && <div className="bg-lime-500 text-slate-950 rounded-full p-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-8 bg-slate-800/80 border-t border-slate-700 flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl">Voltar</button>
                    <button 
                        disabled={selectedIds.length === 0} 
                        onClick={() => onSave({ id: editBooking?.id || crypto.randomUUID(), slotTime: slot, playerIds: selectedIds })}
                        className={`flex-[2] py-4 font-black uppercase tracking-widest rounded-2xl ${selectedIds.length > 0 ? 'bg-lime-500 text-slate-950' : 'bg-slate-700 text-slate-500'}`}
                    >
                        Confirmar {selectedIds.length > 0 && `(${selectedIds.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};
