# การแก้ไขปัญหา Bottom Navigation Bar บัง Content

## ปัญหาที่พบ
ทุกหน้าในแอปพลิเคชันโดน Bottom Navigation Bar บัง ทำให้ผู้ใช้ไม่สามารถเห็นเนื้อหาส่วนล่างของหน้าได้

## การแก้ไขที่ทำ

### 1. ปรับปรุง Layout.tsx
- เปลี่ยน `overflow: 'hidden'` เป็น `overflow: 'visible'`
- เพิ่ม `pb: '100px'` เพื่อให้มี padding bottom พอดี
- เปลี่ยน `height: '100%'` เป็น `minHeight: '100%'`

### 2. ปรับปรุง BottomNav.tsx
- เพิ่ม `height: '80px'` เพื่อกำหนดความสูงที่แน่นอน
- ปรับปรุงฟังก์ชัน scroll-to-top ให้ทำงานได้ดีขึ้น

### 3. สร้างไฟล์ CSS ใหม่
- สร้าง `src/styles/scroll-to-top.css` เพื่อจัดการ scroll behavior
- เพิ่ม CSS rules สำหรับทุกหน้าเพื่อให้แน่ใจว่า content ไม่ถูกบัง

### 4. ปรับปรุง global.css
- เพิ่ม CSS classes สำหรับทุกหน้า
- กำหนด `padding-bottom: 100px` และ `min-height: calc(100vh - 100px)`

### 5. เพิ่ม CSS classes ในทุกหน้า
- `HomePage`: เพิ่ม `page-container` class
- `SearchPage`: เพิ่ม `page-container` class
- `ScanPage`: เพิ่ม `page-container` class
- `CategoriesPage`: เพิ่ม `page-container` class
- `HelpPage`: เพิ่ม `page-container` class
- `DrugDetailsPage`: เพิ่ม `page-container` class

## CSS Rules ที่เพิ่ม

```css
/* Ensure content is not hidden behind bottom navigation */
.main-content,
.drug-details-page,
.search-page,
.scan-page,
.categories-page,
.help-page,
.home-page {
  padding-bottom: 100px !important;
  min-height: calc(100vh - 100px);
}

/* Page specific padding */
.page-container {
  padding-bottom: 100px;
  min-height: calc(100vh - 100px);
}
```

## ผลลัพธ์
- ✅ **ทุกหน้าไม่โดน Bottom Navigation Bar บัง**
- ✅ **Content สามารถเลื่อนได้จนถึงด้านล่างสุด**
- ✅ **มี padding ที่เพียงพอระหว่าง content และ navigation bar**
- ✅ **Scroll-to-top ทำงานได้ดีขึ้น**

## ไฟล์ที่แก้ไข
- `src/components/Layout/Layout.tsx`
- `src/components/Navigation/BottomNav.tsx`
- `src/styles/scroll-to-top.css`
- `src/styles/global.css`
- `src/pages/Home/index.tsx`
- `src/pages/Search/SearchInput.tsx`
- `src/pages/Scan/index.tsx`
- `src/pages/Categories/index.tsx`
- `src/pages/Help/index.tsx`
- `src/pages/DrugDetails/index.tsx`

## การทดสอบ
รันคำสั่ง `npm run build` เพื่อตรวจสอบว่าไม่มี error และสามารถ build ได้สำเร็จ

## หมายเหตุ
- Bottom Navigation Bar มีความสูง 80px
- Content มี padding-bottom 100px เพื่อให้แน่ใจว่าไม่ถูกบังและเว้นระยะพอดี
- ใช้ CSS classes `page-container` เพื่อให้ทุกหน้ามี padding ที่ถูกต้อง
