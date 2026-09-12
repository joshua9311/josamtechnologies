import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  AdminUser,
  SiteSettings,
  AboutContent,
  ServiceItem,
  WebProject,
  GraphicProject,
  Testimonial,
  Inquiry,
  ContactSettings,
  LocationSettings,
  SocialLink,
  MediaFile,
  SEOSettings,
  PublicSiteData,
  AdminDashboardStats
} from '../../types';
import {
  initialSiteSettings,
  initialAboutContent,
  initialServices,
  initialWebProjects,
  initialGraphicProjects,
  initialTestimonials,
  initialContactSettings,
  initialLocationSettings,
  initialSocialLinks,
  initialSEOSettings
} from './seedData';

interface DatabaseSchema {
  adminUsers: AdminUser[];
  siteSettings: SiteSettings;
  aboutContent: AboutContent;
  services: ServiceItem[];
  webProjects: WebProject[];
  graphicProjects: GraphicProject[];
  testimonials: Testimonial[];
  inquiries: Inquiry[];
  contactSettings: ContactSettings;
  locationSettings: LocationSettings;
  socialLinks: SocialLink[];
  mediaFiles: MediaFile[];
  seoSettings: SEOSettings;
}

class Store {
  private dataFile: string;
  private db: DatabaseSchema;
  private isInitialized = false;

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dataFile = path.join(dataDir, 'db.json');
    this.db = this.loadOrInit();
  }

  private loadOrInit(): DatabaseSchema {
    if (fs.existsSync(this.dataFile)) {
      try {
        const raw = fs.readFileSync(this.dataFile, 'utf-8');
        const parsed = JSON.parse(raw);
        this.isInitialized = true;
        return parsed;
      } catch (e) {
        console.error('Failed to parse database file, reinitializing with seed data', e);
      }
    }

    // Initialize with seed data
    const initialAdminPassword = process.env.ADMIN_PASSWORD || 'JosamAdmin2026!';
    const initialAdminEmail = process.env.ADMIN_EMAIL || 'admin@josamtech.com';
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(initialAdminPassword, salt);

    const initialDb: DatabaseSchema = {
      adminUsers: [
        {
          id: 'admin-1',
          email: initialAdminEmail.toLowerCase().trim(),
          name: 'Josam Admin',
          passwordHash,
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: null
        }
      ],
      siteSettings: initialSiteSettings,
      aboutContent: initialAboutContent,
      services: initialServices,
      webProjects: initialWebProjects,
      graphicProjects: initialGraphicProjects,
      testimonials: initialTestimonials,
      inquiries: [],
      contactSettings: initialContactSettings,
      locationSettings: initialLocationSettings,
      socialLinks: initialSocialLinks,
      mediaFiles: [],
      seoSettings: initialSEOSettings,
    };

    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(initialDb, null, 2), 'utf-8');
      this.isInitialized = true;
    } catch (err) {
      console.error('Error writing initial db.json', err);
    }

    return initialDb;
  }

  private persist(): void {
    try {
      const tempPath = `${this.dataFile}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.dataFile);
    } catch (err) {
      console.error('Failed to persist database state:', err);
    }
  }

  // --- Public Site Data ---
  getPublicSiteData(): PublicSiteData {
    return {
      settings: this.db.siteSettings,
      about: this.db.aboutContent,
      services: this.db.services
        .filter(s => s.isPublished)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      webProjects: this.db.webProjects
        .filter(p => p.isPublished)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      graphicProjects: this.db.graphicProjects
        .filter(p => p.isPublished)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      testimonials: this.db.testimonials
        .filter(t => t.isPublished)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      contact: this.db.contactSettings,
      location: this.db.locationSettings,
      socials: this.db.socialLinks
        .filter(s => s.isPublished)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      seo: this.db.seoSettings,
    };
  }

  getFullAdminSiteData(): PublicSiteData {
    return {
      settings: this.db.siteSettings,
      about: this.db.aboutContent,
      services: [...this.db.services].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      webProjects: [...this.db.webProjects].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      graphicProjects: [...this.db.graphicProjects].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      testimonials: [...this.db.testimonials].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      contact: this.db.contactSettings,
      location: this.db.locationSettings,
      socials: [...this.db.socialLinks].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
      seo: this.db.seoSettings,
    };
  }

  // --- Admin Stats ---
  getDashboardStats(): AdminDashboardStats {
    const unreadInquiries = this.db.inquiries.filter(i => i.status === 'new').length;
    const recentProjects = [
      ...this.db.webProjects.map(p => ({ id: p.id, title: p.title, type: 'web' as const, createdAt: p.createdAt })),
      ...this.db.graphicProjects.map(p => ({ id: p.id, title: p.title, type: 'graphic' as const, createdAt: p.createdAt }))
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const recentInquiries = [...this.db.inquiries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalWebProjects: this.db.webProjects.length,
      totalGraphicProjects: this.db.graphicProjects.length,
      publishedServices: this.db.services.filter(s => s.isPublished).length,
      publishedTestimonials: this.db.testimonials.filter(t => t.isPublished).length,
      newInquiries: unreadInquiries,
      totalInquiries: this.db.inquiries.length,
      recentProjects,
      recentInquiries,
    };
  }

  // --- Admin User Management ---
  findAdminByEmail(email: string): AdminUser | undefined {
    return this.db.adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  findAdminById(id: string): AdminUser | undefined {
    return this.db.adminUsers.find(u => u.id === id);
  }

  updateAdminLogin(id: string): void {
    const user = this.findAdminById(id);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      this.persist();
    }
  }

  updateAdminPassword(id: string, newPasswordHash: string): boolean {
    const user = this.findAdminById(id);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date().toISOString();
    this.persist();
    return true;
  }

  updateAdminProfile(id: string, data: { name?: string; email?: string }): AdminUser | null {
    const user = this.findAdminById(id);
    if (!user) return null;
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email.toLowerCase().trim();
    user.updatedAt = new Date().toISOString();
    this.persist();
    return user;
  }

  // --- Site Settings ---
  getSiteSettings(): SiteSettings {
    return this.db.siteSettings;
  }

  updateSiteSettings(data: Partial<SiteSettings>): SiteSettings {
    this.db.siteSettings = {
      ...this.db.siteSettings,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.siteSettings;
  }

  // --- About Content ---
  getAboutContent(): AboutContent {
    return this.db.aboutContent;
  }

  updateAboutContent(data: Partial<AboutContent>): AboutContent {
    this.db.aboutContent = {
      ...this.db.aboutContent,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.aboutContent;
  }

  // --- Services ---
  getAllServices(): ServiceItem[] {
    return [...this.db.services].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getServiceById(id: string): ServiceItem | undefined {
    return this.db.services.find(s => s.id === id);
  }

  createService(data: Omit<ServiceItem, 'id' | 'createdAt' | 'updatedAt'>): ServiceItem {
    const newService: ServiceItem = {
      ...data,
      id: `srv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.services.push(newService);
    this.persist();
    return newService;
  }

  updateService(id: string, data: Partial<ServiceItem>): ServiceItem | null {
    const index = this.db.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.db.services[index] = {
      ...this.db.services[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.services[index];
  }

  deleteService(id: string): boolean {
    const initLen = this.db.services.length;
    this.db.services = this.db.services.filter(s => s.id !== id);
    if (this.db.services.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Web Projects ---
  getAllWebProjects(): WebProject[] {
    return [...this.db.webProjects].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getWebProjectById(id: string): WebProject | undefined {
    return this.db.webProjects.find(p => p.id === id);
  }

  createWebProject(data: Omit<WebProject, 'id' | 'createdAt' | 'updatedAt'>): WebProject {
    const project: WebProject = {
      ...data,
      id: `proj-web-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.webProjects.push(project);
    this.persist();
    return project;
  }

  updateWebProject(id: string, data: Partial<WebProject>): WebProject | null {
    const index = this.db.webProjects.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.db.webProjects[index] = {
      ...this.db.webProjects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.webProjects[index];
  }

  deleteWebProject(id: string): boolean {
    const initLen = this.db.webProjects.length;
    this.db.webProjects = this.db.webProjects.filter(p => p.id !== id);
    if (this.db.webProjects.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Graphic Projects ---
  getAllGraphicProjects(): GraphicProject[] {
    return [...this.db.graphicProjects].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getGraphicProjectById(id: string): GraphicProject | undefined {
    return this.db.graphicProjects.find(p => p.id === id);
  }

  createGraphicProject(data: Omit<GraphicProject, 'id' | 'createdAt' | 'updatedAt'>): GraphicProject {
    const project: GraphicProject = {
      ...data,
      id: `proj-graphic-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.graphicProjects.push(project);
    this.persist();
    return project;
  }

  updateGraphicProject(id: string, data: Partial<GraphicProject>): GraphicProject | null {
    const index = this.db.graphicProjects.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.db.graphicProjects[index] = {
      ...this.db.graphicProjects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.graphicProjects[index];
  }

  deleteGraphicProject(id: string): boolean {
    const initLen = this.db.graphicProjects.length;
    this.db.graphicProjects = this.db.graphicProjects.filter(p => p.id !== id);
    if (this.db.graphicProjects.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Testimonials ---
  getAllTestimonials(): Testimonial[] {
    return [...this.db.testimonials].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Testimonial {
    const testimonial: Testimonial = {
      ...data,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.testimonials.push(testimonial);
    this.persist();
    return testimonial;
  }

  updateTestimonial(id: string, data: Partial<Testimonial>): Testimonial | null {
    const index = this.db.testimonials.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.db.testimonials[index] = {
      ...this.db.testimonials[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.testimonials[index];
  }

  deleteTestimonial(id: string): boolean {
    const initLen = this.db.testimonials.length;
    this.db.testimonials = this.db.testimonials.filter(t => t.id !== id);
    if (this.db.testimonials.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Inquiries ---
  getAllInquiries(): Inquiry[] {
    return [...this.db.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createInquiry(data: {
    name: string;
    email: string;
    phone: string;
    service: string;
    description: string;
    preferredContact: 'email' | 'whatsapp' | 'phone';
  }): Inquiry {
    const inquiry: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.inquiries.push(inquiry);
    this.persist();
    return inquiry;
  }

  updateInquiryStatus(id: string, status: 'new' | 'read' | 'archived'): Inquiry | null {
    const inquiry = this.db.inquiries.find(i => i.id === id);
    if (!inquiry) return null;
    inquiry.status = status;
    inquiry.updatedAt = new Date().toISOString();
    this.persist();
    return inquiry;
  }

  deleteInquiry(id: string): boolean {
    const initLen = this.db.inquiries.length;
    this.db.inquiries = this.db.inquiries.filter(i => i.id !== id);
    if (this.db.inquiries.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Contact & Location ---
  getContactSettings(): ContactSettings {
    return this.db.contactSettings;
  }

  updateContactSettings(data: Partial<ContactSettings>): ContactSettings {
    this.db.contactSettings = {
      ...this.db.contactSettings,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.contactSettings;
  }

  getLocationSettings(): LocationSettings {
    return this.db.locationSettings;
  }

  updateLocationSettings(data: Partial<LocationSettings>): LocationSettings {
    this.db.locationSettings = {
      ...this.db.locationSettings,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.locationSettings;
  }

  // --- Social Links ---
  getAllSocialLinks(): SocialLink[] {
    return [...this.db.socialLinks].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  createSocialLink(data: Omit<SocialLink, 'id' | 'updatedAt'>): SocialLink {
    const link: SocialLink = {
      ...data,
      id: `soc-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    this.db.socialLinks.push(link);
    this.persist();
    return link;
  }

  updateSocialLink(id: string, data: Partial<SocialLink>): SocialLink | null {
    const index = this.db.socialLinks.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.db.socialLinks[index] = {
      ...this.db.socialLinks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.socialLinks[index];
  }

  deleteSocialLink(id: string): boolean {
    const initLen = this.db.socialLinks.length;
    this.db.socialLinks = this.db.socialLinks.filter(s => s.id !== id);
    if (this.db.socialLinks.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Media Files ---
  getAllMedia(): MediaFile[] {
    return [...this.db.mediaFiles].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addMediaFile(media: Omit<MediaFile, 'id' | 'createdAt'>): MediaFile {
    const file: MediaFile = {
      ...media,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.db.mediaFiles.push(file);
    this.persist();
    return file;
  }

  deleteMediaFile(id: string): MediaFile | null {
    const file = this.db.mediaFiles.find(m => m.id === id);
    if (!file) return null;
    this.db.mediaFiles = this.db.mediaFiles.filter(m => m.id !== id);
    this.persist();
    return file;
  }

  // --- SEO Settings ---
  getSEOSettings(): SEOSettings {
    return this.db.seoSettings;
  }

  updateSEOSettings(data: Partial<SEOSettings>): SEOSettings {
    this.db.seoSettings = {
      ...this.db.seoSettings,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.db.seoSettings;
  }

  // --- Backup & Restore ---
  exportFullBackup(): DatabaseSchema {
    return JSON.parse(JSON.stringify(this.db));
  }

  restoreBackup(backupData: Partial<DatabaseSchema>): boolean {
    try {
      if (backupData.siteSettings) this.db.siteSettings = backupData.siteSettings;
      if (backupData.aboutContent) this.db.aboutContent = backupData.aboutContent;
      if (Array.isArray(backupData.services)) this.db.services = backupData.services;
      if (Array.isArray(backupData.webProjects)) this.db.webProjects = backupData.webProjects;
      if (Array.isArray(backupData.graphicProjects)) this.db.graphicProjects = backupData.graphicProjects;
      if (Array.isArray(backupData.testimonials)) this.db.testimonials = backupData.testimonials;
      if (Array.isArray(backupData.inquiries)) this.db.inquiries = backupData.inquiries;
      if (backupData.contactSettings) this.db.contactSettings = backupData.contactSettings;
      if (backupData.locationSettings) this.db.locationSettings = backupData.locationSettings;
      if (Array.isArray(backupData.socialLinks)) this.db.socialLinks = backupData.socialLinks;
      if (Array.isArray(backupData.mediaFiles)) this.db.mediaFiles = backupData.mediaFiles;
      if (backupData.seoSettings) this.db.seoSettings = backupData.seoSettings;
      
      this.persist();
      return true;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  }

  resetToSeed(): void {
    const initialAdminPassword = process.env.ADMIN_PASSWORD || 'JosamAdmin2026!';
    const initialAdminEmail = process.env.ADMIN_EMAIL || 'admin@josamtech.com';
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(initialAdminPassword, salt);

    this.db = {
      adminUsers: [
        {
          id: 'admin-1',
          email: initialAdminEmail.toLowerCase().trim(),
          name: 'Josam Admin',
          passwordHash,
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: null
        }
      ],
      siteSettings: initialSiteSettings,
      aboutContent: initialAboutContent,
      services: initialServices,
      webProjects: initialWebProjects,
      graphicProjects: initialGraphicProjects,
      testimonials: initialTestimonials,
      inquiries: [],
      contactSettings: initialContactSettings,
      locationSettings: initialLocationSettings,
      socialLinks: initialSocialLinks,
      mediaFiles: [],
      seoSettings: initialSEOSettings,
    };
    this.persist();
  }
}

export const store = new Store();
