
export type BookingStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PartnerStatus =
  | 'active'
  | 'offline'
  | 'busy'
  | 'pending_verification'
  | 'suspended';

export type KycStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED';

export type PartnerApplicationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

// ADMIN

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role:
    | 'super_admin'
    | 'operations_manager'
    | 'support_lead'
    | 'branch_manager';
  branch: string;
  token?: string;
}

// CUSTOMER

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
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  totalBookings: number;
  totalSpent: number;
  joinedDate: string;
  status: 'active' | 'blocked';
}

// EXISTING PARTNER

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

// PARTNER KYC APPLICATION

export interface PartnerKycApplication {
  _id: string;
  partnerId: string;
  legalName: string;
  mobileNumber: string;
  email?: string;
  dob?: string;
  address: string;
  serviceArea: string;
  emergencyContact?: string;
  categoryIds: string[];
  aadhaarMasked: string;
  aadhaarName: string;
  panMasked: string;
  panName: string;
  livePhotoRef?: string;
  status: PartnerApplicationStatus;
  aadhaarStatus: KycStatus;
  panStatus: KycStatus;
  photoStatus: KycStatus;
  isOnline?: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

// BOOKING

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

// VOICE BOOKING

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
  hourlyRate: number;
  requestedHours?: number;
  estimatedTotal?: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  priority: 'normal' | 'urgent';
  adminNotes?: string;
}

// PARTNER PRICING

export interface HirePartnerPricingConfig {
  hourlyRate: number;
  currency: 'INR';
  minHours: number;
  updatedAt: string;
  updatedBy: string;
  updatedByEmail: string;
}

// AUDIT LOG

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  adminId: string;
  adminName: string;
  targetType: string;
  targetId?: string;
  details: string;
  ipAddress: string;
  userAgent?: string;
}

// SERVICE CATEGORY

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  basePrice: number;
  active: boolean;
}

// COUPON

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

// SUPPORT TICKET

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
