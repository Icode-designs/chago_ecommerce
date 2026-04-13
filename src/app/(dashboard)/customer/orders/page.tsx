"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getCustomerOrders } from "@/lib/supabase/services";
import { Order } from "@/lib/types";
import { Button } from "@/components/ui";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
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
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  }
`;

const StatusChip = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: capitalize;
  background: ${({ theme, $status }) =>
    $status === "delivered"
      ? "rgba(76, 175, 80, 0.1)"
      : $status === "shipped"
        ? "rgba(33, 150, 243, 0.1)"
        : theme.colors.surfaceContainerHigh};
  color: ${({ theme, $status }) =>
    $status === "delivered"
      ? "#2E7D32"
      : $status === "shipped"
        ? "#1565C0"
        : theme.colors.onSurface};
`;

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const customerOrders = await getCustomerOrders(user.id);
          setOrders(customerOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
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
        <Title>Order History</Title>
      </PageHeader>

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
          <p>Start shopping to create your first order.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>Order ID</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Total</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Tr key={order.id}>
                  <Td style={{ fontWeight: 500 }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Td>
                  <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <StatusChip $status={order.status}>
                      {order.status}
                    </StatusChip>
                  </Td>
                  <Td>${order.total.toLocaleString()}</Td>
                  <Td style={{ textAlign: "right" }}>
                    <Button $variant="ghost" $size="sm">
                      View Details
                    </Button>
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
