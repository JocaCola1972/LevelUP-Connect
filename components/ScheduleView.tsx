
import React, { useState } from 'react';
import { Player, SlotTime, Booking } from '../types';
import { BookingModal } from './BookingModal';

interface ScheduleViewProps {
    players: Player[];
    bookings: Booking[];
    setBookings: (bookings: Booking[]) => void;
}

const SLOTS: SlotTime[] = ['08:00 - 09:30', '09:30 - 11:00', '11:00 - 13:00'];

export const ScheduleView: React.FC<ScheduleViewProps> = ({ players, bookings, setBookings }) => {
    const [selectedSlot, setSelectedSlot] = useState<SlotTime | null>(null);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

    const handleCancel = (bookingId: string, playerId?: string) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        if (playerId && booking.playerIds.length > 1) {
            const confirmed = window.confirm("Deseja remover apenas este jogador da reserva (passando a solo) ou cancelar a dupla completa?");
            if (confirmed) {
                // Remove only the specific player
                setBookings(bookings.map(b => 
                    b.id === bookingId 
                        ? { ...b, playerIds: b.playerIds.filter(id => id !== playerId) }
                        : b
                ));
            } else {
                // Cancel whole booking
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
                    return (
                        <div key={slot} className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden shadow-xl">
                            <div className="p-6 bg-slate-800/50 border-b border-slate-800">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-white tracking-tight">{slot}</h3>
                                    <button 
                                        onClick={() => setSelectedSlot(slot)}
                                        className="text-xs font-bold uppercase tracking-wider bg-lime-500 text-slate-950 px-3 py-1.5 rounded-full hover:bg-lime-400 transition-colors"
                                    >
                                        + Inscrição
                                    </button>
                                </div>
                                <p className="text-slate-500 text-xs mt-1 font-bold">
                                    {slotBookings.length} Reservas Ativas
                                </p>
                            </div>

                            <div className="p-6 flex-1 space-y-4 max-h-[500px] overflow-y-auto">
                                {slotBookings.length > 0 ? (
                                    slotBookings.map(booking => (
                                        <div key={booking.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 group">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${booking.playerIds.length === 2 ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                    {booking.playerIds.length === 2 ? 'Dupla' : 'Solo'}
                                                </span>
                                                <button 
                                                    onClick={() => handleCancel(booking.id)}
                                                    className="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {booking.playerIds.map(pid => {
                                                    const p = players.find(x => x.id === pid);
                                                    return (
                                                        <div key={pid} className="flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                                                                    {p?.avatar ? <img src={p.avatar} /> : p?.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-white leading-tight">{p?.name || 'Atleta Removido'}</p>
                                                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{p?.level.split(' ')[0]}</p>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => handleCancel(booking.id, pid)}
                                                                className="text-[10px] text-slate-600 hover:text-red-400 font-bold uppercase"
                                                            >
                                                                Sair
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                                {booking.playerIds.length === 1 && (
                                                    <button 
                                                        onClick={() => setEditingBooking(booking)}
                                                        className="w-full py-2 bg-slate-900 border border-dashed border-slate-700 rounded-xl text-[10px] font-bold text-lime-400 uppercase tracking-widest hover:border-lime-500 transition-all"
                                                    >
                                                        + Adicionar Parceiro
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center py-12 text-center opacity-30">
                                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p className="text-sm font-bold uppercase tracking-widest">Turno Livre</p>
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
                    onClose={() => { setSelectedSlot(null); setEditingBooking(null); }}
                    onSave={(newBooking) => {
                        if (editingBooking) {
                            setBookings(bookings.map(b => b.id === editingBooking.id ? newBooking : b));
                        } else {
                            setBookings([...bookings, newBooking]);
                        }
                        setSelectedSlot(null);
                        setEditingBooking(null);
                    }}
                />
            )}
        </div>
    );
};
