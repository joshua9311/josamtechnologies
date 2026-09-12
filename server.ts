import express from 'express';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/routes/api';
import { postgresStore } from './src/db/store.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Gzip / Brotli response compression for high performance
  app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
  }));

  // Ensure uploads and data directories exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Core Express Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Cybersecurity Sentinel & Intrusion Detection Firewall
  app.use(async (req, res, next) => {
    const rawUrl = req.originalUrl || req.url || '';
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Client';

    // 1. Detect suspicious scanner paths targeting exploits (.env, wp-login, .git, phpmyadmin, etc.)
    const suspiciousProbeRegex =
      /(\.(env|git|htaccess|aws|ssh)|wp-admin|wp-login|xmlrpc|phpmyadmin|cgi-bin|actuator|eval-stdin|\.php)/i;

    if (suspiciousProbeRegex.test(rawUrl)) {
      try {
        await postgresStore.recordActivity({
          type: 'hack_attempt',
          title: 'Vulnerability Probe Intercepted',
          description: `Blocked automated exploit scanner requesting sensitive path: ${rawUrl}`,
          severity: 'danger',
          ip: clientIp,
          userAgent,
          path: rawUrl,
          metadata: { targetUrl: rawUrl, method: req.method },
        });
      } catch {
        // Fallback safely
      }
      return res.status(403).json({
        error: 'Forbidden: Request blocked by Josam Technologies Security Shield.',
        threatBlocked: true,
      });
    }

    // 2. Detect common SQL Injection / Script Injection payloads in non-admin public requests
    if (!rawUrl.startsWith('/admin') && !req.headers.authorization) {
      const queryStr = req.url.includes('?') ? req.url.split('?')[1] : '';
      const injectionRegex =
        /(\bunion\s+select\b|\bselect\s+.*\s+from\b|drop\s+table|insert\s+into\s+.*\s+values|;\s*shutdown|exec\s*\(|or\s+['"]?1['"]?\s*=\s*['"]?1\b|<script\b|\.\.\/|\.\.\\)/i;

      try {
        const decodedQuery = decodeURIComponent(queryStr);
        if (injectionRegex.test(decodedQuery)) {
          await postgresStore.recordActivity({
            type: 'hack_attempt',
            title: 'Malicious Query Injection Intercepted',
            description: `Blocked SQLi/XSS payload attempt on ${req.method} ${rawUrl}`,
            severity: 'danger',
            ip: clientIp,
            userAgent,
            path: rawUrl,
            metadata: { querySnippet: decodedQuery.slice(0, 100), method: req.method },
          });
          return res.status(400).json({
            error: 'Blocked: Potentially malicious injection signature detected.',
            threatBlocked: true,
          });
        }
      } catch {
        // URI decode error, continue
      }
    }

    next();
  });

  // Security & Performance HTTP Headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Serve static public folder for uploads & logo assets with client caching
  app.use(
    '/uploads',
    express.static(uploadsDir, {
      maxAge: '7d',
      etag: true,
      lastModified: true,
    })
  );
  app.use(
    express.static(path.join(process.cwd(), 'public'), {
      maxAge: '1d',
      etag: true,
      lastModified: true,
    })
  );

  // REST API Routes FIRST
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'Josam Technologies Full-Stack CMS',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite Middleware for Development / Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
        etag: true,
      })
    );
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Josam Technologies server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
