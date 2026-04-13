"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Input, Button } from "@/components/ui";
import {
  getCategories,
  createCategory,
  updateCategory,
  uploadCategoryImage,
} from "@/lib/supabase/services";
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

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.titleMd};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  label {
    font-size: ${({ theme }) => theme.fontSizes.labelMd};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.onSurface};
  }

  input {
    padding: ${({ theme }) => theme.spacing[3]};
    border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: ${({ theme }) => theme.fontSizes.bodyMd};
    color: ${({ theme }) => theme.colors.onSurface};
    background: ${({ theme }) => theme.colors.surfaceContainerLowest};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  }

  textarea {
    padding: ${({ theme }) => theme.spacing[3]};
    border: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: ${({ theme }) => theme.fontSizes.bodyMd};
    color: ${({ theme }) => theme.colors.onSurface};
    background: ${({ theme }) => theme.colors.surfaceContainerLowest};
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.surfaceContainerHigh};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  input[type="file"] {
    display: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  max-width: 300px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const RemoveImageButton = styled.button`
  background: #fee;
  color: #c33;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing[2]};

  &:hover {
    background: #fdd;
  }
`;

const CategoryImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-right: ${({ theme }) => theme.spacing[3]};
`;

const ModalFooter = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: flex-end;
`;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: null as File | null,
    imageUrl: "" as string,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
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

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
    setError(null);
    setImagePreview(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: null,
      imageUrl: "",
    });
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
    setError(null);
    setImagePreview(category.image_url || null);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: null,
      imageUrl: category.image_url || "",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: null,
      imageUrl: "",
    });
    setImagePreview(null);
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null, imageUrl: "" }));
    setImagePreview(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    handleInputChange(e);
    // Auto-generate slug from name (only if not editing or slug is empty)
    if (
      !editingCategory &&
      (!formData.slug || formData.slug === generateSlug(formData.name))
    ) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(name) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if provided
      if (formData.image) {
        const categoryId = editingCategory?.id || "new";
        imageUrl = await uploadCategoryImage(formData.image, categoryId);
      }

      if (editingCategory) {
        // Update existing category
        const updated = await updateCategory(
          editingCategory.id,
          formData.name,
          formData.slug,
          formData.description || undefined,
          imageUrl || undefined,
        );
        setCategories((prev) =>
          prev.map((cat) => (cat.id === updated.id ? updated : cat)),
        );
      } else {
        // Create new category
        const newCategory = await createCategory(
          formData.name,
          formData.slug,
          formData.description || undefined,
          imageUrl || undefined,
        );
        setCategories((prev) => [...prev, newCategory]);
      }

      handleCloseModal();
    } catch (err: any) {
      setError(
        `Failed to ${editingCategory ? "update" : "create"} category. Please try again.`,
      );
      console.error(err);
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
          <Title>Categories</Title>
        </PageHeader>
        <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1rem", color: "#86868B" }}>
            Loading categories...
          </p>
        </div>
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
        <Title>Categories</Title>
        <Button onClick={handleAddClick}>Add Category</Button>
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
              <div style={{ display: "flex", alignItems: "center" }}>
                {c.image_url && (
                  <CategoryImage src={c.image_url} alt={c.name} />
                )}
                <CategoryInfo>
                  <CategoryName>{c.name}</CategoryName>
                  <CategorySlug>/{c.slug}</CategorySlug>
                </CategoryInfo>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  $variant="ghost"
                  $size="sm"
                  onClick={() => handleEditClick(c)}
                >
                  Edit
                </Button>
              </div>
            </CategoryCard>
          ))
        )}
      </CategoriesList>

      <Modal $isOpen={isModalOpen} onClick={handleCloseModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </ModalHeader>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "#fee",
                color: "#c33",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="name">Category Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g., Electronics, Clothing"
                disabled={isSubmitting}
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="slug">Slug *</label>
              <input
                id="slug"
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="e.g., electronics, clothing"
                disabled={isSubmitting}
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional category description"
                disabled={isSubmitting}
              />
            </FormGroup>

            <FormGroup>
              <label>Category Image</label>
              {imagePreview ? (
                <>
                  <ImagePreview>
                    <img src={imagePreview} alt="Preview" />
                  </ImagePreview>
                  <RemoveImageButton
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                  >
                    Remove Image
                  </RemoveImageButton>
                </>
              ) : (
                <ImageUploadArea>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="image" style={{ cursor: "pointer" }}>
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      Drag and drop an image here
                    </p>
                    <p
                      style={{
                        margin: "0.5rem 0 0 0",
                        fontSize: "0.875rem",
                        color: "#86868B",
                      }}
                    >
                      or click to browse
                    </p>
                  </label>
                </ImageUploadArea>
              )}
            </FormGroup>

            <ModalFooter>
              <Button
                type="button"
                $variant="ghost"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? editingCategory
                    ? "Updating..."
                    : "Creating..."
                  : editingCategory
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
