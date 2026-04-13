"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getVendorOrders } from "@/lib/supabase/services";
import { Button, Input } from "@/components/ui";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Toolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SearchInput = styled(Input)`
  max-width: 320px;
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
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
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
        : $status === "shipped"
          ? "rgba(33, 150, 243, 0.1)"
          : $status === "delivered"
            ? "rgba(76, 175, 80, 0.1)"
            : theme.colors.surfaceContainerHigh};
  color: ${({ theme, $status }) =>
    $status === "pending"
      ? "#F5A623"
      : $status === "processing"
        ? "#9C27B0"
        : $status === "shipped"
          ? "#1565C0"
          : $status === "delivered"
            ? "#2E7D32"
            : theme.colors.onSurface};
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export default function VendorOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const vendorOrders = await getVendorOrders(user.id);
          setOrders(vendorOrders);
        }
      } catch (error) {
        console.error("Error fetching vendor orders:", error);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Orders</Title>
      </PageHeader>

      <Toolbar>
        <SearchInput placeholder="Search orders by ID..." />
        <Button $variant="secondary">Filter Status</Button>
      </Toolbar>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "#86868B",
            background: "var(--surface-container-lowest)",
            borderRadius: "12px",
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            No orders yet
          </p>
          <p>Your customer orders will appear here.</p>
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
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((orderItem) => (
                <Tr key={orderItem.id}>
                  <Td style={{ fontWeight: 500 }}>
                    #{orderItem.order?.id.slice(0, 8).toUpperCase()}
                  </Td>
                  <Td>
                    {new Date(orderItem.order?.created_at).toLocaleDateString()}
                  </Td>
                  <Td>{orderItem.order?.customer?.full_name || "Customer"}</Td>
                  <Td>
                    <StatusBadge $status={orderItem.order?.status}>
                      {orderItem.order?.status}
                    </StatusBadge>
                  </Td>
                  <Td>${orderItem.order?.total.toLocaleString()}</Td>
                  <Td>
                    <ActionRow>
                      <Button $variant="ghost" $size="sm">
                        View
                      </Button>
                      <Button $variant="ghost" $size="sm">
                        Update Status
                      </Button>
                    </ActionRow>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </motion.div>
  );
}
