
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Admin, { AdminRole } from '../models/Admin';

export interface AdminSession {
  id: string;
  role: AdminRole;
}

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        name: string;
        email: string;
        role: AdminRole;
        branch: string;
      };
    }
  }
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.admin_session;
    const secret = process.env.ADMIN_JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        success: false,
        error: 'Admin authentication is not configured.',
      });
      return;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (
      typeof decoded.sub !== 'string' ||
      typeof decoded.role !== 'string'
    ) {
      res.status(401).json({
        success: false,
        error: 'Invalid admin session.',
      });
      return;
    }

    const admin = await Admin.findById(decoded.sub).select(
      '+passwordHash'
    );

    if (!admin || !admin.isActive || admin.role !== decoded.role) {
      res.status(401).json({
        success: false,
        error: 'Admin account is inactive or session is invalid.',
      });
      return;
    }

    req.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      branch: admin.branch,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired admin session.',
    });
  }
}
