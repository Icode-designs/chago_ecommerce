"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getCustomerOrders,
  getFeaturedProducts,
  getUserWishlist,
} from "@/lib/supabase/services";
import { Card, Section } from "@/components/ui";
import ProductCard from "@/components/product/ProductCard";
import { Product, Order } from "@/lib/types";

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
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[10]};

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

const RecentOrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const OrderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerLow};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const OrderId = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const OrderDate = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const OrderStatus = styled.span<{ $status: string }>`
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

const OrderTotal = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const RecommendationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export default function CustomerDashboard() {
  const { profile, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const [customerOrders, featuredProds, wishlist] = await Promise.all([
            getCustomerOrders(user.id),
            getFeaturedProducts(3),
            getUserWishlist(user.id),
          ]);
          setOrders(customerOrders);
          setRecommendations(featuredProds);
          setWishlistCount(wishlist.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const recentOrders = orders.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Greeting>
          Welcome back, {profile?.full_name?.split(" ")[0] || "Guest"}
        </Greeting>
        <Subtitle>Here&apos;s what is happening with your account.</Subtitle>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatValue>{orders.length}</StatValue>
          <StatLabel>Total Orders</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{wishlistCount}</StatValue>
          <StatLabel>Saved Items</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Active Returns</StatLabel>
        </StatCard>
      </StatsGrid>

      <div style={{ marginBottom: "3rem" }}>
        <SectionTitle>Recent Orders</SectionTitle>
        <RecentOrdersList>
          {recentOrders.map((order) => (
            <OrderRow key={order.id}>
              <OrderInfo>
                <OrderId>Order #{order.id.slice(0, 8)}</OrderId>
                <OrderDate>
                  {new Date(order.created_at).toLocaleDateString()}
                </OrderDate>
              </OrderInfo>
              <OrderStatus $status={order.status}>{order.status}</OrderStatus>
              <OrderTotal>${order.total.toLocaleString()}</OrderTotal>
            </OrderRow>
          ))}
        </RecentOrdersList>
      </div>

      <div>
        <SectionTitle>AI Stylist Recommendations</SectionTitle>
        <p
          style={{
            color: "#596065",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          Based on your recent aesthetic preferences and historical purchases.
        </p>
        <RecommendationsGrid>
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </RecommendationsGrid>
      </div>
    </motion.div>
  );
}
