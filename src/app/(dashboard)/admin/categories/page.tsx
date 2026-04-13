"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Input, Button } from "@/components/ui";
import { getCategories } from "@/lib/supabase/services";
import { Category } from "@/lib/types";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const CategoriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const CategoryCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
`;

const CategoryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const CategoryName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const CategorySlug = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        <Title>Categories</Title>
        <Button>Add Category</Button>
      </PageHeader>

      <Toolbar>
        <SearchInput placeholder="Search categories..." />
      </Toolbar>

      <CategoriesList>
        {categories.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 2rem",
              color: "#86868B",
              background: "#F5F5F5",
              borderRadius: "12px",
            }}
          >
            <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              No categories yet
            </p>
            <p>Create your first category to get started.</p>
          </div>
        ) : (
          categories.map((c) => (
            <CategoryCard key={c.id}>
              <CategoryInfo>
                <CategoryName>{c.name}</CategoryName>
                <CategorySlug>/{c.slug}</CategorySlug>
              </CategoryInfo>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button $variant="ghost" $size="sm">
                  Edit
                </Button>
              </div>
            </CategoryCard>
          ))
        )}
      </CategoriesList>
    </motion.div>
  );
}
