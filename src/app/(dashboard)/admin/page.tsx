"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Card, Input, Button, InputLabel } from "@/components/ui";
import { getAdminStats } from "@/lib/supabase/services";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Greeting = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[10]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const StatCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.labelMd};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
`;

const ActivityContainer = styled.div`
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  padding: ${({ theme }) => theme.spacing[6]};
  min-height: 300px;
`;

const ActivityTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalUsers: 0,
    openDisputes: 0,
    platformRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const adminStats = await getAdminStats();
        setStats(adminStats);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Greeting>Admin Dashboard</Greeting>
        <Subtitle>Platform overview and recent system activity.</Subtitle>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalVendors}</StatValue>
          <StatLabel>Total Vendors</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalUsers}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.openDisputes}</StatValue>
          <StatLabel>Open Disputes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>${(stats.platformRevenue / 1000).toFixed(1)}k</StatValue>
          <StatLabel>Platform Revenue (All Time)</StatLabel>
        </StatCard>
      </StatsGrid>

      <div
        style={{ display: "grid", gridTemplateColumns: "revert", gap: "24px" }}
      >
        <ActivityContainer>
          <ActivityTitle>Recent System Activity</ActivityTitle>
          <div
            style={{
              color: "#86868B",
              fontStyle: "italic",
              padding: "2rem 0",
              textAlign: "center",
            }}
          >
            No prominent system alerts at this time.
          </div>
        </ActivityContainer>

        <ActivityContainer style={{ gridColumn: "1 / -1" }}>
          <ActivityTitle>Promotions Override</ActivityTitle>
          <p
            style={{ color: "#86868B", fontSize: "14px", marginBottom: "16px" }}
          >
            Force a product to be featured on the main homepage carousel using
            its unique Product ID.
          </p>
          <form
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-end",
              maxWidth: "400px",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Override successful. Product set to Featured.");
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div style={{ flex: 1 }}>
              <InputLabel>Product ID</InputLabel>
              <Input
                placeholder="e.g. prod-1"
                required
                style={{ marginTop: "8px" }}
              />
            </div>
            <Button type="submit">Set Featured</Button>
          </form>
        </ActivityContainer>
      </div>
    </motion.div>
  );
}
