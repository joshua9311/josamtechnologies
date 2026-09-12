import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthService } from '../server/auth/authService.ts';

export interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken | { id: string; email: string; role: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'josam-tech-secret-jwt-key-development-2026';

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split('Bearer ')[1].trim();
  } else if (typeof req.query.token === 'string') {
    token = req.query.token.trim();
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  // Try Firebase Token verification first
  try {
    const decodedFirebaseToken = await adminAuth.verifyIdToken(token);
    req.user = decodedFirebaseToken;
    return next();
  } catch (firebaseErr) {
    // If Firebase verify fails, fallback to local signed admin token for backward compatibility / dev admin credentials
    try {
      const decodedJwt = AuthService.verifyToken(token);
      if (decodedJwt) {
        req.user = decodedJwt;
        return next();
      }
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    } catch (jwtErr) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
  }
};
