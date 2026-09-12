import { db, pool } from './index.ts';
import {
  siteSettings,
  aboutContent,
  services,
  webProjects,
  graphicProjects,
  testimonials,
  inquiries,
  contactSettings,
  locationSettings,
  socialLinks,
  seoSettings,
  mediaFiles,
  mediaBlobs,
  activityLogs,
} from './schema.ts';
import { eq, desc, asc } from 'drizzle-orm';
import {
  PublicSiteData,
  AdminDashboardStats,
  Inquiry,
  MediaItem,
  ServiceItem,
  WebProject,
  GraphicProject,
  Testimonial,
  SocialLink,
  SiteSettings,
  AboutContent,
  ContactSettings,
  LocationSettings,
  SEOSettings,
  ActivityLog,
  SecurityStats,
} from '../types';

export const initialSiteSettings: SiteSettings = {
  id: 'main',
  siteName: 'Josam Technologies',
  brandName: 'Josam Technologies',
  tagline: 'Modern Digital Technology & Creative Engineering Solutions',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
  heroHeadline: 'Engineering Cutting-Edge Web & Digital Experiences for Modern Brands',
  heroSubheadline:
    'From bespoke websites and high-impact graphic design to comprehensive cyber & online digital services, we turn complex challenges into seamless digital experiences.',
  heroBadgeText: 'Official Digital Technology Hub',
  primaryCtaText: "Let's Work Together",
  secondaryCtaText: 'Explore Projects',
  updatedAt: new Date().toISOString(),
};

export const initialAboutContent: AboutContent = {
  id: 'main',
  title: 'About Josam Technologies',
  intro:
    'Josam Technologies is a modern technology studio dedicated to crafting digital excellence for businesses, institutions, and individual innovators.',
  bio: 'Founded on the principle that precision engineering and purposeful design must work in tandem, we bridge the gap between creative visual branding and robust scalable web systems. In addition to commercial digital production, we offer vital online cyber services assisting clients with national portals, educational systems, and compliance portals.',
  mission:
    'To empower organizations and individuals through dependable digital infrastructure, captivating design aesthetics, and accessible online public services.',
  vision:
    'To be the premier digital transformation partner across East Africa and beyond, known for craftsmanship, technological reliability, and client success.',
  approach:
    'We adopt a collaborative, agile development methodology—prototyping early, designing with mathematical precision, and deploying cloud-native architectures that perform flawlessly.',
  highlights: [
    'Full-Stack Modern Websites & Web Platforms',
    'Creative Brand Identity, UI/UX & Graphic Systems',
    'Cyber & Online Government Services (KRA, HELB, eCitizen)',
    '100% Tailored Client Solutions with Zero Hidden Fees',
  ],
  updatedAt: new Date().toISOString(),
};

export const initialServices: Omit<ServiceItem, 'updatedAt' | 'createdAt'>[] = [
  {
    id: 'web-development',
    title: 'Full-Stack Web Development',
    category: 'web',
    iconName: 'Code',
    shortDescription: 'Custom, blazing-fast websites, e-commerce stores, and enterprise business portals.',
    fullDescription:
      'We build scalable, secure, and intuitive websites and web platforms using modern technologies including React, Next.js, Node.js, TypeScript, PostgreSQL, and Cloud infrastructure.',
    features: [
      'Custom Websites & Business Portals',
      'E-Commerce & Payment Gateway Integration',
      'RESTful & GraphQL API Architecture',
      'Database Modeling & High-Throughput Optimization',
      'Responsive Mobile-First Interfaces',
      'Continuous Deployment & Cloud Hosting',
    ],
    displayOrder: 1,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design & Brand Identity',
    category: 'graphic',
    iconName: 'Palette',
    shortDescription: 'Distinct visual identities, marketing collateral, logos, and high-impact digital graphics.',
    fullDescription:
      'From complete corporate brand guidelines to advertising creatives, vector illustrations, and print media, our design work commands attention and creates lasting impressions.',
    features: [
      'Logo Design & Complete Brand Identity Systems',
      'Marketing Posters, Flyers, & Social Media Kits',
      'UI/UX Wireframing & Interactive Prototypes',
      'Corporate Stationery, Brochures, & Business Cards',
      'Packaging & Product Mockup Visuals',
      'Vector Illustrations & Visual Assets',
    ],
    displayOrder: 2,
    isPublished: true,
    isFeatured: true,
  },
  {
    id: 'cyber-services',
    title: 'Cyber & Online Digital Services',
    category: 'cyber',
    iconName: 'Globe',
    shortDescription: 'Reliable assistance with public portals, e-government compliance, student, and business services.',
    fullDescription:
      'We guide individuals and businesses through crucial online platforms including tax compliance, student loans, business registrations, and academic documentation.',
    features: [
      'KRA iTax (PIN Registration, Returns Filing, Compliance Certificates)',
      'HELB / Higher Education Financing Support',
      'eCitizen Business & Government Service Facilitation',
      'KUCCPS Student Placement & Portal Guidance',
      'NTSA TIMS & Driving License Portals',
      'Online Document Processing, Typesetting, & Submissions',
    ],
    displayOrder: 3,
    isPublished: true,
    isFeatured: true,
  },
];

export const initialWebProjects: Omit<WebProject, 'updatedAt' | 'createdAt'>[] = [
  {
    id: 'apex-logistics',
    title: 'Apex Logistics Freight Platform',
    category: 'Full-Stack Website',
    description:
      'A real-time cargo tracking and fleet management portal with live telemetry, dispatch scheduling, and automated client billing.',
    mainImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Mapbox API'],
    projectUrl: 'https://example.com/apex-logistics',
    githubUrl: null,
    displayOrder: 1,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'savanna-ecommerce',
    title: 'Savanna Craft E-Commerce Hub',
    category: 'E-Commerce Platform',
    description:
      'A high-conversion artisan goods marketplace featuring multi-currency support, automated inventory reconciliation, and instant M-Pesa / Card checkout.',
    mainImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Stripe', 'M-Pesa Daraja API'],
    projectUrl: 'https://example.com/savanna-crafts',
    githubUrl: null,
    displayOrder: 2,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'medicare-portal',
    title: 'MediCare Clinical Appointment System',
    category: 'Healthcare Management',
    description:
      'HIPAA-aligned patient portal enabling automated appointment bookings, doctor schedule management, tele-consultation room links, and diagnostic report retrieval.',
    mainImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
    ],
    technologies: ['React', 'Express.js', 'PostgreSQL', 'Drizzle ORM', 'Tailwind CSS'],
    projectUrl: 'https://example.com/medicare-portal',
    githubUrl: null,
    displayOrder: 3,
    isFeatured: true,
    isPublished: true,
  },
];

