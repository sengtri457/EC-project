import { Product, ProductVariant, CartItem, Customer, Order, ShippingMethod } from "@/types";
import { getProducts, getProductById, getProductBySlug } from "@/data/products";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

interface DjangoVariantResponse {
  id: number;
  sku: string;
  size?: string;
  color?: string;
  color_hex?: string;
  price: string | number;
  stock: number;
  is_default?: boolean;
  is_active?: boolean;
}

interface DjangoProductResponse {
  id: number;
  slug: string;
  title: string;
  description?: string;
  price: string | number;
  thumbnail: string;
  category?: { name: string; slug: string } | string;
  category_name?: string;
  department?: string;
  audience?: string;
  subcategory?: string;
  fabric?: string;
  total_stock?: number;
  stock?: number;
  variants?: DjangoVariantResponse[];
  images?: { id: number; image_url: string; alt_text?: string; is_primary?: boolean }[];
}

export function transformDjangoProduct(item: DjangoProductResponse): Product {
  const variants: ProductVariant[] = (item.variants || []).map((v) => ({
    id: v.id,
    productId: item.id,
    sku: v.sku,
    size: v.size,
    color: v.color,
    colorHex: v.color_hex,
    price: typeof v.price === "string" ? parseFloat(v.price) : v.price,
    stock: v.stock,
    isDefault: v.is_default,
    thumbnail: item.thumbnail,
  }));

  const sizes = Array.from(new Set(variants.map((v) => v.size).filter((s): s is string => Boolean(s))));
  const categoryName =
    typeof item.category === "object"
      ? item.category.name
      : item.category_name || item.category || "Clothes";

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description || "",
    price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
    stock: item.total_stock ?? item.stock ?? 20,
    thumbnail: item.thumbnail,
    category: categoryName,
    department: item.department as any,
    audience: item.audience as any,
    subcategory: item.subcategory as any,
    fabric: item.fabric,
    sizes: sizes.length > 0 ? sizes : undefined,
    variants: variants.length > 0 ? variants : undefined,
  };
}

/**
 * Fetch all catalog products with filtering options.
 * Falls back to local products.ts if the Django backend is unreachable.
 */
export async function fetchCatalogProducts(params?: {
  department?: string;
  audience?: string;
  category?: string;
  subcategory?: string;
  search?: string;
  sort?: string;
}): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val && val !== "all") query.set(key, val);
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE}/catalog/products/?${query.toString()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Backend responded with ${res.status}`);

    const data = await res.json();
    const results: DjangoProductResponse[] = data.results || data;
    return results.map(transformDjangoProduct);
  } catch (error) {
    console.warn("Backend catalog unavailable, using local mock catalog fallback:", error);
    let localList = getProducts();
    if (params?.department && params.department !== "all") {
      localList = localList.filter((p) => p.department === params.department);
    }
    if (params?.audience && params.audience !== "all") {
      localList = localList.filter((p) => p.audience === params.audience);
    }
    return localList;
  }
}

/**
 * Fetch a single product detail with its live variant matrix and stock.
 */
export async function fetchProductDetail(slugOrId: string | number): Promise<Product | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE}/catalog/products/${slugOrId}/`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Product not found on backend (status ${res.status})`);

    const data: DjangoProductResponse = await res.json();
    return transformDjangoProduct(data);
  } catch (error) {
    console.warn(`Backend detail for "${slugOrId}" unavailable, using fallback:`, error);
    if (typeof slugOrId === "number" || !isNaN(Number(slugOrId))) {
      return getProductById(Number(slugOrId)) || null;
    }
    return getProductBySlug(String(slugOrId)) || null;
  }
}

export interface CheckoutApiResponse {
  order: {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_telegram?: string;
    city_province: string;
    khan_district?: string;
    sangkat_commune?: string;
    street_address: string;
    landmark?: string;
    subtotal: string | number;
    shipping_cost: string | number;
    tax: string | number;
    total_usd: string | number;
    total_khr: number;
    status: string;
    payment_status: string;
    tracking_number?: string;
    created_at: string;
  };
  payment?: {
    id: string;
    method: string;
    status: string;
    amount_usd: string;
    amount_khr: number;
    khqr_payload: string;
    khqr_md5: string;
  };
}

/**
 * Submit checkout order to Django backend with atomic stock deduction and KHQR payload generation.
 */
export async function submitOrderCheckout(payload: {
  customer: Customer;
  items: CartItem[];
}): Promise<CheckoutApiResponse> {
  const backendItems = payload.items.map((item) => {
    // If variantId is known, pass it directly; otherwise find variant or default
    const variantId = item.variantId || item.productId * 100 + 1;
    return {
      variant_id: variantId,
      quantity: item.quantity,
    };
  });

  const bodyData = {
    name: payload.customer.name,
    email: payload.customer.email,
    phone: payload.customer.phone,
    telegram: payload.customer.telegram || "",
    city_province: payload.customer.cityProvince,
    khan_district: payload.customer.khanDistrict || "",
    sangkat_commune: payload.customer.sangkatCommune || "",
    street_address: payload.customer.streetAddress,
    landmark: payload.customer.landmark || "",
    shipping_method: payload.customer.shippingMethod || "phnom_penh_express",
    payment_method: (payload.customer.paymentMethod || "khqr").toUpperCase(),
    order_notes: payload.customer.orderNotes || "",
    items: backendItems,
  };

  const res = await fetch(`${API_BASE}/orders/checkout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(bodyData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData.detail ||
      (Array.isArray(errorData) ? errorData[0] : null) ||
      errorData.items?.[0] ||
      JSON.stringify(errorData) ||
      `Checkout failed (HTTP ${res.status})`;
    throw new Error(message);
  }

  return res.json();
}

