import React from 'react';
import { Box, Typography, Container } from '@mui/material';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'MedSearch',
  subtitle = 'ค้นหาข้อมูลยา'
}) => {
  return (
    <Box 
      component="header" 
      sx={{
        padding: '48px 24px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        borderBottom: '1px solid',
        borderColor: 'rgba(66, 99, 235, 0.1)',
        position: 'relative',
        textAlign: 'center',
        boxShadow: '0 2px 20px rgba(66, 99, 235, 0.08)',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -1,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 80,
          height: 4,
          background: 'linear-gradient(90deg, #4263eb, #5a7cfa)',
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(66, 99, 235, 0.3)',
        }
      }}
    >
      <Container maxWidth="sm">
        <Typography 
          variant="h1" 
          sx={{
            fontSize: 42,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4263eb 0%, #5a7cfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1.5,
            letterSpacing: '-1px',
            textShadow: '0 2px 4px rgba(66, 99, 235, 0.1)',
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="subtitle1"
          sx={{
            fontSize: 18,
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.2px',
          }}
        >
          {subtitle}
        </Typography>
      </Container>
    </Box>
  );
};

export default Header; 