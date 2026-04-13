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
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} 0;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 1px dashed ${({ theme }) => theme.colors.outlineVariant};
`;

export default function AdminDisputesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Disputes</Title>
        <Subtitle>Manage platform disputes between customers and vendors.</Subtitle>
      </PageHeader>

      <EmptyState>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2D3338', marginBottom: '8px' }}>No Active Disputes</h3>
        <p style={{ color: '#86868B', marginBottom: '24px' }}>There are no disputes requiring administrative action at this time.</p>
        <Button $variant="secondary">View Resolved Logs</Button>
      </EmptyState>
    </motion.div>
  );
}
