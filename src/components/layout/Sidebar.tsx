import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Mic,
  Users,
  UserCheck,
  Radio,
  Layers,
  CircleDollarSign,
  TicketPercent,
  Headphones,
  ShieldAlert,
  Database,
  Smartphone,
  Building2,
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'bookings'
  | 'voice-hiring'
  | 'partners'
  | 'customers'
  | 'radar'
  | 'services'
  | 'financials'
  | 'coupons'
  | 'support'
  | 'audit'
  | 'database'
  | 'developer'
  | 'branches';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  voiceBookingCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  voiceBookingCount = 5,
}) => {
  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
    isNew?: boolean;
  }[] = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: 2 },
    // Only added navigation item: Voice Hiring (Hire a Partner)
    {
      id: 'voice-hiring',
      label: 'Voice Hiring',
      icon: Mic,
      badge: voiceBookingCount,
      badgeColor: 'bg-emerald-500 text-white',
      isNew: true,
    },
    { id: 'partners', label: 'Partner Management', icon: UserCheck, badge: 4 },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'radar', label: 'Live GPS Radar', icon: Radio },
    { id: 'services', label: 'Services & Pricing', icon: Layers },
    { id: 'financials', label: 'Financials & Payouts', icon: CircleDollarSign },
    { id: 'coupons', label: 'Promos & Coupons', icon: TicketPercent },
    { id: 'support', label: 'Support Desk', icon: Headphones, badge: 2 },
    { id: 'audit', label: 'Audit & Compliance', icon: ShieldAlert },
    { id: 'database', label: 'Mongo Database', icon: Database },
    { id: 'developer', label: 'Android Dev Portal', icon: Smartphone },
    { id: 'branches', label: 'Branch Access', icon: Building2 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-800 bg-slate-900/90">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
          H
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 text-base tracking-tight">HomeHelp</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Operations Console</p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Core Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {item.isNew && !isActive && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    NEW
                  </span>
                )}
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[11px] rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Backend Sync Active
          </span>
          <span className="font-mono text-[11px] text-slate-400">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
};
