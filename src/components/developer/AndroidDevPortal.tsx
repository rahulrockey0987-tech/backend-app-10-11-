import React from 'react';
import { Smartphone, Download, QrCode, ShieldCheck } from 'lucide-react';

export const AndroidDevPortal: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-indigo-600" />
          Android Developer & APK Build Portal
        </h1>
        <p className="text-xs text-slate-500">Customer App and Partner App binary distribution and endpoint configs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">HomeHelp Customer App (Android)</h3>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              v1.8.4
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Enables customers to record voice descriptions (Hire a Partner), track assigned partners, and pay hourly bills.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs">
              <Download className="w-3.5 h-3.5" /> Download APK
            </button>
            <span className="text-[11px] text-slate-400">Package: com.homehelp.customer</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">HomeHelp Partner App (Android)</h3>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              v2.1.0
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Allows partners to accept voice jobs, listen to customer audio notes, navigate via GPS, and complete hourly tasks.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs">
              <Download className="w-3.5 h-3.5" /> Download APK
            </button>
            <span className="text-[11px] text-slate-400">Package: com.homehelp.partner</span>
          </div>
        </div>
      </div>
    </div>
  );
};
