'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIChatbox from '@/components/ai/AIChatbox';
import { Container, Button } from '@/components/ui';
import { useCart } from '@/hooks/useCart';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.layout.headerHeight};
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[10]} 0 ${({ theme }) => theme.spacing[16]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const CartItemCard = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]};
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.outlineVariant};
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ItemName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const ItemCategory = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
`;

const ItemPrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.titleSm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const QtyButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const QtyValue = styled.span`
  width: 32px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const RemoveButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.labelMd};
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

// Order Summary
const Summary = styled.div`
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  height: fit-content;
  position: sticky;
  top: calc(${({ theme }) => theme.layout.headerHeight} + 24px);
`;

const SummaryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const SummaryRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ $bold, theme }) => ($bold ? theme.fontSizes.titleSm : theme.fontSizes.bodyMd)};
  font-weight: ${({ $bold, theme }) => ($bold ? theme.fontWeights.semibold : theme.fontWeights.regular)};
  color: ${({ $bold, theme }) => ($bold ? theme.colors.onSurface : theme.colors.textSecondary)};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const AISuggestion = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-top: ${({ theme }) => theme.spacing[5]};
`;

const AISuggestionTag = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.tertiary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wide};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  &::before {
    content: '✦';
    font-size: 10px;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} 0;
`;

const EmptyTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.headlineSm};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export default function CartPage() {
  const { items, itemCount, total, updateQuantity, removeItem } = useCart();
  const shipping = total > 500 ? 0 : 25;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <PageWrapper>
        <Navbar />
        <Main>
          <Container>
            <EmptyCart>
              <EmptyTitle>Your cart is empty</EmptyTitle>
              <EmptyText>Discover something extraordinary.</EmptyText>
              <Link href="/shop">
                <Button $size="lg">Browse Products</Button>
              </Link>
            </EmptyCart>
          </Container>
        </Main>
        <Footer />
        <AIChatbox />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />
      <Main>
        <Container>
          <PageTitle>Cart ({itemCount})</PageTitle>
          <CartLayout>
            <div>
              {items.map((item, i) => (
                <CartItemCard
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ItemImage>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                  </ItemImage>
                  <ItemInfo>
                    <ItemCategory>{item.product.category?.name || 'Product'}</ItemCategory>
                    <ItemName>{item.product.name}</ItemName>
                    <ItemPrice>${(item.product.price * item.quantity).toLocaleString()}</ItemPrice>
                    <ItemActions>
                      <QuantityControl>
                        <QtyButton onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</QtyButton>
                        <QtyValue>{item.quantity}</QtyValue>
                        <QtyButton onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</QtyButton>
                      </QuantityControl>
                      <RemoveButton onClick={() => removeItem(item.product.id)}>Remove</RemoveButton>
                    </ItemActions>
                  </ItemInfo>
                </CartItemCard>
              ))}
            </div>

            <Summary>
              <SummaryTitle>Order Summary</SummaryTitle>
              <SummaryRow>
                <span>Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </SummaryRow>
              <Divider />
              <SummaryRow $bold>
                <span>Total</span>
                <span>${grandTotal.toLocaleString()}</span>
              </SummaryRow>
              <Link href="/checkout">
                <Button $size="lg" $fullWidth style={{ marginTop: '1rem' }}>
                  Proceed to Checkout
                </Button>
              </Link>

              <AISuggestion>
                <AISuggestionTag>Complete Your Look</AISuggestionTag>
                <p style={{ fontSize: '0.875rem', color: '#596065', lineHeight: '1.6' }}>
                  Based on your selections, our AI recommends the Ceramic Diffuser Set — a perfect sensory complement.
                </p>
              </AISuggestion>
            </Summary>
          </CartLayout>
        </Container>
      </Main>
      <Footer />
      <AIChatbox />
    </PageWrapper>
  );
}
