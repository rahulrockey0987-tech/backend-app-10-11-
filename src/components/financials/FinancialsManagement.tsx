import React from 'react';
import { CircleDollarSign, IndianRupee, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const FinancialsManagement: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Financials & Partner Payouts</h1>
        <p className="text-xs text-slate-500">Gross transaction values, platform fee deductions and partner settlements.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Volume (Gross)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹1,42,800</div>
          <div className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +12% this cycle
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Partner Payouts (85%)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹1,21,380</div>
          <div className="text-xs text-slate-500 mt-2">Disbursed via UPI / IMPS</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Platform Revenue (15%)</div>
          <div className="text-2xl font-black text-indigo-700 mt-1">₹21,420</div>
          <div className="text-xs text-slate-500 mt-2">HomeHelp Platform Fee</div>
        </div>
      </div>
    </div>
  );
};
