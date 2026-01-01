
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

                            <div className="p-4 flex-1 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {slotBookings.length > 0 ? (
                                    slotBookings.map(booking => {
                                        const includesMe = booking.playerIds.includes(loggedPlayer.id);
                                        if (!isAdmin && !includesMe) return null;

                                        return (
                                            <div key={booking.id} className={`border rounded-xl p-3 group transition-all relative ${includesMe ? 'bg-lime-500/5 border-lime-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        {/* Avatars Condensados */}
                                                        <div className="flex -space-x-2">
                                                            {booking.playerIds.map((pid, idx) => {
                                                                const p = players.find(x => x.id === pid);
                                                                const isMe = pid === loggedPlayer.id;
                                                                if (!isAdmin && !isMe) return null;
                                                                return (
                                                                    <div key={pid} className={`w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[8px] font-bold text-white overflow-hidden z-[${20-idx}] ${isMe ? 'border-lime-500' : ''}`}>
                                                                        {p?.avatar ? <img src={p.avatar} alt="" /> : p?.name.charAt(0)}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        
                                                        {/* Nomes em Linha */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-white truncate">
                                                                {booking.playerIds.map((pid, idx) => {
                                                                    const p = players.find(x => x.id === pid);
                                                                    const isMe = pid === loggedPlayer.id;
                                                                    if (!isAdmin && !isMe) return null;
                                                                    return (
                                                                        <React.Fragment key={pid}>
                                                                            <span className={isMe ? 'text-lime-400' : 'text-slate-200'}>
                                                                                {p?.name.split(' ')[0]}
                                                                            </span>
                                                                            {idx < booking.playerIds.length - 1 && (isAdmin || (idx === 0 && booking.playerIds.length > 1 && (isAdmin || booking.playerIds.includes(loggedPlayer.id)))) && (
                                                                                <span className="text-slate-600 mx-1">/</span>
                                                                            )}
                                                                        </React.Fragment>
                                                                    );
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        {isAdmin && booking.playerIds.length === 1 && (
                                                            <button 
                                                                onClick={() => setEditingBooking(booking)}
                                                                className="p-1.5 text-lime-500 hover:bg-lime-500/10 rounded-md transition-all"
                                                                title="Adicionar parceiro"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => handleCancel(booking.id)}
                                                            className="p-1.5 text-slate-500 hover:text-red-500 transition-all"
                                                            title="Cancelar"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                        </button>
                                                    </div>
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
