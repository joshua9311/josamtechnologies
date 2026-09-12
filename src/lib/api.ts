import { PublicSiteData, AdminDashboardStats, Inquiry, ActivityLog, SecurityStats } from '../types';

const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('josam_admin_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('josam_admin_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('josam_admin_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data.error) errorMsg = data.error;
    } catch {
      // Fallback
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Public
  getPublicSiteData: () => request<PublicSiteData>('/site-data'),
  
  submitInquiry: (data: {
    name: string;
    email: string;
    phone: string;
    service: string;
    description: string;
    preferredContact: 'email' | 'whatsapp' | 'phone';
  }) =>
    request<{ success: boolean; message: string; inquiryId: string }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Auth
  login: (credentials: { email?: string; identifier?: string; username?: string; password: string }) =>
    request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () => request<{ user: any }>('/auth/me'),

  // Admin Dashboard
  getAdminSiteData: () => request<any>('/admin/site-data'),
  getDashboardStats: () => request<AdminDashboardStats>('/admin/dashboard'),
  updateProfile: (data: { name?: string; email?: string }) =>
    request<{ success: boolean; user: any }>('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ success: boolean; message: string }>('/admin/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Settings & Content
  updateSettings: (data: any) =>
    request<any>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateAbout: (data: any) =>
    request<any>('/admin/about', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Services
  getAdminServices: () => request<any[]>('/admin/services'),
  createService: (data: any) =>
    request<any>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateService: (id: string, data: any) =>
    request<any>(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteService: (id: string) =>
    request<{ success: boolean }>(`/admin/services/${id}`, {
      method: 'DELETE',
    }),

  // Web Projects
  getAdminWebProjects: () => request<any[]>('/admin/web-projects'),
  createWebProject: (data: any) =>
    request<any>('/admin/web-projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateWebProject: (id: string, data: any) =>
    request<any>(`/admin/web-projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteWebProject: (id: string) =>
    request<{ success: boolean }>(`/admin/web-projects/${id}`, {
      method: 'DELETE',
    }),

  // Graphic Projects
  getAdminGraphicProjects: () => request<any[]>('/admin/graphic-projects'),
  createGraphicProject: (data: any) =>
    request<any>('/admin/graphic-projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateGraphicProject: (id: string, data: any) =>
    request<any>(`/admin/graphic-projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteGraphicProject: (id: string) =>
    request<{ success: boolean }>(`/admin/graphic-projects/${id}`, {
      method: 'DELETE',
    }),

  // Testimonials
  getAdminTestimonials: () => request<any[]>('/admin/testimonials'),
  createTestimonial: (data: any) =>
    request<any>('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTestimonial: (id: string, data: any) =>
    request<any>(`/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTestimonial: (id: string) =>
    request<{ success: boolean }>(`/admin/testimonials/${id}`, {
      method: 'DELETE',
    }),

  // Inquiries
  getAdminInquiries: () => request<Inquiry[]>('/admin/inquiries'),
  getInquiries: () => request<Inquiry[]>('/admin/inquiries'),
  updateInquiryStatus: (id: string, status: 'new' | 'read' | 'archived') =>
    request<Inquiry>(`/admin/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteInquiry: (id: string) =>
    request<{ success: boolean }>(`/admin/inquiries/${id}`, {
      method: 'DELETE',
    }),

  // Contact & Location & Socials
  updateContact: (data: any) =>
    request<any>('/admin/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateLocation: (data: any) =>
    request<any>('/admin/location', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getAdminSocials: () => request<any[]>('/admin/socials'),
  createSocial: (data: any) =>
    request<any>('/admin/socials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSocial: (id: string, data: any) =>
    request<any>(`/admin/socials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSocial: (id: string) =>
    request<{ success: boolean }>(`/admin/socials/${id}`, {
      method: 'DELETE',
    }),

  // SEO
  updateSEO: (data: any) =>
    request<any>('/admin/seo', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Media
  getAdminMedia: () => request<any[]>('/admin/media'),
  getMediaList: () => request<any[]>('/admin/media'),
  uploadMedia: (formData: FormData) =>
    request<{ success: boolean; media: any }>('/admin/media/upload', {
      method: 'POST',
      body: formData,
    }),
  deleteMedia: (id: string) =>
    request<{ success: boolean }>(`/admin/media/${id}`, {
      method: 'DELETE',
    }),

  // Backup & Reset
  exportBackupUrl: `${API_BASE}/admin/backup/export`,
  exportBackup: () => request<any>('/admin/backup/export'),
  restoreBackup: (backupData: any) =>
    request<{ success: boolean; message: string }>('/admin/backup/restore', {
      method: 'POST',
      body: JSON.stringify(backupData),
    }),
  resetSeed: () =>
    request<{ success: boolean; message: string }>('/admin/backup/reset-seed', {
      method: 'POST',
    }),

  // Activity & Cybersecurity Logs
  getSecurityLogs: (limit: number = 100) =>
    request<ActivityLog[]>(`/admin/security/logs?limit=${limit}`),
  getSecurityStats: () =>
    request<SecurityStats>('/admin/security/stats'),
  clearSecurityLogs: () =>
    request<{ success: boolean; message: string }>('/admin/security/logs', {
      method: 'DELETE',
    }),
  simulateSecurityProbe: (type: 'sql_injection_probe' | 'path_traversal_probe' | 'scanner_probe' = 'sql_injection_probe') =>
    request<{ success: boolean; message: string; log: ActivityLog }>('/admin/security/simulate-probe', {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),
};
