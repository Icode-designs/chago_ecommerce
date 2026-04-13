'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  padding: ${({ theme }) => theme.spacing[16]} 0 ${({ theme }) => theme.spacing[8]};
  margin-top: auto;
`;

const FooterInner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing[4]};
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[12]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const BrandName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.titleLg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
`;

const BrandDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  max-width: 320px;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const FooterColumnTitle = styled.h6`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FooterLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <FooterInner>
        <FooterGrid>
          <FooterBrand>
            <BrandName>Chago</BrandName>
            <BrandDesc>
              A sanctuary for high-end digital commerce and aesthetic discovery powered by neural search.
            </BrandDesc>
          </FooterBrand>

          <FooterColumn>
            <FooterColumnTitle>Shop</FooterColumnTitle>
            <FooterLink href="/collections">Collections</FooterLink>
            <FooterLink href="/shop?filter=new">New Arrivals</FooterLink>
            <FooterLink href="/shop">All Products</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterColumnTitle>Support</FooterColumnTitle>
            <FooterLink href="#">Contact</FooterLink>
            <FooterLink href="#">Shipping Info</FooterLink>
            <FooterLink href="#">Returns</FooterLink>
          </FooterColumn>

          <FooterColumn>
            <FooterColumnTitle>Legal</FooterColumnTitle>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
          </FooterColumn>
        </FooterGrid>

        <FooterBottom>
          <Copyright>© {new Date().getFullYear()} Chago. All rights reserved.</Copyright>
        </FooterBottom>
      </FooterInner>
    </FooterWrapper>
  );
}
