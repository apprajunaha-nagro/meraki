import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, Heart, User, LogOut, ChevronRight } from 'lucide-react';
import { Button, Input, Breadcrumb, Select } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductCard } from '@/components/product/ProductCard';
import { sampleOrders } from '@/lib/mockData';
import { formatINR, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';

// ─── Login / Signup Page ──────────────────────────────────────────────────────

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.auth.login({ email, password });
        if (res.status === 'success' && res.data) {
          login(res.data.user, res.data.token);
          navigate('/account');
        } else {
          setError(res.message || 'Login failed.');
        }
      } else {
        const res = await api.auth.signup({ name, email, password });
        if (res.status === 'success' && res.data) {
          login(res.data.user, res.data.token);
          navigate('/account');
        } else {
          setError(res.message || 'Signup failed.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="header-offset min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-brand shadow-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-2xl text-charcoal">Meraki by Kritika</Link>
          <p className="text-taupe text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-rust text-xs bg-rust/10 p-3 rounded-brand mb-4 border border-rust/10">
            ⚠️ {error}
          </div>
        )}

        {/* Tab toggle */}
        <div className="flex rounded-brand border border-secondary-deep overflow-hidden mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-primary text-white' : 'text-taupe hover:text-charcoal'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-primary text-white' : 'text-taupe hover:text-charcoal'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input label="Full Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <Input label="Email Address" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {mode === 'login' && (
            <div className="text-right">
              <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
            </div>
          )}
          <Button fullWidth type="submit" size="lg" loading={loading} disabled={loading}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-secondary" /></div>
            <span className="relative bg-white px-4 text-xs text-taupe">or continue with</span>
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-3 border border-secondary-deep rounded-brand py-3 text-sm text-charcoal hover:bg-cream transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="mt-5 text-center text-xs text-taupe">
          <Link to="/track-order" className="text-primary hover:underline">Track order without signing in</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Account Layout ───────────────────────────────────────────────────────────

const accountNav = [
  { label: 'My Orders', href: '/account/orders', icon: <Package size={16} /> },
  { label: 'My Addresses', href: '/account/addresses', icon: <MapPin size={16} /> },
  { label: 'My Wishlist', href: '/account/wishlist', icon: <Heart size={16} /> },
  { label: 'Profile', href: '/account/profile', icon: <User size={16} /> },
];

function AccountLayout({ children, activeTab }: { children: React.ReactNode; activeTab: string }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="header-offset pb-16">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
        <h1 className="font-serif text-3xl text-charcoal mb-6">My Account</h1>
        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <div className="bg-white rounded-brand shadow-soft p-5 mb-4">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-secondary">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-charcoal text-sm">{user?.name ?? 'Guest'}</p>
                  <p className="text-taupe text-xs">{user?.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {accountNav.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-brand text-sm transition-colors ${
                      activeTab === item.href ? 'bg-primary/10 text-primary font-medium' : 'text-taupe hover:text-charcoal hover:bg-cream'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-taupe hover:text-rust transition-colors px-3 py-2"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </aside>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

// ─── Orders Page ──────────────────────────────────────────────────────────────

export function AccountOrdersPage() {
  const [orders, setOrders] = useState<any[]>(sampleOrders);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.myOrders().then((res) => {
      if (res.status === 'success' && res.data?.orders) {
        setOrders(res.data.orders);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const statusColors: Record<string, string> = {
    delivered: 'bg-sage/10 text-sage',
    shipped: 'bg-blue-50 text-blue-600',
    confirmed: 'bg-primary/10 text-primary',
    pending: 'bg-amber-50 text-amber-600',
    cancelled: 'bg-rust/10 text-rust',
  };

  return (
    <AccountLayout activeTab="/account/orders">
      <div className="space-y-4">
        <h2 className="font-serif text-xl text-charcoal">My Orders</h2>
        {loading ? (
          <p className="text-taupe text-sm">Loading order history...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-brand shadow-soft p-10 text-center">
            <Package size={48} className="text-secondary-deep mx-auto mb-3" strokeWidth={1} />
            <p className="text-charcoal font-medium mb-1">No orders yet</p>
            <p className="text-taupe text-sm mb-4">Start shopping to see your orders here</p>
            <Link to="/collections"><Button variant="outline">Shop Now</Button></Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-brand shadow-soft p-5">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <p className="font-medium text-charcoal">Order #{order.order_number}</p>
                  <p className="text-taupe text-xs mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] ?? 'bg-cream-alt text-taupe'}`}>
                    {order.status}
                  </span>
                  <Link to={`/account/orders/${order.id}`} className="text-primary text-xs hover:underline flex items-center gap-0.5">
                    View Details <ChevronRight size={10} />
                  </Link>
                </div>
              </div>
              <ul className="space-y-3">
                {order.items.map((item: any) => (
                  <li key={item.id} className="flex gap-3">
                    <img src={item.product?.images[0]?.image_url} alt={item.product?.name}
                      className="w-14 h-18 object-cover rounded-brand" loading="lazy" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">{item.product?.name}</p>
                      <p className="text-xs text-taupe">{item.variant?.color} · {item.variant?.size} · Qty {item.qty}</p>
                      <p className="text-sm font-semibold text-charcoal mt-1">{formatINR(item.price_at_purchase * item.qty)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-secondary flex justify-between text-sm">
                <span className="text-taupe">Total: <span className="font-semibold text-charcoal">{formatINR(order.total)}</span></span>
                <span className="text-taupe capitalize">Paid via {order.payment_method}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </AccountLayout>
  );
}

// ─── Wishlist Account Page ────────────────────────────────────────────────────

export function AccountWishlistPage() {
  const { items } = useWishlistStore();
  return (
    <AccountLayout activeTab="/account/wishlist">
      <div>
        <h2 className="font-serif text-xl text-charcoal mb-5">My Wishlist ({items.length})</h2>
        {items.length === 0 ? (
          <div className="bg-white rounded-brand shadow-soft p-10 text-center">
            <Heart size={48} className="text-secondary-deep mx-auto mb-3" strokeWidth={1} />
            <p className="text-charcoal font-medium mb-4">Your wishlist is empty</p>
            <Link to="/collections"><Button variant="outline">Browse Collections</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((item) => (
              <ProductCard key={item.product.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

export function AccountProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.auth.updateProfile({ name, email, phone });
      if (res.status === 'success' && res.data?.user) {
        updateUser(res.data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(res.message || 'Failed to save changes.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountLayout activeTab="/account/profile">
      <div className="bg-white rounded-brand shadow-soft p-6">
        <h2 className="font-serif text-xl text-charcoal mb-5">Profile Details</h2>
        {error && (
          <div className="text-rust text-xs bg-rust/5 p-3 rounded mb-4 border border-rust/10">
            ⚠️ {error}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4 max-w-md">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Button type="submit" loading={loading} disabled={loading}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </AccountLayout>
  );
}

// ─── Addresses Page ───────────────────────────────────────────────────────────

export function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [label, setLabel] = useState('Home');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchAddresses = () => {
    setLoading(true);
    api.auth.getAddresses().then((res) => {
      if (res.status === 'success' && res.data?.addresses) {
        setAddresses(res.data.addresses);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormSubmitting(true);

    try {
      const res = await api.auth.addAddress({
        label,
        name,
        phone,
        line1,
        line2,
        city,
        state,
        pincode,
        is_default: isDefault ? 1 : 0
      });

      if (res.status === 'success') {
        setIsAdding(false);
        // Reset form
        setName('');
        setPhone('');
        setLine1('');
        setLine2('');
        setCity('');
        setState('');
        setPincode('');
        setIsDefault(false);
        // Refresh
        fetchAddresses();
      } else {
        setError(res.message || 'Failed to add address.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await api.auth.deleteAddress(id);
      if (res.status === 'success') {
        fetchAddresses();
      }
    } catch (err) {
      alert('Failed to delete address.');
    }
  };

  return (
    <AccountLayout activeTab="/account/addresses">
      <div className="bg-white rounded-brand shadow-soft p-6">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-secondary">
          <h2 className="font-serif text-xl text-charcoal">Saved Addresses</h2>
          {!isAdding && (
            <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>+ Add New</Button>
          )}
        </div>

        {error && (
          <div className="text-rust text-xs bg-rust/5 p-3 rounded mb-4 border border-rust/10">
            ⚠️ {error}
          </div>
        )}

        {isAdding && (
          <form onSubmit={handleAddSubmit} className="space-y-4 border border-secondary p-5 rounded-brand mb-6 max-w-lg">
            <h3 className="font-medium text-charcoal text-sm">Add New Shipping Address</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <Select 
                label="Address Label" 
                value={label} 
                onChange={(e) => setLabel(e.target.value)} 
                options={[
                  { value: 'Home', label: 'Home' },
                  { value: 'Office', label: 'Office' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
              <Input label="Recipient Name" placeholder="Ananya Krishnan" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <Input label="Phone Number" placeholder="+91 99000 00000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="Address Line 1" placeholder="Flat, House no., Building, Company, Apartment" value={line1} onChange={(e) => setLine1(e.target.value)} required />
            <Input label="Address Line 2" placeholder="Area, Street, Sector, Village" value={line2} onChange={(e) => setLine2(e.target.value)} />
            
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="City" placeholder="Dhanbad" value={city} onChange={(e) => setCity(e.target.value)} required />
              <Input label="State" placeholder="Jharkhand" value={state} onChange={(e) => setState(e.target.value)} required />
              <Input label="Pincode" placeholder="826001" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} required />
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-2 text-sm text-charcoal">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="accent-primary" />
              Set as default shipping address
            </label>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" loading={formSubmitting} disabled={formSubmitting}>Save Address</Button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-taupe text-sm">Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-secondary rounded-brand">
            <MapPin size={32} className="text-secondary-deep mx-auto mb-2" strokeWidth={1} />
            <p className="text-taupe text-sm">No saved addresses yet. Add your first address to speed up checkout.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className={`p-4 border rounded-brand relative ${addr.is_default ? 'border-primary bg-primary/5' : 'border-secondary'}`}>
                {addr.is_default && (
                  <span className="absolute top-3 right-3 text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-medium">Default</span>
                )}
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{addr.label}</p>
                <p className="font-medium text-charcoal text-sm">{addr.name}</p>
                <p className="text-taupe text-xs leading-relaxed mt-1">
                  {addr.line1}
                  {addr.line2 && `, ${addr.line2}`}
                  <br />
                  {addr.city}, {addr.state} — {addr.pincode}
                </p>
                <p className="text-charcoal text-xs mt-2 font-medium">📞 {addr.phone}</p>
                
                <div className="mt-4 flex gap-3 border-t border-secondary pt-3 text-xs">
                  <button onClick={() => handleDelete(addr.id)} className="text-rust hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

// ─── Public Wishlist Page ─────────────────────────────────────────────────────

export function WishlistPage() {
  const { items } = useWishlistStore();
  return (
    <div className="header-offset pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} className="mb-6" />
        <div className="flex items-end justify-between mb-8">
          <h1 className="font-serif text-4xl text-charcoal">My Wishlist</h1>
          <p className="text-taupe text-sm">{items.length} items</p>
        </div>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="text-secondary-deep mx-auto mb-4" strokeWidth={1} />
            <p className="font-serif text-2xl text-charcoal mb-2">Your wishlist is empty</p>
            <p className="text-taupe mb-6">Save your favourite pieces to revisit later</p>
            <Link to="/collections"><Button>Explore Collections</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <ProductCard key={item.product.id} product={item.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
