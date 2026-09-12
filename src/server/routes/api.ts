import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { postgresStore } from '../../db/store.ts';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth.ts';
import { AuthService } from '../auth/authService.ts';

export const apiRouter = Router();

// Configure Multer for In-Memory uploads (Direct PostgreSQL Blob Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB
  },
});

// ==========================================
// 1. PUBLIC API ROUTES
// ==========================================

const handleGetPublicSiteData = async (_req: Request, res: Response) => {
  try {
    const data = await postgresStore.getPublicSiteData();
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching public site data:', error);
    try {
      const fallbackData = await postgresStore.getPublicSiteData();
      res.json(fallbackData);
    } catch {
      res.json({
        settings: {
          siteName: 'Josam Technologies',
          brandName: 'Josam Technologies',
          tagline: 'Building Digital Experiences. Creating Powerful Brands.',
          logoUrl: '/logo-icon.svg',
          iconUrl: '/logo-icon.svg',
          heroHeadline: 'Building Digital Experiences. Creating Powerful Brands.',
          heroSubheadline: 'We engineer high-performance websites, bespoke graphic identities, and seamless cyber digital services.',
          heroBadgeText: 'Empowering Modern Enterprises & Creators',
          primaryCtaText: "Let's Work Together",
          secondaryCtaText: 'Explore Projects',
          updatedAt: new Date().toISOString(),
        },
        about: {
          title: 'Engineering Digital Excellence & Visual Impact',
          intro: 'Josam Technologies is a hybrid digital agency and technology consultancy.',
          bio: 'Founded with a mission to bridge technical innovation with creative branding.',
          mission: 'To deliver tailored, scalable digital software and visually stunning brand identities.',
          vision: 'To be the most reliable, creative, and transformative digital technology partner.',
          approach: 'We blend modern design aesthetics with enterprise-grade engineering.',
          highlights: ['Engineered for speed', 'Vector brand graphics', 'Cyber compliance', 'Dedicated support'],
          updatedAt: new Date().toISOString(),
        },
        services: [],
        webProjects: [],
        graphicProjects: [],
        testimonials: [],
        contact: {
          email: 'info@josamtech.com',
          phone: '+254 700 000 000',
          whatsapp: '+254 700 000 000',
          description: 'Get in touch with our team.',
          businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM',
          updatedAt: new Date().toISOString(),
        },
        location: {
          locationName: 'Josam Technologies Hub',
          address: 'Commercial Business Centre, Nairobi, Kenya',
          mapLink: 'https://maps.google.com/?q=Nairobi+Kenya',
          coordinates: '-1.286389, 36.817223',
          description: 'Conveniently located for in-person consultations.',
          updatedAt: new Date().toISOString(),
        },
        socials: [],
        seo: {
          siteTitle: 'Josam Technologies | Digital Web & Design Agency',
          metaDescription: 'Modern web development, creative graphic design, and cyber digital compliance services in Nairobi, Kenya.',
          ogImageUrl: '/og-preview.png',
          keywords: 'web design, full stack development, logo design, KRA returns, HELB loan, Kenya',
          canonicalUrl: '',
          robotsDirective: 'index, follow',
          updatedAt: new Date().toISOString(),
        },
      });
    }
  }
};

// Support multiple route aliases for public site data
apiRouter.get('/site-data', handleGetPublicSiteData);
apiRouter.get('/site', handleGetPublicSiteData);
apiRouter.get('/public/site', handleGetPublicSiteData);
apiRouter.get('/public/site-data', handleGetPublicSiteData);
apiRouter.get('/public/data', handleGetPublicSiteData);
apiRouter.get('/data', handleGetPublicSiteData);

// Lead / Inquiry submission with anti-spam check
const recentInquiryIps = new Map<string, number>();

apiRouter.post('/inquiries', async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const lastSubmit = recentInquiryIps.get(ip);

    // Rate limit: 1 inquiry per 5 seconds per IP
    if (lastSubmit && now - lastSubmit < 5000) {
      return res.status(429).json({
        error: 'Please wait a moment before sending another message.',
      });
    }

    const { name, email, phone, service, description, preferredContact } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({
        error: 'Name, email, and description are required fields.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const newInquiry = await postgresStore.addInquiry({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone || '').trim(),
      service: String(service || 'General Inquiry').trim(),
      description: String(description).trim(),
      preferredContact: ['email', 'whatsapp', 'phone'].includes(preferredContact)
        ? preferredContact
        : 'whatsapp',
    });

    recentInquiryIps.set(ip, now);

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received! Josam Technologies will respond promptly.',
      inquiry: newInquiry,
    });
  } catch (error: any) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: error.message || 'Failed to submit inquiry.' });
  }
});

