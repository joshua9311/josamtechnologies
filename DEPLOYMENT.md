# Josam Technologies — Production Deployment Guide

This guide outlines the production deployment setup for **Josam Technologies** using:
1. **Frontend & Backend Hosting**: Dedicated Node.js runtime on [Render](https://render.com) or [Railway](https://railway.app).
2. **Managed Database**: Serverless PostgreSQL on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
3. **Edge CDN & DDoS Shield**: [Cloudflare](https://cloudflare.com) (Free Tier).

---

## 1. Local Setup in VS Code

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your secrets:
   ```env
   NODE_ENV=development
   JWT_SECRET=super-secure-production-jwt-key-2026
   ADMIN_EMAIL=joshuamwenda36@gmail.com
   ADMIN_PASSWORD=9311@Josh
   ```

3. **Run Locally**:
   ```bash
   npm run dev
   ```
   Access the website at `http://localhost:3000` and the Admin Portal at `http://localhost:3000/admin`.

---

## 2. Deploying to Production (Render / Railway)

### Step A: Push Code to GitHub
```bash
git init
git add .
git commit -m "Josam Technologies production release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/josam-technologies.git
git push -u origin main
```

### Step B: Create a Free Managed PostgreSQL Database
Choose **Neon.tech** or **Supabase**:
1. Create a free project named `josam-technologies`.
2. Copy the **PostgreSQL Connection String** (`DATABASE_URL`):
   ```
   postgres://username:password@ep-sample-12345.eu-central-1.neon.tech/neondb?sslmode=require
   ```

### Step C: Deploy Web Service on Render
1. In [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Set the following build settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `[Paste your Neon/Supabase connection string]`
   - `JWT_SECRET` = `[A secure 32+ character random string]`
   - `ADMIN_EMAIL` = `joshuamwenda36@gmail.com`
   - `ADMIN_PASSWORD` = `9311@Josh`
5. Click **Deploy Web Service**.

---

## 3. Setting Up Cloudflare (Edge CDN + DDoS Shield + SSL)

To activate Cloudflare’s worldwide edge caching (including Nairobi and Johannesburg nodes) and automated DDoS defense:

1. **Sign in to Cloudflare**:
   - Go to [cloudflare.com](https://dash.cloudflare.com) and click **Add Site**.
   - Enter your domain: `josamtech.co.ke` (or `josamtech.com`).
   - Select the **Free Plan**.

2. **Update Domain Nameservers**:
   - Cloudflare will show two nameservers (e.g., `ada.ns.cloudflare.com` & `bob.ns.cloudflare.com`).
   - Log in to your domain registrar (e.g. Truehost, Safaricom, GoDaddy) and replace the existing nameservers with Cloudflare's.

3. **Configure DNS Records in Cloudflare**:
   - Add a **CNAME** record:
     - **Type**: `CNAME`
     - **Name**: `@` (root)
     - **Target**: `your-app-name.onrender.com`
     - **Proxy status**: **Proxied (Orange Cloud ON)**
   - Add a **CNAME** record for `www`:
     - **Type**: `CNAME`
     - **Name**: `www`
     - **Target**: `your-app-name.onrender.com`
     - **Proxy status**: **Proxied (Orange Cloud ON)**

4. **SSL / Encryption Settings**:
   - In the Cloudflare dashboard, go to **SSL/TLS** -> set encryption mode to **Full (strict)**.
   - Under **Edge Certificates**, enable **Always Use HTTPS** and **Automatic HTTPS Rewrites**.

---

## 4. Admin Portal & Security Sentinel

- **Admin Login URL**: `https://your-domain.com/admin`
- **Username**: `joshuamwenda`
- **Email**: `joshuamwenda36@gmail.com`
- **Password**: `9311@Josh`
- **Features Active**:
  - Live visitor & inquiry management.
  - Cybersecurity Sentinel tracking unauthorized exploit scans, brute force blocks, and audit logs.
  - CMS controls for Services, Testimonials, Projects, Team, and Hero content.
