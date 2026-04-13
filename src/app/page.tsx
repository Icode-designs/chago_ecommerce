"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AISearchBar from "@/components/ai/AISearchBar";
import AIChatbox from "@/components/ai/AIChatbox";
import ProductCard from "@/components/product/ProductCard";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Container, Section, SectionAlt, Input, Button } from "@/components/ui";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import {
  getProducts,
  getFeaturedProducts,
  getCategories,
} from "@/lib/supabase/services";
import { Product, Category } from "@/lib/types";
import heroBg from "@/assets/heroBg.jpeg";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.layout.headerHeight};
`;

const MobileSearchWrapper = styled.div`
  display: block;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

// ============================================
// HERO
// ============================================

const HeroSection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} 0
    ${({ theme }) => theme.spacing[16]};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-image: url(${heroBg.src});
  background-position: top;
  background-size: cover;
  background-repeat: no-repeat;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing[12]} 0
      ${({ theme }) => theme.spacing[10]};
  }
`;

const HeroLabel = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.tertiary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  &::before {
    content: "✦";
    font-size: 10px;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: ${({ theme }) => theme.fontSizes.displayLg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.inversePrimary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.tight};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  max-width: 640px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.displaySm};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes.headlineLg};
  }
`;

const HeroDescription = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: ${({ theme }) => theme.colors.inversePrimary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  max-width: 520px;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

// ============================================
// PREDICTED AESTHETICS
// ============================================

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.headlineLg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
`;

const SectionLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.tertiary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
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

// ============================================
// CATEGORIES
// ============================================

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const CategoryCard = styled(motion.div)<{ $url?: string }>`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 200px;
  cursor: pointer;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surfaceContainer} 0%,
    ${({ theme }) => theme.colors.surfaceContainerHigh} 100%
  );
  background-image: ${({ $url }) => ($url ? `url(${$url})` : "none")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-end;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const CategoryName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  text-align: center;
`;

// ============================================
// FEATURES
// ============================================

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.tertiary};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const FeatureTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const NewsletterWrapper = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surfaceContainer} 0%,
    ${({ theme }) => theme.colors.surfaceContainerHigh} 100%
  );
  border-radius: ${({ theme }) => theme.radii["2xl"]};
  padding: ${({ theme }) => theme.spacing[16]};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing[10]}
      ${({ theme }) => theme.spacing[6]};
  }
`;

const NewsletterTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.headlineLg};
  }
