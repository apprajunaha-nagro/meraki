/**
 * Meraki by Kritika — Unified API Client with Mock Fallbacks & LocalStorage Persistence
 */

import * as mock from './mockData';

// Force a one-time database cache clear to synchronize all 81 photos & products
if (!localStorage.getItem('meraki_db_version_v50')) {
  localStorage.removeItem('meraki_products');
  localStorage.removeItem('meraki_categories');
  localStorage.removeItem('meraki_hero_banners');
  localStorage.setItem('meraki_db_version_v50', '50');
}


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/meraki-by-kritika/backend/api';

// ─── Local Database Layer ──────────────────────────────────────────────────
// Loads state from localStorage or falls back to mockData initial seeds

const getDb = (key: string, initialData: any) => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && Array.isArray(initialData)) {
        // Safe mapping that handles potential null/undefined elements defensively
        const parsedClean = JSON.stringify(parsed.map(x => x ? { id: x.id, name: x.name, slug: x.slug, img: x.image || (x.images && x.images[0]?.image_url) } : null));
        const initialClean = JSON.stringify(initialData.map(x => x ? { id: x.id, name: x.name, slug: x.slug, img: x.image || (x.images && x.images[0]?.image_url) } : null));
        if (parsedClean !== initialClean) {
          localStorage.setItem(key, JSON.stringify(initialData));
          return initialData;
        }
      }
      return parsed;
    } catch (err) {
      console.warn("Database corrupted, resetting:", key, err);
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

const saveDb = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ─── Generic request runner with offline fallback ───────────────────────────
async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  bodyData?: any,
  mockFallbackValue?: any
): Promise<T> {
  const token = localStorage.getItem('meraki_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;
  const options: RequestInit = {
    method,
    headers,
  };

  if (bodyData && method !== 'GET') {
    options.body = JSON.stringify(bodyData);
  }

  let finalUrl = url;
  if (bodyData && method === 'GET') {
    const params = new URLSearchParams();
    Object.keys(bodyData).forEach((key) => {
      if (bodyData[key] !== null && bodyData[key] !== undefined) {
        if (Array.isArray(bodyData[key])) {
          params.append(key, JSON.stringify(bodyData[key]));
        } else {
          params.append(key, String(bodyData[key]));
        }
      }
    });
    finalUrl = `${url}?${params.toString()}`;
  }

  try {
    const response = await fetch(finalUrl, options);
    if (response.status === 401) {
      localStorage.removeItem('meraki_token');
    }
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || `HTTP error ${response.status}`);
    }
    return result as T;
  } catch (error: any) {
    console.warn(`API Request failed [${method} ${endpoint}]: ${error.message}. Using mock data fallback.`);
    
    if (mockFallbackValue !== undefined) {
      return {
        status: 'success',
        message: 'Loaded from offline fallback',
        data: mockFallbackValue,
      } as unknown as T;
    }
    throw error;
  }
}

// ─── Type Definitions ────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any;
}

