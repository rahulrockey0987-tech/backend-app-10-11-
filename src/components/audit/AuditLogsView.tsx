import React, { useEffect, useState } from 'react';
import { ShieldAlert, Volume2, IndianRupee, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { AuditLog } from '../../types';
import { api } from '../../services/api';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');

  const loadLogs = () => {
    setLoading(true);
    api
      .getAuditLogs(filterAction === 'all' ? undefined : filterAction)
      .then(setLogs)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, [filterAction]);

  const getActionIcon = (action: string) => {
    if (action.includes('AUDIO')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
          <Volume2 className="w-3.5 h-3.5" />
        </div>
      );
    }
    if (action.includes('PRICE')) {
      return (
        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <IndianRupee className="w-3.5 h-3.5" />
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
        <KeyRound className="w-3.5 h-3.5" />
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            Audit & Compliance Log Records
          </h1>
          <p className="text-xs text-slate-500">
            Immutable log of all administrator actions, voice audio playback streams, and price modifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700"
          >
            <option value="all">All Events</option>
            <option value="AUDIT_VOICE_AUDIO_ACCESSED">Voice Audio Streams</option>
            <option value="AUDIT_HIRE_PARTNER_PRICE_UPDATED">Pricing Changes</option>
            <option value="AUDIT_VOICE_BOOKING_PARTNER_ASSIGNED">Partner Assignments</option>
          </select>

          <button
            onClick={loadLogs}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit trail...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No audit events match the filter.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/60 transition-colors">
                {getActionIcon(log.action)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{log.details}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 font-mono">
                    <span>Admin: <strong className="text-slate-600 font-sans">{log.adminName}</strong></span>
                    <span>IP: {log.ipAddress}</span>
                    {log.targetId && <span>Target ID: {log.targetId}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
