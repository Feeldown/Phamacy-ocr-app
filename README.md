# Drug Label OCR - ระบบช่วยค้นหาและวิเคราะห์ข้อมูลยาในประเทศไทย

โปรเจกต์นี้เป็นระบบช่วยค้นหาและวิเคราะห์ข้อมูลยาในประเทศไทย ประกอบด้วยทั้ง Web Application (React + OCR) และเครื่องมือ Python สำหรับประมวลผลข้อมูลยา

## 🚀 อัปเดตล่าสุด

* ✅ **ระบบ OCR ใช้งานได้จริงแล้ว** - ติดตั้ง Tesseract.js, react-webcam, react-dropzone
* ✅ **Page Transition Animation** - เพิ่ม smooth animation เมื่อเปลี่ยนหน้า
* ✅ **Enhanced Bottom Navigation** - เพิ่ม hover effects และ smooth scroll
* ✅ **Responsive Design** - ปรับปรุง UI/UX ให้สวยงามและใช้งานง่าย
* ✅ **Fallback System** - OCR มี fallback system สำหรับกรณีที่ไม่มีไฟล์ภาษา
* ✅ **TypeScript Support** - ใช้ TypeScript อย่างเต็มรูปแบบ
* ✅ **Ready for Deployment** - เตรียมพร้อมสำหรับ deployment บน Render และ Vercel

## ✨ ฟีเจอร์หลัก

### 1. Web Application (React + TypeScript)

* **🔍 ค้นหาข้อมูลยา** ด้วยชื่อ, หมวดหมู่, หรือสแกนฉลากยา (OCR)
* **📷 สแกนฉลากยา** ด้วยกล้องหรืออัปโหลดรูปภาพ แล้วใช้ OCR (Tesseract.js) เพื่อแปลงข้อความบนฉลากเป็นข้อมูลสำหรับค้นหา
* **💊 แสดงรายละเอียดของยา** เช่น ชื่อสามัญ, ชื่อการค้า, รูปแบบยา, วิธีใช้, อาการข้างเคียง, การเก็บรักษา ฯลฯ
* **🎯 แนะนำยาที่คล้ายกัน** และแสดงประวัติการดูยา
* **📱 รองรับการใช้งานบนมือถือ** และมี UI ที่ใช้งานง่าย
* **🎨 Smooth Animations** - Page transitions, hover effects, smooth scroll

### 2. OCR Features

* **Real-time OCR Processing** - ใช้ Tesseract.js จริง
* **Multi-language Support** - รองรับภาษาไทยและอังกฤษ
* **Image Preprocessing** - ปรับปรุงภาพก่อน OCR (contrast, brightness)
* **Fallback System** - Mock OCR สำหรับกรณีที่ไม่มีไฟล์ภาษา
* **Progress Tracking** - แสดงความคืบหน้าแบบ real-time

### 3. เครื่องมือ Python สำหรับประมวลผลข้อมูลยา

* **count_drugs.py**: ดึงรายชื่อยาทั้งหมดจากเว็บไซต์ yaandyou.net และบันทึกลงไฟล์
* **analyze_drug_forms.py**: วิเคราะห์และสรุปรูปแบบยาที่มีในฐานข้อมูล (เช่น เม็ด, น้ำ, ครีม ฯลฯ)
* **test_model/web_test_v05.1.py**: สคริปต์สำหรับดึงและประมวลผลข้อมูลยาแบบอัตโนมัติ

### 4. ฐานข้อมูลและไฟล์ข้อมูล

* **drug_full_details.json/csv/txt/xlsx**: ฐานข้อมูลรายละเอียดของยา
* **drug_backup.json/csv/txt/xlsx**: สำรองข้อมูลยา
* **Name_Ya_all.txt**: รายชื่อยาทั้งหมด

## 🛠️ วิธีเริ่มต้นใช้งาน

### Prerequisites

* Node.js 18+ 
* npm หรือ yarn
* Python 3.8+ (สำหรับเครื่องมือ Python)

### 1. Clone Repository

