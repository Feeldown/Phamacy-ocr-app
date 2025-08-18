# 🚀 Vercel Deployment Guide

## ✅ Vercel เหมาะสมกับ OCR App เพราะ:

- **OCR Performance** - รองรับ WebAssembly ได้ดี
- **TypeScript** - Native support
- **React** - Optimized for React apps
- **Edge Functions** - สำหรับ OCR processing
- **Global CDN** - Performance ดีมาก
- **Free Tier** - 100GB bandwidth/month

## 🔧 ขั้นตอนการ Deploy บน Vercel

### 1. ติดตั้ง Vercel CLI
```bash
npm install -g vercel
```

### 2. Login Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. ตั้งค่า Deployment
```
? Set up and deploy "~/drug-label-ocr"? [Y/n] y
? Which scope do you want to deploy to? [your-username]
? Link to existing project? [y/N] n
? What's your project's name? drug-label-ocr
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

## 🌐 วิธี Deploy แบบ Web UI

### 1. เข้า [Vercel Dashboard](https://vercel.com/dashboard)
### 2. กดปุ่ม **"New Project"**
### 3. Import จาก GitHub:
   - **Repository:** `Feeldown/Phamacy-ocr-app`
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 4. Environment Variables (ถ้าต้องการ)
```
NODE_VERSION=18
NPM_VERSION=8
```

### 5. กดปุ่ม **"Deploy"**

## 📁 ไฟล์ที่สำคัญสำหรับ Vercel

- ✅ **`vercel.json`** - Vercel configuration
- ✅ **`package.json`** - Build scripts
- ✅ **`vite.config.ts`** - Vite configuration
- ✅ **`tsconfig.json`** - TypeScript configuration

## 🔍 Troubleshooting

### Build Fails
```bash
# ตรวจสอบ local build
npm run build

# ตรวจสอบ dependencies
npm list --depth=0
```

### 404 Errors
- ตรวจสอบ `vercel.json` routing
- ตรวจสอบ SPA routing configuration

### OCR Issues
- ตรวจสอบ Tesseract.js compatibility
- ตรวจสอบ WebAssembly support

## 📱 Post-deployment

### 1. ทดสอบการทำงาน
- [ ] หน้าหลักโหลดได้
- [ ] Navigation ทำงาน
- [ ] OCR features ทำงาน
- [ ] Responsive design

### 2. Performance
- [ ] Page load time < 3s
- [ ] OCR processing < 10s
- [ ] Mobile performance

### 3. Custom Domain (Optional)
- เข้า Vercel dashboard
- Settings → Domains
- เพิ่ม domain ของคุณ

## 🎯 ข้อดีของ Vercel

1. **Performance** - Edge functions + Global CDN
2. **Developer Experience** - Easy deployment
3. **TypeScript** - Native support
4. **React** - Optimized
5. **Free Tier** - ดีกว่า Render
6. **Auto-deploy** - จาก GitHub

## 🔄 Auto-deploy Setup

1. **Connect GitHub** - ใน Vercel dashboard
2. **Production Branch** - `main`
3. **Preview Branches** - `develop`, `feature/*`
4. **Auto-deploy** - ทุกครั้งที่ push

---

## 🎉 ยินดีด้วย!

**ตอนนี้โปรเจคพร้อมสำหรับ Vercel deployment แล้ว!**

**🚀 Deploy ได้เลยที่:** https://vercel.com/dashboard  
**📱 แอปจะทำงานที่:** `https://drug-label-ocr.vercel.app` (หลังจาก deploy เสร็จ)

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Community:** https://github.com/vercel/vercel/discussions
- **GitHub Issues:** https://github.com/Feeldown/Phamacy-ocr-app/issues

