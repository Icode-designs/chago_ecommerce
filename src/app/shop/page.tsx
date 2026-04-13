"use client";

import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import AIChatbox from "@/components/ai/AIChatbox";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { Container, Section, Select, Input } from "@/components/ui";
import { getProducts, getCategories } from "@/lib/supabase/services";
import { staggerContainer } from "@/lib/animations";
import { Product, Category } from "@/lib/types";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: ${({ theme }) => theme.layout.headerHeight};
`;

const PageHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[10]} 0
    ${({ theme }) => theme.spacing[6]};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.displaySm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ShopLayout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const FilterSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const FilterTitle = styled.h6`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  text-transform: uppercase;
`;

const CategoryChip = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.labelMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.surfaceContainerHigh};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onPrimary : theme.colors.onSurface};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: left;

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.surfaceContainerHighest};
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ResultCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const SortSelect = styled(Select)`
  width: auto;
  min-width: 180px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const SearchInput = styled(Input)`
  max-width: 300px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 100%;
  }
`;

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [products, cats] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setAllProducts(products);
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    if (selectedCategory) {
      products = products.filter((p) => p.category_id === selectedCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q),
      );
    }

    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        products.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    }

    return products;
  }, [allProducts, selectedCategory, sortBy, search]);

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
        <Container>
          <PageHeader>
            <PageTitle>Shop</PageTitle>
            <PageDescription>
              Explore our curated collection of premium products.
            </PageDescription>
          </PageHeader>

          <ShopLayout>
            <FilterSidebar>
              <FilterGroup>
                <FilterTitle>Categories</FilterTitle>
                <CategoryChip
                  $active={selectedCategory === null}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Products
                </CategoryChip>
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat.id}
                    $active={selectedCategory === cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </CategoryChip>
                ))}
              </FilterGroup>

              <FilterGroup>
                <FilterTitle>Search</FilterTitle>
                <SearchInput
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FilterGroup>
            </FilterSidebar>

            <div>
              <ToolbarRow>
                <ResultCount>{filteredProducts.length} products</ResultCount>
                <SortSelect
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </SortSelect>
              </ToolbarRow>

              <AnimatedSection stagger>
                <ProductGrid variants={staggerContainer}>
                  {filteredProducts.map((product) => (
                    <AnimatedItem key={product.id}>
                      <ProductCard product={product} />
                    </AnimatedItem>
                  ))}
                </ProductGrid>
              </AnimatedSection>
            </div>
          </ShopLayout>
        </Container>
        <Section />
      </Main>
      <Footer />
      <AIChatbox />
    </PageWrapper>
  );
}
