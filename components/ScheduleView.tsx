
import React, { useState } from 'react';
import { Player, SlotTime, Booking } from '../types';
import { BookingModal } from './BookingModal';

interface ScheduleViewProps {
    players: Player[];
    bookings: Booking[];
    setBookings: (bookings: Booking[]) => void;
    loggedPlayer: Player;
    isAdmin: boolean;
}

const SLOTS: SlotTime[] = ['08:00 - 09:30', '09:30 - 11:00', '11:00 - 13:00'];

export const ScheduleView: React.FC<ScheduleViewProps> = ({ players, bookings, setBookings, loggedPlayer, isAdmin }) => {
    const [selectedSlot, setSelectedSlot] = useState<SlotTime | null>(null);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

    const handleAction = (slot: SlotTime) => {
        if (isAdmin) {
            setSelectedSlot(slot);
        } else {
            // Lógica de inscrição rápida para jogadores comuns
            const alreadyInscribed = bookings.some(b => b.slotTime === slot && b.playerIds.includes(loggedPlayer.id));
            
            if (alreadyInscribed) {
                alert("Já se encontra inscrito neste turno.");
                return;
            }

            const newBooking: Booking = {
                id: crypto.randomUUID(),
                slotTime: slot,
                playerIds: [loggedPlayer.id]
            };
            setBookings([...bookings, newBooking]);
        }
    };

    const handleCancel = (bookingId: string, playerId?: string) => {
        // Se não for admin, só pode cancelar se for o próprio playerId ou se a reserva for dele
        if (!isAdmin && playerId && playerId !== loggedPlayer.id) return;

        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        if (playerId && booking.playerIds.length > 1) {
            const confirmed = window.confirm("Deseja remover apenas este jogador da reserva ou cancelar a dupla completa?");
            if (confirmed) {
                setBookings(bookings.map(b => 
                    b.id === bookingId 
                        ? { ...b, playerIds: b.playerIds.filter(id => id !== playerId) }
                        : b
                ));
            } else {
                setBookings(bookings.filter(b => b.id !== bookingId));
            }
        } else {
            if (window.confirm("Deseja cancelar esta inscrição?")) {
                setBookings(bookings.filter(b => b.id !== bookingId));
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {SLOTS.map(slot => {
                    const slotBookings = bookings.filter(b => b.slotTime === slot);
                    const isMeInscribed = slotBookings.some(b => b.playerIds.includes(loggedPlayer.id));

                    return (
                        <div key={slot} className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-xl transition-all hover:border-slate-700">
                            <div className="p-6 bg-slate-800/50 border-b border-slate-800">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-white italic">{slot}</h3>
                                    <button 
                                        onClick={() => handleAction(slot)}
                                        disabled={!isAdmin && isMeInscribed}
                                        className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full transition-all ${
                                            !isAdmin && isMeInscribed 
                                            ? 'bg-slate-700 text-slate-500 cursor-default' 
                                            : 'bg-lime-500 text-slate-950 hover:bg-lime-400 active:scale-95'
                                        }`}
                                    >
                                        {!isAdmin && isMeInscribed ? 'Inscrito' : 'Inscrever'}
                                    </button>
                                </div>
                                <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-widest">
                                    {isAdmin ? `${slotBookings.length} Reservas Totais` : (isMeInscribed ? 'Estás confirmado neste turno' : 'Turno disponível')}
                                </p>
                            </div>

                            <div className="p-6 flex-1 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {slotBookings.length > 0 ? (
                                    slotBookings.map(booking => {
                                        const includesMe = booking.playerIds.includes(loggedPlayer.id);
                                        // Jogadores comuns apenas vêm blocos onde estão incluídos
                                        if (!isAdmin && !includesMe) return null;

                                        return (
                                            <div key={booking.id} className={`border rounded-2xl p-4 group transition-all ${includesMe ? 'bg-lime-500/5 border-lime-500/20' : 'bg-slate-800/40 border-slate-700/50'}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${booking.playerIds.length === 2 ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                        {booking.playerIds.length === 2 ? 'Dupla' : 'Solo'}
                                                    </span>
                                                    {(isAdmin || includesMe) && (
                                                        <button 
                                                            onClick={() => handleCancel(booking.id)}
                                                            className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    {booking.playerIds.map(pid => {
                                                        const p = players.find(x => x.id === pid);
                                                        const isMe = pid === loggedPlayer.id;
                                                        
                                                        if (!isAdmin && !isMe) return null;

                                                        return (
                                                            <div key={pid} className="flex items-center justify-between gap-3 animate-in slide-in-from-left-2 duration-300">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden border ${isMe ? 'border-lime-500 bg-lime-500/20' : 'border-slate-600 bg-slate-700'}`}>
                                                                        {p?.avatar ? <img src={p.avatar} alt={p.name} /> : p?.name.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className={`text-sm font-bold leading-tight ${isMe ? 'text-lime-400' : 'text-white'}`}>{p?.name || 'Atleta'}</p>
                                                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{p?.level.split(' ')[0]}</p>
                                                                    </div>
                                                                </div>
                                                                <button 
                                                                    onClick={() => handleCancel(booking.id, pid)}
                                                                    className="text-[9px] text-slate-500 hover:text-red-400 font-black uppercase tracking-tighter"
                                                                >
                                                                    Sair
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                    {isAdmin && booking.playerIds.length === 1 && (
                                                        <button 
                                                            onClick={() => setEditingBooking(booking)}
                                                            className="w-full py-2 bg-slate-900/50 border border-dashed border-slate-700 rounded-xl text-[10px] font-bold text-lime-400 uppercase tracking-widest hover:border-lime-500 transition-all"
                                                        >
                                                            + Adicionar Parceiro (Admin)
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center py-12 text-center opacity-20">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Sem Inscrições</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {(selectedSlot || editingBooking) && (
                <BookingModal 
                    slot={selectedSlot || editingBooking?.slotTime || '08:00 - 09:30'} 
                    players={players}
                    bookings={bookings}
                    editBooking={editingBooking}
                    loggedPlayer={loggedPlayer}
                    isAdmin={isAdmin}
                    onClose={() => { setSelectedSlot(null); setEditingBooking(null); }}
                    onSave={(newBooking) => {
                        setBookings(editingBooking 
                            ? bookings.map(b => b.id === editingBooking.id ? newBooking : b)
                            : [...bookings, newBooking]
                        );
                        setSelectedSlot(null);
                        setEditingBooking(null);
                    }}
                />
            )}
        </div>
    );
};