`;

const NewsletterDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 480px;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  max-width: 400px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allProducts, featured, cats] = await Promise.all([
          getProducts({ limit: 12 }),
          getFeaturedProducts(8),
          getCategories(),
        ]);
        setProducts(allProducts);
        setFeaturedProducts(featured);
        setCategories(cats);
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

  const predictedProducts = products.slice(0, 4);
  const bestDeals = [...products]
    .filter((p) => p.compare_at_price && p.compare_at_price > p.price)
    .sort((a, b) => {
      const discountA = (a.compare_at_price! - a.price) / a.compare_at_price!;
      const discountB = (b.compare_at_price! - b.price) / b.compare_at_price!;
      return discountB - discountA;
    })
    .slice(0, 4);

  return (
    <PageWrapper>
      <Navbar />
      <Main>
        {/* Hero */}
        <HeroSection>
          <Container
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <HeroLabel
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              AI-Powered Discovery
            </HeroLabel>
            <HeroTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Curation Redefined.
            </HeroTitle>
            <HeroDescription
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              The first marketplace where AI understands your aesthetic
              intuition. Search with words, or just a feeling.
            </HeroDescription>
            <MobileSearchWrapper>
              <AISearchBar />
            </MobileSearchWrapper>
            <div style={{ height: "40px" }} />
          </Container>
        </HeroSection>

        {/* Predicted Aesthetics */}
        <Section>
          <Container>
            <AnimatedSection>
              <SectionHeader>
                <SectionTitle>Predicted Aesthetics</SectionTitle>
                <SectionLink href="/shop">View All →</SectionLink>
              </SectionHeader>
            </AnimatedSection>
            <AnimatedSection stagger>
              {predictedProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <p style={{ color: "#596065", fontSize: "0.95rem" }}>
                    No products available at the moment.
                  </p>
                </div>
              ) : (
                <ProductGrid variants={staggerContainer}>
                  {predictedProducts.map((product) => (
                    <AnimatedItem key={product.id}>
                      <ProductCard product={product} />
                    </AnimatedItem>
                  ))}
                </ProductGrid>
              )}
            </AnimatedSection>
          </Container>
        </Section>

        {/* Shop by Category */}
        <SectionAlt>
          <Container>
            <AnimatedSection>
              <SectionHeader>
                <SectionTitle>Shop by Category</SectionTitle>
              </SectionHeader>
            </AnimatedSection>
            <AnimatedSection stagger>
              {categories.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <p style={{ color: "#596065", fontSize: "0.95rem" }}>
                    No categories available at the moment.
                  </p>
                </div>
              ) : (
                <CategoryGrid>
                  {categories.map((category) => (
                    <div key={category.id}>
                      <CategoryCard
                        $url={category.image_url || undefined}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      />
                      <CategoryName>{category.name}</CategoryName>
                    </div>
                  ))}
                </CategoryGrid>
              )}
            </AnimatedSection>
          </Container>
        </SectionAlt>

        {/* Featured Products */}
        <Section>
          <Container>
            <AnimatedSection>
              <SectionHeader>
                <SectionTitle>Featured Products</SectionTitle>
                <SectionLink href="/shop?filter=featured">
                  View All →
                </SectionLink>
              </SectionHeader>
            </AnimatedSection>
            <AnimatedSection stagger>
              {featuredProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <p style={{ color: "#596065", fontSize: "0.95rem" }}>
                    No featured products available at the moment.
                  </p>
                </div>
              ) : (
                <ProductGrid variants={staggerContainer}>
                  {featuredProducts.map((product) => (
                    <AnimatedItem key={`feat-${product.id}`}>
                      <ProductCard product={product} />
                    </AnimatedItem>
                  ))}
                </ProductGrid>
              )}
            </AnimatedSection>
          </Container>
        </Section>

        {/* Best Deals */}
        <SectionAlt>
          <Container>
            <AnimatedSection>
              <SectionHeader>
                <SectionTitle>Best Deals</SectionTitle>
                <SectionLink href="/shop?filter=sale">
                  Shop Offers →
                </SectionLink>
              </SectionHeader>
            </AnimatedSection>
            <AnimatedSection stagger>
              {bestDeals.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <p style={{ color: "#596065", fontSize: "0.95rem" }}>
                    No deals available at the moment.
                  </p>
                </div>
              ) : (
                <ProductGrid variants={staggerContainer}>
                  {bestDeals.map((product) => (
                    <AnimatedItem key={`deal-${product.id}`}>
                      <ProductCard product={product} />
                    </AnimatedItem>
                  ))}
                </ProductGrid>
              )}
            </AnimatedSection>
          </Container>
        </SectionAlt>

        {/* Features */}
        <Section>
          <Container>
            <AnimatedSection stagger>
              <FeatureGrid>
                <FeatureCard variants={fadeInUp}>
                  <FeatureIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                      />
                    </svg>
                  </FeatureIcon>
                  <FeatureTitle>Neural Personalization</FeatureTitle>
                  <FeatureDesc>
                    Our AI models learn your visual preferences over time to
                    surface products that match your unique aesthetic
                    fingerprint.
                  </FeatureDesc>
                </FeatureCard>

                <FeatureCard variants={fadeInUp}>
                  <FeatureIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                      />
                    </svg>
                  </FeatureIcon>
                  <FeatureTitle>Curation Quality</FeatureTitle>
                  <FeatureDesc>
                    Every artisan and brand on Chago is manually vetted for
                    sustainability, craftsmanship, and design excellence.
                  </FeatureDesc>
                </FeatureCard>

                <FeatureCard variants={fadeInUp}>
                  <FeatureIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />
                    </svg>
                  </FeatureIcon>
                  <FeatureTitle>Seamless Fulfillment</FeatureTitle>
                  <FeatureDesc>
                    Priority white-glove delivery on all items over $500.
                    Securely handled and tracked at every micro-step.
                  </FeatureDesc>
                </FeatureCard>
              </FeatureGrid>
            </AnimatedSection>
          </Container>
        </Section>
        {/* Newsletter */}
        <SectionAlt>
          <Container>
            <AnimatedSection>
              <NewsletterWrapper>
                <NewsletterTitle>The Curation, Delivered.</NewsletterTitle>
                <NewsletterDesc>
                  Sign up to receive early access to new designer collections,
                  exclusive artisan drops, and curated aesthetic guides.
                </NewsletterDesc>
                <NewsletterForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Subscribed!");
                  }}
                >
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    style={{ flex: 1 }}
                  />
                  <Button type="submit">Subscribe</Button>
                </NewsletterForm>
              </NewsletterWrapper>
            </AnimatedSection>
          </Container>
        </SectionAlt>
      </Main>
      <Footer />
      <AIChatbox />
    </PageWrapper>
  );
}
