
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Partner from '../models/Partner';

const router = Router();

const DEV_OTP = '123456';
const OTP_TTL_MS = 5 * 60 * 1000;

interface OtpSession {
  otp: string;
  expiresAt: number;
  verified: boolean;
}

// Development-only OTP sessions.
const otpSessions = new Map<string, OtpSession>();

function respondError(
  res: Response,
  status: number,
  error: string,
  errorCode: string
) {
  return res.status(status).json({
    success: false,
    message: error,
    error,
    errorCode,
  });
}

function isValidMobile(mobile: string): boolean {
  return /^\+?[0-9]{10,15}$/.test(mobile);
}

// ============================================
// POST /api/v1/partners/otp/send
// Development OTP
// ============================================

router.post(
  '/v1/partners/otp/send',
  (req: Request, res: Response) => {
    const mobileNumber = String(
      req.body?.mobileNumber ?? ''
    ).trim();

    if (!isValidMobile(mobileNumber)) {
      return respondError(
        res,
        400,
        'Enter a valid mobile number.',
        'INVALID_MOBILE'
      );
    }

    if (process.env.NODE_ENV === 'production') {
      return respondError(
        res,
        503,
        'SMS OTP provider is not configured.',
        'OTP_PROVIDER_UNAVAILABLE'
      );
    }

    const expiresAt = Date.now() + OTP_TTL_MS;

    otpSessions.set(mobileNumber, {
      otp: DEV_OTP,
      expiresAt,
      verified: false,
    });

    return res.json({
      success: true,
      message: 'Development OTP created. Use 123456.',
      data: {
        message: 'Development OTP created. Use 123456.',
        expiresAt,
      },
    });
  }
);

// ============================================
// POST /api/v1/partners/otp/verify
// ============================================

router.post(
  '/v1/partners/otp/verify',
  (req: Request, res: Response) => {
    const mobileNumber = String(
      req.body?.mobileNumber ?? ''
    ).trim();

    const otp = String(req.body?.otp ?? '').trim();

    const session = otpSessions.get(mobileNumber);

    if (
      !session ||
      session.expiresAt < Date.now() ||
      session.otp !== otp
    ) {
      return respondError(
        res,
        400,
        'OTP is invalid or expired.',
        'INVALID_OTP'
      );
    }

    session.verified = true;

    return res.json({
      success: true,
      message: 'OTP verified successfully.',
      data: true,
    });
  }
);

// ============================================
// POST /api/v1/partners/register
// Register partner and save to MongoDB
// ============================================

