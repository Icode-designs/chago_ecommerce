"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserReviews } from "@/lib/supabase/services";
import { Review } from "@/lib/types";

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
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ReviewCard = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const ProductImg = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.md};
  flex-shrink: 0;
`;

const ReviewContent = styled.div`
  flex: 1;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ProductName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const DateText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const Stars = styled.div`
  color: #f5a623;
  letter-spacing: 2px;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Comment = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const userReviews = await getUserReviews(user.id);
          setReviews(userReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
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
        <Title>My Reviews</Title>
        <Subtitle>
          Your feedback helps the community make informed decisions.
        </Subtitle>
      </PageHeader>

      {reviews.length === 0 ? (
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
            No reviews yet
          </p>
          <p>
            Your reviews will appear here once you've purchased and reviewed
            products.
          </p>
        </div>
      ) : (
        <ReviewList>
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              <ProductImg />
              <ReviewContent>
                <HeaderRow>
                  <ProductName>{review.product?.name || "Product"}</ProductName>
                  <DateText>
                    {new Date(review.created_at).toLocaleDateString()}
                  </DateText>
                </HeaderRow>
                <Stars>
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </Stars>
                <Comment>{review.comment}</Comment>
              </ReviewContent>
            </ReviewCard>
          ))}
        </ReviewList>
      )}
    </motion.div>
  );
}
