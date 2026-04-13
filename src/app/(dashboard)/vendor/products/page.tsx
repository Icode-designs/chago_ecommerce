"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getVendorProducts } from "@/lib/supabase/services";
import { Product } from "@/lib/types";
import { Button, Input } from "@/components/ui";

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing[4]};
  }
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceContainerHigh};
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const Tr = styled.tr`
  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ProductThumb = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceContainerLow};
`;

const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndices.modal};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  width: 100%;
  max-width: 480px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.titleLg};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ModalDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export default function VendorProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotingProductId, setPromotingProductId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const vendorProducts = await getVendorProducts(user.id);
          setProducts(vendorProducts);
        }
      } catch (error) {
        console.error("Error fetching vendor products:", error);
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

  const promotingProduct = products.find((p) => p.id === promotingProductId);

  const handlePromote = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Payment successful! ${promotingProduct?.name} is now Featured.`);
    setPromotingProductId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader>
        <div>
          <Title>Products</Title>
        </div>
        <Link href="/vendor/products/new">
          <Button>Add New Product</Button>
        </Link>
      </PageHeader>

      <Toolbar>
        <SearchInput placeholder="Search products..." />
      </Toolbar>

      {products.length === 0 ? (
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
            No products yet
          </p>
          <p>Start by adding your first product to your store.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Status</Th>
                <Th>Inventory</Th>
                <Th>Price</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>
                    <ProductCell>
                      <ProductThumb />
                      <span style={{ fontWeight: 500 }}>
                        {product.name} {product.is_featured && "⭐"}
                      </span>
                    </ProductCell>
                  </Td>
                  <Td>
                    <span
                      style={{
                        color: "#2E7D32",
                        background: "rgba(76, 175, 80, 0.1)",
                        padding: "4px 8px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      Active
                    </span>
                  </Td>
                  <Td>{product.stock} in stock</Td>
                  <Td>${product.price.toLocaleString()}</Td>
                  <Td>
                    <ActionRow>
                      {!product.is_featured && (
                        <Button
                          $variant="tertiary"
                          $size="sm"
                          onClick={() => setPromotingProductId(product.id)}
                        >
                          Promote 🚀
                        </Button>
                      )}
                      <Button $variant="ghost" $size="sm">
                        Edit
                      </Button>
                      <Button
                        $variant="ghost"
                        $size="sm"
                        style={{ color: "#9F403D" }}
                      >
                        Delete
                      </Button>
                    </ActionRow>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {promotingProductId && promotingProduct && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setPromotingProductId(null)}
        >
          <ModalContent
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle>Promote Product</ModalTitle>
            <ModalDesc>
              Boost visibility by adding{" "}
              <strong>{promotingProduct.name}</strong> to the Featured Products
              section on the homepage. Cost: <strong>$50.00</strong>
            </ModalDesc>
            <form onSubmit={handlePromote}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <Input placeholder="Card Number" required />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <Input placeholder="MM/YY" required />
                  <Input placeholder="CVC" required />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  $variant="ghost"
                  type="button"
                  onClick={() => setPromotingProductId(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Pay $50.00</Button>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </motion.div>
  );
}
