export type BookingStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type PartnerStatus = 'active' | 'offline' | 'busy' | 'pending_verification' | 'suspended';
export type AdminRole = 'super_admin' | 'operations_manager' | 'support_lead' | 'branch_manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  branch: string;
  lastLogin: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    pincode: string;
    landmark?: string;
    coordinates?: { lat: number; lng: number };
  };
  totalBookings: number;
  totalSpent: number;
  joinedDate: string;
  status: 'active' | 'blocked';
}

export interface Partner {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  services: string[];
  skills: string[];
  rating: number;
  completedJobs: number;
  status: PartnerStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
    lastUpdated: string;
  };
  hourlyRate?: number;
  kycVerified: boolean;
  joinedDate: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  partnerId?: string;
  partnerName?: string;
  serviceCategory: string;
  serviceName: string;
  status: BookingStatus;
  scheduledTime: string;
  createdAt: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
}

export interface VoiceBooking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  assignedPartnerId?: string;
  assignedPartnerName?: string;
  assignedPartnerPhone?: string;
  assignedPartnerRating?: number;
  workDescription: string;
  serviceTypeSuggestion?: string;
  audioStorageKey: string;
  audioDurationSeconds: number;
  audioFileFormat: string;
  transcription: string;
  transcriptionLanguage: string;
  hourlyRate: number; // In INR agreed at booking creation time
  requestedHours?: number;
  estimatedTotal?: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  priority: 'normal' | 'urgent';
  adminNotes?: string;
}

export interface HirePartnerPricingConfig {
  hourlyRate: number; // In INR
  currency: 'INR';
  minHours: number;
  updatedAt: string;
  updatedBy: string;
  updatedByEmail: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  adminId: string;
  adminName: string;
  targetType: 'voice_booking' | 'pricing' | 'partner' | 'booking' | 'system' | 'auth';
  targetId?: string;
  details: string;
  ipAddress: string;
  userAgent?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  basePrice: number;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minBookingValue: number;
  maxDiscount?: number;
  validUntil: string;
  usageCount: number;
  active: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId?: string;
  partnerId?: string;
  raisedBy: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastReply: string;
}
