'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const LogContainer = styled.div`
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  font-family: monospace;
  overflow: hidden;
`;

const LogHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  font-weight: 600;
  font-size: 14px;
`;

const LogRow = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainer};
  font-size: 13px;
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};

  &:last-child {
    border-bottom: none;
  }
`;

const Timestamp = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  width: 160px;
  flex-shrink: 0;
`;

const logs = [
  { id: 1, ts: new Date().toISOString(), event: 'ADMIN_LOGIN_SUCCESS', user: 'admin@chago.com', ip: '192.168.1.1' },
  { id: 2, ts: new Date(Date.now() - 3600000).toISOString(), event: 'ROLE_UPDATED', user: 'system', details: 'User ID 45 updated to vendor' },
  { id: 3, ts: new Date(Date.now() - 7200000).toISOString(), event: 'PAYOUT_PROCESSED', user: 'admin@chago.com', details: 'Batch ID #8892' },
];

export default function AdminSecurityPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Security & Audit Logs</Title>
      </PageHeader>

      <LogContainer>
        <LogHeader>System Audit Trail</LogHeader>
        {logs.map(log => (
          <LogRow key={log.id}>
            <Timestamp>{new Date(log.ts).toLocaleString()}</Timestamp>
            <span style={{ color: '#0066CC', width: 140 }}>{log.event}</span>
            <span style={{ width: 150 }}>{log.user}</span>
            <span style={{ color: '#86868B' }}>{log.ip || log.details}</span>
          </LogRow>
        ))}
      </LogContainer>
    </motion.div>
  );
}
