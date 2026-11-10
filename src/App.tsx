
import React, { useState, useEffect } from 'react';

import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { VoiceHiringManagement } from './components/voice/VoiceHiringManagement';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { BookingManagement } from './components/bookings/BookingManagement';
import { PartnerManagement } from './components/partners/PartnerManagement';
import { CustomerManagement } from './components/customers/CustomerManagement';
import { LiveGpsRadarMap } from './components/radar/LiveGpsRadarMap';
import { ServiceManagement } from './components/services/ServiceManagement';
import { FinancialsManagement } from './components/financials/FinancialsManagement';
import { CouponManagement } from './components/coupons/CouponManagement';
import { SupportManagement } from './components/support/SupportManagement';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { MongoDatabaseView } from './components/database/MongoDatabaseView';
import { AndroidDevPortal } from './components/developer/AndroidDevPortal';
import { BranchAccessManagement } from './components/branches/BranchAccessManagement';
import { AdminLoginScreen } from './components/auth/AdminLoginScreen';

import { AdminUser } from './types';
import { api } from './services/api';

export default function App() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [activeTab, setActiveTab] = useState<NavTab>('voice-hiring');
  const [voiceBookingCount, setVoiceBookingCount] = useState<number>(0);

  // Verify the existing admin session when the application opens.
  useEffect(() => {
    let isMounted = true;

    api
      .getCurrentAdmin()
      .then((admin) => {
        if (isMounted) {
          setCurrentAdmin(admin);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentAdmin(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Load voice bookings only after successful authentication.
  useEffect(() => {
    if (!currentAdmin) return;

    api
      .getVoiceBookings()
      .then((res) => {
        setVoiceBookingCount(res.bookings.length);
      })
      .catch((err) => console.error('Voice bookings error:', err));
  }, [currentAdmin]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      setCurrentAdmin(null);
    }
  };

  // Show a loading screen while checking the session.
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-300">
            Verifying administrator session...
          </p>
        </div>
      </div>
    );
  }

  // Do not show the dashboard without authentication.
  if (!currentAdmin) {
    return <AdminLoginScreen onLoginSuccess={setCurrentAdmin} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        voiceBookingCount={voiceBookingCount}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentAdmin={currentAdmin}
          onRefreshData={() => {
            api
              .getVoiceBookings()
              .then((res) => setVoiceBookingCount(res.bookings.length))
              .catch(console.error);
          }}
          onOpenVoiceHiring={() => setActiveTab('voice-hiring')}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'voice-hiring' && <VoiceHiringManagement />}

          {activeTab === 'dashboard' && (
            <OverviewDashboard
              onOpenVoiceHiring={() => setActiveTab('voice-hiring')}
            />
          )}

          {activeTab === 'bookings' && <BookingManagement />}
          {activeTab === 'partners' && <PartnerManagement />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'radar' && <LiveGpsRadarMap />}
          {activeTab === 'services' && <ServiceManagement />}
          {activeTab === 'financials' && <FinancialsManagement />}
          {activeTab === 'coupons' && <CouponManagement />}
          {activeTab === 'support' && <SupportManagement />}
          {activeTab === 'audit' && <AuditLogsView />}
          {activeTab === 'database' && <MongoDatabaseView />}
          {activeTab === 'developer' && <AndroidDevPortal />}
          {activeTab === 'branches' && <BranchAccessManagement />}
        </main>
      </div>
    </div>
  );
}