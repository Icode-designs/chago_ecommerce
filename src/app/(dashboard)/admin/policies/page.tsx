'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, Button } from '@/components/ui';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const PolicyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const PolicyCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PolicyInfo = styled.div``;

const PolicyName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 4px;
`;

const PolicyMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

export default function AdminPoliciesPage() {
  const policies = [
    { id: 1, name: 'Terms of Service', lastUpdated: '2024-01-10' },
    { id: 2, name: 'Privacy Policy', lastUpdated: '2023-11-05' },
    { id: 3, name: 'Vendor Agreement', lastUpdated: '2024-02-28' },
    { id: 4, name: 'Return Policy', lastUpdated: '2024-03-15' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Policies Editor</Title>
      </PageHeader>

      <PolicyList>
        {policies.map(p => (
          <PolicyCard key={p.id}>
            <PolicyInfo>
              <PolicyName>{p.name}</PolicyName>
              <PolicyMeta>Last updated on {new Date(p.lastUpdated).toLocaleDateString()}</PolicyMeta>
            </PolicyInfo>
            <Button $variant="secondary">Edit Text</Button>
          </PolicyCard>
        ))}
      </PolicyList>
    </motion.div>
  );
}
