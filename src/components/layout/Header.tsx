import React from 'react';
import {
  Bell,
  Search,
  ShieldCheck,
  Zap,
  Mic,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { AdminUser } from '../../types';

interface HeaderProps {
  currentAdmin: AdminUser;
  onRefreshData?: () => void;
  onOpenVoiceHiring?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAdmin,
  onRefreshData,
  onOpenVoiceHiring,
  onLogout,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs sticky top-0 z-20">
      {/* Left Search / Title */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking ID, customer phone, partner or service..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right Action Icons & Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Voice Hiring Shortcut Button */}
        {onOpenVoiceHiring && (
          <button
            onClick={onOpenVoiceHiring}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors"
            title="Open Voice Hiring Management"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span>Voice Bookings</span>
          </button>
        )}

        {/* Refresh Button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh System Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Live GPS Health Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>Bengaluru Central Hub</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* Admin User Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-blue-100">
            {currentAdmin.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">{currentAdmin.name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-[11px] text-slate-500 capitalize">
              {currentAdmin.role.replace('_', ' ')}
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
