import React, { useState, useEffect } from 'react';
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

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}>
      {!hideHeader && <Header />}
      <Container 
        component="main" 
        maxWidth="sm"
        sx={{ 
          flex: 1,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          pb: 'calc(80px + env(safe-area-inset-bottom, 20px))',
          px: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            animation: isTransitioning 
              ? 'fadeOut 0.15s ease-out forwards'
              : 'fadeIn 0.3s ease-out forwards',
            '@keyframes fadeOut': {
              '0%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
              },
              '100%': {
                opacity: 0,
                transform: 'translateY(-10px) scale(0.98)',
              },
            },
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px) scale(0.98)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
              },
            },
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