/**
 * Check payment status for polling the Bakong KHQR modal.
 */
export async function checkPaymentStatus(paymentId: string): Promise<{
  payment_id: string;
  order_number: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  amount_usd: string;
  amount_khr: number;
  khqr_payload?: string;
  khqr_md5?: string;
  paid_at?: string;
}> {
  const res = await fetch(`${API_BASE}/payments/${paymentId}/status/`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to check payment status (${res.status})`);
  }
  return res.json();
}

/**
 * Trigger immediate verification of payment.
 */
export async function verifyPayment(paymentId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/payments/${paymentId}/verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status: "PAID" }),
  });
  return res.json();
}

/**
 * Fetch official verified order receipt by order number.
 */
export async function fetchOrderDetail(orderNumber: string): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderNumber}/`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      id: data.order_number,
      createdAt: data.created_at,
      customer: {
        name: data.customer_name,
        email: data.customer_email,
        phone: data.customer_phone,
        telegram: data.customer_telegram,
        address: `${data.street_address}, ${data.khan_district ? data.khan_district + ", " : ""}${data.city_province}`,
        cityProvince: data.city_province,
        khanDistrict: data.khan_district,
        sangkatCommune: data.sangkat_commune,
        streetAddress: data.street_address,
        landmark: data.landmark,
        shippingMethod: data.shipping_method?.code as any,
        shippingCost: parseFloat(data.shipping_cost || "0"),
        paymentMethod: data.payments?.[0]?.payment_method?.toLowerCase() || "khqr",
        orderNotes: data.order_notes,
      },
      items: (data.items || []).map((item: any) => ({
        id: `${item.sku}`,
        productId: item.variant?.product_id || 1,
        variantId: item.variant?.id,
        sku: item.sku,
        selectedSize: item.size,
        selectedColor: item.color,
        title: item.product_title,
        price: parseFloat(item.unit_price),
        thumbnail: "/collection/ctrl-blazer.webp",
        quantity: item.quantity,
      })),
      subtotal: parseFloat(data.subtotal),
      shippingCost: parseFloat(data.shipping_cost),
      tax: parseFloat(data.tax || "0"),
      total: parseFloat(data.total_usd),
      totalKhr: data.total_khr,
      trackingNumber: data.tracking_number,
      status: (data.status.toLowerCase() as any) || "confirmed",
    };
  } catch (err) {
    console.warn(`Could not fetch order ${orderNumber} from backend:`, err);
    return null;
  }
}
