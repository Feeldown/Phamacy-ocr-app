import React from 'react';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { spacing } from '../theme/spacing';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const MinimalButton: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return (
    <button
      style={{
        padding: `${spacing.md} ${spacing.xl}`,
        borderRadius: '20px',
        border: 'none',
        fontFamily: fonts.main,
        fontWeight: fonts.weight.bold,
        fontSize: fonts.size.h2,
        background: variant === 'primary' 
          ? 'linear-gradient(135deg, #4263eb 0%, #5a7cfa 100%)' 
          : 'rgba(255, 255, 255, 0.9)',
        color: variant === 'primary' ? '#fff' : colors.primary,
        cursor: 'pointer',
        boxShadow: variant === 'primary'
          ? '0 4px 20px rgba(66, 99, 235, 0.3)'
          : '0 2px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        letterSpacing: '0.3px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.background = 'linear-gradient(135deg, #5a7cfa 0%, #4263eb 100%)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(66, 99, 235, 0.4)';
        } else {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.background = 'linear-gradient(135deg, #4263eb 0%, #5a7cfa 100%)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(66, 99, 235, 0.3)';
        } else {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
        }
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default MinimalButton; 