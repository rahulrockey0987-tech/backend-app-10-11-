
import {
  AdminUser,
  VoiceBooking,
  HirePartnerPricingConfig,
  AuditLog,
  Partner,
  Customer,
  Booking,
  ServiceCategory,
  Coupon,
  SupportTicket,
} from '../types';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const requestOptions = {
  credentials: 'include' as RequestCredentials,
  headers: defaultHeaders,
};

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || `Request failed: ${res.status}`
    );
  }

  return data as T;
}

export const api = {

  // ADMIN AUTHENTICATION

  async getCurrentAdmin(): Promise<AdminUser> {
    const res = await fetch('/api/admin/auth/me', requestOptions);
    const data = await handleResponse<{ admin: AdminUser }>(res);
    return data.admin;
  },

  async logout(): Promise<void> {
    const res = await fetch('/api/admin/auth/logout', {
      ...requestOptions,
      method: 'POST',
    });
    await handleResponse(res);
  },

  // VOICE BOOKINGS

  async getVoiceBookings(filters?: {
    status?: string;
    search?: string;
  }): Promise<{
    bookings: VoiceBooking[];
    currentHourlyRate: number;
    currency: string;
  }> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(
      `/api/voice-bookings?${params.toString()}`,
      requestOptions
    );

    return handleResponse(res);
  },

  async getVoiceBooking(id: string): Promise<VoiceBooking> {
    const res = await fetch(
      `/api/voice-bookings/${encodeURIComponent(id)}`,
      requestOptions
    );

    const data = await handleResponse<{ booking: VoiceBooking }>(res);
    return data.booking;
  },

  getVoiceBookingAudioUrl(id: string): string {
    return `/api/voice-bookings/${encodeURIComponent(id)}/audio`;
  },

  async assignPartnerToVoiceBooking(
    bookingId: string,
    partnerId: string
  ): Promise<VoiceBooking> {
    const res = await fetch(
      `/api/voice-bookings/${encodeURIComponent(bookingId)}/assign`,
      {
        ...requestOptions,
        method: 'POST',
        body: JSON.stringify({ partnerId }),
      }
    );

    const data = await handleResponse<{ booking: VoiceBooking }>(res);
    return data.booking;
  },

  async updateVoiceBookingStatus(
    bookingId: string,
    status: string
  ): Promise<VoiceBooking> {
    const res = await fetch(
      `/api/voice-bookings/${encodeURIComponent(bookingId)}/status`,
      {
        ...requestOptions,
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );

    const data = await handleResponse<{ booking: VoiceBooking }>(res);
    return data.booking;
  },

  // PARTNER PRICING

  async getHirePartnerPricing(): Promise<HirePartnerPricingConfig> {
    const res = await fetch(
      '/api/settings/hire-partner-pricing',
      requestOptions
    );

    const data = await handleResponse<{
      pricing: HirePartnerPricingConfig;
    }>(res);

    return data.pricing;
  },

  async updateHirePartnerHourlyRate(
    hourlyRate: number
  ): Promise<HirePartnerPricingConfig> {
    const res = await fetch(
      '/api/settings/hire-partner-pricing',
      {
        ...requestOptions,
        method: 'PUT',
        body: JSON.stringify({ hourlyRate }),
      }
    );

    const data = await handleResponse<{
      pricing: HirePartnerPricingConfig;
    }>(res);

    return data.pricing;
  },

  // AUDIT LOGS

  async getAuditLogs(filter?: string): Promise<AuditLog[]> {
    const url = filter
      ? `/api/admin/audit-logs?action=${encodeURIComponent(filter)}`
      : '/api/admin/audit-logs';

    const res = await fetch(url, requestOptions);
    const data = await handleResponse<{ auditLogs: AuditLog[] }>(res);

    return data.auditLogs;
  },

  // OVERVIEW

  async getOverviewStats(): Promise<any> {
    const res = await fetch(
      '/api/admin/overview-stats',
      requestOptions
    );

    const data = await handleResponse<{ stats: any }>(res);
    return data.stats;
  },

  // PARTNER MANAGEMENT

  async getPartners(): Promise<Partner[]> {
    try {
      const res = await fetch(
        '/api/admin/partners',
        requestOptions
      );

      const data = await handleResponse<{
        success: boolean;
        partners: Partner[];
        pagination?: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(res);

      if (!Array.isArray(data.partners)) {
        throw new Error('Invalid partner API response');
      }

      console.log('HOMEHELP PARTNER API:', {
        success: data.success,
        total: data.pagination?.total,
        received: data.partners.length,
        partners: data.partners,
      });

      return data.partners;

    } catch (error) {
      console.error('HOMEHELP PARTNER FETCH ERROR:', error);
      throw error;
    }
  },

  // CUSTOMERS

  async getCustomers(): Promise<Customer[]> {
    const res = await fetch(
      '/api/admin/customers',
      requestOptions
    );

    const data = await handleResponse<{ customers: Customer[] }>(res);
    return data.customers;
  },

  // BOOKINGS

  async getBookings(): Promise<Booking[]> {
    const res = await fetch('/api/bookings', requestOptions);
    const data = await handleResponse<{ bookings: Booking[] }>(res);
    return data.bookings;
  },

  // CATEGORIES

  async getCategories(): Promise<ServiceCategory[]> {
    const res = await fetch(
      '/api/admin/categories',
      requestOptions
    );

    const data = await handleResponse<{
      categories: ServiceCategory[];
    }>(res);

    return data.categories;
  },

  // COUPONS

  async getCoupons(): Promise<Coupon[]> {
    const res = await fetch(
      '/api/admin/coupons',
      requestOptions
    );

    const data = await handleResponse<{ coupons: Coupon[] }>(res);
    return data.coupons;
  },

  // SUPPORT TICKETS

  async getSupportTickets(): Promise<SupportTicket[]> {
    const res = await fetch(
      '/api/admin/support-tickets',
      requestOptions
    );

    const data = await handleResponse<{
      tickets: SupportTicket[];
    }>(res);

    return data.tickets;
  },
};
