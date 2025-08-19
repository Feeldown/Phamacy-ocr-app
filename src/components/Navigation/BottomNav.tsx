import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Container, Button } from '@mui/material';
import { Home, Search, Category, Camera, Help } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  // เพิ่ม useEffect เพื่อให้แน่ใจว่าทุกครั้งที่เปลี่ยนหน้า จะเด้งขึ้นไปด้านบนสุด (ปรับปรุงให้ไม่เด้งแปลก)
  useEffect(() => {
    // ใช้วิธีที่นุ่มนวลกว่า
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [location.pathname]);



  // ใช้ useMemo เพื่อ cache navItems
  const navItems = useMemo(() => [
    { icon: Home, label: 'หน้าแรก', path: '/' },
    { icon: Search, label: 'ค้นหา', path: '/search' },
    { icon: Camera, label: 'สแกน', path: '/scan' },
    { icon: Category, label: 'หมวดหมู่', path: '/categories' },
    { icon: Help, label: 'ช่วยเหลือ', path: '/help' },
  ], []);

  // ใช้ useCallback เพื่อ optimize performance (ปรับปรุงให้ไม่เด้งแปลก)
  const handleNavigation = useCallback(async (path: string) => {
    // เพิ่ม ripple effect
    setClickedItem(path);
    setTimeout(() => setClickedItem(null), 300);
    
    // ถ้าเป็นหน้าเดิม ให้เด้งไปข้างบนเท่านั้น
    if (location.pathname === path) {
      // ใช้วิธีที่นุ่มนวลกว่า
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
      return;
    }
    
    // ถ้าเป็นหน้าใหม่ ให้ navigate ทันที (ลด delay)
    navigate(path);
    setClickedItem(null);
  }, [location.pathname, navigate]);

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.98)',
        borderTop: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        padding: '16px 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(20px)',
        zIndex: 1000,
        height: '88px',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '@keyframes slideUp': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: 0,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
      }}
    >
      <Container 
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          height: '100%',
          px: { xs: 2, sm: 3 },
        }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isClicked = clickedItem === item.path;

          return (
            <Button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.75,
                minWidth: 72,
                flex: 1,
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? 'rgba(66, 99, 235, 0.1)' : 'transparent',
                borderRadius: 3,
                padding: '12px 8px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isClicked ? 'scale(0.95)' : 'scale(1)',
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                '&:hover': {
                  bgcolor: isActive ? 'rgba(66, 99, 235, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 16px rgba(66, 99, 235, 0.15)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                  transition: 'transform 0.1s ease-out',
                },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.5s ease-out',
                },
                '&:hover::before': {
                  left: '100%',
                },
                '&::after': isActive ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 16,
                  height: 4,
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    '0%': {
                      transform: 'translateX(-50%) scaleX(0)',
                      opacity: 0,
                    },
                    '100%': {
                      transform: 'translateX(-50%) scaleX(1)',
                      opacity: 1,
                    },
                  },
                } : {},
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px) scale(0.9)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0) scale(1)',
                  },
                },
              }}
            >
                             <Icon 
                 sx={{ 
                   fontSize: 24, 
                   mb: 0.5,
                   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                   transform: isActive ? 'scale(1.15)' : 'scale(1)',
                   filter: isActive ? 'drop-shadow(0 2px 6px rgba(66, 99, 235, 0.4))' : 'none',
                   animation: isClicked ? 'bounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
                   '@keyframes bounce': {
                     '0%, 20%, 50%, 80%, 100%': {
                       transform: 'translateY(0) scale(1)',
                     },
                     '40%': {
                       transform: 'translateY(-6px) scale(1.1)',
                     },
                     '60%': {
                       transform: 'translateY(-3px) scale(1.05)',
                     },
                   },
                 }} 
               />
                             <Box
                 component="span"
                 sx={{
                   fontSize: 12,
                   fontWeight: 600,
                   lineHeight: 1.2,
                   whiteSpace: 'nowrap',
                   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                   transform: isActive ? 'scale(1.05)' : 'scale(1)',
                   color: isActive ? 'primary.main' : 'text.secondary',
                   letterSpacing: '0.2px',
                 }}
               >
                 {item.label}
               </Box>
            </Button>
          );
        })}
      </Container>
    </Box>
  );
};

export default BottomNav; 