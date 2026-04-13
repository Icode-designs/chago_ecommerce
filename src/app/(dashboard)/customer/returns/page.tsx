'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} 0;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px dashed ${({ theme }) => theme.colors.outlineVariant};
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

export default function ReturnsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Returns & Disputes</Title>
        <Subtitle>Manage your return requests and open disputes.</Subtitle>
      </PageHeader>

      <EmptyState>
        <EmptyIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </EmptyIcon>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2D3338', marginBottom: '8px' }}>No Active Returns</h3>
        <p style={{ color: '#86868B', marginBottom: '24px' }}>You don&apos;t have any ongoing returns or disputes.</p>
        <Button $variant="secondary">Start a Return</Button>
      </EmptyState>
    </motion.div>
  );
}
