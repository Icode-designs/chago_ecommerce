import { createClient } from "./client";
import {
  Product,
  Category,
  Order,
  Review,
  Profile,
  WishlistItem,
} from "../types";

const supabase = createClient();

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(filters?: {
  category_id?: string;
  search?: string;
  is_featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from("products")
    .select("*, category:categories(*), vendor:profiles(*)")
    .eq("status", "active");

  if (filters?.category_id) {
    query = query.eq("category_id", filters.category_id);
  }

  if (filters?.is_featured) {
    query = query.eq("is_featured", true);
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const limit = filters?.limit || 20;
  const offset = filters?.offset || 0;

  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), vendor:profiles(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product;
}

export async function getFeaturedProducts(limit = 6) {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), vendor:profiles(*)")
    .eq("status", "active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return data as Product[];
}

export async function getVendorProducts(vendorId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vendor products:", error);
    return [];
  }

  return data as Product[];
}

export async function createProduct(
  vendorId: string,
  name: string,
  slug: string,
  description: string | null,
  categoryId: string,
  price: number,
  compareAtPrice: number | null,
  stock: number,
  images: string[] = [],
) {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        vendor_id: vendorId,
        name,
        slug,
        description,
        category_id: categoryId,
        price,
        compare_at_price: compareAtPrice,
        stock,
        images,
        status: "draft",
      },
    ])
    .select("*, category:categories(*), vendor:profiles(*)")
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return data as Product;
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data as Category;
}

export async function createCategory(
  name: string,
  slug: string,
  description?: string,
  imageUrl?: string,
) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug,
      description: description || null,
      image_url: imageUrl || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw error;
  }

  return data as Category;
}

export async function updateCategory(
  categoryId: string,
  name: string,
  slug: string,
  description?: string,
  imageUrl?: string,
) {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
      description: description || null,
      image_url: imageUrl || null,
    })
    .eq("id", categoryId)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    throw error;
  }

  return data as Category;
}

export async function uploadCategoryImage(file: File, categoryId: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${categoryId}-${Date.now()}.${fileExt}`;
  const filePath = `categories/${fileName}`;

  const { data, error: uploadError } = await supabase.storage
    .from("category-images")
    .upload(filePath, file, { upsert: false });

  if (uploadError) {
    console.error("Error uploading category image:", uploadError);
    throw uploadError;
  }

  const { data: publicUrl } = supabase.storage
    .from("category-images")
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}

export async function deleteCategoryImage(imageUrl: string) {
  const urlParts = imageUrl.split("/");
  const filePath = urlParts.slice(-2).join("/");

  const { error } = await supabase.storage
    .from("category-images")
    .remove([filePath]);

  if (error) {
    console.error("Error deleting category image:", error);
    throw error;
  }
}

// ============================================
// ORDERS
// ============================================

export async function getCustomerOrders(customerId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }

  return data as Order[];
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(*), vendor:profiles(*))")
    .eq("id", orderId)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data as Order;
}

export async function getVendorOrders(vendorId: string) {
  const { data, error } = await supabase
    .from("order_items")
    .select("*, order:orders(*, customer:profiles(*)), product:products(*)")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vendor orders:", error);
    return [];
  }

  return data;
}

// ============================================
// REVIEWS
// ============================================

export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, user:profiles(*)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data as Review[];
}

export async function getUserReviews(userId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, product:products(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }

  return data as Review[];
}

export async function createReview(
  productId: string,
  userId: string,
  rating: number,
  comment?: string,
) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        product_id: productId,
        user_id: userId,
        rating,
        comment: comment || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    return null;
  }

  return data as Review;
}

// ============================================
// WISHLIST
// ============================================

export async function getUserWishlist(userId: string) {
  const { data, error } = await supabase
    .from("wishlist_items")
    .select(
      "*, product:products(*, category:categories(*), vendor:profiles(*))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }

  return data as WishlistItem[];
}

export async function addToWishlist(userId: string, productId: string) {
  const { data, error } = await supabase
    .from("wishlist_items")
    .insert([
      {
        user_id: userId,
        product_id: productId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding to wishlist:", error);
    return null;
  }

  return data as WishlistItem;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) {
    console.error("Error removing from wishlist:", error);
    return false;
  }

  return true;
}

// ============================================
// PROFILES
// ============================================

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile;
}

export async function getVendorProfile(vendorId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", vendorId)
    .eq("role", "vendor")
    .single();

  if (error) {
    console.error("Error fetching vendor profile:", error);
    return null;
  }

  return data as Profile;
}

// ============================================
// ADMIN DASHBOARD
// ============================================

export async function getAdminStats() {
  try {
    // Get total vendors
    const { count: vendorCount } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "vendor");

    // Get total users
    const { count: userCount } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    // Get open disputes
    const { count: disputeCount } = await supabase
      .from("disputes")
      .select("id", { count: "exact", head: true })
      .eq("status", "open");

    // Get platform revenue (sum of all order totals)
    const { data: orderData } = await supabase.from("orders").select("total");

    const platformRevenue = (orderData || []).reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    );

    return {
      totalVendors: vendorCount || 0,
      totalUsers: userCount || 0,
      openDisputes: disputeCount || 0,
      platformRevenue: platformRevenue,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalVendors: 0,
      totalUsers: 0,
      openDisputes: 0,
      platformRevenue: 0,
    };
  }
}

export async function getAllDisputes(limit = 10) {
  const { data, error } = await supabase
    .from("disputes")
    .select(
      "*, order:orders(*), customer:profiles!customer_id(*), vendor:profiles!vendor_id(*)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching disputes:", error);
    return [];
  }

  return data || [];
}

// ============================================
// VENDOR DASHBOARD
// ============================================

export async function getVendorStats(vendorId: string) {
  try {
    // Get vendor's products count
    const { count: productsCount } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("vendor_id", vendorId)
      .eq("status", "active");

    // Get vendor's products IDs
    const { data: vendorProducts } = await supabase
      .from("products")
      .select("id")
      .eq("vendor_id", vendorId)
      .eq("status", "active");

    // Get average rating from vendor's products
    let avgRating = 0;
    if (vendorProducts && vendorProducts.length > 0) {
      const productIds = vendorProducts.map((p) => p.id);
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("rating")
        .in("product_id", productIds);

      avgRating =
        reviewsData && reviewsData.length > 0
          ? parseFloat(
              (
                reviewsData.reduce((sum, r) => sum + (r.rating || 0), 0) /
                reviewsData.length
              ).toFixed(1),
            )
          : 0;
    }

    return {
      activeProducts: productsCount || 0,
      storeRating: avgRating || 0,
    };
  } catch (error) {
    console.error("Error fetching vendor stats:", error);
    return {
      activeProducts: 0,
      storeRating: 0,
    };
  }
}

// ============================================
// USER MANAGEMENT
// ============================================

export async function getAllUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, avatar_url, role, phone, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data as Profile[];
}

export async function suspendUser(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_suspended: true })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to suspend user");
  }

  return data;
}

export async function unsuspendUser(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_suspended: false })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to unsuspend user");
  }

  return data;
}

export async function syncExistingUserEmails() {
  const { data, error } = await supabase.rpc("sync_existing_user_emails");

  if (error) {
    console.error("Error syncing user emails:", error);
    return 0;
  }

  return data?.[0]?.updated_count || 0;
}
