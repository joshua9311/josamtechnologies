# Josam Technologies — Full-Stack Digital Agency & CMS Platform

A high-performance full-stack web application and content management system for **Josam Technologies**, a modern digital technology brand specializing in **Full-Stack Web Development**, **Graphic Design & Brand Identity**, and **Cyber & Online Digital Services** (KRA, HELB, eCitizen, Student & Business Portals).

---

## 🎨 Brand Identity & Aesthetic Principles

- **Primary Colors**:
  - Primary Accent: `#F97316` (Vibrant Warm Orange)
  - Secondary Accent: `#FACC15` (Warm Golden Amber)
  - Dark Surface: `#18181B` (Deep Zinc Slate)
  - Light Background: `#FAFAF9` (Warm Stone)
  - Typography: `Outfit` for expressive headings, `Plus Jakarta Sans` for clean body copy, `JetBrains Mono` for code and specs.
- **Strict Pricing Policy**: No prices are displayed across the site. All inquiries funnel directly to tailored consultations via the **"Let's Work Together"** CTA and direct WhatsApp channel.

---

## 🚀 Key Features

### 1. Public Showcase Website
- **Hero & Value Proposition**: High-impact brand tagline, core capability highlights, and quick project consultation CTAs.
- **Services Portfolio**: Filterable overview of web engineering, brand identity & graphic design, and cyber/digital assistance.
- **Interactive Web Development Showcase**: Live links, tech stack badges, and deep-dive modals.
- **Graphic Design Gallery**: High-resolution image zoom and category filtering.
- **Cyber & Digital Services Section**: Clear overview of e-government services (KRA, HELB, eCitizen).
- **Client Testimonials & Trust Indicators**: Verified client reviews and star ratings.
- **Lead Capture & Project Inquiry Form**: Interactive quote and consultation request form with anti-spam rate limiting.
- **Physical Hub & GPS Map Coordinates**: Complete location details, office hours, and navigation links.
- **Floating WhatsApp Quick Connect**: Floating action button with pre-filled greeting.

### 2. Admin Content Management System (CMS)
- **Protected Authentication**: Secure JWT-based admin authentication with bcrypt password hashing and brute-force attempt throttling.
- **Comprehensive Admin Dashboard**:
  - **Site Branding & Hero**: Edit brand name, hero headlines, subheadlines, badges, and CTAs.
  - **About Story & Vision**: Update company story, mission, vision, and strategic approach.
  - **Services Manager**: Full CRUD, reordering, publishing toggle, and feature bullets.
  - **Web Projects Manager**: Upload screenshots, add tech stack tags, live URLs, GitHub repos, and featured flags.
  - **Graphic Design Manager**: Manage portfolio pieces, tags, and gallery images.
  - **Testimonials Manager**: Manage client feedback, ratings, and display order.
  - **Inquiry & Leads Inbox**: Review customer project inquiries, update statuses (`new` -> `read` -> `archived`), and filter leads.
  - **Contact & Physical Location**: Configure phone, WhatsApp, email, GPS coordinates, Google Maps URL, and hours.
  - **Social Media Links**: Manage profiles and visibility.
  - **SEO & Meta Tags**: Real-time management of site titles, meta descriptions, Open Graph preview images, and keywords.
  - **Media Library**: Drag-and-drop file upload manager with pluggable storage providers.
  - **Backup & Reset**: One-click JSON data export, snapshot restore, and factory reset to default seed data.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons.
- **Backend API**: Express.js (Node.js) with type-safe routing.
- **Database / Store**: Modular JSON store with atomic file writes and pluggable adapters.
- **Storage Layer**: Flexible `StorageProvider` abstraction supporting `local` filesystem storage, Amazon S3, and Cloudinary.
- **Security**: JWT tokens, bcrypt password hashing, IP rate limiting, input validation, and sanitized uploads.

---

## 📦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```env
ADMIN_EMAIL="admin@josamtech.com"
ADMIN_PASSWORD="JosamAdmin2026!"
JWT_SECRET="your-jwt-auth-token-secret-key-min-32-chars"
STORAGE_PROVIDER="local"
```

### 3. Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### 4. Default Admin Credentials
- **URL**: Click the "Admin Portal" button in the navigation or visit `#admin`
- **Email**: `admin@josamtech.com`
- **Password**: `JosamAdmin2026!`

*(A quick "Autofill Demo Credentials" button is provided on the admin login page for convenience)*

---

## 📄 License
MIT © Josam Technologies
