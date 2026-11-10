
import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { dbStore } from '../db/store';
import { requireAdmin } from '../middleware/adminAuth';
import Partner from '../models/Partner';

const router = Router();

/**
 * PROTECT ALL ADMIN MANAGEMENT ROUTES
 * All /api/admin/* endpoints require a valid admin session.
 */
router.use('/admin', requireAdmin);

/**
 * GET /api/settings/hire-partner-pricing
 * Public endpoint: customers can view current pricing.
 */
router.get(
  '/settings/hire-partner-pricing',
  (_req: Request, res: Response) => {
    try {
      const config = dbStore.getHirePartnerPricing();

      return res.json({
        success: true,
        pricing: config,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/**
 * PUT /api/settings/hire-partner-pricing
 * Update pricing. Requires admin authentication.
 */
router.put(
  '/settings/hire-partner-pricing',
  requireAdmin,
  (req: Request, res: Response) => {
    try {
      const { hourlyRate } = req.body;

      if (
        typeof hourlyRate !== 'number' ||
        !Number.isFinite(hourlyRate) ||
        hourlyRate <= 0
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Invalid hourly rate. Provide a positive numeric value in INR.',
        });
      }

      if (hourlyRate < 99 || hourlyRate > 5000) {
        return res.status(400).json({
          success: false,
          error: 'Hourly rate must be between ₹99 and ₹5,000 INR per hour.',
        });
      }

      const updatedBy = req.admin!.name;
      const updatedByEmail = req.admin!.email;

      const updatedPricing = dbStore.updateHirePartnerHourlyRate(
        hourlyRate,
        updatedBy,
        updatedByEmail
      );

      return res.json({
        success: true,
        message: `Hire a Partner hourly rate updated to ₹${updatedPricing.hourlyRate}/hr INR.`,
        pricing: updatedPricing,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/**
 * GET /api/admin/audit-logs
 */
router.get(
  '/admin/audit-logs',
  (req: Request, res: Response) => {
    try {
      const filter = req.query.action as string | undefined;
      let logs = dbStore.auditLogs;

      if (filter) {
        logs = logs.filter((log) =>
          log.action.toLowerCase().includes(filter.toLowerCase())
        );
      }

      return res.json({
        success: true,
        count: logs.length,
        auditLogs: logs,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/**
 * GET /api/admin/overview-stats
 */
router.get(
  '/admin/overview-stats',
  (_req: Request, res: Response) => {
    try {
      const totalVoiceBookings = dbStore.voiceBookings.length;

      const pendingVoiceBookings = dbStore.voiceBookings.filter(
        (booking) => booking.status === 'pending'
      ).length;

      const activeVoiceBookings = dbStore.voiceBookings.filter(
        (booking) =>
          booking.status === 'in_progress' ||
          booking.status === 'assigned'
      ).length;

      const completedVoiceBookings = dbStore.voiceBookings.filter(
        (booking) => booking.status === 'completed'
      ).length;

      const totalStandardBookings = dbStore.standardBookings.length;

      const activePartners = dbStore.partners.filter(
        (partner) =>
          partner.status === 'active' || partner.status === 'busy'
      ).length;

      const totalCustomers = dbStore.customers.length;

      const totalRevenue =
        dbStore.standardBookings.reduce(
          (sum, booking) => sum + (booking.amount || 0),
          0
        ) +
        dbStore.voiceBookings.reduce(
          (sum, booking) =>
            sum + (booking.estimatedTotal || booking.hourlyRate * 2),
          0
        );

      return res.json({
        success: true,
        stats: {
          totalRevenue,
          activePartners,
          totalCustomers,
          totalStandardBookings,
          voiceBookings: {
            total: totalVoiceBookings,
            pending: pendingVoiceBookings,
            active: activeVoiceBookings,
            completed: completedVoiceBookings,
            currentRate: dbStore.hirePartnerPricing.hourlyRate,
          },
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/**
 * GET /api/admin/database/stats
 */
router.get(
  '/admin/database/stats',
  async (_req: Request, res: Response) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          success: false,
          error: 'MongoDB is not connected.',
        });
      }

      const database = mongoose.connection.db;

      if (!database) {
        return res.status(503).json({
          success: false,
          error: 'MongoDB database is unavailable.',
        });
      }

      const [databaseStats, collectionList] = await Promise.all([
        database.stats(),
        database.listCollections().toArray(),
      ]);

      const collections = await Promise.all(
        collectionList.map(async (item) => {
          const collection = database.collection(item.name);

          const [stats, indexes] = await Promise.all([
            database.command({
              collStats: item.name,
            }),
            collection.indexes(),
          ]);

          return {
            name: item.name,
            count: stats.count ?? 0,
            sizeBytes: stats.size ?? 0,
            indexes: indexes.map((index) => index.name),
          };
        })
      );

      return res.json({
        success: true,
        stats: {
          connected: true,
          databaseName: database.databaseName,
          storageSizeBytes: databaseStats.storageSize ?? 0,
          collections,
        },
      });
    } catch (error) {
      console.error('MongoDB statistics error:', error);

      return res.status(500).json({
        success: false,
        error:
          'Unable to retrieve MongoDB statistics. Check database permissions.',
      });
    }
  }
);

/**
 * GET /api/admin/partners
 * Retrieve registered partners directly from MongoDB.
 * Admin authentication is applied by router.use('/admin', requireAdmin).
 */
router.get(
  '/admin/partners',
  async (req: Request, res: Response) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(
        50,
        Math.max(1, Number(req.query.limit) || 20)
      );

      const skip = (page - 1) * limit;

      const [partners, total] = await Promise.all([
        Partner.find()
          .select(
            'partnerId legalName mobileNumber email address serviceArea categoryIds status aadhaarMasked aadhaarStatus panMasked panStatus photoStatus isOnline createdAt'
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Partner.countDocuments(),
      ]);

      return res.json({
        success: true,
        partners,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Admin partners retrieval error:', error);

      return res.status(500).json({
        success: false,
        error: 'Unable to retrieve partners from MongoDB.',
      });
    }
  }
);

/**
 * GET /api/admin/customers
 */
router.get(
  '/admin/customers',
  (_req: Request, res: Response) => {
    return res.json({
      success: true,
      customers: dbStore.customers,
    });
  }
);

/**
 * GET /api/admin/categories
 */
router.get(
  '/admin/categories',
  (_req: Request, res: Response) => {
    return res.json({
      success: true,
      categories: dbStore.categories,
    });
  }
);

/**
 * GET /api/admin/coupons
 */
router.get(
  '/admin/coupons',
  (_req: Request, res: Response) => {
    return res.json({
      success: true,
      coupons: dbStore.coupons,
    });
  }
);

/**
 * GET /api/admin/support-tickets
 */
router.get(
  '/admin/support-tickets',
  (_req: Request, res: Response) => {
    return res.json({
      success: true,
      tickets: dbStore.supportTickets,
    });
  }
);

export default router;
