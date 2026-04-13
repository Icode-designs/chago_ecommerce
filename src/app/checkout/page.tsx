'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container, Button, Input, InputWrapper, InputLabel } from '@/components/ui';
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

const CheckoutLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
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

// Steps
const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Step = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const StepCircle = styled.div<{ $active?: boolean; $completed?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.labelMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  background: ${({ theme, $active, $completed }) =>
    $active || $completed ? theme.colors.primary : theme.colors.surfaceContainerHigh};
  color: ${({ theme, $active, $completed }) =>
    $active || $completed ? theme.colors.onPrimary : theme.colors.textTertiary};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const StepLabel = styled.span<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-weight: ${({ $active, theme }) => ($active ? theme.fontWeights.medium : theme.fontWeights.regular)};
  color: ${({ $active, theme }) => ($active ? theme.colors.onSurface : theme.colors.textTertiary)};
`;

const StepDivider = styled.div`
  width: 40px;
  height: 1px;
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
`;

// Form sections
const FormSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[5]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

// Summary
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

const SummaryItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ItemThumb = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  flex-shrink: 0;
`;

const ItemDetail = styled.div`
  flex: 1;
`;

const ItemName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const ItemMeta = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const SummaryRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ $bold, theme }) => ($bold ? theme.fontSizes.titleSm : theme.fontSizes.bodyMd)};
  font-weight: ${({ $bold, theme }) => ($bold ? theme.fontWeights.semibold : theme.fontWeights.regular)};
  color: ${({ $bold, theme }) => ($bold ? theme.colors.onSurface : theme.colors.textSecondary)};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { items, total } = useCart();
  const shipping = total > 500 ? 0 : 25;

  return (
    <PageWrapper>
      <Navbar />
      <Main>
        <Container>
          <PageTitle>Checkout</PageTitle>

          <StepIndicator>
            {steps.map((step, i) => (
              <React.Fragment key={step}>
                {i > 0 && <StepDivider />}
                <Step $active={i === currentStep} $completed={i < currentStep}>
                  <StepCircle $active={i === currentStep} $completed={i < currentStep}>
                    {i < currentStep ? '✓' : i + 1}
                  </StepCircle>
                  <StepLabel $active={i === currentStep}>{step}</StepLabel>
                </Step>
              </React.Fragment>
            ))}
          </StepIndicator>

          <CheckoutLayout>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <FormSection
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <SectionTitle>Shipping Address</SectionTitle>
                  <FormGrid>
                    <InputWrapper>
                      <InputLabel>First Name</InputLabel>
                      <Input placeholder="John" />
                    </InputWrapper>
                    <InputWrapper>
                      <InputLabel>Last Name</InputLabel>
                      <Input placeholder="Doe" />
                    </InputWrapper>
                  </FormGrid>
                  <InputWrapper>
                    <InputLabel>Address</InputLabel>
                    <Input placeholder="123 Design Street" />
                  </InputWrapper>
                  <FormGrid>
                    <InputWrapper>
                      <InputLabel>City</InputLabel>
                      <Input placeholder="San Francisco" />
                    </InputWrapper>
                    <InputWrapper>
                      <InputLabel>State</InputLabel>
                      <Input placeholder="CA" />
                    </InputWrapper>
                  </FormGrid>
                  <FormGrid>
                    <InputWrapper>
                      <InputLabel>ZIP Code</InputLabel>
                      <Input placeholder="94103" />
                    </InputWrapper>
                    <InputWrapper>
                      <InputLabel>Country</InputLabel>
                      <Input placeholder="United States" />
                    </InputWrapper>
                  </FormGrid>
                  <ButtonRow>
                    <Button $size="lg" onClick={() => setCurrentStep(1)}>
                      Continue to Payment
                    </Button>
                  </ButtonRow>
                </FormSection>
              )}

              {currentStep === 1 && (
                <FormSection
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <SectionTitle>Payment Method</SectionTitle>
                  <InputWrapper>
                    <InputLabel>Card Number</InputLabel>
                    <Input placeholder="4242 4242 4242 4242" />
                  </InputWrapper>
                  <FormGrid>
                    <InputWrapper>
                      <InputLabel>Expiry</InputLabel>
                      <Input placeholder="MM/YY" />
                    </InputWrapper>
                    <InputWrapper>
                      <InputLabel>CVC</InputLabel>
                      <Input placeholder="123" />
                    </InputWrapper>
                  </FormGrid>
                  <InputWrapper>
                    <InputLabel>Name on Card</InputLabel>
                    <Input placeholder="John Doe" />
                  </InputWrapper>
                  <ButtonRow>
                    <Button $variant="ghost" $size="lg" onClick={() => setCurrentStep(0)}>
                      Back
                    </Button>
                    <Button $size="lg" onClick={() => setCurrentStep(2)}>
                      Review Order
                    </Button>
                  </ButtonRow>
                </FormSection>
              )}

              {currentStep === 2 && (
                <FormSection
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <SectionTitle>Review Your Order</SectionTitle>
                  <p style={{ color: '#596065', lineHeight: '1.6' }}>
                    Please review your order details below. Once confirmed, your order will be processed and you will receive a confirmation email.
                  </p>
                  <ButtonRow>
                    <Button $variant="ghost" $size="lg" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button $size="lg">
                      Place Order — ${(total + shipping).toLocaleString()}
                    </Button>
                  </ButtonRow>
                </FormSection>
              )}
            </AnimatePresence>

            <Summary>
              <SummaryTitle>Order Summary</SummaryTitle>
              {items.map(item => (
                <SummaryItem key={item.product.id}>
                  <ItemThumb />
                  <ItemDetail>
                    <ItemName>{item.product.name}</ItemName>
                    <ItemMeta>Qty: {item.quantity} · ${(item.product.price * item.quantity).toLocaleString()}</ItemMeta>
                  </ItemDetail>
                </SummaryItem>
              ))}
              <Divider />
              <SummaryRow><span>Subtotal</span><span>${total.toLocaleString()}</span></SummaryRow>
              <SummaryRow><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></SummaryRow>
              <Divider />
              <SummaryRow $bold><span>Total</span><span>${(total + shipping).toLocaleString()}</span></SummaryRow>
            </Summary>
          </CheckoutLayout>
        </Container>
      </Main>
      <Footer />
    </PageWrapper>
  );
}
