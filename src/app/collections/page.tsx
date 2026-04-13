"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import AIChatbox from "@/components/ai/AIChatbox";
import { Container, Section } from "@/components/ui";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { getProducts, getCategories } from "@/lib/supabase/services";
import { staggerContainer } from "@/lib/animations";
import { Product } from "@/lib/types";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.layout.headerHeight};
`;

const HeroBanner = styled(motion.div)`
  width: 100%;
  height: 480px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.primaryDim} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 320px;
  }
`;

const HeroContent = styled.div`
  max-width: 640px;
`;

const HeroLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  text-transform: uppercase;
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displayLg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.onPrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.displaySm};
  }
`;

const HeroDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: rgba(255, 255, 255, 0.7);
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.headlineLg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts({ limit: 50 });
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
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
        <HeroBanner
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <HeroContent>
            <HeroLabel>Featured Collection</HeroLabel>
            <HeroTitle>The Timeless Atelier</HeroTitle>
            <HeroDesc>
              A capsule of enduring design. Each piece selected for its ability
              to transcend trends and elevate everyday living.
            </HeroDesc>
          </HeroContent>
        </HeroBanner>

        <Section>
          <Container>
            <AnimatedSection>
              <SectionTitle>Collection Pieces</SectionTitle>
            </AnimatedSection>
            <AnimatedSection stagger>
              <ProductGrid variants={staggerContainer}>
                {products.map((product) => (
                  <AnimatedItem key={product.id}>
                    <ProductCard product={product} />
                  </AnimatedItem>
                ))}
              </ProductGrid>
            </AnimatedSection>
          </Container>
        </Section>
      </Main>
      <Footer />
      <AIChatbox />
    </PageWrapper>
  );
}
