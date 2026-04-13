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

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
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

const SourceRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};

  &:last-child {
    border-bottom: none;
  }
`;

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Analytics</Title>
        <Subtitle>Deep dive into your store&apos;s performance metrics.</Subtitle>
      </PageHeader>

      <AnalyticsGrid>
        <ChartCard>
          <CardTitle>Revenue Overview</CardTitle>
          <PlaceholderChart>Revenue Line Chart Placeholder</PlaceholderChart>
        </ChartCard>

        <ChartCard>
          <CardTitle>Top Traffic Sources</CardTitle>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <SourceRow>
              <span>Search Options</span>
              <span style={{ fontWeight: 500 }}>45%</span>
            </SourceRow>
            <SourceRow>
              <span>Direct Res</span>
              <span style={{ fontWeight: 500 }}>30%</span>
            </SourceRow>
            <SourceRow>
              <span>Social Media</span>
              <span style={{ fontWeight: 500 }}>15%</span>
            </SourceRow>
            <SourceRow>
              <span>Other</span>
              <span style={{ fontWeight: 500 }}>10%</span>
            </SourceRow>
          </div>
        </ChartCard>
      </AnalyticsGrid>

      <ChartCard>
        <CardTitle>Top Performing Products</CardTitle>
        <PlaceholderChart>Bar Chart Placeholder</PlaceholderChart>
      </ChartCard>
    </motion.div>
  );
}