router.post(
  '/v1/partners/register',
  async (req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return respondError(
          res,
          503,
          'Database is not connected.',
          'DATABASE_UNAVAILABLE'
        );
      }

      const {
        legalName,
        mobileNumber,
        email,
        dob,
        address,
        serviceArea,
        emergencyContact,
        categoryIds,
        aadhaarMasked,
        aadhaarName,
        panMasked,
        panName,
        livePhotoRef,
      } = req.body ?? {};

      // Validate required fields.
      if (
        typeof legalName !== 'string' ||
        typeof mobileNumber !== 'string' ||
        typeof address !== 'string' ||
        typeof serviceArea !== 'string' ||
        typeof aadhaarMasked !== 'string' ||
        typeof aadhaarName !== 'string' ||
        typeof panMasked !== 'string' ||
        typeof panName !== 'string'
      ) {
        return respondError(
          res,
          400,
          'Please provide all required registration details.',
          'MISSING_FIELDS'
        );
      }

      const cleanName = legalName.trim();
      const cleanMobile = mobileNumber.trim();
      const cleanAddress = address.trim();
      const cleanServiceArea = serviceArea.trim();
      const cleanAadhaarName = aadhaarName.trim();
      const cleanPanName = panName.trim();
      const cleanAadhaarMasked = aadhaarMasked.trim();
      const cleanPanMasked = panMasked.trim();

      if (
        !cleanName ||
        !cleanAddress ||
        !cleanServiceArea ||
        !cleanAadhaarName ||
        !cleanPanName
      ) {
        return respondError(
          res,
          400,
          'Required fields cannot be empty.',
          'INVALID_FIELDS'
        );
      }

      if (!isValidMobile(cleanMobile)) {
        return respondError(
          res,
          400,
          'Enter a valid mobile number.',
          'INVALID_MOBILE'
        );
      }

      // Require verified OTP.
      const otpSession = otpSessions.get(cleanMobile);

      if (
        !otpSession ||
        !otpSession.verified ||
        otpSession.expiresAt < Date.now()
      ) {
        return respondError(
          res,
          403,
          'Please verify your mobile number with OTP before registration.',
          'OTP_NOT_VERIFIED'
        );
      }

      // Accept masked identity values only.
      if (
        !/^[Xx*0-9 ]{4,20}$/.test(cleanAadhaarMasked) ||
        !/^[Xx*0-9 ]{4,20}$/.test(cleanPanMasked)
      ) {
        return respondError(
          res,
          400,
          'Provide masked Aadhaar and PAN details only.',
          'INVALID_MASKED_DOCUMENT'
        );
      }

      if (
        !Array.isArray(categoryIds) ||
        !categoryIds.every(
          (id: unknown) =>
            typeof id === 'string' && id.trim().length > 0
        )
      ) {
        return respondError(
          res,
          400,
          'categoryIds must be an array of valid strings.',
          'INVALID_CATEGORIES'
        );
      }

      const cleanEmail =
        typeof email === 'string' && email.trim()
          ? email.trim().toLowerCase()
          : undefined;

      if (
        cleanEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
      ) {
        return respondError(
          res,
          400,
          'Enter a valid email address.',
          'INVALID_EMAIL'
        );
      }

      // Prevent duplicate mobile registration.
      const existingPartner = await Partner.findOne({
        mobileNumber: cleanMobile,
      }).lean();

      if (existingPartner) {
        return respondError(
          res,
          409,
          'A partner account already exists with this mobile number.',
          'PARTNER_ALREADY_EXISTS'
        );
      }

      const partnerId =
        'HH-' +
        new mongoose.Types.ObjectId()
          .toString()
          .slice(-8)
          .toUpperCase();

      // Save partner in MongoDB.
      const partner = await Partner.create({
        partnerId,
        legalName: cleanName,
        mobileNumber: cleanMobile,
        email: cleanEmail,
        dob:
          typeof dob === 'string'
            ? dob.trim()
            : undefined,
        address: cleanAddress,
        serviceArea: cleanServiceArea,
        emergencyContact:
          typeof emergencyContact === 'string'
            ? emergencyContact.trim()
            : undefined,
        categoryIds: categoryIds.map(
          (id: string) => id.trim()
        ),
        aadhaarMasked: cleanAadhaarMasked,
        aadhaarName: cleanAadhaarName,
        panMasked: cleanPanMasked,
        panName: cleanPanName,
        livePhotoRef:
          typeof livePhotoRef === 'string'
            ? livePhotoRef.trim()
            : undefined,

        status: 'PENDING',
        aadhaarStatus: 'PENDING',
        panStatus: 'PENDING',
        photoStatus: 'PENDING',
        isOnline: false,
      });

      // OTP cannot be reused for another registration.
      otpSessions.delete(cleanMobile);

      console.log(
        `New partner registered: ${partner.partnerId}`
      );

      return res.status(201).json({
        success: true,
        message:
          'Partner registered successfully. Awaiting admin verification.',
        data: {
          partnerId: partner.partnerId,
          legalName: partner.legalName,
          mobileNumber: partner.mobileNumber,
          status: partner.status,
          aadhaarStatus: partner.aadhaarStatus,
          panStatus: partner.panStatus,
          photoStatus: partner.photoStatus,
          createdAt: partner.createdAt,
        },
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        return respondError(
          res,
          409,
          'A partner with these details already exists.',
          'DUPLICATE_PARTNER'
        );
      }

      console.error('Partner registration error:', error);

      return respondError(
        res,
        500,
        'Unable to register partner.',
        'SERVER_ERROR'
      );
    }
  }
);

// ============================================
// GET /api/v1/categories
// ============================================

router.get(
  '/v1/categories',
  (_req: Request, res: Response) => {
    return res.json({
      success: true,
      data: [
        {
          id: 'CAT-1',
          name: 'Hire a Partner (Hourly)',
          baseRate: 150,
          rateUnit: 'hour',
          description:
            'Hire a multi-skilled partner by the hour',
          iconKey: 'helper',
        },
      ],
    });
  }
);

// ============================================
// GET /api/v1/partners/verification-status
// ============================================

router.get(
  '/v1/partners/verification-status',
  async (req: Request, res: Response) => {
    try {
      const partnerId = String(
        req.query.partnerId ?? ''
      ).trim();

      if (!partnerId) {
        return respondError(
          res,
          400,
          'partnerId is required.',
          'MISSING_PARTNER_ID'
        );
      }

      const partner = await Partner.findOne({
        partnerId,
      }).lean();

      if (!partner) {
        return respondError(
          res,
          404,
          'Partner not found.',
          'PARTNER_NOT_FOUND'
        );
      }

      return res.json({
        success: true,
        data: {
          partnerId: partner.partnerId,
          status: partner.status,
          aadhaarStatus: partner.aadhaarStatus,
          panStatus: partner.panStatus,
          photoStatus: partner.photoStatus,
          rejectionReason: null,
          actionRequiredMessage: null,
          reviewedAt: null,
        },
      });
    } catch (error) {
      console.error(
        'Partner verification status error:',
        error
      );

      return respondError(
        res,
        500,
        'Unable to get verification status.',
        'SERVER_ERROR'
      );
    }
  }
);

export default router;
