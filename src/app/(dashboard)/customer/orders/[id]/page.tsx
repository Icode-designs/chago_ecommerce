"use client";

import React from "react";
import styled from "styled-components";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getOrderById } from "@/lib/supabase/services";
import { Order } from "@/lib/types";
import { Button } from "@/components/ui";
import Link from "next/link";

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

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const SectionContainer = styled.div`
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const OrderItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerLow};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ItemImg = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ItemName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 4px;
`;

const ItemMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const ItemPrice = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const SummaryRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-weight: ${({ $bold }) => ($bold ? 600 : 400)};
  color: ${({ $bold, theme }) =>
    $bold ? theme.colors.onSurface : theme.colors.textSecondary};
`;

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof params.id === "string") {
          const orderData = await getOrderById(params.id);
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (loading || !order) {
    return <p>Loading...</p>;
  }

  const items = order.items || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <BackButton href="/customer/orders">←</BackButton>
        <TitleColumn>
          <Title>
            Order #
            {typeof params.id === "string"
              ? params.id.slice(0, 8).toUpperCase()
              : "123456"}
          </Title>
          <Subtitle>
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </Subtitle>
        </TitleColumn>
        <Button $variant="secondary">Download Invoice</Button>
      </PageHeader>

      <OrderGrid>
        <div>
          <SectionContainer>
            <SectionTitle>Items Ordered</SectionTitle>
            <ItemList>
              {items.map((item) => (
                <OrderItem key={item.id}>
                  <ItemImg />
                  <ItemDetails>
                    <ItemName>{item.product?.name || "Product"}</ItemName>
                    <ItemMeta>Qty: {item.quantity}</ItemMeta>
                  </ItemDetails>
                  <ItemPrice>${item.price.toLocaleString()}</ItemPrice>
                </OrderItem>
              ))}
            </ItemList>
          </SectionContainer>
        </div>

        <div>
          <SectionContainer>
            <SectionTitle>Order Summary</SectionTitle>
            <SummaryRow>
              <span>Subtotal</span>
              <span>${order.total.toLocaleString()}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Shipping</span>
              <span>$0.00</span>
            </SummaryRow>
            <div
              style={{ height: 1, background: "#e0e0e0", margin: "16px 0" }}
            />
            <SummaryRow $bold>
              <span>Total</span>
              <span>${order.total.toLocaleString()}</span>
            </SummaryRow>
          </SectionContainer>
        </div>
      </OrderGrid>
    </motion.div>
  );
}
