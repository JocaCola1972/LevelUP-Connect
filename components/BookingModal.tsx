
import React, { useState, useMemo } from 'react';
import { Player, SlotTime, Booking } from '../types';

interface BookingModalProps {
    slot: SlotTime;
    players: Player[];
    bookings: Booking[];
    editBooking: Booking | null;
    onClose: () => void;
    onSave: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ slot, players, bookings, editBooking, onClose, onSave }) => {
    const [bookingType, setBookingType] = useState<'solo' | 'dupla'>(editBooking ? 'dupla' : 'solo');
    const [selectedIds, setSelectedIds] = useState<string[]>(editBooking ? editBooking.playerIds : []);
    const [search, setSearch] = useState("");

    // Players busy in THIS specific slot
    const busyIds = useMemo(() => {
        const slotBookings = bookings.filter(b => b.slotTime === slot && b.id !== editBooking?.id);
        return slotBookings.flatMap(b => b.playerIds);
    }, [bookings, slot, editBooking]);

    const availablePlayers = useMemo(() => {
        return players.filter(p => 
            !busyIds.includes(p.id) && 
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [players, busyIds, search]);

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

    const handleConfirm = () => {
        if (selectedIds.length === 0) return;
        
        onSave({
            id: editBooking?.id || crypto.randomUUID(),
            slotTime: slot,
            playerIds: selectedIds
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white">{editBooking ? 'Adicionar Parceiro' : 'Nova Inscrição'}</h2>
                        <p className="text-lime-500 font-bold text-sm uppercase tracking-widest">{slot}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {!editBooking && (
                    <div className="p-4 bg-slate-800/50 flex gap-2">
                        <button 
                            onClick={() => { setBookingType('solo'); setSelectedIds([]); }}
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${bookingType === 'solo' ? 'bg-lime-500 text-slate-950 border-lime-500' : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'}`}
                        >
                            Sozinho
                        </button>
                        <button 
                            onClick={() => { setBookingType('dupla'); setSelectedIds([]); }}
                            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${bookingType === 'dupla' ? 'bg-lime-500 text-slate-950 border-lime-500' : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'}`}
                        >
                            Em Dupla
                        </button>
                    </div>
                )}

                <div className="p-6 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Pesquisar atletas disponíveis..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {availablePlayers.length > 0 ? (
                            availablePlayers.map(p => {
                                const isSelected = selectedIds.includes(p.id);
                                return (
                                    <button 
                                        key={p.id}
                                        onClick={() => handleSelect(p.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected ? 'bg-lime-500/10 border-lime-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white overflow-hidden">
                                                {p.avatar ? <img src={p.avatar} /> : p.name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-white">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.level.split(' ')[0]}</p>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="bg-lime-500 text-slate-950 rounded-full p-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="text-center py-10 text-slate-500 font-medium text-sm">
                                Nenhum atleta disponível para este turno.
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-slate-800/80 border-t border-slate-700 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        disabled={selectedIds.length === 0}
                        onClick={handleConfirm}
                        className={`flex-[2] py-4 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl ${selectedIds.length > 0 ? 'bg-lime-500 text-slate-950 hover:bg-lime-400 shadow-lime-500/10' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                    >
                        Confirmar {selectedIds.length > 0 && `(${selectedIds.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};
