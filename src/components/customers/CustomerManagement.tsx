import React, { useEffect, useState } from 'react';
import { Users, Phone, Mail, MapPin, IndianRupee } from 'lucide-react';
import { Customer } from '../../types';
import { api } from '../../services/api';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    api.getCustomers().then(setCustomers);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
        <p className="text-xs text-slate-500">Registered customers, residential addresses, and booking histories.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Total Bookings</th>
              <th className="p-3">Total Spend</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-900">{c.name}</td>
                <td className="p-3 text-slate-700 font-mono">{c.phone}</td>
                <td className="p-3 text-slate-500">
                  {c.address.line1}, {c.address.city} - {c.address.pincode}
                </td>
                <td className="p-3 font-bold text-slate-800">{c.totalBookings}</td>
                <td className="p-3 font-bold text-emerald-700">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
