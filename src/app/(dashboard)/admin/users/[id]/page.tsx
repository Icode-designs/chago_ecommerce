"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@/components/ui";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const BackButton = styled(Link)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerHigh};
  }
`;

const TitleColumn = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const SectionContainer = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.primary};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};

  &:last-child {
    border-bottom: none;
  }
`;

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = typeof params.id === "string" ? params.id : "unknown";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <BackButton href="/admin/users">←</BackButton>
        <TitleColumn>
          <Title>User Details</Title>
          <Subtitle>ID: {userId}</Subtitle>
        </TitleColumn>
        <Button
          $variant="secondary"
          style={{ color: "#9F403D", borderColor: "#9F403D" }}
        >
          Ban User
        </Button>
      </PageHeader>

      <DetailGrid>
        <div>
          <SectionContainer>
            <SectionTitle>Profile Information</SectionTitle>
            <InfoRow>
              <span>Full Name</span>
              <span style={{ fontWeight: 500 }}>Customer User</span>
            </InfoRow>
            <InfoRow>
              <span>Email</span>
              <span style={{ fontWeight: 500 }}>customer@chago.com</span>
            </InfoRow>
            <InfoRow>
              <span>Phone</span>
              <span style={{ fontWeight: 500 }}>+1 555-0123</span>
            </InfoRow>
            <InfoRow>
              <span>Joined</span>
              <span style={{ fontWeight: 500 }}>Jan 15, 2024</span>
            </InfoRow>
            <InfoRow>
              <span>Role</span>
              <span style={{ fontWeight: 500, textTransform: "capitalize" }}>
                customer
              </span>
            </InfoRow>
            <InfoRow>
              <span>Status</span>
              <span style={{ fontWeight: 500, color: "#2E7D32" }}>Active</span>
            </InfoRow>
          </SectionContainer>
        </div>

        <div>
          <SectionContainer>
            <SectionTitle>Quick Actions</SectionTitle>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <Button $variant="secondary" $fullWidth>
                Verify Identity
              </Button>
            </div>
          </SectionContainer>
        </div>
      </DetailGrid>
    </motion.div>
  );
}