// Serve media file blobs directly from PostgreSQL without external buckets
apiRouter.get('/media/blob/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blob = await postgresStore.getMediaBlob(id);
    if (!blob) {
      return res.status(404).send('File not found');
    }

    res.setHeader('Content-Type', blob.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(blob.data);
  } catch (error) {
    console.error('Error streaming media from PostgreSQL:', error);
    res.status(500).send('Error reading media');
  }
});

// ==========================================
// 2. AUTHENTICATION ROUTES
// ==========================================

apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, username, identifier, password } = req.body;
    const loginId = identifier || email || username;

    if (!loginId || !password) {
      return res.status(400).json({ error: 'Username or email and password are required' });
    }

    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';
    const result = await AuthService.authenticateAdmin(loginId, password, clientIp, userAgent);
    if (!result.success) {
      return res.status(401).json({ error: result.error || 'Invalid username/email or password' });
    }

    res.json({ token: result.token, user: result.user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Authentication error' });
  }
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// ==========================================
// 3. ADMIN MANAGEMENT ROUTES (PostgreSQL)
// ==========================================

apiRouter.get('/admin/site-data', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await postgresStore.getFullAdminSiteData();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/dashboard', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await postgresStore.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Settings & About
const handleUpdateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateSiteSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/settings', requireAuth, handleUpdateSettings);
apiRouter.patch('/admin/settings', requireAuth, handleUpdateSettings);

const handleUpdateAbout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateAboutContent(req.body);
    res.json({ success: true, about: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/about', requireAuth, handleUpdateAbout);
apiRouter.patch('/admin/about', requireAuth, handleUpdateAbout);

// Admin Profile & Password Updates
apiRouter.put('/admin/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    const currentUser = req.user as any;
    AuthService.updateProfile(name, email);
    res.json({
      success: true,
      user: {
        id: currentUser?.id || 'admin-1',
        email: email || currentUser?.email || 'admin@josamtech.co.ke',
        name: name || currentUser?.name || 'Josam Administrator',
        role: 'super_admin',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/change-password', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }
    AuthService.updatePassword(newPassword);
    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Services
apiRouter.get('/admin/services', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getServices();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/services', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveService(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/services/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveService({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/services/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteService(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Web Projects
apiRouter.get('/admin/web-projects', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getWebProjects();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/web-projects', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveWebProject(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/web-projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveWebProject({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/web-projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteWebProject(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Graphic Projects
apiRouter.get('/admin/graphic-projects', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getGraphicProjects();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/graphic-projects', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveGraphicProject(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/graphic-projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveGraphicProject({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/graphic-projects/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteGraphicProject(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Testimonials
apiRouter.get('/admin/testimonials', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getTestimonials();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/testimonials', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveTestimonial(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/testimonials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveTestimonial({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/testimonials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteTestimonial(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Inquiries
apiRouter.get('/admin/inquiries', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getInquiries();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/admin/inquiries/:id/status', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await postgresStore.updateInquiryStatus(req.params.id, status);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/inquiries/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteInquiry(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Contact, Location, Socials, SEO
const handleUpdateContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateContactSettings(req.body);
    res.json({ success: true, contact: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/contact', requireAuth, handleUpdateContact);
apiRouter.patch('/admin/contact', requireAuth, handleUpdateContact);

const handleUpdateLocation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateLocationSettings(req.body);
    res.json({ success: true, location: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/location', requireAuth, handleUpdateLocation);
apiRouter.patch('/admin/location', requireAuth, handleUpdateLocation);

apiRouter.get('/admin/socials', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getSocialLinks();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/socials', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const created = await postgresStore.saveSocialLink(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/socials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.saveSocialLink({ ...req.body, id: req.params.id });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/socials/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteSocialLink(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const handleUpdateSEO = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = await postgresStore.updateSEOSettings(req.body);
    res.json({ success: true, seo: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.put('/admin/seo', requireAuth, handleUpdateSEO);
apiRouter.patch('/admin/seo', requireAuth, handleUpdateSEO);

// Direct PostgreSQL Media Uploads (NO BUCKETS REQUIRED)
apiRouter.get('/admin/media', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const list = await postgresStore.getMediaFiles();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post(
  '/admin/media/upload',
  requireAuth,
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided for upload.' });
      }

      const media = await postgresStore.storeMediaInPostgres(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      res.status(201).json({
        success: true,
        media,
        message: 'File stored successfully in PostgreSQL database!',
      });
    } catch (err: any) {
      console.error('Error uploading media to PostgreSQL:', err);
      res.status(500).json({ error: err.message || 'Failed to save media in database.' });
    }
  }
);

apiRouter.delete('/admin/media/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = await postgresStore.deleteMedia(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Backup & Seed reset in PostgreSQL
const handleResetSeed = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await postgresStore.seedAll();
    res.json({ success: true, message: 'Database reset to default seed successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
apiRouter.post('/admin/reset-seed', requireAuth, handleResetSeed);
apiRouter.post('/admin/backup/reset-seed', requireAuth, handleResetSeed);

apiRouter.get('/admin/backup/export', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await postgresStore.getFullAdminSiteData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=josam-backup-${Date.now()}.json`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/admin/backup/restore', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const backup = req.body;
    if (backup.settings) await postgresStore.updateSiteSettings(backup.settings);
    if (backup.about) await postgresStore.updateAboutContent(backup.about);
    if (backup.contact) await postgresStore.updateContactSettings(backup.contact);
    if (backup.location) await postgresStore.updateLocationSettings(backup.location);
    if (backup.seo) await postgresStore.updateSEOSettings(backup.seo);
    res.json({ success: true, message: 'Backup restored successfully!' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. ACTIVITY & SECURITY AUDIT ROUTES
// ==========================================

apiRouter.get('/admin/security/logs', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 100;
    const logs = await postgresStore.getActivityLogs(limit);
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/admin/security/stats', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await postgresStore.getSecurityStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/security/logs', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    await postgresStore.clearActivityLogs();
    await postgresStore.recordActivity({
      type: 'admin_action',
      title: 'Security Audit Logs Reset',
      description: 'Activity history cleared by authorized administrator.',
      severity: 'info',
      ip: '127.0.0.1',
      path: '/api/admin/security/logs',
    });
    res.json({ success: true, message: 'Activity logs cleared.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Diagnostic / Testing Route: Allows admin to simulate an intrusion probe to verify real-time alerts
apiRouter.post('/admin/security/simulate-probe', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type } = req.body;
    let simulatedLog;

    if (type === 'sql_injection_probe') {
      simulatedLog = await postgresStore.recordActivity({
        type: 'hack_attempt',
        title: 'Blocked SQL Injection Vector Probe',
        description: 'Attack signature detected: `UNION SELECT 1,2,username,password FROM users--` in query parameter `q`.',
        severity: 'danger',
        ip: '197.232.84.112',
        userAgent: 'sqlmap/1.7.2#stable (https://sqlmap.org)',
        location: 'Nairobi (Simulated)',
        path: '/api/search?q=UNION+SELECT+1,2,password+FROM+users',
        metadata: { vector: 'SQLi', blockedRule: 'RULE_SQLI_KEYWORD_MATCH', action: 'FIREWALL_DROP' },
      });
    } else if (type === 'path_traversal_probe') {
      simulatedLog = await postgresStore.recordActivity({
        type: 'hack_attempt',
        title: 'Blocked Directory Traversal Probe',
        description: 'Exploit signature detected: `../../../../etc/passwd` attempting to leak root file system.',
        severity: 'danger',
        ip: '185.220.101.5',
        userAgent: 'Nikto/2.1.6 Vulnerability Scanner',
        location: 'Tor Exit Node (Simulated)',
        path: '/api/files?file=../../../../etc/passwd',
        metadata: { vector: 'LFI_Path_Traversal', blockedRule: 'RULE_PATH_TRAVERSAL', action: 'FIREWALL_DROP' },
      });
    } else {
      simulatedLog = await postgresStore.recordActivity({
        type: 'hack_attempt',
        title: 'Blocked Vulnerability Scanner Bot',
        description: 'Automated exploit bot probed non-existent sensitive path `/wp-login.php`.',
        severity: 'danger',
        ip: '45.154.255.89',
        userAgent: 'WPScan v3.8.22 (Automated Exploit Bot)',
        location: 'External Scanner',
        path: '/wp-login.php',
        metadata: { vector: 'Vulnerability_Scan', blockedRule: 'RULE_SENSITIVE_PATH_PROBE', action: 'FIREWALL_DROP' },
      });
    }

    res.json({
      success: true,
      message: 'Simulated intrusion logged successfully for security diagnostic.',
      log: simulatedLog,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

