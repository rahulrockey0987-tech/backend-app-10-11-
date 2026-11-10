import {
  Booking,
  Customer,
  Partner,
  VoiceBooking,
  HirePartnerPricingConfig,
  AuditLog,
  ServiceCategory,
  Coupon,
  SupportTicket,
} from './schema';
import { generateVoiceAudioWav } from '../audio/audioGenerator';

class DatabaseStore {
  public hirePartnerPricing: HirePartnerPricingConfig = {
    hourlyRate: 299, // Current default INR rate for Hire a Partner
    currency: 'INR',
    minHours: 1,
    updatedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    updatedBy: 'Admin (System)',
    updatedByEmail: 'admin@homehelp.in',
  };

  public audioStorage: Map<string, Buffer> = new Map();
  public voiceBookings: VoiceBooking[] = [];
  public partners: Partner[] = [];
  public customers: Customer[] = [];
  public standardBookings: Booking[] = [];
  public auditLogs: AuditLog[] = [];
  public categories: ServiceCategory[] = [];
  public coupons: Coupon[] = [];
  public supportTickets: SupportTicket[] = [];

  constructor() {
  // Demo data initialization disabled.
}
  private seedInitialData() {
    // Seed Partners
    this.partners = [
      {
        id: 'PRT-1001',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        email: 'rajesh.kumar@homehelp.in',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        services: ['Electrical', 'Appliance Repair', 'Hire a Partner (All-rounder)'],
        skills: ['Wiring', 'Switchboard', 'Inverter Installation', 'Fan Repair'],
        rating: 4.85,
        completedJobs: 142,
        status: 'active',
        location: {
          lat: 12.9716,
          lng: 77.5946,
          address: 'Indiranagar 100ft Rd, Bengaluru',
          lastUpdated: new Date().toISOString(),
        },
        hourlyRate: 299,
        kycVerified: true,
        joinedDate: '2025-03-12',
      },
      {
        id: 'PRT-1002',
        name: 'Mohammed Tariq',
        phone: '+91 98112 34567',
        email: 'tariq.m@homehelp.in',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        services: ['Plumbing', 'Drain Cleaning', 'Hire a Partner (All-rounder)'],
        skills: ['Pipe Fitting', 'Bathroom Leakage', 'Water Purifier Line', 'Motor Pump'],
        rating: 4.92,
        completedJobs: 218,
        status: 'busy',
        location: {
          lat: 12.9352,
          lng: 77.6245,
          address: 'Koramangala 5th Block, Bengaluru',
          lastUpdated: new Date().toISOString(),
        },
        hourlyRate: 299,
        kycVerified: true,
        joinedDate: '2024-11-20',
      },
      {
        id: 'PRT-1003',
        name: 'Suresh Babu',
        phone: '+91 97401 22889',
        email: 'suresh.babu@homehelp.in',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        services: ['Carpentry', 'Furniture Assembly', 'Hire a Partner (All-rounder)'],
        skills: ['Door Locks', 'Cabinet Repair', 'Drilling & Wall Hanging', 'Bed Frame'],
        rating: 4.78,
        completedJobs: 98,
        status: 'active',
        location: {
          lat: 12.9279,
          lng: 77.6271,
          address: 'HSR Layout Sector 2, Bengaluru',
          lastUpdated: new Date().toISOString(),
        },
        hourlyRate: 299,
        kycVerified: true,
        joinedDate: '2025-01-15',
      },
      {
        id: 'PRT-1004',
        name: 'Anand Verma',
        phone: '+91 98223 90112',
        email: 'anand.v@homehelp.in',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
        services: ['Painting', 'Deep Cleaning', 'Hire a Partner (All-rounder)'],
        skills: ['Wall Touchups', 'Waterproofing Inspection', 'Deep Scrubbing'],
        rating: 4.65,
        completedJobs: 73,
        status: 'active',
        location: {
          lat: 12.9915,
          lng: 77.5925,
          address: 'Malleshwaram 8th Cross, Bengaluru',
          lastUpdated: new Date().toISOString(),
        },
        hourlyRate: 299,
        kycVerified: true,
        joinedDate: '2025-04-02',
      },
    ];

    // Seed Customers
    this.customers = [
      {
        id: 'CUST-801',
        name: 'Pooja Hegde',
        phone: '+91 98450 11223',
        email: 'pooja.h@gmail.com',
        address: {
          line1: 'Flat 402, Oakwood Greens',
          line2: '12th Main Road, HAL 2nd Stage',
          city: 'Bengaluru',
          pincode: '560008',
          landmark: 'Opposite Coffee Day',
          coordinates: { lat: 12.9642, lng: 77.6432 },
        },
        totalBookings: 8,
        totalSpent: 4250,
        joinedDate: '2024-08-10',
        status: 'active',
      },
      {
        id: 'CUST-802',
        name: 'Vikram Malhotra',
        phone: '+91 99001 88776',
        email: 'vikram.m@outlook.com',
        address: {
          line1: 'Villa 14, Palm Meadows',
          line2: 'Varthur Main Road',
          city: 'Bengaluru',
          pincode: '560066',
          landmark: 'Near Forum Value Mall',
          coordinates: { lat: 12.9589, lng: 77.7491 },
        },
        totalBookings: 14,
        totalSpent: 11200,
        joinedDate: '2024-02-18',
        status: 'active',
      },
      {
        id: 'CUST-803',
        name: 'Sunita Raman',
        phone: '+91 98862 33445',
        email: 'sunita.raman@gmail.com',
        address: {
          line1: '#58, 4th Cross, RMV 2nd Stage',
          city: 'Bengaluru',
          pincode: '560094',
          landmark: 'Near Dollars Colony Park',
          coordinates: { lat: 13.0358, lng: 77.5746 },
        },
        totalBookings: 5,
        totalSpent: 2890,
        joinedDate: '2025-01-09',
        status: 'active',
      },
      {
        id: 'CUST-804',
        name: 'Arjun Das',
        phone: '+91 97312 90871',
        email: 'arjun.das@technocorp.in',
        address: {
          line1: 'B-201, Sobha Dream Acres',
          line2: 'Panathur Main Road',
          city: 'Bengaluru',
          pincode: '560087',
          landmark: 'Near Balagere Lake',
          coordinates: { lat: 12.9341, lng: 77.7214 },
        },
        totalBookings: 3,
        totalSpent: 1850,
        joinedDate: '2025-02-28',
        status: 'active',
      },
    ];

    // Seed Voice Bookings and their actual audio WAV buffers
    const voice1Key = 'voice_audio_vb_101.wav';
    const voice2Key = 'voice_audio_vb_102.wav';
    const voice3Key = 'voice_audio_vb_103.wav';
    const voice4Key = 'voice_audio_vb_104.wav';
    const voice5Key = 'voice_audio_vb_105.wav';

    // Generate real PCM WAV audio buffers (18s, 24s, 31s, 15s, 22s)
    this.audioStorage.set(voice1Key, generateVoiceAudioWav(18, 195));
    this.audioStorage.set(voice2Key, generateVoiceAudioWav(24, 160));
    this.audioStorage.set(voice3Key, generateVoiceAudioWav(31, 210));
    this.audioStorage.set(voice4Key, generateVoiceAudioWav(15, 175));
    this.audioStorage.set(voice5Key, generateVoiceAudioWav(22, 185));

    this.voiceBookings = [
      {
        id: 'VB-901',
        bookingNumber: 'HH-V-2026-901',
        customerId: 'CUST-801',
        customerName: 'Pooja Hegde',
        customerPhone: '+91 98450 11223',
        customerAddress: 'Flat 402, Oakwood Greens, HAL 2nd Stage, Bengaluru - 560008',
        assignedPartnerId: 'PRT-1002',
        assignedPartnerName: 'Mohammed Tariq',
        assignedPartnerPhone: '+91 98112 34567',
        assignedPartnerRating: 4.92,
        workDescription: 'Urgent kitchen sink drain leakage under the cabinet and slow drainage in the master bathroom washbasin.',
        serviceTypeSuggestion: 'Plumbing & Drainage',
        audioStorageKey: voice1Key,
        audioDurationSeconds: 18,
        audioFileFormat: 'audio/wav',
        transcription: 'Hello, the kitchen sink drain pipe has come loose beneath the quartz counter and is leaking onto the cabinet floor. Also the master bathroom washbasin is draining very slowly. Please send someone with replacement gaskets today.',
        transcriptionLanguage: 'en-IN (English / Hinglish)',
        hourlyRate: 299, // Agreed rate when booked
        requestedHours: 2,
        estimatedTotal: 598,
        status: 'in_progress',
        createdAt: new Date(Date.now() - 3600 * 1000 * 2.5).toISOString(),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 1.2).toISOString(),
        priority: 'urgent',
        adminNotes: 'Customer requested partner to wear shoe covers inside the apartment.',
      },
      {
        id: 'VB-902',
        bookingNumber: 'HH-V-2026-902',
        customerId: 'CUST-802',
        customerName: 'Vikram Malhotra',
        customerPhone: '+91 99001 88776',
        customerAddress: 'Villa 14, Palm Meadows, Varthur Main Road, Bengaluru - 560066',
        assignedPartnerId: 'PRT-1001',
        assignedPartnerName: 'Rajesh Kumar',
        assignedPartnerPhone: '+91 98765 43210',
        assignedPartnerRating: 4.85,
        workDescription: 'Electrical main switch tripping intermittently when inverter cuts in, plus mounting 2 heavy curtain rods in master bedroom.',
        serviceTypeSuggestion: 'Electrical & General Handyman',
        audioStorageKey: voice2Key,
        audioDurationSeconds: 24,
        audioFileFormat: 'audio/wav',
        transcription: 'Hi, I need an experienced partner for about 3 hours. Our MCB switch keeps tripping whenever the power backup kicks in. Also I have two custom brass curtain rods that need heavy-duty wall anchor drilling in the bedroom.',
        transcriptionLanguage: 'en-IN (English)',
        hourlyRate: 299,
        requestedHours: 3,
        estimatedTotal: 897,
        status: 'assigned',
        createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 3.8).toISOString(),
        priority: 'normal',
        adminNotes: 'Scheduled for partner arrival at 3:30 PM.',
      },
      {
        id: 'VB-903',
        bookingNumber: 'HH-V-2026-903',
        customerId: 'CUST-803',
        customerName: 'Sunita Raman',
        customerPhone: '+91 98862 33445',
        customerAddress: '#58, 4th Cross, RMV 2nd Stage, Bengaluru - 560094',
        assignedPartnerId: undefined,
        assignedPartnerName: undefined,
        assignedPartnerPhone: undefined,
        workDescription: 'Assembling newly delivered IKEA 3-door wardrobe and aligning sliding tracks and drawer rollers.',
        serviceTypeSuggestion: 'Carpentry & Furniture Assembly',
        audioStorageKey: voice3Key,
        audioDurationSeconds: 31,
        audioFileFormat: 'audio/wav',
        transcription: 'Namaste. We have received an IKEA wardrobe package yesterday. The instruction manual is complicated and we need someone who has proper cordless screwdrivers and Allen keys to assemble it properly without damaging the veneer.',
        transcriptionLanguage: 'en-IN / hi-IN',
        hourlyRate: 299,
        requestedHours: 3,
        estimatedTotal: 897,
        status: 'pending',
        createdAt: new Date(Date.now() - 3600 * 1000 * 1.1).toISOString(),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 1.1).toISOString(),
        priority: 'normal',
      },
      {
        id: 'VB-904',
        bookingNumber: 'HH-V-2026-904',
        customerId: 'CUST-804',
        customerName: 'Arjun Das',
        customerPhone: '+91 97312 90871',
        customerAddress: 'B-201, Sobha Dream Acres, Panathur, Bengaluru - 560087',
        assignedPartnerId: 'PRT-1003',
        assignedPartnerName: 'Suresh Babu',
        assignedPartnerPhone: '+91 97401 22889',
        assignedPartnerRating: 4.78,
        workDescription: 'Door lock replacement on balcony safety grill and fixing squeaky study table drawer joints.',
        serviceTypeSuggestion: 'Carpentry & Locksmith',
        audioStorageKey: voice4Key,
        audioDurationSeconds: 15,
        audioFileFormat: 'audio/wav',
        transcription: 'Hey team, the key broke inside our balcony grill lock. I have already purchased a Godrej replacement lock from the hardware store. Need someone to drill out the old lock and fit the new one.',
        transcriptionLanguage: 'en-IN (English)',
        hourlyRate: 299,
        requestedHours: 1.5,
        estimatedTotal: 448.5,
        status: 'completed',
        createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString(),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 22).toISOString(),
        priority: 'normal',
      },
      {
        id: 'VB-905',
        bookingNumber: 'HH-V-2026-905',
        customerId: 'CUST-801',
        customerName: 'Pooja Hegde',
        customerPhone: '+91 98450 11223',
        customerAddress: 'Flat 402, Oakwood Greens, HAL 2nd Stage, Bengaluru - 560008',
        assignedPartnerId: undefined,
        workDescription: 'Full balcony deep scrub and external sliding window pane cleaning before festival visit.',
        serviceTypeSuggestion: 'Deep Cleaning',
        audioStorageKey: voice5Key,
        audioDurationSeconds: 22,
        audioFileFormat: 'audio/wav',
        transcription: 'Hello, our balcony tiles have accumulated stubborn hard water marks and pigeon dirt. Need a partner with high pressure scrub brush and floor cleaner solutions to wash it down thoroughly.',
        transcriptionLanguage: 'en-IN (English)',
        hourlyRate: 299,
        requestedHours: 2,
        estimatedTotal: 598,
        status: 'pending',
        createdAt: new Date(Date.now() - 3600 * 1000 * 0.4).toISOString(),
        updatedAt: new Date(Date.now() - 3600 * 1000 * 0.4).toISOString(),
        priority: 'urgent',
      },
    ];

    // Seed Standard Bookings
    this.standardBookings = [
      {
        id: 'BK-501',
        bookingNumber: 'HH-B-2026-501',
        customerId: 'CUST-801',
        customerName: 'Pooja Hegde',
        customerPhone: '+91 98450 11223',
        customerAddress: 'Flat 402, Oakwood Greens, HAL 2nd Stage, Bengaluru',
        partnerId: 'PRT-1001',
        partnerName: 'Rajesh Kumar',
        serviceCategory: 'Appliance Repair',
        serviceName: 'Split AC Deep Foam Jet Servicing',
        status: 'completed',
        scheduledTime: '2026-10-09 11:00 AM',
        createdAt: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
        amount: 899,
        paymentStatus: 'paid',
      },
      {
        id: 'BK-502',
        bookingNumber: 'HH-B-2026-502',
        customerId: 'CUST-802',
        customerName: 'Vikram Malhotra',
        customerPhone: '+91 99001 88776',
        customerAddress: 'Villa 14, Palm Meadows, Varthur Main Road',
        partnerId: 'PRT-1002',
        partnerName: 'Mohammed Tariq',
        serviceCategory: 'Plumbing',
        serviceName: 'Overhead Water Tank Cleaning & Sanitization',
        status: 'in_progress',
        scheduledTime: '2026-10-10 02:00 PM',
        createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
        amount: 1499,
        paymentStatus: 'paid',
      },
    ];

    // Seed Audit Logs
    this.auditLogs = [
      {
        id: 'AUD-301',
        timestamp: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
        action: 'AUDIT_ADMIN_LOGIN',
        adminId: 'ADM-01',
        adminName: 'Keerthi Almati (Super Admin)',
        targetType: 'auth',
        targetId: 'ADM-01',
        details: 'Admin logged into HomeHelp Operations Portal from office subnet.',
        ipAddress: '103.212.144.18',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      {
        id: 'AUD-302',
        timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        action: 'AUDIT_VOICE_AUDIO_ACCESSED',
        adminId: 'ADM-01',
        adminName: 'Keerthi Almati (Super Admin)',
        targetType: 'voice_booking',
        targetId: 'VB-901',
        details: 'Admin verified and played customer voice recording for work scope clarity.',
        ipAddress: '103.212.144.18',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    ];

    // Seed Categories
    this.categories = [
      {
        id: 'CAT-1',
        name: 'Hire a Partner (Hourly)',
        icon: 'Mic',
        description: 'Instant multi-skilled partner hired by the hour via audio note or description',
        basePrice: 299,
        active: true,
      },
      {
        id: 'CAT-2',
        name: 'Plumbing & Water Systems',
        icon: 'Wrench',
        description: 'Pipes, faucets, water heaters, leakage inspection and motor pumps',
        basePrice: 199,
        active: true,
      },
      {
        id: 'CAT-3',
        name: 'Electrical & Lighting',
        icon: 'Zap',
        description: 'Wiring, MCBs, fixtures, appliances and inverter setups',
        basePrice: 199,
        active: true,
      },
      {
        id: 'CAT-4',
        name: 'Carpentry & Woodwork',
        icon: 'Hammer',
        description: 'Locks, hinges, custom drilling, wardrobe repair and IKEA assembly',
        basePrice: 249,
        active: true,
      },
      {
        id: 'CAT-5',
        name: 'Deep Cleaning & Sanitization',
        icon: 'Sparkles',
        description: 'Balconies, kitchens, bathrooms, sofas and water tanks',
        basePrice: 499,
        active: true,
      },
    ];

    // Seed Coupons
    this.coupons = [
      {
        id: 'CPN-1',
        code: 'WELCOME50',
        discountType: 'percentage',
        discountValue: 15,
        minBookingValue: 400,
        maxDiscount: 150,
        validUntil: '2026-12-31',
        usageCount: 412,
        active: true,
      },
      {
        id: 'CPN-2',
        code: 'VOICE100',
        discountType: 'flat',
        discountValue: 100,
        minBookingValue: 500,
        validUntil: '2026-11-30',
        usageCount: 189,
        active: true,
      },
    ];

    // Seed Support Tickets
    this.supportTickets = [
      {
        id: 'TCK-201',
        ticketNumber: 'HH-T-7891',
        customerId: 'CUST-802',
        raisedBy: 'Vikram Malhotra',
        subject: 'Need invoice with GST for my villa maintenance',
        category: 'Billing',
        status: 'open',
        priority: 'medium',
        createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
        lastReply: 'Support lead reviewing tax invoice template.',
      },
      {
        id: 'TCK-202',
        ticketNumber: 'HH-T-7892',
        partnerId: 'PRT-1002',
        raisedBy: 'Mohammed Tariq (Partner)',
        subject: 'Customer extended job by 1.5 hours on-site',
        category: 'Hire a Partner Hours',
        status: 'in_progress',
        priority: 'high',
        createdAt: new Date(Date.now() - 3600 * 1000 * 1.5).toISOString(),
        lastReply: 'Adjusted billing time in system.',
      },
    ];
  }

  // --- Voice Bookings Store Methods ---
  public getVoiceBookings(filters?: { status?: string; search?: string }) {
    let result = [...this.voiceBookings];

    if (filters?.status && filters.status !== 'all') {
      result = result.filter((b) => b.status === filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.bookingNumber.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.customerPhone.toLowerCase().includes(q) ||
          (b.assignedPartnerName && b.assignedPartnerName.toLowerCase().includes(q)) ||
          b.workDescription.toLowerCase().includes(q) ||
          b.transcription.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getVoiceBookingById(id: string) {
    return this.voiceBookings.find((b) => b.id === id || b.bookingNumber === id);
  }

  public getAudioBuffer(storageKey: string): Buffer | undefined {
    return this.audioStorage.get(storageKey);
  }

  public assignPartnerToVoiceBooking(bookingId: string, partnerId: string, adminName = 'Admin') {
    const booking = this.voiceBookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    const partner = this.partners.find((p) => p.id === partnerId);
    if (!partner) return null;

    booking.assignedPartnerId = partner.id;
    booking.assignedPartnerName = partner.name;
    booking.assignedPartnerPhone = partner.phone;
    booking.assignedPartnerRating = partner.rating;
    if (booking.status === 'pending') {
      booking.status = 'assigned';
    }
    booking.updatedAt = new Date().toISOString();

    this.addAuditLog({
      action: 'AUDIT_VOICE_BOOKING_PARTNER_ASSIGNED',
      adminId: 'ADM-CURRENT',
      adminName,
      targetType: 'voice_booking',
      targetId: booking.id,
      details: `Assigned partner ${partner.name} (${partner.id}) to Voice Booking ${booking.bookingNumber}.`,
    });

    return booking;
  }

  public updateVoiceBookingStatus(bookingId: string, status: VoiceBooking['status'], adminName = 'Admin') {
    const booking = this.voiceBookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    const oldStatus = booking.status;
    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    this.addAuditLog({
      action: 'AUDIT_VOICE_BOOKING_STATUS_CHANGED',
      adminId: 'ADM-CURRENT',
      adminName,
      targetType: 'voice_booking',
      targetId: booking.id,
      details: `Updated Voice Booking ${booking.bookingNumber} status from "${oldStatus}" to "${status}".`,
    });

    return booking;
  }

  // --- Pricing Controls ---
  public getHirePartnerPricing(): HirePartnerPricingConfig {
    return { ...this.hirePartnerPricing };
  }

  public updateHirePartnerHourlyRate(newRate: number, updatedBy: string, updatedByEmail: string) {
    const previousRate = this.hirePartnerPricing.hourlyRate;
    this.hirePartnerPricing = {
      ...this.hirePartnerPricing,
      hourlyRate: Math.round(newRate),
      updatedAt: new Date().toISOString(),
      updatedBy,
      updatedByEmail,
    };

    // Log the audit event for pricing modification
    this.addAuditLog({
      action: 'AUDIT_HIRE_PARTNER_PRICE_UPDATED',
      adminId: 'ADM-CURRENT',
      adminName: updatedBy,
      targetType: 'pricing',
      targetId: 'HIRE_A_PARTNER_HOURLY',
      details: `Updated Hire a Partner base hourly rate from ₹${previousRate}/hr to ₹${Math.round(newRate)}/hr INR. Existing bookings retain their original locked rate.`,
    });

    return this.hirePartnerPricing;
  }

  // --- Audit Logs ---
  public addAuditLog(entry: {
    action: string;
    adminId?: string;
    adminName?: string;
    targetType: AuditLog['targetType'];
    targetId?: string;
    details: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const log: AuditLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action: entry.action,
      adminId: entry.adminId || 'ADM-01',
      adminName: entry.adminName || 'Admin Operator',
      targetType: entry.targetType,
      targetId: entry.targetId,
      details: entry.details,
      ipAddress: entry.ipAddress || '127.0.0.1',
      userAgent: entry.userAgent || 'HomeHelp Admin Web Console',
    };
    this.auditLogs.unshift(log);
    // Keep max 500 audit logs
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return log;
  }
}

export const dbStore = new DatabaseStore();
