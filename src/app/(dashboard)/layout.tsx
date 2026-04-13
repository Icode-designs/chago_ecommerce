'use client';

import React from 'react';
import styled from 'styled-components';
import Navbar from '@/components/layout/Navbar';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  padding-top: ${({ theme }) => theme.layout.headerHeight};
`;

const ContentArea = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[10]};
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[4]};
  }
`;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutWrapper>
      <Navbar />
      <MainContent>
        <DashboardSidebar />
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutWrapper>
  );
}
