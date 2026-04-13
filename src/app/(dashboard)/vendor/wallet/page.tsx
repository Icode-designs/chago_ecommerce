'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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

const BalanceCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[8]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDim} 100%);
  color: ${({ theme }) => theme.colors.onPrimary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const BalanceLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.labelMd};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  opacity: 0.8;
`;

const BalanceAmount = styled.div`
  font-size: 3rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.titleLg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const TxCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
`;

const TxInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const TxTitle = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const TxDate = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const TxAmount = styled.span<{ $positive?: boolean }>`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.titleSm};
  color: ${({ theme, $positive }) => ($positive ? '#2E7D32' : theme.colors.onSurface)};
`;

const transactions = [
  { id: 1, type: 'Payout', amount: -2500, date: new Date().toISOString() },
  { id: 2, type: 'Sale (Order #A1B2C3D4)', amount: 150, date: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, type: 'Sale (Order #X9Y8Z7W6)', amount: 320, date: new Date(Date.now() - 172800000).toISOString() },
];

export default function WalletPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <div>
          <Title>Wallet & Payouts</Title>
          <Subtitle>Manage your earnings and withdraw funds.</Subtitle>
        </div>
      </PageHeader>

      <BalanceCard>
        <BalanceLabel>Available Balance</BalanceLabel>
        <BalanceAmount>$4,250.00</BalanceAmount>
        <div>
          <Button style={{ background: '#fff', color: '#1D1D1F' }}>Withdraw Funds</Button>
        </div>
      </BalanceCard>

      <div>
        <SectionTitle>Recent Transactions</SectionTitle>
        <TransactionList>
          {transactions.map(tx => (
            <TxCard key={tx.id}>
              <TxInfo>
                <TxTitle>{tx.type}</TxTitle>
                <TxDate>{new Date(tx.date).toLocaleDateString()}</TxDate>
              </TxInfo>
              <TxAmount $positive={tx.amount > 0}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
              </TxAmount>
            </TxCard>
          ))}
        </TransactionList>
      </div>
    </motion.div>
  );
}
