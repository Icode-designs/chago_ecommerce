'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const BackButton = styled(Link)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  }
`;

const TitleColumn = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function AdminDisputeDetailPage() {
  const params = useParams();
  const disputeId = typeof params.id === 'string' ? params.id : 'unknown';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <BackButton href="/admin/disputes">←</BackButton>
        <TitleColumn>
          <Title>Dispute #{disputeId.slice(0,8).toUpperCase()}</Title>
          <Subtitle>Opened on {new Date().toLocaleDateString()}</Subtitle>
        </TitleColumn>
      </PageHeader>

      <Card style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#86868B' }}>Dispute details will appear here once active.</p>
      </Card>
    </motion.div>
  );
}
