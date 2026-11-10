import React, { useEffect, useState } from 'react';
import {
  Users,
  CalendarCheck,
  IndianRupee,
  Mic,
  TrendingUp,
  UserCheck,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { api } from '../../services/api';

interface OverviewDashboardProps {
  onOpenVoiceHiring: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onOpenVoiceHiring }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOverviewStats()
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider bg-blue-500/30 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/20">
              Live Operations Hub
            </span>
            <span className="text-xs text-slate-400">• Bengaluru Region</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">HomeHelp Operations Console</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time telemetry, standard scheduled services, partner fleet deployment, and on-demand Voice Hiring governance.
          </p>
        </div>

        {/* Voice Hiring Feature Spotlight Card */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
              Voice Hiring Feature
            </div>
            <div className="text-sm font-bold text-white">Hire a Partner Active</div>
            <div className="text-xs text-slate-300">
              Rate: <strong className="text-amber-400">₹{stats?.voiceBookings?.currentRate || 299}/hr</strong>
            </div>
          </div>
          <button
            onClick={onOpenVoiceHiring}
            className="ml-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
          >
            Manage <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Platform Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{stats?.totalRevenue?.toLocaleString('en-IN') || '48,650'}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {/* Active Partners */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Active Partners</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats?.activePartners || 4}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% verified & deployed</span>
          </div>
        </div>

        {/* Voice Bookings KPI */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Voice Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.voiceBookings?.total || 5}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span className="text-amber-600 font-semibold">
              {stats?.voiceBookings?.pending || 2} Pending
            </span>
            <span className="text-purple-600 font-semibold">
              {stats?.voiceBookings?.active || 2} Active
            </span>
          </div>
        </div>

        {/* Standard Bookings */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase">Catalog Services</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.totalStandardBookings || 2}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>AC, Plumbing, Deep Clean</span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Hire a Partner Operations</h3>
            <button
              onClick={onOpenVoiceHiring}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              View All ➜
            </button>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <div>
                  <div className="font-semibold text-slate-800">Pending Audio Assignment</div>
                  <div className="text-slate-500 text-[11px]">2 customer voice bookings awaiting partner</div>
                </div>
              </div>
              <button
                onClick={onOpenVoiceHiring}
                className="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold"
              >
                Assign
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-2.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-800">Hourly Rate Governance</div>
                  <div className="text-slate-500 text-[11px]">Active rate: ₹{stats?.voiceBookings?.currentRate || 299}/hr INR</div>
                </div>
              </div>
              <button
                onClick={onOpenVoiceHiring}
                className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[11px] font-semibold"
              >
                Change Rate
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">System Security & Audio Access</h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Audit Active
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All customer voice recording streaming events initiated by administrators are logged with full IP, admin ID, timestamp, and duration tracking to ensure end-to-end customer privacy and strict compliance with telecom data protection standards.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Audio Storage Protocol: AES-256 Protected</span>
            <span className="font-mono text-[11px]">Audit Engine: Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
