import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AdminUser } from '../../types';
import { postgresStore } from '../../db/store.ts';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'josam-tech-secure-jwt-secret-key-2026';
const TOKEN_EXPIRY = '7d';

const DEFAULT_ADMIN_IDENTIFIERS = [
  'joshuamwenda',
  'joshuamwenda36@gmail.com',
  'joshuamwenda2001@gmail.com',
  'admin@josamtech.co.ke',
  'admin@josamtech.com',
  (process.env.ADMIN_EMAIL || '').toLowerCase().trim(),
].filter(Boolean);

const DEFAULT_ADMIN_PASSWORDS = [
  '9311@Josh',
  'Admin@Josam2026!',
  'JosamAdmin2026!',
  process.env.ADMIN_PASSWORD,
].filter(Boolean) as string[];

// Dynamic custom admin credentials (for runtime password / profile change)
let currentAdminProfile = {
  name: 'Joshua Mwenda',
  email: 'joshuamwenda36@gmail.com',
};
const customPasswords = new Set<string>();

// In-memory rate limiting map for login attempts (IP -> { count, lockedUntil })
interface LoginAttempt {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

export class AuthService {
  static isRateLimited(ip: string): { limited: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record) return { limited: false };

    if (record.lockedUntil && record.lockedUntil > now) {
      return {
        limited: true,
        retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000),
      };
    }

    if (now - record.lastAttempt > 15 * 60 * 1000) {
      loginAttempts.delete(ip);
      return { limited: false };
    }

    return { limited: false };
  }

  static recordFailedAttempt(ip: string): number {
    const now = Date.now();
    const record = loginAttempts.get(ip) || { attempts: 0, lastAttempt: now };
    record.attempts += 1;
    record.lastAttempt = now;

    if (record.attempts >= 5) {
      record.lockedUntil = now + 5 * 60 * 1000;
    }

    loginAttempts.set(ip, record);
    return record.attempts;
  }

  static clearAttempts(ip: string): void {
    loginAttempts.delete(ip);
  }

  static updatePassword(newPassword: string): void {
    if (newPassword && newPassword.length >= 6) {
      customPasswords.add(newPassword);
    }
  }

  static updateProfile(name?: string, email?: string): void {
    if (name) currentAdminProfile.name = name;
    if (email) currentAdminProfile.email = email.toLowerCase().trim();
  }

  static async authenticateAdmin(
    identifier: string,
    passwordPlain: string,
    clientIp: string,
    userAgent?: string
  ): Promise<{ success: boolean; token?: string; user?: AdminUser; error?: string }> {
    const rateCheck = this.isRateLimited(clientIp);
    if (rateCheck.limited) {
      // Record threat log for locked out brute-force attacks
      await postgresStore.recordActivity({
        type: 'hack_attempt',
        title: 'Brute-Force Attack Blocked (IP Locked)',
        description: `Blocked automated login barrage from IP ${clientIp} targeting '${identifier}'.`,
        severity: 'danger',
        ip: clientIp,
        userAgent,
        path: '/api/auth/login',
        metadata: { identifier, retryAfterSeconds: rateCheck.retryAfterSeconds },
      });

      return {
        success: false,
        error: `Too many failed attempts. Access temporarily restricted. Retry in ${rateCheck.retryAfterSeconds} seconds.`,
      };
    }

    const cleanId = (identifier || '').trim().toLowerCase();

    // Check valid admin identifiers (username or email)
    const isValidIdentifier =
      DEFAULT_ADMIN_IDENTIFIERS.includes(cleanId) ||
      cleanId === currentAdminProfile.email.toLowerCase() ||
      cleanId === 'joshuamwenda';

    // Check valid passwords
    const isValidPassword =
      DEFAULT_ADMIN_PASSWORDS.includes(passwordPlain) ||
      customPasswords.has(passwordPlain);

    if (!isValidIdentifier || !isValidPassword) {
      const attemptsCount = this.recordFailedAttempt(clientIp);
      const isBruteForce = attemptsCount >= 3;

      // Log failure in security audit
      await postgresStore.recordActivity({
        type: isBruteForce ? 'hack_attempt' : 'login_failed',
        title: isBruteForce
          ? `Repeated Login Failure Alert (Attempt #${attemptsCount})`
          : 'Failed Admin Login Attempt',
        description: isBruteForce
          ? `Suspicious repetitive failed login attempts using identifier '${cleanId}' from IP ${clientIp}.`
          : `Failed login attempt with identifier '${cleanId}'.`,
        severity: isBruteForce ? 'danger' : 'warning',
        ip: clientIp,
        userAgent,
        path: '/api/auth/login',
        metadata: { attemptedIdentifier: cleanId, attemptsCount },
      });

      return { success: false, error: 'Invalid username/email or password.' };
    }

    this.clearAttempts(clientIp);

    const safeUser: AdminUser = {
      id: 'admin-joshua',
      email: cleanId.includes('@') ? cleanId : currentAdminProfile.email,
      name: currentAdminProfile.name,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Record successful login in security audit
    await postgresStore.recordActivity({
      type: 'login_success',
      title: 'Admin Login Successful',
      description: `Joshua Mwenda (${safeUser.email}) logged in successfully from IP ${clientIp}.`,
      severity: 'success',
      ip: clientIp,
      userAgent,
      path: '/api/auth/login',
      metadata: { user: safeUser.name, email: safeUser.email },
    });

    const token = jwt.sign(
      {
        id: safeUser.id,
        email: safeUser.email,
        role: safeUser.role,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return { success: true, token, user: safeUser };
  }

  static verifyToken(token: string): { id: string; email: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };
      return decoded;
    } catch {
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
