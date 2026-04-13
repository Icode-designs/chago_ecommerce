'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { hoverLift } from '@/lib/animations';

const CardWrapper = styled(motion.div)`
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceContainerLowest};
  overflow: hidden;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 120%;
  background: ${({ theme }) => theme.colors.surfaceDim};
  overflow: hidden;
`;

const PlaceholderImage = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surfaceContainerLow} 0%,
    ${({ theme }) => theme.colors.surfaceContainer} 50%,
    ${({ theme }) => theme.colors.surfaceContainerHigh} 100%
  );

  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.colors.outlineVariant};
  }
`;

const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const CategoryLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.labelSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textTertiary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  text-transform: uppercase;
`;

const ProductName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.titleSm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: ${({ theme }) => theme.letterSpacings.normal};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const Price = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodyLg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const ComparePrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodyMd};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-decoration: line-through;
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  left: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  z-index: 2;
`;

const Badge = styled.span<{ $variant?: 'discount' | 'featured' }>`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  letter-spacing: ${({ theme }) => theme.letterSpacings.wider};
  text-transform: uppercase;
  background: ${({ theme, $variant }) => 
    $variant === 'discount' ? theme.colors.error : 
    $variant === 'featured' ? theme.colors.primary : 
    theme.colors.surfaceContainerHighest};
  color: ${({ theme, $variant }) => 
    $variant === 'discount' ? theme.colors.onError : 
    $variant === 'featured' ? theme.colors.onPrimary : 
    theme.colors.onSurface};
`;

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isDiscounted = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = isDiscounted 
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  return (
    <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none' }}>
      <CardWrapper
        variants={hoverLift}
        initial="rest"
        whileHover="hover"
      >
        <ImageContainer>
          {(isDiscounted || product.is_featured) && (
            <BadgeContainer>
              {isDiscounted && <Badge $variant="discount">-{discountPercentage}%</Badge>}
              {product.is_featured && <Badge $variant="featured">Featured</Badge>}
            </BadgeContainer>
          )}
          <PlaceholderImage>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </PlaceholderImage>
        </ImageContainer>
        <CardBody>
          {product.category && (
            <CategoryLabel>{product.category.name}</CategoryLabel>
          )}
          <ProductName>{product.name}</ProductName>
          <PriceRow>
            <Price>${product.price.toLocaleString()}</Price>
            {isDiscounted && (
              <ComparePrice>${product.compare_at_price!.toLocaleString()}</ComparePrice>
            )}
          </PriceRow>
        </CardBody>
      </CardWrapper>
    </Link>
  );
}
