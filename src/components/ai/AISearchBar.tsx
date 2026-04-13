'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SearchWrapper = styled(motion.div)`
  width: 100%;
  max-width: 640px;
  position: relative;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 0.375rem 0.5rem 0.375rem 1.25rem;
  gap: ${({ theme }) => theme.spacing[2]};
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  padding: 0.625rem 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.outlineVariant};
    font-style: italic;
  }
`;

const ActionButton = styled.button<{ $variant?: 'icon' | 'primary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $variant }) => ($variant === 'primary' ? '40px' : '36px')};
  height: ${({ $variant }) => ($variant === 'primary' ? '40px' : '36px')};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme, $variant }) =>
    $variant === 'primary'
      ? theme.colors.primary
      : 'transparent'};
  color: ${({ theme, $variant }) =>
    $variant === 'primary'
      ? theme.colors.onPrimary
      : theme.colors.onSurfaceVariant};
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === 'primary'
        ? theme.colors.primaryHover
        : theme.colors.surfaceContainerLow};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const AiTag = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.tertiary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wide};
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  &::before {
    content: '✦';
    font-size: 10px;
  }
`;

export default function AISearchBar({ compact }: { compact?: boolean }) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: AI search handler
    console.log('AI Search:', query);
  };

  const content = (
    <form onSubmit={handleSearch}>
      <SearchContainer style={compact ? { padding: '0.25rem 0.5rem 0.25rem 1rem', borderRadius: '24px' } : {}}>
        <AiTag>AI</AiTag>
        <SearchInput
          type="text"
          placeholder={compact ? 'Search aesthetics...' : '"This silhouette pairs perfectly with modernist architecture."'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="AI-powered search"
          style={compact ? { fontSize: '14px', padding: '0.5rem 0' } : {}}
        />
        <ActionButton type="button" aria-label="Upload image for visual search" style={compact ? { width: '32px', height: '32px' } : {}}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={compact ? { width: '16px', height: '16px' } : {}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </ActionButton>
        <ActionButton type="submit" $variant="primary" aria-label="Search" style={compact ? { width: '32px', height: '32px' } : {}}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={compact ? { width: '16px', height: '16px' } : {}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </ActionButton>
      </SearchContainer>
    </form>
  );

  return compact ? (
    <SearchWrapper style={{ maxWidth: '300px' }}>{content}</SearchWrapper>
  ) : (
    <SearchWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {content}
    </SearchWrapper>
  );
}
