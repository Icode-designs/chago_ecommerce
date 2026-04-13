"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import AIChatbox from "@/components/ai/AIChatbox";
import { Container, Button, Badge } from "@/components/ui";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { useCart } from "@/hooks/useCart";
import {
  getProductById,
  getProductReviews,
  getProducts,
} from "@/lib/supabase/services";
import { staggerContainer } from "@/lib/animations";
import { Product, Review } from "@/lib/types";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.layout.headerHeight};
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[12]};
  padding: ${({ theme }) => theme.spacing[10]} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const MainImage = styled(motion.div)`
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surfaceContainerLow} 0%,
    ${({ theme }) => theme.colors.surfaceContainer} 50%,
    ${({ theme }) => theme.colors.surfaceContainerHigh} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  svg {
    width: 80px;
    height: 80px;
    color: ${({ theme }) => theme.colors.outlineVariant};
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[4]};
`;

const CategoryLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textTertiary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  text-transform: uppercase;
`;

const ProductName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.headlineLg};
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Price = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.headlineMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const ComparePrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-decoration: line-through;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.loose};
`;

const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

const QtyButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.onSurface};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceContainer};
  }
`;

const QtyValue = styled.span`
  width: 40px;
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const AISuggestionCard = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

const AISuggestionTitle = styled.h6`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.tertiary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wide};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "✦";
    font-size: 10px;
  }
`;

const AISuggestionText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const SimilarSection = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} 0;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.headlineLg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const SimilarGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ReviewSection = styled.section`
  padding: ${({ theme }) => theme.spacing[10]} 0
    ${({ theme }) => theme.spacing[16]};
`;

const ReviewCard = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ReviewerName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Stars = styled.span`
  color: #f5a623;
  letter-spacing: 2px;
`;

const ReviewText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProductById(params.id as string);
        if (productData) {
          setProduct(productData);
          const [productReviews, allProducts] = await Promise.all([
            getProductReviews(productData.id),
            getProducts({ limit: 20 }),
          ]);
          setReviews(productReviews);
          setSimilarProducts(
            allProducts.filter((p) => p.id !== productData.id).slice(0, 4),
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading || !product) {
    return (
      <PageWrapper>
        <Navbar />
        <Main>
          <Container>
            <p>Loading...</p>
          </Container>
        </Main>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />
      <Main>
        <Container>
          <ProductLayout>
            <ImageGallery>
              <MainImage
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={0.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                  />
                </svg>
              </MainImage>
            </ImageGallery>

            <ProductInfo>
              {product.category && (
                <CategoryLabel>{product.category.name}</CategoryLabel>
              )}
              <ProductName>{product.name}</ProductName>

              <PriceRow>
                <Price>${product.price.toLocaleString()}</Price>
                {product.compare_at_price && (
                  <ComparePrice>
                    ${product.compare_at_price.toLocaleString()}
                  </ComparePrice>
                )}
                {product.compare_at_price && (
                  <Badge $variant="success">
                    Save $
                    {(
                      product.compare_at_price - product.price
                    ).toLocaleString()}
                  </Badge>
                )}
              </PriceRow>

              <Description>{product.description}</Description>

              <QuantityRow>
                <QuantityControl>
                  <QtyButton
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </QtyButton>
                  <QtyValue>{quantity}</QtyValue>
                  <QtyButton onClick={() => setQuantity((q) => q + 1)}>
                    +
                  </QtyButton>
                </QuantityControl>
                <span style={{ fontSize: "0.875rem", color: "#86868B" }}>
                  {product.stock} in stock
                </span>
              </QuantityRow>

              <ButtonRow>
                <Button
                  $size="lg"
                  onClick={handleAddToCart}
                  style={{ flex: 1 }}
                >
                  {added ? "✓ Added to Cart" : "Add to Cart"}
                </Button>
                <Button $variant="secondary" $size="lg">
                  ♡
                </Button>
              </ButtonRow>

              <AISuggestionCard>
                <AISuggestionTitle>AI Styling Insight</AISuggestionTitle>
                <AISuggestionText>
                  This piece pairs beautifully with minimalist interiors.
                  Consider complementing it with our Mono Desk Lamp for a
                  cohesive Scandinavian aesthetic.
                </AISuggestionText>
              </AISuggestionCard>
            </ProductInfo>
          </ProductLayout>

          {/* Reviews */}
          {reviews.length > 0 && (
            <ReviewSection>
              <SectionTitle>Reviews</SectionTitle>
              {reviews.map((review) => (
                <ReviewCard key={review.id}>
                  <ReviewHeader>
                    <ReviewerName>Verified Buyer</ReviewerName>
                    <Stars>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </Stars>
                  </ReviewHeader>
                  <ReviewText>{review.comment}</ReviewText>
                </ReviewCard>
              ))}
            </ReviewSection>
          )}

          {/* Similar Products */}
          <SimilarSection>
            <AnimatedSection>
              <SectionTitle>You May Also Like</SectionTitle>
            </AnimatedSection>
            <AnimatedSection stagger>
              <SimilarGrid variants={staggerContainer}>
                {similarProducts.map((p) => (
                  <AnimatedItem key={p.id}>
                    <ProductCard product={p} />
                  </AnimatedItem>
                ))}
              </SimilarGrid>
            </AnimatedSection>
          </SimilarSection>
        </Container>
      </Main>
      <Footer />
      <AIChatbox />
    </PageWrapper>
  );
}