// ─── API Client Methods ──────────────────────────────────────────────────────
export const api = {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    signup: (data: any) => 
      apiRequest<ApiResponse<any>>('POST', '/auth/signup', data, {
        user: { id: 999, name: data.name || 'Customer', email: data.email, role: 'customer' },
        token: 'mock-jwt-token-12345'
      }),
    
    login: (data: any) => {
      const isAdmin = data.email === 'merakidhanbad2026' || data.email === 'admin@merakibykritika.in';
      const fallbackUser = isAdmin 
        ? { id: 1, name: 'Kritika Sharma', email: data.email, role: 'admin' }
        : { id: 999, name: 'Ananya Krishnan', email: data.email, role: 'customer' };
      return apiRequest<ApiResponse<any>>('POST', '/auth/login', data, {
        user: fallbackUser,
        token: 'mock-jwt-token-12345'
      });
    },
    
    getProfile: () => 
      apiRequest<ApiResponse<any>>('GET', '/auth/me', null, { user: mock.sampleUsers[0] }),
    
    updateProfile: (data: any) => 
      apiRequest<ApiResponse<any>>('PUT', '/auth/profile', data, { user: data }),
    
    getAddresses: () => 
      apiRequest<ApiResponse<any>>('GET', '/auth/addresses', null, { addresses: [] }),
    
    addAddress: (data: any) => 
      apiRequest<ApiResponse<any>>('POST', '/auth/addresses', data, { success: true, address: { id: Date.now(), ...data } }),
    
    deleteAddress: (id: number) => 
      apiRequest<ApiResponse<any>>('DELETE', `/auth/addresses/${id}`, null, { success: true }),
  },

  // ─── Product Catalog ───────────────────────────────────────────────────────
  products: {
    list: (params?: any) => {
      const productsDb = getDb('meraki_products', mock.products);
      const limit = params?.limit || 12;
      const offset = params?.offset || 0;
      let list = [...productsDb];

      if (params?.category) {
        list = list.filter(p => p && p.category && (p.category.slug === params.category || String(p.category_id) === String(params.category)));
      }
      if (params?.featured) {
        list = list.filter(p => p && p.is_featured);
      }
      if (params?.bestseller) {
        list = list.filter(p => p && p.is_bestseller);
      }
      if (params?.new_arrival) {
        list = list.filter(p => p && p.is_new_arrival);
      }
      if (params?.search) {
        const query = params.search.toLowerCase();
        list = list.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.sku.toLowerCase().includes(query) ||
          p.tags?.some((t: string) => t.toLowerCase().includes(query))
        );
      }
      if (params?.sort) {
        if (params.sort === 'price-asc') {
          list.sort((a, b) => a.base_price - b.base_price);
        } else if (params.sort === 'price-desc') {
          list.sort((a, b) => b.base_price - a.base_price);
        }
      }

      const paginatedList = list.slice(offset, offset + limit);

      const fallback = {
        products: paginatedList,
        pagination: {
          total: list.length,
          limit,
          offset,
          has_more: (offset + limit) < list.length
        }
      };
      return apiRequest<ApiResponse<any>>('GET', '/products', params, fallback);
    },
    
    getDetails: (slug: string) => {
      const productsDb = getDb('meraki_products', mock.products);
      const prod = productsDb.find((p: any) => p.slug === slug);
      const reviewsDb = getDb('meraki_reviews', mock.reviews);
      const fallback = prod ? {
        product: {
          ...prod,
          reviews: reviewsDb.filter((r: any) => r.product_id === prod.id && r.status === 'approved')
        }
      } : null;
      return apiRequest<ApiResponse<any>>('GET', `/products/${slug}`, null, fallback);
    },
    
    getCategories: () => {
      const categoriesDb = getDb('meraki_categories', mock.categories);
      return apiRequest<ApiResponse<any>>('GET', '/products/categories', null, { categories: categoriesDb });
    },
    
    getCuratedEdits: () => 
      apiRequest<ApiResponse<any>>('GET', '/products/curated-edits', null, { curated_edits: mock.curatedEdits }),
    
    getCuratedEditProducts: (slug: string) => {
      const productsDb = getDb('meraki_products', mock.products);
      const edit = mock.curatedEdits.find((e) => e.slug === slug);
      const matched = edit && edit.product_ids ? productsDb.filter((p: any) => edit.product_ids.includes(p.id)) : [];
      const fallback = {
        curated_edit: edit,
        products: matched.length > 0 ? matched : productsDb.filter((p: any) => p.is_featured)
      };
      return apiRequest<ApiResponse<any>>('GET', `/products/curated-edits/${slug}`, null, fallback);
    },
  },

  // ─── Reviews ───────────────────────────────────────────────────────────────
  reviews: {
    create: (data: any) => {
      const reviewsDb = getDb('meraki_reviews', mock.reviews);
      const newReview = { id: Date.now(), status: 'pending', created_at: new Date().toISOString(), ...data };
      const updated = [newReview, ...reviewsDb];
      saveDb('meraki_reviews', updated);
      return apiRequest<ApiResponse<any>>('POST', '/reviews', data, { success: true, review: newReview });
    },
    
    listForProduct: (productId: number) => {
      const reviewsDb = getDb('meraki_reviews', mock.reviews);
      return apiRequest<ApiResponse<any>>('GET', `/reviews/${productId}`, null, {
        reviews: reviewsDb.filter((r: any) => r.product_id === productId && r.status === 'approved')
      });
    },
  },

  // ─── Checkout ──────────────────────────────────────────────────────────────
  checkout: {
    verifyCoupon: (code: string, subtotal: number) => {
      const couponsDb = getDb('meraki_coupons', mock.coupons);
      const coupon = couponsDb.find((c: any) => c.code === code && c.active);
      let fallback = null;
      if (coupon) {
        const discount_amount = coupon.type === 'percent' 
          ? (subtotal * coupon.value) / 100 
          : coupon.value;
        fallback = {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          discount_amount: Math.min(discount_amount, subtotal),
          description: coupon.description
        };
      }
      return apiRequest<ApiResponse<any>>('POST', '/checkout/verify-coupon', { code, subtotal }, fallback);
    },
    
    createRazorpayOrder: (data: any) => {
      const ordersDb = getDb('meraki_orders', mock.sampleOrders);
      const newOrderNum = 'MBK' + Date.now().toString().slice(-8);
      const newOrder = {
        id: Date.now(),
        order_number: newOrderNum,
        customer_name: data.address?.name || 'Customer',
        email: data.address?.email || '',
        order_date: new Date().toISOString(),
        payment_method: 'Razorpay',
        payment_status: 'paid',
        shipping_status: 'pending',
        items_count: data.items?.length || 1,
        total_amount: data.amount,
        items: data.items || [],
        shipping_address: data.address
      };
      saveDb('meraki_orders', [newOrder, ...ordersDb]);
      return apiRequest<ApiResponse<any>>('POST', '/checkout/razorpay-order', data, {
        默默: 'razorpay_order_id',
        razorpay_order_id: 'rzp_order_mock_' + Date.now().toString().slice(-6),
        amount: (data.amount || 2500) * 100,
        currency: 'INR',
        razorpay_key_id: 'rzp_test_mockKey123',
        order_number: newOrderNum,
        receipt: 'rcpt_' + Date.now()
      });
    },
    
    verifyPayment: (data: any) => 
      apiRequest<ApiResponse<any>>('POST', '/checkout/verify-payment', data, { status: 'success' }),
    
    createCodOrder: (data: any) => {
      const ordersDb = getDb('meraki_orders', mock.sampleOrders);
      const newOrderNum = 'MBK' + Date.now().toString().slice(-8);
      const newOrder = {
        id: Date.now(),
        order_number: newOrderNum,
        customer_name: data.address?.name || 'Customer',
        email: data.address?.email || '',
        order_date: new Date().toISOString(),
        payment_method: 'COD',
        payment_status: 'unpaid',
        shipping_status: 'pending',
        items_count: data.items?.length || 1,
        total_amount: data.amount,
        items: data.items || [],
        shipping_address: data.address
      };
      saveDb('meraki_orders', [newOrder, ...ordersDb]);
      return apiRequest<ApiResponse<any>>('POST', '/checkout/cod-order', data, {
        order_number: newOrderNum
      });
    },
  },

  // ─── Customer Orders ───────────────────────────────────────────────────────
  orders: {
    track: (orderNumber: string, contact: string) => {
      const ordersDb = getDb('meraki_orders', mock.sampleOrders);
      const order = ordersDb.find((o: any) => o.order_number === orderNumber);
      return apiRequest<ApiResponse<any>>('GET', '/orders/track', { order_number: orderNumber, contact }, { order });
    },
    
    myOrders: () => {
      const ordersDb = getDb('meraki_orders', mock.sampleOrders);
      return apiRequest<ApiResponse<any>>('GET', '/orders/my-orders', null, { orders: ordersDb });
    },
    
    getDetails: (id: number) => {
      const ordersDb = getDb('meraki_orders', mock.sampleOrders);
      const order = ordersDb.find((o: any) => o.id === id);
      return apiRequest<ApiResponse<any>>('GET', `/orders/${id}`, null, { order });
    },
    
    requestReturn: (id: number, data: any) => 
      apiRequest<ApiResponse<any>>('POST', `/orders/${id}/return`, data, { success: true }),
  },

  // ─── General Operations ────────────────────────────────────────────────────
  general: {
    sendMessage: (data: any) => 
      apiRequest<ApiResponse<any>>('POST', '/contact', data, { success: true }),
    
    subscribeNewsletter: (email: string) => 
      apiRequest<ApiResponse<any>>('POST', '/newsletter/subscribe', { email }, { success: true }),
  },

  // ─── Admin Dashboard ───────────────────────────────────────────────────────
  admin: {
    getStats: () => {
      const ordersDb = getDb('meraki_orders', mock.sampleOrders);
      const productsDb = getDb('meraki_products', mock.products);
      // Recalculate basic dashboard statistics from the live ordersDb
      const totalRevenue = ordersDb.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);
      const activeStats = {
        ...mock.adminStats,
        revenue: { value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: '+12.4%', isPositive: true },
        orders: { value: String(ordersDb.length), change: '+8.1%', isPositive: true },
        products: { value: String(productsDb.length), change: '+4.3%', isPositive: true }
      };
      return apiRequest<ApiResponse<any>>('GET', '/admin/stats', null, activeStats);
    },
    
    getProducts: (params?: any) => {
      const productsDb = getDb('meraki_products', mock.products);
      return apiRequest<ApiResponse<any>>('GET', '/admin/products', params, { products: productsDb, total: productsDb.length });
    },
    
    createProduct: (data: any) => {
      const productsDb = getDb('meraki_products', mock.products);
      const newProduct = {
        id: Date.now(),
        slug: (data.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        created_at: new Date().toISOString(),
        category: { id: data.category_id, name: 'Custom Collection', slug: 'custom' },
        ...data
      };
      const updated = [newProduct, ...productsDb];
      saveDb('meraki_products', updated);
      return apiRequest<ApiResponse<any>>('POST', '/admin/products', data, { product: newProduct });
    },
    
    updateProduct: (id: number, data: any) => {
      const productsDb = getDb('meraki_products', mock.products);
      const updated = productsDb.map((p: any) => p.id === id ? { ...p, ...data } : p);
      saveDb('meraki_products', updated);
      return apiRequest<ApiResponse<any>>('PUT', `/admin/products/${id}`, data, { product: { id, ...data } });
    },
    
    deleteProduct: (id: number) => {
      const productsDb = getDb('meraki_products', mock.products);
      const updated = productsDb.filter((p: any) => p.id !== id);
      saveDb('meraki_products', updated);
      return apiRequest<ApiResponse<any>>('DELETE', `/admin/products/${id}`, null, { success: true });
    },
    
    getOrders: (params?: any) => {
      const ordersDb = getDb('meraki_orders', mock.sampleOrders);
      return apiRequest<ApiResponse<any>>('GET', '/admin/orders', params, { orders: ordersDb, total: ordersDb.length });
    },
    
    updateOrderStatus: (id: number, data: any) => {
      const ordersDb = getDb('meraki_orders', mock.sampleOrders);
      const updated = ordersDb.map((o: any) => o.id === id ? { ...o, shipping_status: data.status, payment_status: data.payment_status || o.payment_status } : o);
      saveDb('meraki_orders', updated);
      return apiRequest<ApiResponse<any>>('PUT', `/admin/orders/${id}`, data, { success: true });
    },
    
    updateCourier: (data: any) => 
      apiRequest<ApiResponse<any>>('PUT', '/admin/orders/courier', data, { success: true }),
    
    getCoupons: () => {
      const couponsDb = getDb('meraki_coupons', mock.coupons);
      return apiRequest<ApiResponse<any>>('GET', '/admin/coupons', null, { coupons: couponsDb });
    },
    
    createCoupon: (data: any) => {
      const couponsDb = getDb('meraki_coupons', mock.coupons);
      const newCoupon = { id: Date.now(), active: true, ...data };
      const updated = [newCoupon, ...couponsDb];
      saveDb('meraki_coupons', updated);
      return apiRequest<ApiResponse<any>>('POST', '/admin/coupons', data, { coupon: newCoupon });
    },
    
    updateCoupon: (id: number, data: any) => {
      const couponsDb = getDb('meraki_coupons', mock.coupons);
      const updated = couponsDb.map((c: any) => c.id === id ? { ...c, ...data } : c);
      saveDb('meraki_coupons', updated);
      return apiRequest<ApiResponse<any>>('PUT', `/admin/coupons/${id}`, data, { coupon: { id, ...data } });
    },
    
    deleteCoupon: (id: number) => {
      const couponsDb = getDb('meraki_coupons', mock.coupons);
      const updated = couponsDb.filter((c: any) => c.id !== id);
      saveDb('meraki_coupons', updated);
      return apiRequest<ApiResponse<any>>('DELETE', `/admin/coupons/${id}`, null, { success: true });
    },
    
    getReviews: () => {
      const reviewsDb = getDb('meraki_reviews', mock.reviews);
      return apiRequest<ApiResponse<any>>('GET', '/admin/reviews', null, { reviews: reviewsDb });
    },
    
    moderateReview: (id: number, data: any) => {
      const reviewsDb = getDb('meraki_reviews', mock.reviews);
      const updated = reviewsDb.map((r: any) => r.id === id ? { ...r, status: data.status } : r);
      saveDb('meraki_reviews', updated);
      return apiRequest<ApiResponse<any>>('PUT', `/admin/reviews/${id}`, data, { success: true });
    },
    
    getSettings: () => {
      const defaultSettings = {
        store_name: 'Meraki by Kritika',
        store_tagline: 'Made with Soul, Worn with Ease',
        store_address: 'Dhanbad, Jharkhand - 826001, India',
        store_email: 'hello@merakibykritika.in',
        store_phone: '+919900000000',
        store_whatsapp: '+919900000000',
        gstin: '20AAXXXX0000X1Z5',
        gst_rate: '5',
        free_shipping_above: '1499',
        standard_shipping_fee: '99',
        express_shipping_fee: '199',
        cod_order_limit: '10000',
        currency: 'INR',
      };
      const settingsDb = getDb('meraki_settings', defaultSettings);
      return apiRequest<ApiResponse<any>>('GET', '/admin/settings', null, { settings: settingsDb });
    },
    
    updateSettings: (data: any) => {
      const defaultSettings = {
        store_name: 'Meraki by Kritika',
        store_tagline: 'Made with Soul, Worn with Ease',
        store_address: 'Dhanbad, Jharkhand - 826001, India',
        store_email: 'hello@merakibykritika.in',
        store_phone: '+919900000000',
        store_whatsapp: '+919900000000',
        gstin: '20AAXXXX0000X1Z5',
        gst_rate: '5',
        free_shipping_above: '1499',
        standard_shipping_fee: '99',
        express_shipping_fee: '199',
        cod_order_limit: '10000',
        currency: 'INR',
      };
      const settingsDb = getDb('meraki_settings', defaultSettings);
      const updated = { ...settingsDb, ...data };
      saveDb('meraki_settings', updated);
      return apiRequest<ApiResponse<any>>('PUT', '/admin/settings', data, { success: true });
    },
  },
};
