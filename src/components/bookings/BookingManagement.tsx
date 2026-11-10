import React, { useEffect, useState } from 'react';
import { CalendarCheck, Search, CheckCircle2, Clock, User, IndianRupee } from 'lucide-react';
import { Booking } from '../../types';
import { api } from '../../services/api';

export const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBookings().then(setBookings).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Standard Bookings
          </h1>
          <p className="text-xs text-slate-500">
            Catalog-based scheduled home maintenance and repair services.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-3">Booking ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Service</th>
              <th className="p-3">Assigned Partner</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Scheduled Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50/80">
                <td className="p-3 font-mono font-bold text-slate-900">{booking.bookingNumber}</td>
                <td className="p-3">
                  <div className="font-semibold text-slate-800">{booking.customerName}</div>
                  <div className="text-[11px] text-slate-400">{booking.customerPhone}</div>
                </td>
                <td className="p-3">
                  <div className="font-medium text-slate-800">{booking.serviceName}</div>
                  <div className="text-[10px] text-slate-400">{booking.serviceCategory}</div>
                </td>
                <td className="p-3 font-medium text-slate-700">
                  {booking.partnerName || <span className="italic text-slate-400">Unassigned</span>}
                </td>
                <td className="p-3 font-bold text-slate-900">₹{booking.amount}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                    {booking.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3 text-slate-500">{booking.scheduledTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
