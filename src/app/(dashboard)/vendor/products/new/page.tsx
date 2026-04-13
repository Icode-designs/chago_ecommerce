'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button, Input, InputWrapper, InputLabel, Card } from '@/components/ui';

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

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.labelMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $active, $completed }) => 
    $active || $completed ? theme.colors.primary : theme.colors.textTertiary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &::before {
    content: '${({ $completed }) => $completed ? '✓' : ''}';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ theme, $active, $completed }) => 
      $active || $completed ? theme.colors.primary : theme.colors.surfaceContainerHigh};
    color: ${({ theme }) => theme.colors.onPrimary};
  }
`;

const StepDivider = styled.div`
  height: 1px;
  width: 40px;
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
`;

const FormSection = styled(Card)`
  padding: ${({ theme }) => theme.spacing[8]};
  max-width: 800px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurface};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.tertiary};
  }
`;

export default function NewProductPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Product uploaded successfully!');
    router.push('/vendor/products');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Add New Product</Title>
        <Subtitle>List a new item on the Chago marketplace.</Subtitle>
      </PageHeader>

      <StepIndicator>
        <Step $active={step === 1} $completed={step > 1}>Basic Info</Step>
        <StepDivider />
        <Step $active={step === 2} $completed={step > 2}>Pricing & Inventory</Step>
        <StepDivider />
        <Step $active={step === 3} $completed={step > 3}>Media & Publish</Step>
      </StepIndicator>

      <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
        <FormSection>
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <InputWrapper>
                <InputLabel>Product Name</InputLabel>
                <Input placeholder="e.g. Ceramic Accent Vase" required />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Category</InputLabel>
                <Input placeholder="Home Decor" required />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Description</InputLabel>
                <TextArea placeholder="Describe your product..." required />
              </InputWrapper>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FormGrid>
                <InputWrapper>
                  <InputLabel>Price ($)</InputLabel>
                  <Input type="number" min="0" step="0.01" placeholder="0.00" required />
                </InputWrapper>
                <InputWrapper>
                  <InputLabel>Compare At Price ($)</InputLabel>
                  <Input type="number" min="0" step="0.01" placeholder="Optional" />
                  <div style={{ fontSize: '12px', color: '#86868B', marginTop: '6px' }}>
                    Setting this higher than the Price will show a discount percentage and automatically qualify this product for the Best Deals category.
                  </div>
                </InputWrapper>
              </FormGrid>
              <FormGrid>
                <InputWrapper>
                  <InputLabel>Inventory Quantity</InputLabel>
                  <Input type="number" min="0" placeholder="0" required />
                </InputWrapper>
                <InputWrapper>
                  <InputLabel>SKU (Optional)</InputLabel>
                  <Input placeholder="e.g. VASE-01" />
                </InputWrapper>
              </FormGrid>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <InputWrapper>
                <InputLabel>Product Images</InputLabel>
                <div style={{ padding: '2rem', border: '2px dashed #E0E0E0', borderRadius: 8, textAlign: 'center', background: '#F9F9FB' }}>
                  <p style={{ color: '#86868B' }}>Drag and drop images here, or click to upload</p>
                  <div style={{ fontSize: '12px', marginTop: '8px', color: '#ACB3B8' }}>Maximum 3 images, max size 5MB each</div>
                </div>
              </InputWrapper>
            </motion.div>
          )}

          <ButtonRow>
            {step > 1 && (
              <Button type="button" $variant="ghost" onClick={handleBack}>Back</Button>
            )}
            <Button type="submit">
              {step === 3 ? 'Publish Product' : 'Next Step'}
            </Button>
          </ButtonRow>
        </FormSection>
      </form>
    </motion.div>
  );
}
