"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button, Input, InputWrapper, InputLabel, Card } from "@/components/ui";
import { getCategories, createProduct } from "@/lib/supabase/services";
import { useAuth } from "@/hooks/useAuth";
import { Category } from "@/lib/types";

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
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.labelMd};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $active, $completed }) =>
    $active || $completed ? theme.colors.primary : theme.colors.textTertiary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &::before {
    content: "${({ $completed }) => ($completed ? "✓" : "")}";
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ theme, $active, $completed }) =>
      $active || $completed
        ? theme.colors.primary
        : theme.colors.surfaceContainerHigh};
    color: ${({ theme }) => theme.colors.onPrimary};
  }
`;

const StepDivider = styled.div`
  height: 1px;
  width: 40px;
  background: ${({ theme }) => theme.colors.surfaceContainerHigh};
`;

const FormSection = styled(Card)`
  padding: ${({ theme }) => theme.spacing[8]};
  max-width: 800px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurface};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurface};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]}
    ${({ theme }) => theme.spacing[8]};
  text-align: center;
`;

const EmptyStateTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.headlineMd};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 400px;
`;

export default function NewProductPage() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    price: "",
    compareAtPrice: "",
    stock: "",
    sku: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== 3) {
      handleNext();
      return;
    }

    if (!formData.name.trim() || !formData.categoryId || !formData.price) {
      setError("Please fill in all required fields");
      return;
    }

    if (!user?.id) {
      setError("You must be logged in to create a product");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const slug = generateSlug(formData.name);
      const compareAtPrice = formData.compareAtPrice
        ? parseFloat(formData.compareAtPrice)
        : null;

      await createProduct(
        user.id,
        formData.name,
        slug,
        formData.description || null,
        formData.categoryId,
        parseFloat(formData.price),
        compareAtPrice,
        parseInt(formData.stock) || 0,
        [],
      );

      router.push("/vendor/products");
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader>
          <Title>Add New Product</Title>
        </PageHeader>
        <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1rem", color: "#86868B" }}>
            Loading categories...
          </p>
        </div>
      </motion.div>
    );
  }

  if (categories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader>
          <Title>Add New Product</Title>
        </PageHeader>
        <FormSection>
          <EmptyStateContainer>
            <EmptyStateTitle>No Categories Available</EmptyStateTitle>
            <EmptyStateText>
              The store currently has no product categories. Please contact the
              admin to create categories before you can add products.
            </EmptyStateText>
          </EmptyStateContainer>
        </FormSection>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <Title>Add New Product</Title>
        <Subtitle>List a new item on the Chago marketplace.</Subtitle>
      </PageHeader>

      <StepIndicator>
        <Step $active={step === 1} $completed={step > 1}>
          Basic Info
        </Step>
        <StepDivider />
        <Step $active={step === 2} $completed={step > 2}>
          Pricing & Inventory
        </Step>
        <StepDivider />
        <Step $active={step === 3} $completed={step > 3}>
          Media & Publish
        </Step>
      </StepIndicator>

      <form onSubmit={handleSubmit}>
        <FormSection>
          {error && (
            <div
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#FEE2E2",
                border: "1px solid #FCA5A5",
                borderRadius: "0.5rem",
                color: "#991B1B",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InputWrapper>
                <InputLabel>Product Name *</InputLabel>
                <Input
                  placeholder="e.g. Ceramic Accent Vase"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Category *</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </InputWrapper>
              <InputWrapper>
                <InputLabel>Description</InputLabel>
                <TextArea
                  placeholder="Describe your product..."
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </InputWrapper>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FormGrid>
                <InputWrapper>
                  <InputLabel>Price ($) *</InputLabel>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </InputWrapper>
                <InputWrapper>
                  <InputLabel>Compare At Price ($)</InputLabel>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    name="compareAtPrice"
                    value={formData.compareAtPrice}
                    onChange={handleInputChange}
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#86868B",
                      marginTop: "6px",
                    }}
                  >
                    Setting this higher than the Price will show a discount
                    percentage and automatically qualify this product for the
                    Best Deals category.
                  </div>
                </InputWrapper>
              </FormGrid>
              <FormGrid>
                <InputWrapper>
                  <InputLabel>Inventory Quantity *</InputLabel>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </InputWrapper>
                <InputWrapper>
                  <InputLabel>SKU (Optional)</InputLabel>
                  <Input
                    placeholder="e.g. VASE-01"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                  />
                </InputWrapper>
              </FormGrid>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InputWrapper>
                <InputLabel>Product Images</InputLabel>
                <div
                  style={{
                    padding: "2rem",
                    border: "2px dashed #E0E0E0",
                    borderRadius: 8,
                    textAlign: "center",
                    background: "#F9F9FB",
                  }}
                >
                  <p style={{ color: "#86868B" }}>
                    Drag and drop images here, or click to upload
                  </p>
                  <div
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      color: "#ACB3B8",
                    }}
                  >
                    Maximum 3 images, max size 5MB each
                  </div>
                </div>
              </InputWrapper>
            </motion.div>
          )}

          <ButtonRow>
            {step > 1 && (
              <Button
                type="button"
                $variant="ghost"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Creating..."
                : step === 3
                  ? "Publish Product"
                  : "Next Step"}
            </Button>
          </ButtonRow>
        </FormSection>
      </form>
    </motion.div>
  );
}
