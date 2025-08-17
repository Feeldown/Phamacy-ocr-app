# 🚀 Render Deployment Guide

## 📋 Prerequisites

- GitHub account
- Render account (free tier available)
- Repository ที่มีโค้ดพร้อมแล้ว

## 🔧 ขั้นตอนการ Deploy บน Render

### 1. เตรียม Repository

```bash
# ตรวจสอบว่า build ได้
npm run build

# Commit และ push โค้ด
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2. เข้า Render Dashboard

1. ไปที่ [https://dashboard.render.com/](https://dashboard.render.com/)
2. Sign in ด้วย GitHub account
3. กดปุ่ม **"New"** → **"Static Site"**

### 3. เชื่อมต่อ Repository

1. **Connect a repository** - เลือก GitHub repository ของคุณ
2. **Repository** - เลือก `Drug_PhamacyApp`
3. **Branch** - เลือก `main` หรือ `master`
4. **Root Directory** - ใส่ `drug-label-ocr` (ถ้า repository หลักมีหลายโปรเจค)

### 4. ตั้งค่า Build

1. **Name** - `drug-label-ocr` (หรือชื่อที่คุณต้องการ)
2. **Build Command** - `npm install && npm run build`
3. **Publish Directory** - `dist`

### 5. Environment Variables (Optional)

- `NODE_VERSION`: `18.0.0`
- `NPM_VERSION`: `8.0.0`

### 6. Deploy

1. กดปุ่ม **"Create Static Site"**
2. รอ build process (ประมาณ 2-5 นาที)
3. เมื่อเสร็จจะได้ URL เช่น `https://drug-label-ocr.onrender.com`

## 🔍 Troubleshooting

### Build Fails

```bash
# ตรวจสอบ error logs ใน Render dashboard
# หรือลอง build ในเครื่องก่อน
npm run build
```

### 404 Errors

- ตรวจสอบว่า `_redirects` ไฟล์อยู่ใน `dist/` folder
- ตรวจสอบ `render.yaml` configuration

### Dependencies Issues

```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

## 📱 Custom Domain (Optional)

1. ใน Render dashboard → Settings → Custom Domains
2. เพิ่ม domain ของคุณ
3. ตั้งค่า DNS records ตามที่ Render แนะนำ

## 🔄 Auto-Deploy

- Render จะ auto-deploy ทุกครั้งที่ push code ใหม่
- สามารถปิด auto-deploy ได้ใน Settings → Build & Deploy

## 📊 Monitoring

- **Build Logs** - ดูใน Render dashboard
- **Performance** - ใช้ Render's built-in analytics
- **Uptime** - Render จะแจ้งเตือนเมื่อ site down

## 💰 Pricing

- **Free Tier**: 750 hours/month, custom domains, SSL
- **Paid Plans**: จาก $7/month สำหรับ advanced features

## 🎯 Best Practices

1. **Optimize Bundle Size** - ใช้ code splitting
2. **Cache Headers** - ตั้งค่าใน `render.yaml`
3. **Environment Variables** - ใช้สำหรับ configuration
4. **Health Checks** - ตรวจสอบ site availability

## 📞 Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [GitHub Issues](https://github.com/Feeldown/Drug_PhamacyApp/issues)

---

**🎉 ยินดีด้วย! ตอนนี้แอปของคุณพร้อมใช้งานบน Render แล้ว! 🎉**
