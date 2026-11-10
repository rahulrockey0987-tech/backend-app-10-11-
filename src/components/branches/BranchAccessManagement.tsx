import React from 'react';
import { Building2, ShieldCheck, Users } from 'lucide-react';

export const BranchAccessManagement: React.FC = () => {
  const branches = [
    { id: 'BR-BLR-01', name: 'Bengaluru Central & East', city: 'Bengaluru', partners: 24, leads: 'Keerthi Almati' },
    { id: 'BR-BLR-02', name: 'Bengaluru South & West', city: 'Bengaluru', partners: 18, leads: 'Ramesh Reddy' },
    { id: 'BR-HYD-01', name: 'Hyderabad Hitec City Hub', city: 'Hyderabad', partners: 32, leads: 'Kavita Rao' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          Branch & Regional Access Control
        </h1>
        <p className="text-xs text-slate-500">Regional hubs, authorized staff roles and service zone polygons.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-slate-400">{b.id}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active Hub
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">{b.name}</h3>
            <div className="text-xs text-slate-500">
              City: <strong>{b.city}</strong> • Fleet: <strong>{b.partners} Partners</strong>
            </div>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              Operations Lead: <strong className="text-slate-700 font-sans">{b.leads}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
