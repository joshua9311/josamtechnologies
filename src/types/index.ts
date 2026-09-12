export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  passwordHash?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  brandName?: string; // alias
  tagline: string;
  logoUrl: string;
  iconUrl: string;
  heroHeadline?: string;
  heroSubheadline: string;
  heroBadgeText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  updatedAt: string;
}

export interface AboutContent {
  id: string;
  title: string;
  intro: string;
  bio: string;
  mission: string;
  vision: string;
  approach: string;
  highlights: string[];
  updatedAt: string;
}

export type ServiceCategory = 'web' | 'graphic' | 'cyber' | 'other';

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  iconName: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  displayOrder?: number;
  order?: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebProject {
  id: string;
  title: string;
  category: string;
  description: string;
  mainImage: string;
  additionalImages: string[];
  technologies: string[];
  projectUrl?: string | null;
  githubUrl?: string | null;
  displayOrder?: number;
  order?: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GraphicProject {
  id: string;
  title: string;
  category: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  tags: string[];
  displayOrder?: number;
  order?: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientCompany: string;
  clientRole: string;
  message: string;
  clientImage?: string | null;
  rating: number;
  displayOrder?: number;
  order?: number;
  isFeatured?: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InquiryStatus = 'new' | 'read' | 'archived';
export type PreferredContact = 'email' | 'whatsapp' | 'phone';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  description: string;
  preferredContact: PreferredContact;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSettings {
  id: string;
  email: string;
  phone: string;
  whatsapp: string;
  description: string;
  businessHours: string;
  updatedAt: string;
}

export interface LocationSettings {
  id: string;
  locationName: string;
  address: string;
  mapLink: string;
  coordinates: string;
  description: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  platformName: string;
  url: string;
  icon: string;
  displayOrder?: number;
  order?: number;
  isPublished?: boolean;
  isEnabled?: boolean;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  provider: 'local' | 's3' | 'cloudinary';
  createdAt: string;
}

export type MediaFile = MediaItem;

export interface SEOSettings {
  id: string;
  siteTitle?: string;
  metaTitle?: string;
  metaDescription: string;
  ogImageUrl?: string;
  ogImage?: string;
  keywords: string;
  canonicalUrl?: string;
  robotsDirective?: string;
  updatedAt: string;
}

export interface PublicSiteData {
  settings: SiteSettings;
  about: AboutContent;
  services: ServiceItem[];
  webProjects: WebProject[];
  graphicProjects: GraphicProject[];
  testimonials: Testimonial[];
  contact: ContactSettings;
  location: LocationSettings;
  socials: SocialLink[];
  seo: SEOSettings;
}

export interface AdminSiteData extends PublicSiteData {}

export interface AdminDashboardStats {
  totalWebProjects: number;
  totalGraphicProjects: number;
  totalServices?: number;
  publishedServices: number;
  publishedTestimonials: number;
  newInquiries: number;
  totalInquiries: number;
  recentProjects: Array<{ id: string; title: string; type: 'web' | 'graphic'; createdAt: string }>;
  recentInquiries: Inquiry[];
}

export interface AuthState {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
}

export type ActivityType =
  | 'login_success'
  | 'login_failed'
  | 'hack_attempt'
  | 'security_alert'
  | 'unauthorized_access'
  | 'data_update'
  | 'admin_action';

export type ActivitySeverity = 'info' | 'success' | 'warning' | 'danger';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  severity: ActivitySeverity;
  ip: string;
  userAgent?: string;
  location?: string;
  path?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SecurityStats {
  totalLogins: number;
  lastLoginTime: string | null;
  lastLoginIp: string | null;
  failedLoginsCount: number;
  blockedAttacksCount: number;
  threatLevel: 'normal' | 'elevated' | 'high';
  activeFirewallRulesCount: number;
  recentAttacks: ActivityLog[];
}