export const initialGraphicProjects: Omit<GraphicProject, 'updatedAt' | 'createdAt'>[] = [
  {
    id: 'kestral-branding',
    title: 'Kestral Coffee Co. Brand Identity',
    category: 'Brand Identity',
    description:
      'Complete visual identity system including logo design, color hierarchy, custom typography guidelines, and packaging labels for premium highland coffee.',
    mainImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Logo Design', 'Packaging', 'Typography', 'Print'],
    displayOrder: 1,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'nairobi-fintech-summit',
    title: 'Fintech Innovation Summit 2026 Poster Series',
    category: 'Marketing Collateral',
    description:
      'Dynamic visual campaign encompassing digital banners, entrance rollups, participant badges, and speaker spotlight cards for an international tech conference.',
    mainImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['Conference', 'Poster Design', 'Social Media', 'Flyers'],
    displayOrder: 2,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 'lumina-brand-ui',
    title: 'Lumina Smart Home Brand & UI Kit',
    category: 'Graphic & UI Design',
    description:
      'Sophisticated dark-mode visual interface design for IoT smart home platforms with custom vector device icons and fluid controls.',
    mainImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    ],
    tags: ['UI Design', 'Figma', 'Dark Mode', 'Iconography'],
    displayOrder: 3,
    isFeatured: true,
    isPublished: true,
  },
];

export const initialTestimonials: Omit<Testimonial, 'updatedAt' | 'createdAt'>[] = [
  {
    id: 't-1',
    clientName: 'Dennis Mutua',
    clientCompany: 'Savanna Crafts Ltd',
    clientRole: 'Managing Director',
    message:
      'Josam Technologies completely revolutionized our online presence. Our e-commerce sales have grown threefold since launching the new custom platform. Invaluable partner!',
    clientImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    displayOrder: 1,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 't-2',
    clientName: 'Faith Wanjiku',
    clientCompany: 'Apex Freight Kenya',
    clientRole: 'Operations Lead',
    message:
      'Their technical depth in web engineering is exceptional. The dispatch and tracking system they built has streamlined our day-to-day operations with zero downtime.',
    clientImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    displayOrder: 2,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: 't-3',
    clientName: 'Brian Kiprop',
    clientCompany: 'Kestral Brands',
    clientRole: 'Creative Director',
    message:
      'The brand identity and packaging design exceeded all expectations. Our products now stand out boldly on store shelves. Fast turnaround and outstanding professionalism.',
    clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    displayOrder: 3,
    isFeatured: true,
    isPublished: true,
  },
];

export const initialContactSettings: ContactSettings = {
  id: 'main',
  email: 'info@josamtech.com',
  phone: '+254 700 000 000',
  whatsapp: '+254700000000',
  description:
    'Reach out to our team directly for customized project estimates, design inquiries, or e-government portal guidance.',
  businessHours: 'Monday - Saturday: 8:00 AM - 7:00 PM (EAT)',
  updatedAt: new Date().toISOString(),
};

export const initialLocationSettings: LocationSettings = {
  id: 'main',
  locationName: 'Josam Technologies Hub',
  address: 'Commercial Business Centre, Suite 4B, Nairobi / Meru, Kenya',
  mapLink: 'https://maps.google.com/?q=Nairobi+Kenya',
  coordinates: '-1.286389, 36.817223',
  description:
    'Visit our physical office for in-person consultations, technical strategy sessions, and on-site cyber services.',
  updatedAt: new Date().toISOString(),
};

export const initialSocialLinks: Omit<SocialLink, 'updatedAt'>[] = [
  {
    id: 'whatsapp',
    platform: 'whatsapp',
    platformName: 'WhatsApp',
    url: 'https://wa.me/254700000000?text=Hello%20Josam%20Technologies%2C%20I%20would%20like%20to%20discuss%20a%20project.',
    icon: 'MessageCircle',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'linkedin',
    platform: 'linkedin',
    platformName: 'LinkedIn',
    url: 'https://linkedin.com/company/josam-technologies',
    icon: 'Linkedin',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'facebook',
    platform: 'facebook',
    platformName: 'Facebook',
    url: 'https://facebook.com/josamtechnologies',
    icon: 'Facebook',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'instagram',
    platform: 'instagram',
    platformName: 'Instagram',
    url: 'https://instagram.com/josamtech',
    icon: 'Instagram',
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: 'twitter',
    platform: 'twitter',
    platformName: 'X (Twitter)',
    url: 'https://x.com/josamtech',
    icon: 'Twitter',
    displayOrder: 5,
    isPublished: true,
  },
  {
    id: 'github',
    platform: 'github',
    platformName: 'GitHub',
    url: 'https://github.com/josamtech',
    icon: 'Github',
    displayOrder: 6,
    isPublished: true,
  },
];

export const initialSEOSettings: SEOSettings = {
  id: 'main',
  siteTitle: 'Josam Technologies | Web Development, Graphic Design & Cyber Services',
  metaDescription:
    'Josam Technologies provides premium full-stack web development, custom graphic design and branding, and e-government cyber services (KRA, HELB, eCitizen). Contact us today for tailored digital solutions.',
  ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  keywords:
    'Josam Technologies, Web Development Kenya, Graphic Design, Brand Identity, Cyber Services, KRA Returns, HELB Student Loans, eCitizen, Full-Stack Developer, Nairobi Tech Hub',
  canonicalUrl: 'https://josamtech.com',
  robotsDirective: 'index, follow',
  updatedAt: new Date().toISOString(),
};

// Database Service with automatic seeding and error sanitization
export class PostgresStore {
  private static instance: PostgresStore;
  private isInitialized = false;
  private cachedPublicData: PublicSiteData | null = null;
  private cachedTimestamp: number = 0;
  private readonly CACHE_TTL_MS = 30 * 1000; // 30 seconds

  private memoryActivityLogs: ActivityLog[] = [
    {
      id: 'log-baseline-init',
      type: 'admin_action',
      title: 'Josam Security Sentinel Activated',
      description: 'Zero-trust perimeter protection, brute-force rate limiter, and injection firewalls initialized.',
      severity: 'info',
      ip: '127.0.0.1',
      userAgent: 'Josam Security Engine/v2.0 (Ubuntu x86_64)',
      location: 'Nairobi, Kenya',
      path: '/api/security/engine',
      timestamp: new Date().toISOString(),
    },
  ];

  private constructor() {}

  public static getInstance(): PostgresStore {
    if (!PostgresStore.instance) {
      PostgresStore.instance = new PostgresStore();
    }
    return PostgresStore.instance;
  }

  public invalidateCache(): void {
    this.cachedPublicData = null;
    this.cachedTimestamp = 0;
  }

