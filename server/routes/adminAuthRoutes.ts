
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 8 * 60 * 60 * 1000,
};

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_JWT_SECRET must be configured with at least 32 characters.');
  }

  return secret;
}

// ADMIN LOGIN
router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {};

const email =
  typeof body.email === 'string'
    ? body.email.trim().toLowerCase()
    : '';

const password =
  typeof body.password === 'string'
    ? body.password
    : '';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    const admin = await Admin.findOne({ email }).select('+passwordHash');

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      { role: admin.role },
      getJwtSecret(),
      {
        subject: admin.id,
        expiresIn: '8h',
      }
    );

    admin.lastLoginAt = new Date();
    await admin.save();

    res.cookie('admin_session', token, cookieOptions);

    return res.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        branch: admin.branch,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to process admin login.',
    });
  }
});

// CHECK CURRENT ADMIN SESSION
router.get('/me', requireAdmin, (req: Request, res: Response) => {
  return res.json({
    success: true,
    admin: req.admin,
  });
});

// ADMIN LOGOUT
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('admin_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.json({
    success: true,
    message: 'Admin logged out successfully.',
  });
});

export default router;
