"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getVendorOrders, getVendorStats } from "@/lib/supabase/services";
import { Card } from "@/components/ui";
import { Order } from "@/lib/types";

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

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.headlineSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing[5]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Tr = styled.tr`
  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: capitalize;
  background: ${({ theme, $status }) =>
    $status === "pending"
      ? "rgba(245, 166, 35, 0.1)"
      : $status === "processing"
        ? "rgba(156, 39, 176, 0.1)"
        : theme.colors.surfaceContainerHigh};
  color: ${({ theme, $status }) =>
    $status === "pending"
      ? "#F5A623"
      : $status === "processing"
        ? "#9C27B0"
        : theme.colors.onSurface};
`;

export default function VendorDashboard() {
  const { profile, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [vendorStats, setVendorStats] = useState({
    activeProducts: 0,
    storeRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const [vendorOrders, stats] = await Promise.all([
            getVendorOrders(user.id),
            getVendorStats(user.id),
          ]);
          setOrders(vendorOrders);
          setVendorStats(stats);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const recentOrders = orders.slice(0, 4);
  const totalRevenue = orders.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Greeting>Vendor Dashboard</Greeting>
        <Subtitle>
          Welcome back, {profile?.full_name || "Vendor"}. Here is your
          store&apos;s performance.
        </Subtitle>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatValue>${totalRevenue.toLocaleString()}</StatValue>
          <StatLabel>Total Revenue</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{orders.length}</StatValue>
          <StatLabel>Total Orders</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{vendorStats.activeProducts}</StatValue>
          <StatLabel>Active Products</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{vendorStats.storeRating || "N/A"}</StatValue>
          <StatLabel>Store Rating</StatLabel>
        </StatCard>
      </StatsGrid>

      <div>
        <SectionTitle>Recent Orders to Fulfill</SectionTitle>
        {recentOrders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 2rem",
              color: "#86868B",
              background: "#F5F5F5",
              borderRadius: "12px",
            }}
          >
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              No orders yet
            </p>
            <p>Orders will appear here once customers place them.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <Table>
              <thead>
                <tr>
                  <Th>Order ID</Th>
                  <Th>Date</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th>Total</Th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <Tr key={order.id}>
                    <Td>#{order.id.slice(0, 8).toUpperCase()}</Td>
                    <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                    <Td>Customer User</Td>
                    <Td>
                      <StatusBadge $status={order.status}>
                        {order.status}
                      </StatusBadge>
                    </Td>
                    <Td>${order.total.toLocaleString()}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
