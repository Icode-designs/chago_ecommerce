"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUserWishlist } from "@/lib/supabase/services";
import { WishlistItem, Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import { staggerContainer } from "@/lib/animations";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Grid = styled(motion.div)`
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

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const items = await getUserWishlist(user.id);
          setWishlistItems(items);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
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

  const products: Product[] =
    wishlistItems
      .map((item) => item.product)
      .filter((p): p is Product => Boolean(p)) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Wishlist</Title>
        <Subtitle>Curated items you&apos;ve saved for later.</Subtitle>
      </PageHeader>

      {products.length > 0 ? (
        <Grid variants={staggerContainer} initial="hidden" animate="visible">
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </Grid>
      ) : (
        <div
          style={{ textAlign: "center", padding: "4rem 0", color: "#86868B" }}
        >
          Your wishlist is empty. Explore our collection to find pieces you
          love.
        </div>
      )}
    </motion.div>
  );
}
