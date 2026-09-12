import { Request, Response, NextFunction } from 'express';
import { AuthService } from './authService.ts';
import { AdminUser } from '../../types';

export interface AuthenticatedRequest extends Request {
  adminUser?: AdminUser;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired authentication session.' });
    return;
  }

  req.adminUser = {
    id: decoded.id,
    email: decoded.email,
    name: 'Josam Administrator',
    role: decoded.role as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  next();
}
