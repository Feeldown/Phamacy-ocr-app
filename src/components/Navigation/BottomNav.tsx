import React, { useState } from 'react';
import { Box, Container, Button } from '@mui/material';
import { Home, Search, Category, Camera, Help } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'หน้าแรก', path: '/' },
  { icon: Search, label: 'ค้นหา', path: '/search' },
  { icon: Camera, label: 'สแกน', path: '/scan' },
  { icon: Category, label: 'หมวดหมู่', path: '/categories' },
  { icon: Help, label: 'ช่วยเหลือ', path: '/help' },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handleNavigation = async (path: string) => {
    // ถ้าเป็นหน้าเดิม ให้เด้งไปข้างบนเท่านั้น
    if (location.pathname === path) {
      // เพิ่ม ripple effect และ smooth scroll
      setClickedItem(path);
      setTimeout(() => setClickedItem(null), 300);
      
      // Smooth scroll ไปข้างบนด้วย easing function ที่สวยงาม
      const startPosition = window.pageYOffset;
      const targetPosition = 0;
      const distance = targetPosition - startPosition;
      const duration = 800;
      const startTime = performance.now();
      
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
      return;
    }
    
    // ถ้าเป็นหน้าใหม่ ให้เด้งไปข้างบนก่อน แล้วค่อย navigate
    setClickedItem(path);
    
    // Smooth scroll ไปข้างบน
    const startPosition = window.pageYOffset;
    const targetPosition = 0;
    const distance = targetPosition - startPosition;
    const duration = 600;
    const startTime = performance.now();
    
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      window.scrollTo(0, startPosition + distance * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // เมื่อ scroll เสร็จแล้วค่อย navigate
        setTimeout(() => {
          navigate(path);
          setClickedItem(null);
        }, 100);
      }
    };
    
    requestAnimationFrame(animateScroll);
  };

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        borderTop: '1px solid',
        borderColor: 'divider',
        padding: '12px 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        animation: 'slideUp 0.3s ease-out',
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
          gap: 1,
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
                gap: 0.5,
                minWidth: 64,
                flex: 1,
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? 'primary.light' : 'transparent',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isClicked ? 'scale(0.9)' : 'scale(1)',
                animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
                '&:hover': {
                  bgcolor: isActive ? 'primary.light' : 'action.hover',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
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
                  fontSize: 20, 
                  mb: 0.25,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  filter: isActive ? 'drop-shadow(0 2px 4px rgba(66, 99, 235, 0.3))' : 'none',
                  animation: isClicked ? 'bounce 0.3s ease-out' : 'none',
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '40%': {
                      transform: 'translateY(-8px)',
                    },
                    '60%': {
                      transform: 'translateY(-4px)',
                    },
                  },
                }} 
              />
              <Box
                component="span"
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
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