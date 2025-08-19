// Force Scroll to Top Utility
// ฟังก์ชันที่บังคับให้หน้าเว็บเด้งขึ้นไปด้านบนสุดในทุกกรณี

export const forceScrollToTop = (): void => {
  // ใช้หลายวิธีเพื่อให้แน่ใจว่า scroll ไปข้างบนได้
  
  // วิธีที่ 1: window.scrollTo แบบ instant
  try {
    window.scrollTo(0, 0);
  } catch (error) {
    console.warn('window.scrollTo failed:', error);
  }
  
  // วิธีที่ 2: document.documentElement.scrollTop
  try {
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
  } catch (error) {
    console.warn('document.documentElement.scrollTop failed:', error);
  }
  
  // วิธีที่ 3: document.body.scrollTop
  try {
    if (document.body) {
      document.body.scrollTop = 0;
    }
  } catch (error) {
    console.warn('document.body.scrollTop failed:', error);
  }
  
  // วิธีที่ 4: ใช้ scrollIntoView แบบ instant
  try {
    if (document.body.firstElementChild) {
      document.body.firstElementChild.scrollIntoView({ 
        behavior: 'instant',
        block: 'start'
      });
    }
  } catch (error) {
    console.warn('scrollIntoView failed:', error);
  }
  
  // วิธีที่ 5: ใช้ window.scroll แบบ legacy
  try {
    if (window.scroll) {
      window.scroll(0, 0);
    }
  } catch (error) {
    console.warn('window.scroll failed:', error);
  }
  
  // วิธีที่ 6: ใช้ requestAnimationFrame
  try {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    });
  } catch (error) {
    console.warn('requestAnimationFrame failed:', error);
  }
  
  // วิธีที่ 7: ใช้ setTimeout แบบ multiple
  try {
    [0, 50, 100, 200, 500].forEach(delay => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTop = 0;
        }
      }, delay);
    });
  } catch (error) {
    console.warn('setTimeout failed:', error);
  }
  
  // วิธีที่ 8: ใช้ setTimeout เพื่อตรวจสอบอีกครั้ง (ลดการใช้ setInterval)
  try {
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTop = 0;
        }
      }
    }, 300);
  } catch (error) {
    console.warn('setTimeout final check failed:', error);
  }
};

// ฟังก์ชันที่บังคับให้ scroll ไปข้างบนเมื่อเปลี่ยนหน้า (ปรับปรุงให้ไม่เกินไป)
export const forceScrollToTopOnRouteChange = (): void => {
  // เรียกใช้ทันที
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }
  
  // เรียกใช้อีกครั้งหลังจาก render เสร็จ (ลดจำนวนครั้ง)
  setTimeout(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, 100);
  
  // ใช้ requestAnimationFrame เพียงครั้งเดียว
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  });
};

// ฟังก์ชันที่บังคับให้ scroll ไปข้างบนเมื่อ component mount (ปรับปรุงให้ไม่เกินไป)
export const forceScrollToTopOnMount = (): void => {
  // เรียกใช้ทันที
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }
  
  // เรียกใช้อีกครั้งหลังจาก render เสร็จ
  setTimeout(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, 200);
};

// ฟังก์ชันที่บังคับให้ scroll ไปข้างบนเมื่อคลิก navigation (ปรับปรุงให้ไม่เกินไป)
export const forceScrollToTopOnNavigation = (): void => {
  // เรียกใช้ทันที
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }
  
  // เรียกใช้อีกครั้งหลังจาก navigate เสร็จ
  setTimeout(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, 150);
};

export default forceScrollToTop;
