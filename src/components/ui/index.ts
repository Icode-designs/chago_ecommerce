'use client';

import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

// ============================================
// BUTTON
// ============================================

interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  $size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
}

const buttonSizes = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  `,
  md: css`
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  `,
  lg: css`
    padding: 1rem 2rem;
    font-size: 1rem;
  `,
};

const buttonVariants = {
  primary: css`
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDim} 100%);
    color: ${({ theme }) => theme.colors.onPrimary};
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryHover} 0%, ${({ theme }) => theme.colors.primary} 100%);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surfaceContainerHighest};
    color: ${({ theme }) => theme.colors.onSurface};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceContainerHigh};
    }
  `,
  tertiary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.tertiary};
    
    &:hover:not(:disabled) {
      background: rgba(0, 102, 204, 0.06);
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.onSurface};
    
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceContainerLow};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.onError};
    
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.01em;
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  white-space: nowrap;

  ${({ $size = 'md' }) => buttonSizes[$size]}
  ${({ $variant = 'primary' }) => buttonVariants[$variant]}
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    box-shadow: ${({ theme }) => theme.shadows.glowPrimary};
  }
`;

// ============================================
// INPUT
// ============================================

interface InputWrapperProps {
  $hasError?: boolean;
}

export const InputWrapper = styled.div<InputWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.labelMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wide};
  text-transform: uppercase;
`;

export const Input = styled.input<InputWrapperProps>`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  color: ${({ theme }) => theme.colors.onSurface};
  border: 1px solid ${({ theme, $hasError }) =>
    $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.outlineVariant};
  }

  &:focus {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : 'rgba(95, 94, 96, 0.4)'};
    box-shadow: ${({ theme, $hasError }) =>
      $hasError ? '0 0 0 4px rgba(159, 64, 61, 0.1)' : theme.shadows.glow};
  }
`;

export const TextArea = styled.textarea<InputWrapperProps>`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  color: ${({ theme }) => theme.colors.onSurface};
  border: 1px solid ${({ theme, $hasError }) =>
    $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-family: ${({ theme }) => theme.fonts.body};
  resize: vertical;
  min-height: 100px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.outlineVariant};
  }

  &:focus {
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : 'rgba(95, 94, 96, 0.4)'};
    box-shadow: ${({ theme, $hasError }) =>
      $hasError ? '0 0 0 4px rgba(159, 64, 61, 0.1)' : theme.shadows.glow};
  }
`;

export const InputError = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

// ============================================
// SELECT
// ============================================

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  color: ${({ theme }) => theme.colors.onSurface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-family: ${({ theme }) => theme.fonts.body};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23596065' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: rgba(95, 94, 96, 0.4);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

// ============================================
// CARD
// ============================================

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  transition: all ${({ theme }) => theme.transitions.normal};
`;

export const CardHover = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  cursor: pointer;
  transition: box-shadow ${({ theme }) => theme.transitions.normal};
`;

// ============================================
// LAYOUT
// ============================================

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing[4]};
  }
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing[10]} 0;
  }
`;

export const SectionAlt = styled(Section)`
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
`;

export const Grid = styled.div<{ $cols?: number; $gap?: string; $minWidth?: string }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ $cols }) => $cols || 'auto-fill'},
    minmax(${({ $minWidth }) => $minWidth || '280px'}, 1fr)
  );
  gap: ${({ $gap, theme }) => $gap || theme.spacing[6]};
`;

export const Flex = styled.div<{
  $align?: string;
  $justify?: string;
  $gap?: string;
  $direction?: string;
  $wrap?: string;
}>`
  display: flex;
  align-items: ${({ $align }) => $align || 'center'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  gap: ${({ $gap }) => $gap || '0'};
  flex-direction: ${({ $direction }) => $direction || 'row'};
  flex-wrap: ${({ $wrap }) => $wrap || 'nowrap'};
`;

// ============================================
// BADGE / CHIP
// ============================================

interface BadgeProps {
  $variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const badgeColors = {
  default: css`
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
    color: ${({ theme }) => theme.colors.onSurface};
  `,
  primary: css`
    background: ${({ theme }) => theme.colors.primaryContainer};
    color: ${({ theme }) => theme.colors.onPrimaryContainer};
  `,
  success: css`
    background: #E8F5E9;
    color: #2E7D32;
  `,
  warning: css`
    background: #FFF3E0;
    color: #E65100;
  `,
  error: css`
    background: ${({ theme }) => theme.colors.errorContainer};
    color: ${({ theme }) => theme.colors.onErrorContainer};
  `,
  info: css`
    background: rgba(0, 102, 204, 0.08);
    color: ${({ theme }) => theme.colors.tertiary};
  `,
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wide};
  text-transform: uppercase;
  white-space: nowrap;

  ${({ $variant = 'default' }) => badgeColors[$variant]}
`;

// ============================================
// DIVIDER (tonal, not line-based)
// ============================================

export const Spacer = styled.div<{ $size?: string }>`
  height: ${({ $size }) => $size || '2rem'};
`;

// ============================================
// TEXT UTILITIES
// ============================================

export const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.headlineLg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
`;

export const SubHeading = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  max-width: 560px;
`;

export const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textTertiary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  text-transform: uppercase;
`;

// ============================================
// SKELETON LOADER
// ============================================

export const Skeleton = styled.div<{ $width?: string; $height?: string; $radius?: string }>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '1rem'};
  border-radius: ${({ $radius, theme }) => $radius || theme.radii.md};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceContainerLow} 25%,
    ${({ theme }) => theme.colors.surfaceContainer} 37%,
    ${({ theme }) => theme.colors.surfaceContainerLow} 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.5s ease-in-out infinite;

  @keyframes shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
  }
`;

// ============================================
// EMPTY STATE
// ============================================

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[16]};
  text-align: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.outlineVariant};
`;
