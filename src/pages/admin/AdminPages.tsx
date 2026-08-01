import { useTheme, DEFAULT_THEME, isValidHex, type ThemeSettings } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users, Percent,
  Star, Megaphone, Gift, BarChart2, Settings, LogOut, Bell,
  ChevronLeft, ChevronRight, Menu, X, TrendingUp, TrendingDown,
  AlertTriangle, ChevronDown, Palette, RotateCcw, Save, Eye,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { cn, formatINR, formatDate } from '@/lib/utils';
import { Button, Badge, Input, Select } from '@/components/ui';
import { adminStats, products, sampleOrders, sampleUsers, coupons, reviews, blogPosts, heroBanners } from '@/lib/mockData';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
// Client-side image compression to avoid localStorage 5MB quota limits
function compressImage(base64: string, maxWidth = 1400, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64);
      }
    };
    img.onerror = () => {
      resolve(base64);
    };
  });
}


// ─── Admin Nav Data ────────────────────────────────────────────────────────────

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
  { href: '/admin/products', label: 'Products', icon: <Package size={18} /> },
  { href: '/admin/categories', label: 'Categories', icon: <Tag size={18} /> },
  { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
  { href: '/admin/customers', label: 'Customers', icon: <Users size={18} /> },
  { href: '/admin/theme', label: 'Theme Settings', icon: <Palette size={18} /> },
  { href: '/admin/coupons', label: 'Coupons', icon: <Percent size={18} /> },
  { href: '/admin/reviews', label: 'Reviews', icon: <Star size={18} /> },
  { href: '/admin/marketing', label: 'Marketing', icon: <Megaphone size={18} /> },
  { href: '/admin/gift-cards', label: 'Gift Cards', icon: <Gift size={18} /> },
  { href: '/admin/reports', label: 'Reports', icon: <BarChart2 size={18} /> },
  { href: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
];

// ─── Admin Sidebar ────────────────────────────────────────────────────────────

function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const isActive = (href: string, exact = false) =>
    exact ? location.pathname === href : location.pathname.startsWith(href);

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-full bg-charcoal text-white flex flex-col z-20 transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center px-4 py-5 border-b border-white/10 gap-3', collapsed && 'justify-center')}>
        {!collapsed && (
          <Link to="/" className="font-serif text-base text-white hover:text-primary-light transition-colors truncate">
            Meraki by Kritika
          </Link>
        )}
        <button
          onClick={onToggle}
          className="text-white/60 hover:text-white transition-colors flex-shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Admin badge */}
      {!collapsed && (
        <div className="px-4 py-2 border-b border-white/10">
          <span className="text-[10px] font-sans uppercase tracking-widest text-white/40">Admin Panel</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm transition-all duration-150',
              isActive(item.href, item.exact)
                ? 'bg-primary/20 text-primary-light'
                : 'text-white/60 hover:text-white hover:bg-white/5',
              collapsed && 'justify-center px-2'
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm text-white/60 hover:text-rust hover:bg-white/5 transition-all w-full',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={16} />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}

// ─── Admin Top Bar ────────────────────────────────────────────────────────────

function AdminTopBar({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const { user } = useAuthStore();
  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-14 bg-white border-b border-secondary flex items-center px-5 gap-4 z-10 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-60'
      )}
    >
      <div className="flex-1">
        <Input
          placeholder="Search products, orders, customers..."
          wrapperClassName="max-w-xs"
          className="h-8 text-xs py-1"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-taupe hover:text-charcoal">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-secondary">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          <span className="text-sm text-charcoal">{user?.name ?? 'Admin'}</span>
          <ChevronDown size={14} className="text-taupe" />
        </div>
      </div>
    </header>
  );
}

// ─── Admin Layout ─────────────────────────────────────────────────────────────

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <AdminTopBar sidebarCollapsed={sidebarCollapsed} />
      <main
        className={cn(
          'pt-14 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-60'
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

function StatCard({ title, value, change, icon, color = 'primary' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    gold: 'bg-gold/10 text-gold',
    sage: 'bg-sage/10 text-sage',
    rust: 'bg-rust/10 text-rust',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white rounded-brand shadow-soft p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-brand flex items-center justify-center', colorMap[color] ?? colorMap.primary)}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn('flex items-center gap-0.5 text-xs font-medium', change >= 0 ? 'text-sage' : 'text-rust')}>
            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="font-serif text-2xl text-charcoal font-light">{value}</p>
      <p className="text-taupe text-xs mt-1">{title}</p>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    setLoading(true);
    api.admin.getStats().then((res) => {
      if (res.status === 'success' && res.data) {
        const d = res.data;
        const mappedStats = {
          todaySales: d.kpis?.total_sales || 0,
          totalOrders: d.kpis?.total_orders || 0,
          pendingOrders: d.kpis?.pending_reviews_count || 0,
          lowStockAlerts: d.kpis?.low_stock_count || 0,
          newCustomers: 8, // mock fallback
          totalRevenue: d.kpis?.total_sales || 0,
          salesTrend: d.charts?.daily_sales?.map((s: any) => ({
            date: s.date,
            amount: parseFloat(s.sales),
            orders: parseInt(s.orders)
          })) || adminStats.salesTrend,
          topProducts: d.top_products?.map((tp: any) => ({
            name: tp.product_name,
            units: parseInt(tp.units_sold),
            revenue: parseFloat(tp.total_revenue)
          })) || adminStats.topProducts
        };
        setStatsData(mappedStats);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const stats = statsData || adminStats;

  const statusColors: Record<string, string> = {
    delivered: 'bg-sage/10 text-sage',
    shipped: 'bg-blue-50 text-blue-600',
    confirmed: 'bg-primary/10 text-primary',
    pending: 'bg-amber-50 text-amber-600',
    cancelled: 'bg-rust/10 text-rust',
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Dashboard</h1>
          <p className="text-taupe text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <Select
          options={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
          ]}
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          wrapperClassName="w-40"
        />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard title="Today's Sales" value={formatINR(stats.todaySales)} change={12} icon={<TrendingUp size={18} />} color="sage" />
        <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} change={8} icon={<ShoppingCart size={18} />} color="primary" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<AlertTriangle size={18} />} color="rust" />
        <StatCard title="Low Stock Alerts" value={stats.lowStockAlerts} icon={<Package size={18} />} color="gold" />
        <StatCard title="New Customers" value={stats.newCustomers} change={5} icon={<Users size={18} />} color="blue" />
        <StatCard title="Total Revenue" value={formatINR(stats.totalRevenue)} change={22} icon={<BarChart2 size={18} />} color="sage" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        {/* Sales trend chart */}
        <div className="bg-white rounded-brand shadow-soft p-5">
          <h2 className="font-sans font-semibold text-charcoal mb-4">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3D9CE" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8A7A82' }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#8A7A82' }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => [formatINR(value), 'Sales']}
                contentStyle={{ fontFamily: 'Poppins', fontSize: 12, borderColor: '#F3D9CE', borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="amount" stroke="#9B7A93" strokeWidth={2} dot={{ r: 4, fill: '#9B7A93' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-brand shadow-soft p-5">
          <h2 className="font-sans font-semibold text-charcoal mb-4">Top Products</h2>
          <ul className="space-y-3">
            {stats.topProducts.slice(0, 5).map((p, i) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="text-xs text-taupe w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-charcoal truncate">{p.name}</p>
                  <p className="text-xs text-taupe">{p.units} sold</p>
                </div>
                <span className="text-xs font-semibold text-charcoal flex-shrink-0">{formatINR(p.revenue)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent orders + low stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-brand shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-charcoal">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary text-xs hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-secondary">
                  {['Order #', 'Customer', 'Amount', 'Status'].map((h) => (
                    <th key={h} className="pb-2 text-left text-taupe font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-secondary/50 hover:bg-cream-alt transition-colors">
                    <td className="py-2.5 font-medium text-charcoal">{order.order_number}</td>
                    <td className="py-2.5 text-taupe">{order.shipping_address.name}</td>
                    <td className="py-2.5 font-medium">{formatINR(order.total)}</td>
                    <td className="py-2.5">
                      <span className={cn('px-2 py-0.5 rounded-full capitalize font-medium', statusColors[order.status] ?? '')}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-brand shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-charcoal">Low Stock Alerts</h2>
            <Link to="/admin/products" className="text-primary text-xs hover:underline">Manage</Link>
          </div>
          <ul className="space-y-2">
            {products.flatMap((p) =>
              p.variants
                .filter((v) => v.stock_qty > 0 && v.stock_qty <= 5)
                .map((v) => ({
                  product: p,
                  variant: v,
                }))
            ).slice(0, 6).map(({ product, variant }) => (
              <li key={variant.id} className="flex items-center gap-3 py-2 border-b border-secondary/50 last:border-0">
                <img src={product.images[0]?.image_url} alt={product.name}
                  className="w-8 h-10 object-cover rounded" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-charcoal truncate">{product.name}</p>
                  <p className="text-xs text-taupe">{variant.color} · {variant.size}</p>
                </div>
                <span className="text-xs font-bold text-rust flex-shrink-0">{variant.stock_qty} left</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Products Page ──────────────────────────────────────────────────────

export function AdminProductsPage() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  // Form state
  const [activeSection, setActiveSection] = useState<'list' | 'add' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Input fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [mrp, setMrp] = useState(0);
  const [fabric, setFabric] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const fetchProducts = () => {
    setLoading(true);
    api.products.list({ limit: 100 }).then((res) => {
      if (res.status === 'success' && res.data?.products) {
        setProductsList(res.data.products);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  const fetchCategories = () => {
    api.products.getCategories().then((res) => {
      if (res.status === 'success' && res.data?.categories) {
        setCategoriesList(res.data.categories);
      }
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setActiveSection('add');
    setName('');
    setSku('MBK-' + Date.now().toString().slice(-6));
    setBasePrice(1999);
    setMrp(2499);
    setFabric('Pure Handloom Cotton');
    setCategoryId(categoriesList[0]?.id || 1);
    setStatus('active');
    setDescription('');
    setUploadedImages([]);
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setActiveSection('edit');
    setName(product.name || '');
    setSku(product.sku || '');
    setBasePrice(product.base_price || 0);
    setMrp(product.mrp || 0);
    setFabric(product.fabric || '');
    setCategoryId(product.category_id || product.category?.id || 1);
    setStatus(product.status || 'active');
    setDescription(product.description || '');
    setUploadedImages(product.images?.map((img: any) => img.image_url) || []);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categoriesList.find(c => c.id === Number(categoryId));
    const productData = {
      name,
      sku,
      base_price: Number(basePrice),
      mrp: Number(mrp),
      fabric,
      category_id: Number(categoryId),
      category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : { id: 1, name: 'Kurta Sets', slug: 'kurta-sets' },
      status,
      description,
      images: uploadedImages.map((url, idx) => ({ id: idx + 1, image_url: url, alt_text: name })),
      variants: [
        { id: 1, size: 'S', stock_qty: 15 },
        { id: 2, size: 'M', stock_qty: 25 },
        { id: 3, size: 'L', stock_qty: 20 },
        { id: 4, size: 'XL', stock_qty: 10 }
      ],
      is_new_arrival: true,
      is_featured: false,
      is_bestseller: false
    };

    try {
      let res;
      if (activeSection === 'add') {
        res = await api.admin.createProduct(productData);
      } else {
        res = await api.admin.updateProduct(editingProduct.id, productData);
      }
      if (res.status === 'success') {
        toast.success(activeSection === 'add' ? 'Product created successfully!' : 'Product updated successfully!');
        setActiveSection('list');
        fetchProducts();
      } else {
        toast.error(res.message || 'Failed to save product.');
      }
    } catch (err) {
      toast.error('Failed to save product.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await api.admin.deleteProduct(id);
      if (res.status === 'success') {
        toast.success('Product deleted successfully!');
        fetchProducts();
      } else {
        toast.error(res.message || 'Failed to delete product.');
      }
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const filtered = productsList.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (p.sku || '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string, 1000, 0.85);
          setUploadedImages((prev) => [...prev, compressed]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  if (activeSection === 'add' || activeSection === 'edit') {
    return (
      <div className="max-w-4xl">
        <button
          onClick={() => setActiveSection('list')}
          className="flex items-center gap-1.5 text-primary hover:text-primary-dark transition-colors mb-6 text-sm font-sans"
          type="button"
        >
          ← Back to Products List
        </button>

        <h1 className="font-serif text-2xl text-charcoal mb-6">
          {activeSection === 'add' ? 'Add New Product' : 'Edit Product'}
        </h1>

        <form onSubmit={handleSaveProduct} className="bg-white rounded-brand shadow-soft p-6 border border-secondary/20 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-sans text-taupe block mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans text-taupe block mb-1">SKU</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-sans text-taupe block mb-1">Fabric</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans text-taupe block mb-1">Base Price (INR)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-sans text-taupe block mb-1">MRP (INR)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-sans text-taupe block mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-sans text-taupe block mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-sans text-taupe block mb-1">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-sans text-taupe block mb-1">Product Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full text-xs text-taupe file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark file:cursor-pointer"
                />
                <p className="text-[10px] text-taupe mt-1">Upload photos from your device. Base64 encoding will be used.</p>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {uploadedImages.map((url, idx) => (
                      <div key={idx} className="relative group aspect-[3/4] border rounded overflow-hidden">
                        <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-rust text-white rounded-full p-1 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit">Save Product</Button>
            <Button variant="outline" type="button" onClick={() => setActiveSection('list')}>Cancel</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Products</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Import CSV</Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
              const savedProducts = localStorage.getItem('meraki_products');
              if (!savedProducts) return alert('No products data to sync.');
              try {
                const res = await fetch('/api/dev/save-seed', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ products: JSON.parse(savedProducts) })
                });
                const data = await res.json();
                if (data.success) {
                  alert('Successfully synced browser uploads directly to mockData.ts and saved images locally!');
                } else {
                  alert('Sync failed: ' + data.error);
                }
              } catch (e) {
                alert('Sync error: ' + String(e));
              }
            }}
          >
            💾 Sync Uploads to Code files
          </Button>
          <Button size="sm" onClick={handleAddNewClick}>+ Add Product</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-brand shadow-soft p-4 mb-4 flex gap-3 flex-wrap items-center">
        <Input
          placeholder="Search name, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          wrapperClassName="flex-1 min-w-[200px]"
          className="h-9 text-sm"
        />
        <Select
          options={[{ value: '', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'draft', label: 'Draft' }]}
          wrapperClassName="w-36"
        />
        <Select
          options={[{ value: '', label: 'All Categories' }, ...categoriesList.map((c) => ({ value: c.name, label: c.name }))]}
          wrapperClassName="w-44"
        />
        {selected.length > 0 && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Bulk Status</Button>
            <Button variant="danger" size="sm">Delete ({selected.length})</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-brand shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-taupe">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-alt border-b border-secondary">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" className="accent-primary" onChange={(e) => {
                      setSelected(e.target.checked ? filtered.map((p) => p.id) : []);
                    }} />
                  </th>
                  {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-taupe uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {filtered.map((product) => {
                  const totalStock = product.variants?.reduce((s: number, v: any) => s + v.stock_qty, 0) || 0;
                  return (
                    <tr key={product.id} className="hover:bg-cream-alt transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={selected.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.images?.[0]?.image_url} alt={product.name}
                            className="w-10 h-12 object-cover rounded bg-[#E8E1DA]" loading="lazy" />
                          <div>
                            <p className="font-medium text-charcoal">{product.name}</p>
                            <p className="text-xs text-taupe">{product.fabric}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-taupe text-xs">{product.sku}</td>
                      <td className="px-4 py-3 text-taupe text-xs">{product.category?.name}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-charcoal">{formatINR(product.base_price)}</span>
                        {product.mrp > product.base_price && (
                          <span className="ml-1 text-xs text-taupe line-through">{formatINR(product.mrp)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('font-medium text-sm', totalStock === 0 ? 'text-rust' : totalStock <= 10 ? 'text-amber-600' : 'text-sage')}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                          product.status === 'active' ? 'bg-sage/10 text-sage' : 'bg-taupe/10 text-taupe'
                        )}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditClick(product)} className="text-xs text-primary hover:underline">Edit</button>
                          <button className="text-xs text-taupe hover:text-charcoal">Duplicate</button>
                          <button onClick={() => handleDelete(product.id)} className="text-xs text-rust hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-secondary flex items-center justify-between text-xs text-taupe">
          <span>Showing {filtered.length} of {productsList.length} products</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-secondary rounded hover:bg-cream">Previous</button>
            <button className="px-3 py-1 border border-secondary rounded hover:bg-cream">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminOrdersPage() {
  const [ordersList, setOrdersList] = useState<any[]>(sampleOrders);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    api.admin.getOrders().then((res) => {
      if (res.status === 'success' && res.data?.orders) {
        setOrdersList(res.data.orders);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateShipping = async (orderId: number) => {
    const carrier = prompt('Enter shipping carrier (e.g., Delhivery, BlueDart):');
    if (carrier === null) return;
    const tracking_number = prompt('Enter tracking number:');
    if (tracking_number === null) return;

    try {
      const res = await api.admin.updateCourier({ order_id: orderId, carrier, tracking_number });
      if (res.status === 'success') {
        alert('Tracking information updated successfully!');
        fetchOrders();
      } else {
        alert(res.message || 'Failed to update tracking details.');
      }
    } catch (err) {
      alert('Error updating courier.');
    }
  };

  const statusColors: Record<string, string> = {
    delivered: 'bg-sage/10 text-sage',
    shipped: 'bg-blue-50 text-blue-600',
    confirmed: 'bg-primary/10 text-primary',
    pending: 'bg-amber-50 text-amber-600',
    cancelled: 'bg-rust/10 text-rust',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Orders</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Export CSV</Button>
          <Button size="sm">+ Manual Order</Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-brand shadow-soft p-4 mb-4 flex gap-3 flex-wrap">
        <Input placeholder="Search order #, customer..." wrapperClassName="flex-1 min-w-[200px]" className="h-9 text-sm" />
        <Select options={[
          { value: '', label: 'All Status' },
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' },
        ]} wrapperClassName="w-40" />
        <Select options={[{ value: '', label: 'All Payments' }, { value: 'razorpay', label: 'Razorpay' }, { value: 'cod', label: 'COD' }]} wrapperClassName="w-36" />
      </div>

      <div className="bg-white rounded-brand shadow-soft overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-taupe">Loading order registry...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-alt border-b border-secondary">
                <tr>
                  {['Order #', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-taupe uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {ordersList.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-alt transition-colors">
                    <td className="px-4 py-3 font-medium text-charcoal">{order.order_number}</td>
                    <td className="px-4 py-3 text-taupe text-xs">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{order.shipping_address?.name || order.shipping_details?.name || 'Customer'}</p>
                      <p className="text-xs text-taupe">{order.guest_email ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 text-taupe">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold text-charcoal">{formatINR(order.total)}</td>
                    <td className="px-4 py-3 text-taupe capitalize text-xs">{order.payment_method}</td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', statusColors[order.status] ?? '')}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/admin/orders/${order.id}`} className="text-xs text-primary hover:underline">View</Link>
                        <button onClick={() => handleUpdateShipping(order.id)} className="text-xs text-secondary-deep hover:underline">Ship</button>
                        <button className="text-xs text-taupe hover:text-charcoal">Invoice</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Customers Page ─────────────────────────────────────────────────────

export function AdminCustomersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Customers</h1>
        <Button variant="secondary" size="sm">Export CSV</Button>
      </div>
      <div className="bg-white rounded-brand shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-alt border-b border-secondary">
              <tr>
                {['Customer', 'Phone', 'Orders', 'Total Spend', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-taupe uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {sampleUsers.map((user) => (
                <tr key={user.id} className="hover:bg-cream-alt">
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{user.name}</p>
                    <p className="text-xs text-taupe">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-taupe text-xs">{user.phone}</td>
                  <td className="px-4 py-3 text-charcoal">{user.total_orders}</td>
                  <td className="px-4 py-3 font-semibold text-charcoal">{formatINR(user.total_spend ?? 0)}</td>
                  <td className="px-4 py-3 text-taupe text-xs">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-primary hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Coupons Page ───────────────────────────────────────────────────────

export function AdminCouponsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Coupons & Discounts</h1>
        <Button size="sm">+ Create Coupon</Button>
      </div>
      <div className="bg-white rounded-brand shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-alt border-b border-secondary">
            <tr>
              {['Code', 'Type', 'Value', 'Min Cart', 'Usage', 'Expiry', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-taupe uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-cream-alt">
                <td className="px-4 py-3 font-mono font-bold text-primary">{coupon.code}</td>
                <td className="px-4 py-3 text-taupe capitalize">{coupon.type}</td>
                <td className="px-4 py-3 font-medium">{coupon.type === 'percent' ? `${coupon.value}%` : formatINR(coupon.value)}</td>
                <td className="px-4 py-3 text-taupe">{coupon.min_cart_value ? formatINR(coupon.min_cart_value) : '—'}</td>
                <td className="px-4 py-3 text-taupe">{coupon.usage_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ''}</td>
                <td className="px-4 py-3 text-taupe text-xs">{coupon.expiry_date ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', coupon.active ? 'bg-sage/10 text-sage' : 'bg-taupe/10 text-taupe')}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="text-xs text-primary hover:underline">Edit</button>
                  <button className="text-xs text-rust hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin Reviews Page ────────────────────────────────────────────────────────

export function AdminReviewsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Reviews & Ratings</h1>
        <Select options={[
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ]} wrapperClassName="w-36" />
      </div>
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-brand shadow-soft p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-charcoal">{review.user_name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {'⭐'.repeat(review.rating)}
                  <span className="text-xs text-taupe">{formatDate(review.created_at)}</span>
                </div>
              </div>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                review.status === 'approved' ? 'bg-sage/10 text-sage' :
                review.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rust/10 text-rust'
              )}>
                {review.status}
              </span>
            </div>
            <p className="text-sm text-taupe">{review.comment}</p>
            <div className="flex gap-2 mt-3">
              {review.status !== 'approved' && <button className="text-xs text-sage hover:underline">Approve</button>}
              {review.status !== 'rejected' && <button className="text-xs text-rust hover:underline">Reject</button>}
              <button className="text-xs text-primary hover:underline">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Reports Page ────────────────────────────────────────────────────────

export function AdminReportsPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Reports & Analytics</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-brand shadow-soft p-5 md:col-span-2">
          <h2 className="font-sans font-semibold text-charcoal mb-4">Revenue This Week</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={adminStats.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3D9CE" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8A7A82' }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#8A7A82' }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [formatINR(value), 'Revenue']} />
              <Bar dataKey="amount" fill="#9B7A93" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Top products */}
        <div className="bg-white rounded-brand shadow-soft p-5">
          <div className="flex justify-between mb-4">
            <h2 className="font-sans font-semibold text-charcoal">Top Products</h2>
            <Button variant="secondary" size="xs">Export</Button>
          </div>
          <ul className="divide-y divide-secondary">
            {adminStats.topProducts.map((p, i) => (
              <li key={p.name} className="py-3 flex items-center gap-3">
                <span className="text-xs text-taupe w-4">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{p.name}</p>
                  <p className="text-xs text-taupe">{p.units} units sold</p>
                </div>
                <span className="font-semibold text-charcoal text-sm">{formatINR(p.revenue)}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Inventory */}
        <div className="bg-white rounded-brand shadow-soft p-5">
          <div className="flex justify-between mb-4">
            <h2 className="font-sans font-semibold text-charcoal">Inventory Summary</h2>
            <Button variant="secondary" size="xs">Export</Button>
          </div>
          <ul className="divide-y divide-secondary">
            {products.map((p) => {
              const total = p.variants.reduce((s, v) => s + v.stock_qty, 0);
              return (
                <li key={p.id} className="py-2.5 flex items-center justify-between">
                  <p className="text-sm text-charcoal">{p.name}</p>
                  <span className={cn('text-sm font-semibold', total === 0 ? 'text-rust' : total <= 10 ? 'text-amber-600' : 'text-sage')}>
                    {total} units
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Settings Page ──────────────────────────────────────────────────────

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
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
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.admin.getSettings().then((res) => {
      if (res.status === 'success' && res.data?.settings) {
        setSettings(res.data.settings);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError('');
    try {
      const res = await api.admin.updateSettings(settings);
      if (res.status === 'success') {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(res.message || 'Failed to update settings.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    }
  };

  if (loading) {
    return <p className="text-sm text-taupe p-6">Loading store configuration...</p>;
  }

  const sections = [
    {
      title: 'Store Information',
      fields: [
        { label: 'Business Name', key: 'store_name' },
        { label: 'Tagline', key: 'store_tagline' },
        { label: 'Address', key: 'store_address' },
        { label: 'Contact Email', key: 'store_email' },
        { label: 'WhatsApp Number', key: 'store_whatsapp' },
        { label: 'GSTIN', key: 'gstin' },
      ],
    },
    {
      title: 'Shipping Settings',
      fields: [
        { label: 'Free Shipping Threshold (₹)', key: 'free_shipping_above' },
        { label: 'Standard Shipping Fee (₹)', key: 'standard_shipping_fee' },
        { label: 'Express Shipping Fee (₹)', key: 'express_shipping_fee' },
      ],
    },
    {
      title: 'Payment Settings',
      fields: [
        { label: 'COD Order Limit (₹)', key: 'cod_order_limit' },
      ],
    },
    {
      title: 'Tax Settings',
      fields: [
        { label: 'GST Rate (%)', key: 'gst_rate' },
      ],
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Settings</h1>
      
      {error && (
        <div className="text-rust text-xs bg-rust/5 p-3 rounded mb-4 border border-rust/10 max-w-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section) => (
          <form key={section.title} onSubmit={handleSave} className="bg-white rounded-brand shadow-soft p-6">
            <h2 className="font-sans font-semibold text-charcoal mb-5 pb-3 border-b border-secondary">{section.title}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {section.fields.map((field) => (
                <Input 
                  key={field.key} 
                  label={field.label} 
                  value={settings[field.key] || ''} 
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ))}
            </div>
            <Button type="submit" size="sm">{saved ? '✓ Saved!' : 'Save Changes'}</Button>
          </form>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Marketing Page ─────────────────────────────────────────────────────

export function AdminMarketingPage() {
  const [activeSection, setActiveSection] = useState<'list' | 'hero' | 'announcements'>('list');
  const [banners, setBanners] = useState<any[]>(() => {
    const saved = localStorage.getItem('meraki_hero_banners');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some((b: any) => b.image && (b.image.includes('hero-slide-1') || b.image.includes('hero-slide-2')))) {
          localStorage.setItem('meraki_hero_banners', JSON.stringify(heroBanners));
          return heroBanners;
        }
        return parsed;
      } catch (e) {
        return heroBanners;
      }
    }
    return heroBanners;
  });
  const [announcementList, setAnnouncementList] = useState<string[]>(() => {
    const saved = localStorage.getItem('meraki_announcements');
    return saved ? JSON.parse(saved) : [
      '✨ Free shipping on orders above ₹1,499 across India',
      '🎁 Use code WELCOME10 for 10% off your first order',
      '🏺 Handcrafted in India — Made with Soul, Worn with Ease',
      '📦 Easy 7-day returns | Secure payment | Authentic handcrafted',
    ];
  });

  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [newBanner, setNewBanner] = useState<boolean>(false);

  // Form states for banner editing/adding
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [accent, setAccent] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [image, setImage] = useState('/hero-slide-sankranti.png');
  const [imageSource, setImageSource] = useState<'preset' | 'upload'>('preset');

  // Load banner data into form
  const handleEditBannerClick = (banner: any) => {
    setEditingBanner(banner);
    setNewBanner(false);
    setTitle(banner.title || '');
    setSubtitle(banner.subtitle || '');
    setAccent(banner.accent || '');
    setCtaText(banner.cta_text || 'Shop Now');
    setCtaLink(banner.cta_link || '/collections');
    setImage(banner.image || '/hero-slide-sankranti.png');
    setImageSource(banner.image && banner.image.startsWith('data:') ? 'upload' : 'preset');
  };

  const handleAddNewClick = () => {
    setEditingBanner(null);
    setNewBanner(true);
    setTitle('');
    setSubtitle('');
    setAccent('');
    setCtaText('Shop Now');
    setCtaLink('/collections');
    setImage('/hero-slide-sankranti.png');
    setImageSource('preset');
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [];
    if (newBanner) {
      const nextId = banners.length > 0 ? Math.max(...banners.map(b => b.id)) + 1 : 1;
      updated = [...banners, { id: nextId, title, subtitle, cta_text: ctaText, cta_link: ctaLink, image, accent }];
    } else if (editingBanner) {
      updated = banners.map(b => b.id === editingBanner.id ? { ...b, title, subtitle, cta_text: ctaText, cta_link: ctaLink, image, accent } : b);
    }
    setBanners(updated);
    localStorage.setItem('meraki_hero_banners', JSON.stringify(updated));
    setEditingBanner(null);
    setNewBanner(false);
    toast.success('Hero Banners updated successfully!');
  };

  const handleDeleteBanner = (id: number) => {
    const updated = banners.filter(b => b.id !== id);
    setBanners(updated);
    localStorage.setItem('meraki_hero_banners', JSON.stringify(updated));
    toast.success('Banner deleted successfully!');
  };

  const handleSaveAnnouncements = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('meraki_announcements', JSON.stringify(announcementList));
    toast.success('Announcement Bar updated successfully!');
  };

  if (activeSection === 'hero') {
    return (
      <div>
        <button
          onClick={() => { setActiveSection('list'); setEditingBanner(null); setNewBanner(false); }}
          className="flex items-center gap-1.5 text-primary hover:text-primary-dark transition-colors mb-6 text-sm font-sans"
        >
          ← Back to Marketing
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-charcoal">Carousel Hero Banners</h1>
          <Button size="sm" onClick={handleAddNewClick}>+ Add New Slide</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* List of current banners */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-sans font-medium text-taupe mb-2">Active Slides ({banners.length})</h3>
            {banners.length === 0 ? (
              <div className="bg-white rounded-brand p-8 text-center text-taupe border border-dashed border-secondary/60">
                No slides active. Click "+ Add New Slide" to create one.
              </div>
            ) : (
              banners.map(b => (
                <div key={b.id} className="bg-white rounded-brand shadow-soft p-4 border border-secondary/20 flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img src={b.image} alt={b.title} className="h-16 w-28 object-cover rounded bg-[#E8E1DA] border" />
                    <div>
                      <span className="text-[10px] uppercase font-sans tracking-wider text-primary font-medium">{b.accent}</span>
                      <h4 className="font-sans font-semibold text-charcoal text-sm">{b.title}</h4>
                      <p className="text-xs text-taupe line-clamp-1">{b.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => handleEditBannerClick(b)}>Edit</Button>
                    <Button variant="outline" size="sm" className="h-8 px-2 text-rust hover:bg-rust/5 border-rust/30 hover:border-rust" onClick={() => handleDeleteBanner(b.id)}>Delete</Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form for adding/editing */}
          <div className="lg:col-span-1">
            {(editingBanner || newBanner) ? (
              <div className="bg-white rounded-brand shadow-soft p-5 border border-secondary/30">
                <h3 className="font-sans font-semibold text-charcoal mb-4">
                  {newBanner ? 'Add New Carousel Slide' : 'Edit Slide: ' + (editingBanner ? editingBanner.title : '')}
                </h3>
                <form onSubmit={handleSaveBanner} className="space-y-4">
                  <div>
                    <label className="text-xs font-sans text-taupe block mb-1">Slide Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-sans text-taupe block mb-1">Slide Subtitle</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-sans text-taupe block mb-1">Accent Badge Text</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                      value={accent}
                      placeholder="e.g., Makar Sankranti Special"
                      onChange={(e) => setAccent(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-sans text-taupe block mb-1">CTA Text</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-sans text-taupe block mb-1">CTA Link</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                        value={ctaLink}
                        onChange={(e) => setCtaLink(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-sans text-taupe block mb-1">Image Asset Source</label>
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setImageSource('preset')}
                        className={'flex-1 py-1 text-xs font-sans border rounded-brand transition-colors ' + (imageSource === 'preset' ? 'bg-primary text-white border-primary' : 'bg-cream-alt text-taupe')}
                      >
                        Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSource('upload')}
                        className={'flex-1 py-1 text-xs font-sans border rounded-brand transition-colors ' + (imageSource === 'upload' ? 'bg-primary text-white border-primary' : 'bg-cream-alt text-taupe')}
                      >
                        From Device
                      </button>
                    </div>

                    {imageSource === 'preset' ? (
                      <select
                        className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                      >
                        <option value="/hero-slide-sankranti.png">Makar Sankranti 8K (/hero-slide-sankranti.png)</option>
                        <option value="/hero-slide-diwali.png">Diwali Sale 8K (/hero-slide-diwali.png)</option>
                        <option value="/hero-slide-1.png">Slide 1 (/hero-slide-1.png)</option>
                        <option value="/hero-slide-2.png">Slide 2 (/hero-slide-2.png)</option>
                        <option value="/hero-slide-3.png">Slide 3 (/hero-slide-3.png)</option>
                        <option value="/hero-slide-4.png">Slide 4 (/hero-slide-4.png)</option>
                        <option value="/hero-slide-5.png">Slide 5 (/hero-slide-5.png)</option>
                      </select>
                    ) : (
                      <div className="space-y-2 border p-3 rounded bg-cream-alt/40">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = async () => {
                                const compressed = await compressImage(reader.result as string, 1600, 0.85);
                                setImage(compressed);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-taupe file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark file:cursor-pointer"
                        />
                        {image && image.startsWith('data:') ? (
                          <div className="text-[10px] text-primary font-sans">✓ Custom image loaded from device</div>
                        ) : (
                          <div className="text-[10px] text-taupe font-sans">Select an image file from your device</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" size="sm" className="flex-1">Save Slide</Button>
                    <Button variant="outline" size="sm" onClick={() => { setEditingBanner(null); setNewBanner(false); }}>Cancel</Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-cream-alt rounded-brand p-5 text-center text-taupe text-xs border border-secondary">
                Select a slide from the list to edit, or click "+ Add New Slide" to create a new banner.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'announcements') {
    return (
      <div>
        <button
          onClick={() => setActiveSection('list')}
          className="flex items-center gap-1.5 text-primary hover:text-primary-dark transition-colors mb-6 text-sm font-sans"
        >
          ← Back to Marketing
        </button>

        <h1 className="font-serif text-2xl text-charcoal mb-6">Manage Announcement Bar</h1>

        <div className="bg-white rounded-brand shadow-soft p-6 max-w-2xl border border-secondary/20">
          <form onSubmit={handleSaveAnnouncements} className="space-y-4">
            {announcementList.map((ann, index) => (
              <div key={index}>
                <label className="text-xs font-sans text-taupe block mb-1">Announcement message {index + 1}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
                  value={ann}
                  onChange={(e) => {
                    const copy = [...announcementList];
                    copy[index] = e.target.value;
                    setAnnouncementList(copy);
                  }}
                  required
                />
              </div>
            ))}
            <div className="pt-2">
              <Button type="submit" size="sm">Save Announcements</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Marketing & CMS</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: '🎠 Hero Banners', desc: banners.length + ' active banners. Last updated today.', section: 'hero' as const },
          { title: '📝 Blog Posts', desc: blogPosts.length + ' published posts.', disabled: true },
          { title: '📸 Lookbook', desc: '6 editorial images.', disabled: true },
          { title: '📣 Announcement Bar', desc: 'Currently showing: Custom announcements.', section: 'announcements' as const },
          { title: '📧 Newsletter', desc: '1,247 subscribers.', disabled: true },
          { title: '🏷️ Popup Offers', desc: 'No active popup.', disabled: true },
        ].map((card) => (
          <div key={card.title} className="bg-white rounded-brand shadow-soft p-5 flex items-start justify-between">
            <div>
              <h3 className="font-sans font-semibold text-charcoal">{card.title}</h3>
              <p className="text-taupe text-sm mt-1">{card.desc}</p>
            </div>
            {!card.disabled ? (
              <Button variant="outline" size="sm" onClick={() => setActiveSection(card.section!)}>Manage</Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="opacity-50">Manage</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}// ─── Admin Gift Cards Page ────────────────────────────────────────────────────

export function AdminGiftCardsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-charcoal">Gift Cards</h1>
        <Button size="sm">+ Issue Gift Card</Button>
      </div>
      <div className="bg-white rounded-brand shadow-soft p-8 text-center text-taupe">
        <p>No gift cards issued yet. Click "Issue Gift Card" to create one.</p>
      </div>
    </div>
  );
}

// ─── Admin Login Page ─────────────────────────────────────────────────────────

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loginAdmin = useAuthStore((s) => s.loginAdmin);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.auth.login({ email, password });
      if (res.status === 'success' && res.data) {
        const user = res.data.user;
        if (user.role === 'admin' || user.role === 'staff') {
          loginAdmin(user, res.data.token);
          navigate('/admin');
        } else {
          setError('Access denied. Only administrators can log in here.');
        }
      } else {
        setError(res.message || 'Authentication failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="bg-white rounded-brand shadow-elevated w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="font-serif text-2xl text-charcoal mb-1">Meraki by Kritika</div>
          <p className="text-taupe text-sm">Admin Panel</p>
        </div>

        {error && (
          <div className="text-rust text-xs bg-rust/10 p-3 rounded-brand mb-4 border border-rust/10">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="Admin Email / ID" type="text" placeholder="merakidhanbad2026"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button fullWidth type="submit" size="lg" loading={loading} disabled={loading}>
            Sign In to Admin
          </Button>
        </form>
        <p className="text-center text-xs text-taupe mt-5">
          For security, admin access is restricted. Contact super admin for access.
        </p>
      </div>
    </div>
  );
}

// ─── Admin Categories Page ────────────────────────────────────────────────────

export function AdminCategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<'list' | 'add' | 'edit'>('list');
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Inputs
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const fetchCategories = () => {
    api.products.getCategories().then((res) => {
      if (res.status === 'success' && res.data?.categories) {
        setCategoriesList(res.data.categories);
      }
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddNewClick = () => {
    setEditingCategory(null);
    setActiveSection('add');
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
  };

  const handleEditClick = (cat: any) => {
    setEditingCategory(cat);
    setActiveSection('edit');
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setImage(cat.image || '');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [];
    const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const categoryData = {
      id: editingCategory ? editingCategory.id : Date.now(),
      name,
      slug: formattedSlug,
      description,
      image: image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80',
      product_count: editingCategory ? editingCategory.product_count : 0
    };

    if (activeSection === 'add') {
      updated = [...categoriesList, categoryData];
    } else {
      updated = categoriesList.map(c => c.id === editingCategory.id ? { ...c, ...categoryData } : c);
    }

    setCategoriesList(updated);
    localStorage.setItem('meraki_categories', JSON.stringify(updated));
    toast.success(activeSection === 'add' ? 'Category created!' : 'Category updated!');
    setActiveSection('list');
    fetchCategories();
  };

  const handleDeleteCategory = (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const updated = categoriesList.filter(c => c.id !== id);
    setCategoriesList(updated);
    localStorage.setItem('meraki_categories', JSON.stringify(updated));
    toast.success('Category deleted!');
    fetchCategories();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 800, 0.8);
        setImage(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  if (activeSection === 'add' || activeSection === 'edit') {
    return (
      <div className="max-w-2xl">
        <button
          onClick={() => setActiveSection('list')}
          className="flex items-center gap-1.5 text-primary hover:text-primary-dark transition-colors mb-6 text-sm font-sans"
          type="button"
        >
          ← Back to Categories List
        </button>

        <h1 className="font-serif text-2xl text-charcoal mb-6">
          {activeSection === 'add' ? 'Add New Category' : 'Edit Category'}
        </h1>

        <form onSubmit={handleSaveCategory} className="bg-white rounded-brand shadow-soft p-6 border border-secondary/20 space-y-4">
          <div>
            <label className="text-xs font-sans text-taupe block mb-1">Category Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (activeSection === 'add') {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }
              }}
              required
            />
          </div>

          <div>
            <label className="text-xs font-sans text-taupe block mb-1">Slug (URL identifier)</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-sans text-taupe block mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 bg-cream-alt rounded-brand text-xs text-charcoal border outline-none focus:border-primary resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-sans text-taupe block mb-1">Category Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-xs text-taupe file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark file:cursor-pointer"
            />
            {image && (
              <div className="mt-3 w-32 aspect-[3/4] border rounded overflow-hidden">
                <img src={image} alt="Category preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit">Save Category</Button>
            <Button variant="outline" type="button" onClick={() => setActiveSection('list')}>Cancel</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Categories</h1>
          <p className="text-taupe text-sm">Manage your product categories</p>
        </div>
        <Button size="sm" onClick={handleAddNewClick}>+ Add Category</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {categoriesList.map((cat) => (
          <div key={cat.id} className="bg-white rounded-brand shadow-soft overflow-hidden flex border">
            <img src={cat.image} alt={cat.name} className="w-24 h-24 object-cover flex-shrink-0 bg-[#E8E1DA]" loading="lazy" />
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans font-semibold text-charcoal">{cat.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{cat.product_count || 0} products</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditClick(cat)} className="text-xs text-primary hover:underline">Edit</button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-xs text-rust hover:underline">Delete</button>
                  </div>
                </div>
                <p className="text-taupe text-xs leading-relaxed line-clamp-2">{cat.description}</p>
                <p className="text-[10px] text-taupe/60 mt-1 font-mono">/collections/{cat.slug}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Admin Theme Settings Page ────────────────────────────────────────────────

export function AdminThemeSettingsPage() {
  const { theme, updateTheme, resetTheme, previewTheme } = useTheme();
  
  const [draft, setDraft] = useState<ThemeSettings>(theme);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setDraft(theme);
  }, [theme]);

  const handleColorChange = (key: keyof ThemeSettings, value: string) => {
    const uppercaseVal = value.startsWith('#') ? value : `#${value}`;
    const updated = { ...draft, [key]: uppercaseVal };
    setDraft(updated);

    if (!isValidHex(uppercaseVal)) {
      setErrors((prev) => ({ ...prev, [key]: 'Invalid hex code (e.g. #8C5B6E or #ABC)' }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      previewTheme(updated);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  const handleSave = async () => {
    if (hasErrors) {
      toast.error('Please fix invalid hex color codes before saving.');
      return;
    }
    setIsSaving(true);
    try {
      await updateTheme(draft);
      toast.success('Theme settings saved and applied globally across the website! ✨');
    } catch (err) {
      toast.error('Failed to save theme settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all colors back to the original Meraki brand palette?')) {
      setIsResetting(true);
      try {
        await resetTheme();
        setDraft(DEFAULT_THEME);
        setErrors({});
        toast.success('Theme restored to original Meraki brand palette.');
      } catch (err) {
        toast.error('Failed to reset theme.');
      } finally {
        setIsResetting(false);
      }
    }
  };

  const colorFields: { key: keyof ThemeSettings; label: string; description: string; defaultHex: string }[] = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color for badges, links, active states & accents', defaultHex: DEFAULT_THEME.primary },
    { key: 'secondary', label: 'Secondary / Accent Color', description: 'Soft contrast tint used for borders, subtle highlights & banners', defaultHex: DEFAULT_THEME.secondary },
    { key: 'background', label: 'Background Color', description: 'Global page background tone (Warm Cream default)', defaultHex: DEFAULT_THEME.background },
    { key: 'textHeadings', label: 'Text Color (Headings)', description: 'Color applied to all titles, headings & serif typography', defaultHex: DEFAULT_THEME.textHeadings },
    { key: 'textBody', label: 'Text Color (Body)', description: 'Color for body paragraphs, subtitles & muted secondary text', defaultHex: DEFAULT_THEME.textBody },
    { key: 'button', label: 'Button Color', description: 'Primary action buttons background fill', defaultHex: DEFAULT_THEME.button },
    { key: 'buttonHover', label: 'Button Hover Color', description: 'Darker tone applied when hovering primary buttons', defaultHex: DEFAULT_THEME.buttonHover },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-secondary shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">
              <Palette size={20} />
            </span>
            <h1 className="font-serif text-2xl text-charcoal font-semibold">Theme & Color Settings</h1>
          </div>
          <p className="text-taupe text-sm">
            Customize your storefront's color palette. Changes update dynamically in real-time and persist globally across all pages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-taupe hover:text-charcoal bg-secondary/50 hover:bg-secondary rounded-lg border border-secondary-deep transition-all"
          >
            <RotateCcw size={14} /> Reset to Default
          </button>
          <Button
            onClick={handleSave}
            disabled={isSaving || hasErrors}
            className="flex items-center gap-2 text-xs px-5 py-2"
          >
            <Save size={14} /> {isSaving ? 'Saving...' : 'Save Theme'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Color Form Section */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-secondary shadow-sm space-y-6">
          <div className="border-b border-secondary pb-4">
            <h2 className="font-serif text-lg text-charcoal font-medium">Color Palette Configurator</h2>
            <p className="text-xs text-taupe mt-1">Pick colors using the swatch or type exact hex codes (e.g. #8C5B6E).</p>
          </div>

          <div className="space-y-5">
            {colorFields.map((field) => {
              const val = draft[field.key] || '#000000';
              const isInvalid = !!errors[field.key];
              return (
                <div key={field.key} className="p-4 rounded-xl bg-warm-cream/40 border border-secondary/60 hover:border-primary/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <label className="text-sm font-semibold text-charcoal block">{field.label}</label>
                      <span className="text-xs text-taupe">{field.description}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Live color swatch next to field */}
                      <div
                        className="w-9 h-9 rounded-lg border border-secondary-deep shadow-inner transition-transform hover:scale-105 flex-shrink-0"
                        style={{ backgroundColor: isValidHex(val) ? val : '#ffffff' }}
                        title={`Current Swatch: ${val}`}
                      />

                      {/* Native Color Picker Input */}
                      <div className="relative">
                        <input
                          type="color"
                          value={isValidHex(val) ? (val.length === 4 ? `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}` : val) : '#8C5B6E'}
                          onChange={(e) => handleColorChange(field.key, e.target.value.toUpperCase())}
                          className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent p-0 overflow-hidden"
                          title="Pick color"
                        />
                      </div>

                      {/* Hex Text Input */}
                      <input
                        type="text"
                        value={val}
                        maxLength={7}
                        onChange={(e) => handleColorChange(field.key, e.target.value.toUpperCase())}
                        placeholder="#FFFFFF"
                        className={`w-28 text-xs font-mono px-3 py-2 rounded-lg border uppercase tracking-wider transition-all ${
                          isInvalid 
                            ? 'border-rust text-rust focus:outline-rust bg-rust/5' 
                            : 'border-secondary-deep focus:border-primary text-charcoal bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {isInvalid && (
                    <p className="text-[11px] text-rust font-medium mt-1">
                      ⚠️ {errors[field.key]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-secondary shadow-sm sticky top-20">
            <div className="flex items-center justify-between border-b border-secondary pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-primary" />
                <h2 className="font-serif text-lg text-charcoal font-medium">Live Storefront Preview</h2>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                Instant Render
              </span>
            </div>

            {/* Mini Homepage Banner & Component Mockup */}
            <div 
              className="p-5 rounded-xl border shadow-inner transition-all duration-300 space-y-5"
              style={{
                backgroundColor: isValidHex(draft.background) ? draft.background : '#FAF6F0',
                borderColor: isValidHex(draft.secondary) ? draft.secondary : '#F4D9CE',
              }}
            >
              {/* Mock Banner */}
              <div 
                className="p-5 rounded-lg text-center space-y-2 transition-colors duration-300"
                style={{
                  backgroundColor: isValidHex(draft.secondary) ? draft.secondary : '#F4D9CE',
                }}
              >
                <span 
                  className="text-[10px] uppercase tracking-widest font-mono font-medium block"
                  style={{ color: isValidHex(draft.primary) ? draft.primary : '#8C5B6E' }}
                >
                  Autumn / Winter 2026 Collection
                </span>
                <h3 
                  className="font-serif text-xl font-bold transition-colors"
                  style={{ color: isValidHex(draft.textHeadings) ? draft.textHeadings : '#3E2A32' }}
                >
                  Meraki by Kritika
                </h3>
                <p 
                  className="text-xs max-w-xs mx-auto leading-relaxed transition-colors"
                  style={{ color: isValidHex(draft.textBody) ? draft.textBody : '#75626A' }}
                >
                  Made with Soul, Worn with Ease. Experience Indian heritage textiles.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button 
                    className="px-4 py-1.5 rounded-md text-xs font-medium text-white transition-all shadow-sm hover:opacity-90"
                    style={{
                      backgroundColor: isValidHex(draft.button) ? draft.button : '#8C5B6E',
                    }}
                  >
                    Shop Now
                  </button>
                  <button 
                    className="px-4 py-1.5 rounded-md text-xs font-medium border transition-all"
                    style={{
                      borderColor: isValidHex(draft.primary) ? draft.primary : '#8C5B6E',
                      color: isValidHex(draft.textHeadings) ? draft.textHeadings : '#3E2A32',
                    }}
                  >
                    Explore Lookbook
                  </button>
                </div>
              </div>

              {/* Mock Product Card */}
              <div 
                className="bg-white p-4 rounded-lg border shadow-sm flex items-center gap-3 transition-colors"
                style={{ borderColor: isValidHex(draft.secondary) ? draft.secondary : '#F4D9CE' }}
              >
                <div 
                  className="w-14 h-16 rounded-md flex items-center justify-center text-xs font-serif font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: isValidHex(draft.primary) ? draft.primary : '#8C5B6E' }}
                >
                  Co-ord
                </div>
                <div className="flex-1 min-w-0">
                  <span 
                    className="text-[9px] uppercase tracking-wider font-mono block"
                    style={{ color: isValidHex(draft.primary) ? draft.primary : '#8C5B6E' }}
                  >
                    Bestseller
                  </span>
                  <h4 
                    className="font-serif text-sm font-semibold truncate"
                    style={{ color: isValidHex(draft.textHeadings) ? draft.textHeadings : '#3E2A32' }}
                  >
                    Silk Fusion Co-ord Set
                  </h4>
                  <p 
                    className="text-xs font-serif font-bold mt-0.5"
                    style={{ color: isValidHex(draft.button) ? draft.button : '#8C5B6E' }}
                  >
                    ₹3,400
                  </p>
                </div>
                <button 
                  className="px-3 py-1.5 text-[11px] font-medium text-white rounded-md flex-shrink-0"
                  style={{ backgroundColor: isValidHex(draft.button) ? draft.button : '#8C5B6E' }}
                >
                  + Add
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-warm-cream/70 border border-secondary text-xs text-taupe space-y-1">
              <p className="font-semibold text-charcoal flex items-center gap-1">
                💡 Tip for Admins:
              </p>
              <p>
                Clicking <strong>"Save Theme"</strong> updates global CSS variables instantly across all customer-facing storefront pages without rebuilding or re-deploying code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
