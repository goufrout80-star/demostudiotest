# 🚀 Hostinger Deployment Guide

Complete guide to deploy your Next.js website to Hostinger hosting.

## 📋 Prerequisites

- Hostinger hosting account (Business or Premium plan recommended)
- FTP/SFTP access credentials
- Node.js installed locally (for building)

## 🔨 Step 1: Build Your Website

Run these commands in your project folder:

```bash
# Install dependencies (if not already installed)
npm install

# Build the static export
npm run build
```

This will create an `out` folder with your static website files.

## 📁 Step 2: Prepare Files for Upload

After building, you'll have an `out` folder containing:
- `index.html` - Homepage
- `about.html` - About page
- `services.html` - Services page
- `contact.html` - Contact page
- `_next/` - Static assets (CSS, JS, images)
- Other static files

## 🌐 Step 3: Upload to Hostinger

### Option A: Using File Manager (Recommended for beginners)

1. **Log in to Hostinger hPanel**
   - Go to https://hpanel.hostinger.com
   - Navigate to **Files → File Manager**

2. **Navigate to public_html**
   - Open the `public_html` folder (or your domain's root folder)
   - Delete any existing files (index.html, etc.)

3. **Upload Files**
   - Click **Upload Files**
   - Select ALL files from your `out` folder
   - Upload the `.htaccess` file from your `public` folder
   - Wait for upload to complete

### Option B: Using FTP/SFTP (Recommended for developers)

1. **Get FTP Credentials**
   - In hPanel, go to **Files → FTP Accounts**
   - Note your hostname, username, and password

2. **Connect with FTP Client** (FileZilla, Cyberduck, etc.)
   - Host: `ftp.yourdomain.com`
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (FTP) or 22 (SFTP)

3. **Upload Files**
   - Navigate to `/public_html` on remote server
   - Upload ALL contents of the `out` folder
   - Upload `.htaccess` from `public` folder to `public_html`

## ⚙️ Step 4: Configure Domain

1. **Point Domain to Hosting**
   - In hPanel, go to **Domains**
   - Ensure your domain points to the correct hosting account
   - DNS propagation may take 24-48 hours

2. **SSL Certificate**
   - Go to **Security → SSL**
   - Enable **Force HTTPS** (recommended)
   - Certificate is usually auto-installed

## 🔍 Step 5: Test Your Website

Visit your domain:
- `https://yourdomain.com` - Homepage
- `https://yourdomain.com/about/` - About page
- `https://yourdomain.com/services/` - Services page
- `https://yourdomain.com/contact/` - Contact page

## 🐛 Troubleshooting

### Issue: 404 Errors on Page Navigation
**Solution:** Ensure `.htaccess` file is uploaded to `public_html`

### Issue: Images Not Loading
**Solution:** Check that `_next` folder is uploaded correctly

### Issue: Blank Page
**Solution:** 
- Check browser console for errors
- Verify all files uploaded successfully
- Clear browser cache

### Issue: CSS/JS Not Loading
**Solution:**
- Check file permissions (should be 644 for files, 755 for folders)
- Verify `_next/static` folder exists

## 📊 File Structure on Server

```
public_html/
├── .htaccess
├── index.html
├── about.html
├── services.html
├── contact.html
├── 404.html
├── grid.svg
├── _next/
│   ├── static/
│   │   ├── css/
│   │   ├── chunks/
│   │   └── media/
└── favicon.ico
```

## 🔄 Updating Your Website

To update your website:

1. Make changes locally
2. Run `npm run build`
3. Upload new files from `out` folder to server
4. Clear browser cache to see changes

## 💡 Performance Tips

1. **Enable Caching** - `.htaccess` already configured
2. **Use Cloudflare** - Free CDN through Hostinger
3. **Optimize Images** - Already optimized via Unsplash
4. **Enable GZIP** - Already configured in `.htaccess`

## 🆘 Support

- **Hostinger Support:** https://support.hostinger.com
- **Live Chat:** Available 24/7 in hPanel
- **Knowledge Base:** https://support.hostinger.com/en/collections

## ✅ Checklist

- [ ] Website built successfully (`npm run build`)
- [ ] All files from `out` folder uploaded
- [ ] `.htaccess` file uploaded to `public_html`
- [ ] Domain configured correctly
- [ ] SSL certificate enabled
- [ ] All pages accessible (/, /about/, /services/, /contact/)
- [ ] Images loading correctly
- [ ] Animations working smoothly
- [ ] Mobile responsive
- [ ] Browser cache cleared for testing

---

**Your website is now live! 🎉**

Visit your domain to see your premium Next.js website running on Hostinger.
