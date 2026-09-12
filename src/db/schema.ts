import { integer, pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// 1. Users Table (Linked with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull().default('Admin User'),
  role: text('role').notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
});

// 2. Site Settings Table
export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(),
  siteName: text('site_name').notNull(),
  brandName: text('brand_name'),
  tagline: text('tagline').notNull(),
  logoUrl: text('logo_url').notNull(),
  iconUrl: text('icon_url').notNull(),
  heroHeadline: text('hero_headline'),
  heroSubheadline: text('hero_subheadline').notNull(),
  heroBadgeText: text('hero_badge_text').notNull(),
  primaryCtaText: text('primary_cta_text').notNull(),
  secondaryCtaText: text('secondary_cta_text').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. About Content Table
export const aboutContent = pgTable('about_content', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  intro: text('intro').notNull(),
  bio: text('bio').notNull(),
  mission: text('mission').notNull(),
  vision: text('vision').notNull(),
  approach: text('approach').notNull(),
  highlights: jsonb('highlights').notNull(), // string[]
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 4. Services Table
export const services = pgTable('services', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // 'web' | 'graphic' | 'cyber' | 'other'
  iconName: text('icon_name').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  features: jsonb('features').notNull(), // string[]
  displayOrder: integer('display_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 5. Web Projects Table
export const webProjects = pgTable('web_projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  mainImage: text('main_image').notNull(),
  additionalImages: jsonb('additional_images').notNull(), // string[]
  technologies: jsonb('technologies').notNull(), // string[]
  projectUrl: text('project_url'),
  githubUrl: text('github_url'),
  displayOrder: integer('display_order').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 6. Graphic Projects Table
export const graphicProjects = pgTable('graphic_projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  mainImage: text('main_image').notNull(),
  galleryImages: jsonb('gallery_images').notNull(), // string[]
  tags: jsonb('tags').notNull(), // string[]
  displayOrder: integer('display_order').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 7. Testimonials Table
export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  clientName: text('client_name').notNull(),
  clientCompany: text('client_company').notNull(),
  clientRole: text('client_role').notNull(),
  message: text('message').notNull(),
  clientImage: text('client_image'),
  rating: integer('rating').notNull().default(5),
  displayOrder: integer('display_order').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(true),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 8. Inquiries / Leads Table
export const inquiries = pgTable('inquiries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  service: text('service').notNull(),
  description: text('description').notNull(),
  preferredContact: text('preferred_contact').notNull().default('whatsapp'), // 'email' | 'whatsapp' | 'phone'
  status: text('status').notNull().default('new'), // 'new' | 'read' | 'archived'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 9. Contact Settings Table
export const contactSettings = pgTable('contact_settings', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp').notNull(),
  description: text('description').notNull(),
  businessHours: text('business_hours').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 10. Location Settings Table
export const locationSettings = pgTable('location_settings', {
  id: text('id').primaryKey(),
  locationName: text('location_name').notNull(),
  address: text('address').notNull(),
  mapLink: text('map_link').notNull(),
  coordinates: text('coordinates').notNull(),
  description: text('description').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 11. Social Links Table
export const socialLinks = pgTable('social_links', {
  id: text('id').primaryKey(),
  platform: text('platform').notNull(),
  platformName: text('platform_name').notNull(),
  url: text('url').notNull(),
  icon: text('icon').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 12. Media Library Items Table
export const mediaFiles = pgTable('media_files', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  url: text('url').notNull(),
  provider: text('provider').notNull().default('postgres'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 13. Media Binary Blobs Table (Storing image/file uploads directly in PostgreSQL without buckets)
export const mediaBlobs = pgTable('media_blobs', {
  id: text('id').primaryKey(), // matches media_files.id
  data: text('data').notNull(), // Base64 encoded file payload
  mimeType: text('mime_type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 14. SEO Settings Table
export const seoSettings = pgTable('seo_settings', {
  id: text('id').primaryKey(),
  siteTitle: text('site_title'),
  metaDescription: text('meta_description').notNull(),
  ogImageUrl: text('og_image_url'),
  keywords: text('keywords').notNull(),
  canonicalUrl: text('canonical_url'),
  robotsDirective: text('robots_directive'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 15. Activity & Security Audit Logs Table
export const activityLogs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  severity: text('severity').notNull(),
  ip: text('ip').notNull(),
  userAgent: text('user_agent'),
  location: text('location'),
  path: text('path'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

