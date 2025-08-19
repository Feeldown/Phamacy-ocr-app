import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from '../Navigation/BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideHeader = false }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      
      // Delay เพื่อให้ animation fade out เสร็จก่อน
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation.pathname]);

  // เพิ่ม useEffect เพื่อให้แน่ใจว่าทุกครั้งที่เปลี่ยนหน้า จะเด้งขึ้นไปด้านบนสุด (ปรับปรุงให้ไม่เด้งแปลก)
  useEffect(() => {
    // ใช้วิธีที่นุ่มนวลกว่า เพียงพอสำหรับการเปลี่ยนหน้า
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
    }, 100);
  }, [location.pathname]);

  // เพิ่ม useEffect สำหรับ scroll restoration (ปรับปรุงให้ไม่เด้งแปลก)
  useEffect(() => {
    // ปิดการใช้งาน scroll restoration ของ browser
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // บังคับให้ scroll ไปข้างบนเมื่อ component mount
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, []);

  // เพิ่ม useCallback เพื่อ optimize performance
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default',
      position: 'relative',
    }}>
      {!hideHeader && <Header />}
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{ 
          flex: 1,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          pb: '100px',
          px: 0,
          position: 'relative',
          overflow: 'visible',
          borderRadius: { xs: 0, sm: '16px 16px 0 0' },
          margin: { xs: 0, sm: '0 auto' },
          maxWidth: { xs: '100%', sm: '600px' },
        }}
      >
        <Box
          onTransitionEnd={handleTransitionEnd}
          sx={{
            position: 'relative',
            width: '100%',
            minHeight: '100%',
            transition: isTransitioning 
              ? 'opacity 0.2s ease-out, transform 0.2s ease-out'
              : 'opacity 0.4s ease-out, transform 0.4s ease-out',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning 
              ? 'translateY(-8px) scale(0.99)'
              : 'translateY(0) scale(1)',
            '& > *': {
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }
          }}
        >
          {children}
        </Box>
      </Container>
      <BottomNav />
    </Box>
  );
};

export default Layout; 