  public async ensureTablesExist(): Promise<void> {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          uid TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL,
          name TEXT NOT NULL DEFAULT 'Admin User',
          role TEXT NOT NULL DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          last_login_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS site_settings (
          id TEXT PRIMARY KEY,
          site_name TEXT NOT NULL,
          brand_name TEXT,
          tagline TEXT NOT NULL,
          logo_url TEXT NOT NULL,
          icon_url TEXT NOT NULL,
          hero_headline TEXT,
          hero_subheadline TEXT NOT NULL,
          hero_badge_text TEXT NOT NULL,
          primary_cta_text TEXT NOT NULL,
          secondary_cta_text TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS about_content (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          intro TEXT NOT NULL,
          bio TEXT NOT NULL,
          mission TEXT NOT NULL,
          vision TEXT NOT NULL,
          approach TEXT NOT NULL,
          highlights JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS services (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          icon_name TEXT NOT NULL,
          short_description TEXT NOT NULL,
          full_description TEXT NOT NULL,
          features JSONB NOT NULL,
          display_order INTEGER NOT NULL DEFAULT 0,
          is_published BOOLEAN NOT NULL DEFAULT true,
          is_featured BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS web_projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          main_image TEXT NOT NULL,
          additional_images JSONB NOT NULL,
          technologies JSONB NOT NULL,
          project_url TEXT,
          github_url TEXT,
          display_order INTEGER NOT NULL DEFAULT 0,
          is_featured BOOLEAN NOT NULL DEFAULT false,
          is_published BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS graphic_projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          main_image TEXT NOT NULL,
          gallery_images JSONB NOT NULL,
          tags JSONB NOT NULL,
          display_order INTEGER NOT NULL DEFAULT 0,
          is_featured BOOLEAN NOT NULL DEFAULT false,
          is_published BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS testimonials (
          id TEXT PRIMARY KEY,
          client_name TEXT NOT NULL,
          client_company TEXT NOT NULL,
          client_role TEXT NOT NULL,
          message TEXT NOT NULL,
          client_image TEXT,
          rating INTEGER NOT NULL DEFAULT 5,
          display_order INTEGER NOT NULL DEFAULT 0,
          is_featured BOOLEAN NOT NULL DEFAULT true,
          is_published BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS inquiries (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          service TEXT NOT NULL,
          description TEXT NOT NULL,
          preferred_contact TEXT NOT NULL DEFAULT 'whatsapp',
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS contact_settings (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          whatsapp TEXT NOT NULL,
          description TEXT NOT NULL,
          business_hours TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS location_settings (
          id TEXT PRIMARY KEY,
          location_name TEXT NOT NULL,
          address TEXT NOT NULL,
          map_link TEXT NOT NULL,
          coordinates TEXT NOT NULL,
          description TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS social_links (
          id TEXT PRIMARY KEY,
          platform TEXT NOT NULL,
          platform_name TEXT NOT NULL,
          url TEXT NOT NULL,
          icon TEXT NOT NULL,
          display_order INTEGER NOT NULL DEFAULT 0,
          is_published BOOLEAN NOT NULL DEFAULT true,
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS media_files (
          id TEXT PRIMARY KEY,
          filename TEXT NOT NULL,
          original_name TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          size INTEGER NOT NULL,
          url TEXT NOT NULL,
          provider TEXT NOT NULL DEFAULT 'postgres',
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS media_blobs (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS seo_settings (
          id TEXT PRIMARY KEY,
          site_title TEXT,
          meta_description TEXT NOT NULL,
          og_image_url TEXT,
          keywords TEXT NOT NULL,
          canonical_url TEXT,
          robots_directive TEXT,
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS activity_logs (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          severity TEXT NOT NULL,
          ip TEXT NOT NULL,
          user_agent TEXT,
          location TEXT,
          path TEXT,
          metadata JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
    } catch (tableErr) {
      console.error('[PostgresStore] Error ensuring tables exist:', tableErr);
    }
  }

  public async initSeedIfNeeded(): Promise<void> {
    if (this.isInitialized) return;
    try {
      await this.ensureTablesExist();
      // Check if site_settings has row
      const existingSettings = await db.select().from(siteSettings).where(eq(siteSettings.id, 'main'));
      if (existingSettings.length === 0) {
        console.log('[PostgresStore] Seeding initial data into PostgreSQL...');
        await this.seedAll();
      }
      this.isInitialized = true;
    } catch (err) {
      console.error('[PostgresStore] Init seed check error:', err);
    }
  }

  public async seedAll(): Promise<void> {
    try {
      // 1. Settings
      await db.insert(siteSettings).values({
        ...initialSiteSettings,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 2. About
      await db.insert(aboutContent).values({
        ...initialAboutContent,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 3. Contact
      await db.insert(contactSettings).values({
        ...initialContactSettings,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 4. Location
      await db.insert(locationSettings).values({
        ...initialLocationSettings,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 5. SEO
      await db.insert(seoSettings).values({
        ...initialSEOSettings,
        updatedAt: new Date(),
      }).onConflictDoNothing();

      // 6. Services
      for (const s of initialServices) {
        await db.insert(services).values({
          ...s,
          features: s.features,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      // 7. Web Projects
      for (const p of initialWebProjects) {
        await db.insert(webProjects).values({
          ...p,
          additionalImages: p.additionalImages,
          technologies: p.technologies,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      // 8. Graphic Projects
      for (const g of initialGraphicProjects) {
        await db.insert(graphicProjects).values({
          ...g,
          galleryImages: g.galleryImages,
          tags: g.tags,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      // 9. Testimonials
      for (const t of initialTestimonials) {
        await db.insert(testimonials).values({
          ...t,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      // 10. Social Links
      for (const sl of initialSocialLinks) {
        await db.insert(socialLinks).values({
          ...sl,
          updatedAt: new Date(),
        }).onConflictDoNothing();
      }

      console.log('[PostgresStore] Seeding complete in PostgreSQL!');
    } catch (error) {
      console.error('[PostgresStore] Error seeding database:', error);
      throw new Error('Failed to seed PostgreSQL database', { cause: error });
    }
  }

  // --- Public Site Data ---
  public async getPublicSiteData(): Promise<PublicSiteData> {
    const now = Date.now();
    if (this.cachedPublicData && (now - this.cachedTimestamp < this.CACHE_TTL_MS)) {
      return this.cachedPublicData;
    }

    await this.initSeedIfNeeded();
    try {
      const [
        settingsList,
        aboutList,
        servicesList,
        webList,
        graphicList,
        testimonialsList,
        contactList,
        locationList,
        socialsList,
        seoList,
      ] = await Promise.all([
        db.select().from(siteSettings).where(eq(siteSettings.id, 'main')),
        db.select().from(aboutContent).where(eq(aboutContent.id, 'main')),
        db.select().from(services).where(eq(services.isPublished, true)).orderBy(asc(services.displayOrder)),
        db.select().from(webProjects).where(eq(webProjects.isPublished, true)).orderBy(asc(webProjects.displayOrder)),
        db.select().from(graphicProjects).where(eq(graphicProjects.isPublished, true)).orderBy(asc(graphicProjects.displayOrder)),
        db.select().from(testimonials).where(eq(testimonials.isPublished, true)).orderBy(asc(testimonials.displayOrder)),
        db.select().from(contactSettings).where(eq(contactSettings.id, 'main')),
        db.select().from(locationSettings).where(eq(locationSettings.id, 'main')),
        db.select().from(socialLinks).where(eq(socialLinks.isPublished, true)).orderBy(asc(socialLinks.displayOrder)),
        db.select().from(seoSettings).where(eq(seoSettings.id, 'main')),
      ]);

      const s = settingsList[0];
      const a = aboutList[0];
      const c = contactList[0];
      const l = locationList[0];
      const se = seoList[0];

      const compiledData: PublicSiteData = {
        settings: s
          ? {
              id: s.id,
              siteName: s.siteName,
              brandName: s.brandName || '',
              tagline: s.tagline,
              logoUrl: s.logoUrl,
              iconUrl: s.iconUrl,
              heroHeadline: s.heroHeadline || '',
              heroSubheadline: s.heroSubheadline,
              heroBadgeText: s.heroBadgeText,
              primaryCtaText: s.primaryCtaText,
              secondaryCtaText: s.secondaryCtaText,
              updatedAt: s.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialSiteSettings,
        about: a
          ? {
              id: a.id,
              title: a.title,
              intro: a.intro,
              bio: a.bio,
              mission: a.mission,
              vision: a.vision,
              approach: a.approach,
              highlights: (a.highlights as string[]) || [],
              updatedAt: a.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialAboutContent,
        services: servicesList.map((srv) => ({
          ...srv,
          features: (srv.features as string[]) || [],
          category: srv.category as any,
          createdAt: srv.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: srv.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        webProjects: webList.map((p) => ({
          ...p,
          additionalImages: (p.additionalImages as string[]) || [],
          technologies: (p.technologies as string[]) || [],
          createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: p.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        graphicProjects: graphicList.map((g) => ({
          ...g,
          galleryImages: (g.galleryImages as string[]) || [],
          tags: (g.tags as string[]) || [],
          createdAt: g.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: g.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        testimonials: testimonialsList.map((t) => ({
          ...t,
          createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: t.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        contact: c
          ? {
              id: c.id,
              email: c.email,
              phone: c.phone,
              whatsapp: c.whatsapp,
              description: c.description,
              businessHours: c.businessHours,
              updatedAt: c.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialContactSettings,
        location: l
          ? {
              id: l.id,
              locationName: l.locationName,
              address: l.address,
              mapLink: l.mapLink,
              coordinates: l.coordinates,
              description: l.description,
              updatedAt: l.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialLocationSettings,
        socials: socialsList.map((sl) => ({
          ...sl,
          platformName: sl.platformName,
          updatedAt: sl.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        seo: se
          ? {
              id: se.id,
              siteTitle: se.siteTitle || '',
              metaDescription: se.metaDescription,
              ogImageUrl: se.ogImageUrl || '',
              keywords: se.keywords,
              canonicalUrl: se.canonicalUrl || '',
              robotsDirective: se.robotsDirective || 'index, follow',
              updatedAt: se.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialSEOSettings,
      };

      this.cachedPublicData = compiledData;
      this.cachedTimestamp = Date.now();
      return compiledData;
    } catch (err) {
      console.error('[PostgresStore] getPublicSiteData error, returning fallback:', err);
      return {
        settings: initialSiteSettings,
        about: initialAboutContent,
        services: initialServices.map((s) => ({
          ...s,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        webProjects: initialWebProjects.map((p) => ({
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        graphicProjects: initialGraphicProjects.map((g) => ({
          ...g,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        testimonials: initialTestimonials.map((t) => ({
          ...t,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        contact: initialContactSettings,
        location: initialLocationSettings,
        socials: initialSocialLinks.map((sl) => ({
          ...sl,
          updatedAt: new Date().toISOString(),
        })),
        seo: initialSEOSettings,
      };
    }
  }

  // --- Full Admin Site Data ---
  public async getFullAdminSiteData(): Promise<PublicSiteData> {
    await this.initSeedIfNeeded();
    try {
      const [
        settingsList,
        aboutList,
        servicesList,
        webList,
        graphicList,
        testimonialsList,
        contactList,
        locationList,
        socialsList,
        seoList,
      ] = await Promise.all([
        db.select().from(siteSettings).where(eq(siteSettings.id, 'main')),
        db.select().from(aboutContent).where(eq(aboutContent.id, 'main')),
        db.select().from(services).orderBy(asc(services.displayOrder)),
        db.select().from(webProjects).orderBy(asc(webProjects.displayOrder)),
        db.select().from(graphicProjects).orderBy(asc(graphicProjects.displayOrder)),
        db.select().from(testimonials).orderBy(asc(testimonials.displayOrder)),
        db.select().from(contactSettings).where(eq(contactSettings.id, 'main')),
        db.select().from(locationSettings).where(eq(locationSettings.id, 'main')),
        db.select().from(socialLinks).orderBy(asc(socialLinks.displayOrder)),
        db.select().from(seoSettings).where(eq(seoSettings.id, 'main')),
      ]);

      const s = settingsList[0];
      const a = aboutList[0];
      const c = contactList[0];
      const l = locationList[0];
      const se = seoList[0];

      return {
        settings: s
          ? {
              id: s.id,
              siteName: s.siteName,
              brandName: s.brandName || '',
              tagline: s.tagline,
              logoUrl: s.logoUrl,
              iconUrl: s.iconUrl,
              heroHeadline: s.heroHeadline || '',
              heroSubheadline: s.heroSubheadline,
              heroBadgeText: s.heroBadgeText,
              primaryCtaText: s.primaryCtaText,
              secondaryCtaText: s.secondaryCtaText,
              updatedAt: s.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialSiteSettings,
        about: a
          ? {
              id: a.id,
              title: a.title,
              intro: a.intro,
              bio: a.bio,
              mission: a.mission,
              vision: a.vision,
              approach: a.approach,
              highlights: (a.highlights as string[]) || [],
              updatedAt: a.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialAboutContent,
        services: servicesList.map((srv) => ({
          ...srv,
          features: (srv.features as string[]) || [],
          category: srv.category as any,
          createdAt: srv.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: srv.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        webProjects: webList.map((p) => ({
          ...p,
          additionalImages: (p.additionalImages as string[]) || [],
          technologies: (p.technologies as string[]) || [],
          createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: p.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        graphicProjects: graphicList.map((g) => ({
          ...g,
          galleryImages: (g.galleryImages as string[]) || [],
          tags: (g.tags as string[]) || [],
          createdAt: g.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: g.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        testimonials: testimonialsList.map((t) => ({
          ...t,
          createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: t.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        contact: c
          ? {
              id: c.id,
              email: c.email,
              phone: c.phone,
              whatsapp: c.whatsapp,
              description: c.description,
              businessHours: c.businessHours,
              updatedAt: c.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialContactSettings,
        location: l
          ? {
              id: l.id,
              locationName: l.locationName,
              address: l.address,
              mapLink: l.mapLink,
              coordinates: l.coordinates,
              description: l.description,
              updatedAt: l.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialLocationSettings,
        socials: socialsList.map((sl) => ({
          ...sl,
          platformName: sl.platformName,
          updatedAt: sl.updatedAt?.toISOString() || new Date().toISOString(),
        })),
        seo: se
          ? {
              id: se.id,
              siteTitle: se.siteTitle || '',
              metaDescription: se.metaDescription,
              ogImageUrl: se.ogImageUrl || '',
              keywords: se.keywords,
              canonicalUrl: se.canonicalUrl || '',
              robotsDirective: se.robotsDirective || 'index, follow',
              updatedAt: se.updatedAt?.toISOString() || new Date().toISOString(),
            }
          : initialSEOSettings,
      };
    } catch (err) {
      console.error('[PostgresStore] getFullAdminSiteData error, returning fallback:', err);
      return {
        settings: initialSiteSettings,
        about: initialAboutContent,
        services: initialServices.map((s) => ({
          ...s,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        webProjects: initialWebProjects.map((p) => ({
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        graphicProjects: initialGraphicProjects.map((g) => ({
          ...g,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        testimonials: initialTestimonials.map((t) => ({
          ...t,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        contact: initialContactSettings,
        location: initialLocationSettings,
        socials: initialSocialLinks.map((sl) => ({
          ...sl,
          updatedAt: new Date().toISOString(),
        })),
        seo: initialSEOSettings,
      };
    }
  }

  // --- Admin Dashboard Stats ---
  public async getDashboardStats(): Promise<AdminDashboardStats> {
    await this.initSeedIfNeeded();
    try {
      const [
        allWeb,
        allGraphic,
        allServ,
        allTest,
        allInquiries,
      ] = await Promise.all([
        db.select().from(webProjects),
        db.select().from(graphicProjects),
        db.select().from(services),
        db.select().from(testimonials),
        db.select().from(inquiries).orderBy(desc(inquiries.createdAt)),
      ]);

      const newInquiries = allInquiries.filter((i) => i.status === 'new').length;

      const recentProjects: Array<{ id: string; title: string; type: 'web' | 'graphic'; createdAt: string }> = [
        ...allWeb.map((p) => ({
          id: p.id,
          title: p.title,
          type: 'web' as const,
          createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
        })),
        ...allGraphic.map((g) => ({
          id: g.id,
          title: g.title,
          type: 'graphic' as const,
          createdAt: g.createdAt?.toISOString() || new Date().toISOString(),
        })),
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      return {
        totalWebProjects: allWeb.length,
        totalGraphicProjects: allGraphic.length,
        totalServices: allServ.length,
        publishedServices: allServ.filter((s) => s.isPublished).length,
        publishedTestimonials: allTest.filter((t) => t.isPublished).length,
        newInquiries,
        totalInquiries: allInquiries.length,
        recentProjects,
        recentInquiries: allInquiries.slice(0, 5).map((i) => ({
          ...i,
          preferredContact: i.preferredContact as any,
          status: i.status as any,
          createdAt: i.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt: i.updatedAt?.toISOString() || new Date().toISOString(),
        })),
      };
    } catch (err) {
      console.error('[PostgresStore] getDashboardStats error:', err);
      throw new Error('Failed to retrieve dashboard stats', { cause: err });
    }
  }

  // --- Inquiries ---
  public async getInquiries(): Promise<Inquiry[]> {
    await this.initSeedIfNeeded();
    try {
      const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
      return rows.map((r) => ({
        ...r,
        preferredContact: r.preferredContact as any,
        status: r.status as any,
        createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: r.updatedAt?.toISOString() || new Date().toISOString(),
      }));
    } catch (err) {
      console.error('[PostgresStore] getInquiries error:', err);
      throw new Error('Failed to get inquiries', { cause: err });
    }
  }

  public async addInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Inquiry> {
    await this.initSeedIfNeeded();
    try {
      const id = 'inq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const [inserted] = await db
        .insert(inquiries)
        .values({
          id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          description: data.description,
          preferredContact: data.preferredContact,
          status: 'new',
        })
        .returning();

      return {
        ...inserted,
        preferredContact: inserted.preferredContact as any,
        status: inserted.status as any,
        createdAt: inserted.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: inserted.updatedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (err) {
      console.error('[PostgresStore] addInquiry error:', err);
      throw new Error('Failed to submit inquiry', { cause: err });
    }
  }

  public async updateInquiryStatus(id: string, status: 'new' | 'read' | 'archived'): Promise<Inquiry | null> {
    try {
      const [updated] = await db
        .update(inquiries)
        .set({ status, updatedAt: new Date() })
        .where(eq(inquiries.id, id))
        .returning();

      if (!updated) return null;
      return {
        ...updated,
        preferredContact: updated.preferredContact as any,
        status: updated.status as any,
        createdAt: updated.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (err) {
      console.error('[PostgresStore] updateInquiryStatus error:', err);
      throw new Error('Failed to update inquiry status', { cause: err });
    }
  }

  public async deleteInquiry(id: string): Promise<boolean> {
    try {
      const res = await db.delete(inquiries).where(eq(inquiries.id, id)).returning();
      return res.length > 0;
    } catch (err) {
      console.error('[PostgresStore] deleteInquiry error:', err);
      throw new Error('Failed to delete inquiry', { cause: err });
    }
  }

  // --- Site Settings Update ---
  public async updateSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    this.invalidateCache();
    try {
      const [updated] = await db
        .insert(siteSettings)
        .values({
          id: 'main',
          siteName: patch.siteName ?? initialSiteSettings.siteName,
          brandName: patch.brandName ?? initialSiteSettings.brandName,
          tagline: patch.tagline ?? initialSiteSettings.tagline,
          logoUrl: patch.logoUrl ?? initialSiteSettings.logoUrl,
          iconUrl: patch.iconUrl ?? initialSiteSettings.iconUrl,
          heroHeadline: patch.heroHeadline ?? initialSiteSettings.heroHeadline,
          heroSubheadline: patch.heroSubheadline ?? initialSiteSettings.heroSubheadline,
          heroBadgeText: patch.heroBadgeText ?? initialSiteSettings.heroBadgeText,
          primaryCtaText: patch.primaryCtaText ?? initialSiteSettings.primaryCtaText,
          secondaryCtaText: patch.secondaryCtaText ?? initialSiteSettings.secondaryCtaText,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSettings.id,
          set: {
            ...patch,
            updatedAt: new Date(),
          },
        })
        .returning();

      return {
        id: updated.id,
        siteName: updated.siteName,
        brandName: updated.brandName || '',
        tagline: updated.tagline,
        logoUrl: updated.logoUrl,
        iconUrl: updated.iconUrl,
        heroHeadline: updated.heroHeadline || '',
        heroSubheadline: updated.heroSubheadline,
        heroBadgeText: updated.heroBadgeText,
        primaryCtaText: updated.primaryCtaText,
        secondaryCtaText: updated.secondaryCtaText,
        updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (err) {
      console.error('[PostgresStore] updateSiteSettings error:', err);
      throw new Error('Failed to update site settings', { cause: err });
    }
  }

  // --- About Update ---
  public async updateAboutContent(patch: Partial<AboutContent>): Promise<AboutContent> {
    this.invalidateCache();
    try {
      const [updated] = await db
        .insert(aboutContent)
        .values({
          id: 'main',
          title: patch.title ?? initialAboutContent.title,
          intro: patch.intro ?? initialAboutContent.intro,
          bio: patch.bio ?? initialAboutContent.bio,
          mission: patch.mission ?? initialAboutContent.mission,
          vision: patch.vision ?? initialAboutContent.vision,
          approach: patch.approach ?? initialAboutContent.approach,
          highlights: patch.highlights ?? initialAboutContent.highlights,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: aboutContent.id,
          set: {
            ...patch,
            updatedAt: new Date(),
          },
        })
        .returning();

      return {
        id: updated.id,
        title: updated.title,
        intro: updated.intro,
        bio: updated.bio,
        mission: updated.mission,
        vision: updated.vision,
        approach: updated.approach,
        highlights: (updated.highlights as string[]) || [],
        updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (err) {
      console.error('[PostgresStore] updateAboutContent error:', err);
      throw new Error('Failed to update about content', { cause: err });
    }
  }

  // --- Contact Update ---
  public async updateContactSettings(patch: Partial<ContactSettings>): Promise<ContactSettings> {
    this.invalidateCache();
    try {
      const [updated] = await db
        .insert(contactSettings)
        .values({
          id: 'main',
          email: patch.email ?? initialContactSettings.email,
          phone: patch.phone ?? initialContactSettings.phone,
          whatsapp: patch.whatsapp ?? initialContactSettings.whatsapp,
          description: patch.description ?? initialContactSettings.description,
          businessHours: patch.businessHours ?? initialContactSettings.businessHours,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: contactSettings.id,
          set: {
            ...patch,
            updatedAt: new Date(),
          },
        })
        .returning();

      return {
        id: updated.id,
        email: updated.email,
        phone: updated.phone,
        whatsapp: updated.whatsapp,
        description: updated.description,
        businessHours: updated.businessHours,
        updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (err) {
      console.error('[PostgresStore] updateContactSettings error:', err);
      throw new Error('Failed to update contact settings', { cause: err });
    }
  }

  // --- Location Update ---
  public async updateLocationSettings(patch: Partial<LocationSettings>): Promise<LocationSettings> {
    this.invalidateCache();
    try {
      const [updated] = await db
        .insert(locationSettings)
        .values({
          id: 'main',
          locationName: patch.locationName ?? initialLocationSettings.locationName,
          address: patch.address ?? initialLocationSettings.address,
          mapLink: patch.mapLink ?? initialLocationSettings.mapLink,
          coordinates: patch.coordinates ?? initialLocationSettings.coordinates,
          description: patch.description ?? initialLocationSettings.description,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: locationSettings.id,
          set: {
            ...patch,
            updatedAt: new Date(),
          },
        })
        .returning();

      return {
        id: updated.id,
        locationName: updated.locationName,
        address: updated.address,
        mapLink: updated.mapLink,
        coordinates: updated.coordinates,
        description: updated.description,
        updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (err) {
      console.error('[PostgresStore] updateLocationSettings error:', err);
      throw new Error('Failed to update location settings', { cause: err });
    }
  }

  // --- SEO Update ---
  public async updateSEOSettings(patch: Partial<SEOSettings>): Promise<SEOSettings> {
    this.invalidateCache();
    try {
      const [updated] = await db
        .insert(seoSettings)
        .values({
          id: 'main',
          siteTitle: patch.siteTitle ?? initialSEOSettings.siteTitle,
          metaDescription: patch.metaDescription ?? initialSEOSettings.metaDescription,
          ogImageUrl: patch.ogImageUrl ?? initialSEOSettings.ogImageUrl,
          keywords: patch.keywords ?? initialSEOSettings.keywords,
          canonicalUrl: patch.canonicalUrl ?? initialSEOSettings.canonicalUrl,
          robotsDirective: patch.robotsDirective ?? initialSEOSettings.robotsDirective,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: seoSettings.id,
          set: {
            ...patch,
            updatedAt: new Date(),
          },
        })
        .returning();

      return {
        id: updated.id,
        siteTitle: updated.siteTitle || '',
        metaDescription: updated.metaDescription,
        ogImageUrl: updated.ogImageUrl || '',
        keywords: updated.keywords,
        canonicalUrl: updated.canonicalUrl || '',
        robotsDirective: updated.robotsDirective || 'index, follow',
        updatedAt: updated.updatedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (err) {
      console.error('[PostgresStore] updateSEOSettings error:', err);
      throw new Error('Failed to update SEO settings', { cause: err });
    }
  }

  // --- Services CRUD ---
  public async getServices(): Promise<ServiceItem[]> {
    const rows = await db.select().from(services).orderBy(asc(services.displayOrder));
    return rows.map((s) => ({
      ...s,
      features: (s.features as string[]) || [],
      category: s.category as any,
      createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: s.updatedAt?.toISOString() || new Date().toISOString(),
    }));
  }

  public async saveService(item: Partial<ServiceItem> & { title: string }): Promise<ServiceItem> {
    this.invalidateCache();
    const id = item.id || 'serv-' + Date.now();
    const [saved] = await db
      .insert(services)
      .values({
        id,
        title: item.title,
        category: item.category || 'web',
        iconName: item.iconName || 'Code',
        shortDescription: item.shortDescription || '',
        fullDescription: item.fullDescription || '',
        features: item.features || [],
        displayOrder: item.displayOrder ?? item.order ?? 0,
        isPublished: item.isPublished ?? true,
        isFeatured: item.isFeatured ?? false,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: services.id,
        set: {
          title: item.title,
          category: item.category || 'web',
          iconName: item.iconName || 'Code',
          shortDescription: item.shortDescription || '',
          fullDescription: item.fullDescription || '',
          features: item.features || [],
          displayOrder: item.displayOrder ?? item.order ?? 0,
          isPublished: item.isPublished ?? true,
          isFeatured: item.isFeatured ?? false,
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      ...saved,
      features: (saved.features as string[]) || [],
      category: saved.category as any,
      createdAt: saved.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: saved.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  public async deleteService(id: string): Promise<boolean> {
    this.invalidateCache();
    const res = await db.delete(services).where(eq(services.id, id)).returning();
    return res.length > 0;
  }

  // --- Web Projects CRUD ---
  public async getWebProjects(): Promise<WebProject[]> {
    const rows = await db.select().from(webProjects).orderBy(asc(webProjects.displayOrder));
    return rows.map((p) => ({
      ...p,
      additionalImages: (p.additionalImages as string[]) || [],
      technologies: (p.technologies as string[]) || [],
      createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: p.updatedAt?.toISOString() || new Date().toISOString(),
    }));
  }

  public async saveWebProject(item: Partial<WebProject> & { title: string }): Promise<WebProject> {
    this.invalidateCache();
    const id = item.id || 'web-' + Date.now();
    const [saved] = await db
      .insert(webProjects)
      .values({
        id,
        title: item.title,
        category: item.category || 'Website',
        description: item.description || '',
        mainImage: item.mainImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        additionalImages: item.additionalImages || [],
        technologies: item.technologies || [],
        projectUrl: item.projectUrl || null,
        githubUrl: item.githubUrl || null,
        displayOrder: item.displayOrder ?? item.order ?? 0,
        isFeatured: item.isFeatured ?? false,
        isPublished: item.isPublished ?? true,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: webProjects.id,
        set: {
          title: item.title,
          category: item.category || 'Website',
          description: item.description || '',
          mainImage: item.mainImage || '',
          additionalImages: item.additionalImages || [],
          technologies: item.technologies || [],
          projectUrl: item.projectUrl || null,
          githubUrl: item.githubUrl || null,
          displayOrder: item.displayOrder ?? item.order ?? 0,
          isFeatured: item.isFeatured ?? false,
          isPublished: item.isPublished ?? true,
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      ...saved,
      additionalImages: (saved.additionalImages as string[]) || [],
      technologies: (saved.technologies as string[]) || [],
      createdAt: saved.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: saved.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  public async deleteWebProject(id: string): Promise<boolean> {
    this.invalidateCache();
    const res = await db.delete(webProjects).where(eq(webProjects.id, id)).returning();
    return res.length > 0;
  }

  // --- Graphic Projects CRUD ---
  public async getGraphicProjects(): Promise<GraphicProject[]> {
    const rows = await db.select().from(graphicProjects).orderBy(asc(graphicProjects.displayOrder));
    return rows.map((g) => ({
      ...g,
      galleryImages: (g.galleryImages as string[]) || [],
      tags: (g.tags as string[]) || [],
      createdAt: g.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: g.updatedAt?.toISOString() || new Date().toISOString(),
    }));
  }

  public async saveGraphicProject(item: Partial<GraphicProject> & { title: string }): Promise<GraphicProject> {
    this.invalidateCache();
    const id = item.id || 'graph-' + Date.now();
    const [saved] = await db
      .insert(graphicProjects)
      .values({
        id,
        title: item.title,
        category: item.category || 'Graphic Design',
        description: item.description || '',
        mainImage: item.mainImage || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
        galleryImages: item.galleryImages || [],
        tags: item.tags || [],
        displayOrder: item.displayOrder ?? item.order ?? 0,
        isFeatured: item.isFeatured ?? false,
        isPublished: item.isPublished ?? true,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: graphicProjects.id,
        set: {
          title: item.title,
          category: item.category || 'Graphic Design',
          description: item.description || '',
          mainImage: item.mainImage || '',
          galleryImages: item.galleryImages || [],
          tags: item.tags || [],
          displayOrder: item.displayOrder ?? item.order ?? 0,
          isFeatured: item.isFeatured ?? false,
          isPublished: item.isPublished ?? true,
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      ...saved,
      galleryImages: (saved.galleryImages as string[]) || [],
      tags: (saved.tags as string[]) || [],
      createdAt: saved.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: saved.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  public async deleteGraphicProject(id: string): Promise<boolean> {
    this.invalidateCache();
    const res = await db.delete(graphicProjects).where(eq(graphicProjects.id, id)).returning();
    return res.length > 0;
  }

  // --- Testimonials CRUD ---
  public async getTestimonials(): Promise<Testimonial[]> {
    const rows = await db.select().from(testimonials).orderBy(asc(testimonials.displayOrder));
    return rows.map((t) => ({
      ...t,
      createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: t.updatedAt?.toISOString() || new Date().toISOString(),
    }));
  }

  public async saveTestimonial(item: Partial<Testimonial> & { clientName: string }): Promise<Testimonial> {
    this.invalidateCache();
    const id = item.id || 'test-' + Date.now();
    const [saved] = await db
      .insert(testimonials)
      .values({
        id,
        clientName: item.clientName,
        clientCompany: item.clientCompany || '',
        clientRole: item.clientRole || '',
        message: item.message || '',
        clientImage: item.clientImage || null,
        rating: item.rating ?? 5,
        displayOrder: item.displayOrder ?? item.order ?? 0,
        isFeatured: item.isFeatured ?? true,
        isPublished: item.isPublished ?? true,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: testimonials.id,
        set: {
          clientName: item.clientName,
          clientCompany: item.clientCompany || '',
          clientRole: item.clientRole || '',
          message: item.message || '',
          clientImage: item.clientImage || null,
          rating: item.rating ?? 5,
          displayOrder: item.displayOrder ?? item.order ?? 0,
          isFeatured: item.isFeatured ?? true,
          isPublished: item.isPublished ?? true,
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      ...saved,
      createdAt: saved.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: saved.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  public async deleteTestimonial(id: string): Promise<boolean> {
    this.invalidateCache();
    const res = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return res.length > 0;
  }

  // --- Social Links CRUD ---
  public async getSocialLinks(): Promise<SocialLink[]> {
    const rows = await db.select().from(socialLinks).orderBy(asc(socialLinks.displayOrder));
    return rows.map((sl) => ({
      ...sl,
      platformName: sl.platformName,
      updatedAt: sl.updatedAt?.toISOString() || new Date().toISOString(),
    }));
  }

  public async saveSocialLink(item: Partial<SocialLink> & { platform: string; url: string }): Promise<SocialLink> {
    this.invalidateCache();
    const id = item.id || item.platform.toLowerCase();
    const [saved] = await db
      .insert(socialLinks)
      .values({
        id,
        platform: item.platform,
        platformName: item.platformName || item.platform,
        url: item.url,
        icon: item.icon || 'Globe',
        displayOrder: item.displayOrder ?? item.order ?? 0,
        isPublished: item.isPublished ?? item.isEnabled ?? true,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: socialLinks.id,
        set: {
          platform: item.platform,
          platformName: item.platformName || item.platform,
          url: item.url,
          icon: item.icon || 'Globe',
          displayOrder: item.displayOrder ?? item.order ?? 0,
          isPublished: item.isPublished ?? item.isEnabled ?? true,
          updatedAt: new Date(),
        },
      })
      .returning();

    return {
      ...saved,
      platformName: saved.platformName,
      updatedAt: saved.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  public async deleteSocialLink(id: string): Promise<boolean> {
    this.invalidateCache();
    const res = await db.delete(socialLinks).where(eq(socialLinks.id, id)).returning();
    return res.length > 0;
  }

  // --- PostgreSQL Media Storage (Files + Binary Data) - NO BUCKETS NEEDED ---
  public async getMediaFiles(): Promise<MediaItem[]> {
    const rows = await db.select().from(mediaFiles).orderBy(desc(mediaFiles.createdAt));
    return rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      originalName: r.originalName,
      mimeType: r.mimeType,
      size: r.size,
      url: r.url,
      provider: 'postgres' as any,
      createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
    }));
  }

  public async storeMediaInPostgres(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<MediaItem> {
    const id = 'media-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
    const filename = `${id}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const base64Data = fileBuffer.toString('base64');
    const url = `/api/media/blob/${id}`;

    // Store metadata
    await db.insert(mediaFiles).values({
      id,
      filename,
      originalName,
      mimeType,
      size: fileBuffer.length,
      url,
      provider: 'postgres',
    });

    // Store actual binary blob in Postgres
    await db.insert(mediaBlobs).values({
      id,
      data: base64Data,
      mimeType,
    });

    return {
      id,
      filename,
      originalName,
      mimeType,
      size: fileBuffer.length,
      url,
      provider: 'postgres' as any,
      createdAt: new Date().toISOString(),
    };
  }

  public async getMediaBlob(id: string): Promise<{ data: Buffer; mimeType: string } | null> {
    try {
      const rows = await db.select().from(mediaBlobs).where(eq(mediaBlobs.id, id));
      if (rows.length === 0) return null;
      const blob = rows[0];
      const buffer = Buffer.from(blob.data, 'base64');
      return {
        data: buffer,
        mimeType: blob.mimeType,
      };
    } catch (err) {
      console.error('[PostgresStore] getMediaBlob error:', err);
      return null;
    }
  }

  public async deleteMedia(id: string): Promise<boolean> {
    try {
      await db.delete(mediaBlobs).where(eq(mediaBlobs.id, id));
      const res = await db.delete(mediaFiles).where(eq(mediaFiles.id, id)).returning();
      return res.length > 0;
    } catch (err) {
      console.error('[PostgresStore] deleteMedia error:', err);
      throw new Error('Failed to delete media item', { cause: err });
    }
  }

  // ==========================================
  // ACTIVITY & SECURITY AUDIT LOGGING
  // ==========================================

  public async recordActivity(
    data: Omit<ActivityLog, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
  ): Promise<ActivityLog> {
    const id = data.id || `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = data.timestamp || new Date().toISOString();

    const logEntry: ActivityLog = {
      id,
      type: data.type,
      title: data.title,
      description: data.description,
      severity: data.severity,
      ip: data.ip,
      userAgent: data.userAgent,
      location: data.location,
      path: data.path,
      timestamp,
      metadata: data.metadata,
    };

    // Keep in-memory copy (limit to 500)
    this.memoryActivityLogs.unshift(logEntry);
    if (this.memoryActivityLogs.length > 500) {
      this.memoryActivityLogs.pop();
    }

    // Persist to PostgreSQL
    try {
      await db.insert(activityLogs).values({
        id: logEntry.id,
        type: logEntry.type,
        title: logEntry.title,
        description: logEntry.description,
        severity: logEntry.severity,
        ip: logEntry.ip,
        userAgent: logEntry.userAgent || null,
        location: logEntry.location || null,
        path: logEntry.path || null,
        metadata: logEntry.metadata || null,
        createdAt: new Date(timestamp),
      });
    } catch (dbErr) {
      console.warn('[PostgresStore] Failed to insert activity log to DB (fallback to in-memory):', dbErr);
    }

    return logEntry;
  }

  public async getActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
    try {
      const rows = await db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit);

      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          type: r.type as any,
          title: r.title,
          description: r.description,
          severity: r.severity as any,
          ip: r.ip,
          userAgent: r.userAgent || undefined,
          location: r.location || undefined,
          path: r.path || undefined,
          timestamp: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          metadata: r.metadata as any,
        }));
      }
    } catch (err) {
      console.warn('[PostgresStore] getActivityLogs DB query failed, using in-memory:', err);
    }

    return this.memoryActivityLogs.slice(0, limit);
  }

  public async clearActivityLogs(): Promise<void> {
    try {
      await db.delete(activityLogs);
    } catch (err) {
      console.warn('[PostgresStore] Failed to delete activity logs from DB:', err);
    }
    this.memoryActivityLogs = [];
  }

  public async getSecurityStats(): Promise<SecurityStats> {
    const logs = await this.getActivityLogs(250);

    const loginSuccesses = logs.filter((l) => l.type === 'login_success');
    const loginFailures = logs.filter((l) => l.type === 'login_failed');
    const hackAttempts = logs.filter((l) => l.type === 'hack_attempt' || l.type === 'security_alert');

    const lastLogin = loginSuccesses[0];

    const threatLevel: 'normal' | 'elevated' | 'high' =
      hackAttempts.length >= 5 ? 'high' : hackAttempts.length > 0 || loginFailures.length >= 3 ? 'elevated' : 'normal';

    return {
      totalLogins: loginSuccesses.length,
      lastLoginTime: lastLogin ? lastLogin.timestamp : null,
      lastLoginIp: lastLogin ? lastLogin.ip : null,
      failedLoginsCount: loginFailures.length,
      blockedAttacksCount: hackAttempts.length,
      threatLevel,
      activeFirewallRulesCount: 18,
      recentAttacks: hackAttempts.slice(0, 10),
    };
  }
}

export const postgresStore = PostgresStore.getInstance();
