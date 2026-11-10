import React, { useEffect, useState } from 'react';
import { Headphones, AlertCircle } from 'lucide-react';
import { SupportTicket } from '../../types';
import { api } from '../../services/api';

export const SupportManagement: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    api.getSupportTickets().then(setTickets);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Support Desk & Escalations</h1>
        <p className="text-xs text-slate-500">Tickets raised by customers and on-field service partners.</p>
      </div>

      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {t.ticketNumber}
                </span>
                <span className="text-xs font-semibold text-slate-800">{t.subject}</span>
              </div>
              <p className="text-xs text-slate-500">
                Raised by: <strong>{t.raisedBy}</strong> • Category: {t.category}
              </p>
              <div className="text-[11px] text-blue-600 italic">Latest: {t.lastReply}</div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                {t.status}
              </span>
              <div className="text-[10px] text-slate-400 mt-1 capitalize font-medium">
                {t.priority} priority
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