```bash
git clone https://github.com/Feeldown/Drug_PhamacyApp.git
cd Drug_PhamacyApp/drug-label-ocr
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. รันแอป

```bash
npm run dev
```

### 4. เปิดใช้งาน

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 📱 วิธีใช้งาน

### การค้นหาด้วยชื่อ
1. ไปที่หน้า "ค้นหา"
2. พิมพ์ชื่อยาที่ต้องการค้นหา
3. ระบบจะแสดงผลการค้นหาแบบ real-time

### การสแกนด้วยกล้อง
1. ไปที่หน้า "สแกน"
2. เลือกแท็บ "ถ่ายรูป"
3. กดปุ่มถ่ายภาพ
4. รอผลการประมวลผล OCR
5. ระบบจะแสดงข้อความที่อ่านได้และผลการค้นหา

### การอัปโหลดรูปภาพ
1. ไปที่หน้า "สแกน"
2. เลือกแท็บ "อัปโหลด"
3. ลากไฟล์มาวางหรือกดปุ่มเลือกไฟล์
4. รอผลการประมวลผล OCR

## 🏗️ โครงสร้างโปรเจค

```
drug-label-ocr/
├── src/
│   ├── components/          # React Components
│   │   ├── Layout/         # Layout Components
│   │   ├── Navigation/     # Navigation Components
│   │   ├── OCR/            # OCR Components
│   │   └── ...
│   ├── pages/              # Page Components
│   │   ├── Home/           # หน้าหลัก
│   │   ├── Search/         # หน้าค้นหา
│   │   ├── Scan/           # หน้าสแกน
│   │   ├── Categories/     # หน้าหมวดหมู่
│   │   └── ...
│   ├── api/                # API Functions
│   ├── styles/             # Global Styles
│   └── theme/              # Theme Configuration
├── public/                 # Static Files
│   ├── tessdata/           # Tesseract Language Files
│   └── _redirects          # SPA Routing for Render
├── package.json            # Dependencies
├── vite.config.ts          # Vite Configuration
├── tsconfig.json           # TypeScript Configuration
├── render.yaml             # Render Deployment Config
└── vercel.json             # Vercel Deployment Config
```

## 🚀 การ Deploy

### Render (แนะนำ)

1. **Fork repository** นี้ไปยัง GitHub ของคุณ
2. **เข้า [Render Dashboard](https://dashboard.render.com/)**
3. **กด "New" → "Static Site"**
4. **เชื่อมต่อกับ GitHub repository**
5. **ตั้งค่า:**
   - **Name:** `drug-label-ocr`
   - **Root Directory:** `drug-label-ocr`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
6. **กด "Create Static Site"**
7. **รอ deployment เสร็จ (ประมาณ 2-3 นาที)**
8. **ได้ลิงก์เว็บทันที!**

### Vercel (ทางเลือก)

1. **Fork repository** นี้ไปยัง GitHub ของคุณ
2. **เข้า [Vercel](https://vercel.com/)**
3. **เชื่อมต่อกับ GitHub**
4. **เลือก repository และ deploy**
5. **ได้ลิงก์เว็บทันที!**

### ข้อดีของ Render

* **Free Tier** ที่ดีกว่า
* **Custom Domain** ฟรี
* **SSL Certificate** อัตโนมัติ
* **Global CDN** สำหรับความเร็ว
* **Auto-deploy** เมื่อ push code ใหม่

## 🔧 การพัฒนา

### Scripts ที่มี

```bash
npm run dev          # รัน development server
npm run build        # build สำหรับ production
npm run preview      # preview build
npm run lint         # ตรวจสอบ code quality
```

### การเพิ่มฟีเจอร์ใหม่

1. สร้าง component ใหม่ใน `src/components/`
2. สร้าง page ใหม่ใน `src/pages/`
3. เพิ่ม route ใหม่ใน `src/App.tsx`
4. อัปเดท navigation ใน `src/components/Navigation/`

## 📊 สถานะการพัฒนา

- [x] **Web Application (React)** - ✅ เสร็จสิ้น
- [x] **OCR Integration** - ✅ เสร็จสิ้น
- [x] **Responsive Design** - ✅ เสร็จสิ้น
- [x] **TypeScript Support** - ✅ เสร็จสิ้น
- [x] **Smooth Animations** - ✅ เสร็จสิ้น
- [x] **Python Tools** - ✅ เสร็จสิ้น
- [x] **Deployment Ready** - ✅ เสร็จสิ้น
- [ ] **Backend API** - 🔄 กำลังพัฒนา
- [ ] **Database Integration** - 🔄 กำลังพัฒนา

## 🤝 การมีส่วนร่วม

1. Fork repository
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

โปรเจกต์นี้อยู่ภายใต้ MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

## 👨‍💻 ผู้พัฒนา

* **Feeldown** - [GitHub Profile](https://github.com/Feeldown)

## 🙏 ขอบคุณ

* [Tesseract.js](https://github.com/naptha/tesseract.js) - OCR Engine
* [React](https://reactjs.org/) - Frontend Framework
* [Material-UI](https://mui.com/) - UI Components
* [Vite](https://vitejs.dev/) - Build Tool
* [Render](https://render.com/) - Hosting Platform

---

**⭐ ถ้าชอบโปรเจกต์นี้ กรุณาให้ Star และ Fork เพื่อเป็นกำลังใจในการพัฒนา! ⭐**

## 🚀 Deploy บน Render ทันที!

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Feeldown/Drug_PhamacyApp&ref=drug-label-ocr) 