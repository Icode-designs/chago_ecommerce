'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.primary};
`;

const PlaceholderChart = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px dashed ${({ theme }) => theme.colors.outlineVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
`;

export default function AdminAnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Platform Analytics</Title>
      </PageHeader>

      <ChartGrid>
        <ChartCard>
          <CardTitle>GMV (Gross Merchandise Value)</CardTitle>
          <PlaceholderChart>Line Chart Placeholder</PlaceholderChart>
        </ChartCard>
        <ChartCard>
          <CardTitle>Active Users Growth</CardTitle>
          <PlaceholderChart>Bar Chart Placeholder</PlaceholderChart>
        </ChartCard>
      </ChartGrid>
      
      <ChartCard>
        <CardTitle>Category Performance</CardTitle>
        <PlaceholderChart>Pie Chart Placeholder</PlaceholderChart>
      </ChartCard>
    </motion.div>
  );
}
