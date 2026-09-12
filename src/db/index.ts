import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: Pool | undefined;
}

// Function to create or retrieve the connection pool.
export const createPool = () => {
  if (!global._postgresPool) {
    const rawConnectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.AIVEN_DATABASE_URL;

    if (rawConnectionString) {
      try {
        // Strip sslmode query parameter to prevent pg from overriding ssl configuration
        const url = new URL(rawConnectionString);
        const host = url.hostname;
        const port = url.port ? parseInt(url.port, 10) : 5432;
        const user = decodeURIComponent(url.username);
        const password = decodeURIComponent(url.password);
        const database = url.pathname.replace(/^\//, '') || 'defaultdb';

        const isCloudHost = host.includes('aivencloud.com') ||
          host.includes('neon.tech') ||
          host.includes('supabase.co') ||
          rawConnectionString.includes('sslmode=require') ||
          process.env.NODE_ENV === 'production';

        global._postgresPool = new Pool({
          host,
          port,
          user,
          password,
          database,
          ssl: isCloudHost ? { rejectUnauthorized: false } : false,
          max: 10,
          connectionTimeoutMillis: 15000,
        });
      } catch (parseErr) {
        console.warn('[DB] Failed to parse connection string URL, falling back to connectionString with ssl options:', parseErr);
        // Clean URL by removing ?sslmode=... so pg does not re-enable strict CA validation
        const cleanConnectionString = rawConnectionString.replace(/[?&]sslmode=[^&]+/g, '');
        global._postgresPool = new Pool({
          connectionString: cleanConnectionString,
          ssl: { rejectUnauthorized: false },
          max: 10,
          connectionTimeoutMillis: 15000,
        });
      }
    } else {
      // Fallback to individual Cloud SQL / platform environment variables
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT, 10) : 5432,
        ssl: process.env.SQL_SSL === 'true' || process.env.SQL_HOST?.includes('google') ? { rejectUnauthorized: false } : false,
        max: 10,
        connectionTimeoutMillis: 15000,
      });
    }

    // Prevent unhandled pool-level errors from crashing the application
    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

// Create or retrieve the pool instance.
export const pool = createPool();

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });
