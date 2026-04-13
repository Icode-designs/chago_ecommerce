import { Product, Category, Order, Review, Dispute, Profile } from './types';

// ============================================
// MOCK CATEGORIES
// ============================================

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Furniture',
    slug: 'furniture',
    description: 'Curated designer furniture for the modern home',
    parent_id: null,
    image_url: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Tech',
    slug: 'tech',
    description: 'Premium technology and audio equipment',
    parent_id: null,
    image_url: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Apothecary',
    slug: 'apothecary',
    description: 'Artisanal fragrances and personal care',
    parent_id: null,
    image_url: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smart wearables and accessories',
    parent_id: null,
    image_url: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Elevated home essentials',
    parent_id: null,
    image_url: null,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// ============================================
// MOCK PRODUCTS
// ============================================

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    vendor_id: 'vendor-1',
    name: 'Scandi Lounge Chair',
    slug: 'scandi-lounge-chair',
    description: 'Minimalist Scandinavian lounge chair with natural oak legs and premium wool upholstery. Designed for comfort and visual silence.',
    price: 1295,
    compare_at_price: 1495,
    category_id: 'cat-1',
    images: ['/placeholder-product.jpg'],
    stock: 12,
    status: 'active',
    is_featured: true,
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
    category: mockCategories[0],
  },
  {
    id: 'prod-2',
    vendor_id: 'vendor-1',
    name: 'Ethereal Fragrance No. 04',
    slug: 'ethereal-fragrance-no-04',
    description: 'A delicate blend of white tea, bergamot, and soft musk. Hand-blended in small batches using sustainably sourced ingredients.',
    price: 185,
    compare_at_price: 245,
    category_id: 'cat-3',
    images: ['/placeholder-product.jpg'],
    stock: 48,
    status: 'active',
    is_featured: true,
    created_at: '2024-03-14T00:00:00Z',
    updated_at: '2024-03-14T00:00:00Z',
    category: mockCategories[2],
  },
  {
    id: 'prod-3',
    vendor_id: 'vendor-2',
    name: 'Sonic Pure Headphones',
    slug: 'sonic-pure-headphones',
    description: 'Wireless over-ear headphones with active noise cancellation and spatial audio. 40-hour battery life.',
    price: 349,
    compare_at_price: 499,
    category_id: 'cat-2',
    images: ['/placeholder-product.jpg'],
    stock: 35,
    status: 'active',
    created_at: '2024-03-13T00:00:00Z',
    updated_at: '2024-03-13T00:00:00Z',
    category: mockCategories[1],
  },
  {
    id: 'prod-4',
    vendor_id: 'vendor-2',
    name: 'Lumina Mirrorless Mk II',
    slug: 'lumina-mirrorless-mk-ii',
    description: 'Professional-grade mirrorless camera with 61MP full-frame sensor and 8K video recording capability.',
    price: 2499,
    compare_at_price: 3199,
    category_id: 'cat-2',
    images: ['/placeholder-product.jpg'],
    stock: 8,
    status: 'active',
    is_featured: true,
    created_at: '2024-03-12T00:00:00Z',
    updated_at: '2024-03-12T00:00:00Z',
    category: mockCategories[1],
  },
  {
    id: 'prod-5',
    vendor_id: 'vendor-1',
    name: 'Mono Desk Lamp',
    slug: 'mono-desk-lamp',
    description: 'Architectural desk lamp with adjustable arm and warm LED illumination. Powder-coated aluminum body.',
    price: 325,
    compare_at_price: 375,
    category_id: 'cat-5',
    images: ['/placeholder-product.jpg'],
    stock: 24,
    status: 'active',
    created_at: '2024-03-11T00:00:00Z',
    updated_at: '2024-03-11T00:00:00Z',
    category: mockCategories[4],
  },
  {
    id: 'prod-6',
    vendor_id: 'vendor-3',
    name: 'Aura Smart Watch',
    slug: 'aura-smart-watch',
    description: 'Premium smartwatch with titanium case, sapphire crystal display, and 14-day battery life.',
    price: 499,
    compare_at_price: 699,
    category_id: 'cat-4',
    images: ['/placeholder-product.jpg'],
    stock: 42,
    status: 'active',
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z',
    category: mockCategories[3],
  },
  {
    id: 'prod-7',
    vendor_id: 'vendor-1',
    name: 'Atelier Coffee Table',
    slug: 'atelier-coffee-table',
    description: 'Sculptural coffee table in solid walnut with a hand-polished brass inlay. Each piece is unique.',
    price: 1850,
    compare_at_price: null,
    category_id: 'cat-1',
    images: ['/placeholder-product.jpg'],
    stock: 5,
    status: 'active',
    created_at: '2024-03-09T00:00:00Z',
    updated_at: '2024-03-09T00:00:00Z',
    category: mockCategories[0],
  },
  {
    id: 'prod-8',
    vendor_id: 'vendor-3',
    name: 'Ceramic Diffuser Set',
    slug: 'ceramic-diffuser-set',
    description: 'Hand-thrown ceramic oil diffuser with a curated set of three essential oil blends.',
    price: 145,
    compare_at_price: null,
    category_id: 'cat-3',
    images: ['/placeholder-product.jpg'],
    stock: 67,
    status: 'active',
    created_at: '2024-03-08T00:00:00Z',
    updated_at: '2024-03-08T00:00:00Z',
    category: mockCategories[2],
  },
];

// ============================================
// MOCK ORDERS
// ============================================

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    customer_id: 'customer-1',
    status: 'delivered',
    total: 1744,
    shipping_address: {
      first_name: 'Alex',
      last_name: 'Morgan',
      address: '142 Design District',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'US',
    },
    created_at: '2024-03-14T10:00:00Z',
    updated_at: '2024-03-18T14:00:00Z',
    items: [
      {
        id: 'oi-1',
        order_id: 'order-1',
        product_id: 'prod-1',
        vendor_id: 'vendor-1',
        quantity: 1,
        price: 1295,
        created_at: '2024-03-14T10:00:00Z',
        product: mockProducts[0],
      },
      {
        id: 'oi-2',
        order_id: 'order-1',
        product_id: 'prod-3',
        vendor_id: 'vendor-2',
        quantity: 1,
        price: 449,
        created_at: '2024-03-14T10:00:00Z',
        product: mockProducts[2],
      },
    ],
  },
  {
    id: 'order-2',
    customer_id: 'customer-1',
    status: 'processing',
    total: 599,
    shipping_address: {
      first_name: 'Alex',
      last_name: 'Morgan',
      address: '142 Design District',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'US',
    },
    created_at: '2024-03-20T08:00:00Z',
    updated_at: '2024-03-20T08:00:00Z',
    items: [
      {
        id: 'oi-3',
        order_id: 'order-2',
        product_id: 'prod-6',
        vendor_id: 'vendor-3',
        quantity: 1,
        price: 599,
        created_at: '2024-03-20T08:00:00Z',
        product: mockProducts[5],
      },
    ],
  },
  {
    id: 'order-3',
    customer_id: 'customer-1',
    status: 'shipped',
    total: 470,
    shipping_address: {
      first_name: 'Alex',
      last_name: 'Morgan',
      address: '142 Design District',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      country: 'US',
    },
    created_at: '2024-03-22T15:00:00Z',
    updated_at: '2024-03-23T09:00:00Z',
  },
];

// ============================================
// MOCK REVIEWS
// ============================================

export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    product_id: 'prod-1',
    user_id: 'customer-1',
    rating: 5,
    comment: 'Absolutely stunning craftsmanship. The chair exceeded my expectations in both comfort and design.',
    created_at: '2024-03-19T12:00:00Z',
  },
  {
    id: 'rev-2',
    product_id: 'prod-3',
    user_id: 'customer-1',
    rating: 4,
    comment: 'Excellent sound quality. The noise cancellation is superb. Slight discomfort after 4+ hours.',
    created_at: '2024-03-20T10:00:00Z',
  },
];

// ============================================
// MOCK DISPUTES
// ============================================

export const mockDisputes: Dispute[] = [
  {
    id: 'disp-1',
    order_id: 'order-1',
    customer_id: 'customer-1',
    vendor_id: 'vendor-1',
    reason: 'Product arrived with minor scratch on the leg. Requesting partial refund.',
    status: 'in_review',
    resolution: null,
    created_at: '2024-03-19T14:00:00Z',
    updated_at: '2024-03-20T09:00:00Z',
  },
];

// ============================================
// MOCK PROFILES (for vendor/admin views)
// ============================================

export const mockProfiles: Profile[] = [
  {
    id: 'customer-1',
    full_name: 'Alex Morgan',
    avatar_url: null,
    role: 'customer',
    phone: '+1 415 555 0100',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
  },
  {
    id: 'vendor-1',
    full_name: 'Studio Nordic',
    avatar_url: null,
    role: 'vendor',
    phone: '+1 415 555 0200',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-03-18T00:00:00Z',
  },
  {
    id: 'vendor-2',
    full_name: 'Lumina Electronics',
    avatar_url: null,
    role: 'vendor',
    phone: '+1 415 555 0300',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
  },
  {
    id: 'vendor-3',
    full_name: 'Zen Wellness Co.',
    avatar_url: null,
    role: 'vendor',
    phone: '+1 415 555 0400',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-03-22T00:00:00Z',
  },
  {
    id: 'admin-1',
    full_name: 'System Admin',
    avatar_url: null,
    role: 'admin',
    phone: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
];
