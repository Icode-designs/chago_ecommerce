"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

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

      <EmptyState>
        <div style={{ textAlign: "center" }}>
          <p>No audit logs available</p>
          <p style={{ fontSize: "12px" }}>
            Audit logs will appear here as security events occur
          </p>
        </div>
      </EmptyState>
    </motion.div>
  );
}
