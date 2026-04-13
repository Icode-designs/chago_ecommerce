'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Input, InputWrapper, InputLabel, Button, Card } from '@/components/ui';

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FormSection = styled(Card)`
  padding: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  max-width: 800px;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully.');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Profile & Settings</Title>
      </PageHeader>

      <form onSubmit={handleSave}>
        <FormSection>
          <SectionTitle>Personal Information</SectionTitle>
          <FormGrid>
            <InputWrapper>
              <InputLabel>Full Name</InputLabel>
              <Input defaultValue={profile?.full_name || ''} placeholder="John Doe" />
            </InputWrapper>
            <InputWrapper>
              <InputLabel>Email Address</InputLabel>
              <Input type="email" defaultValue={user?.email || ''} readOnly style={{ background: '#f5f5f7', color: '#86868B' }} />
            </InputWrapper>
            <InputWrapper>
              <InputLabel>Phone Number</InputLabel>
              <Input defaultValue={profile?.phone || ''} placeholder="+1 (555) 000-0000" />
            </InputWrapper>
          </FormGrid>
        </FormSection>

        <FormSection>
          <SectionTitle>Default Shipping Address</SectionTitle>
          <InputWrapper>
            <InputLabel>Street Address</InputLabel>
            <Input placeholder="123 Atelier Way" />
          </InputWrapper>
          <FormGrid>
            <InputWrapper>
              <InputLabel>City</InputLabel>
              <Input placeholder="San Francisco" />
            </InputWrapper>
            <InputWrapper>
              <InputLabel>State/Province</InputLabel>
              <Input placeholder="CA" />
            </InputWrapper>
            <InputWrapper>
              <InputLabel>Postal Code</InputLabel>
              <Input placeholder="94103" />
            </InputWrapper>
            <InputWrapper>
              <InputLabel>Country</InputLabel>
              <Input placeholder="United States" />
            </InputWrapper>
          </FormGrid>
          
          <ButtonRow>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </ButtonRow>
        </FormSection>
      </form>
    </motion.div>
  );
}
