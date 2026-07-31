import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, User, Menu, X,
  Phone, Mail, MapPin, ChevronDown, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { categories } from '@/lib/mockData';
import { AIStylistModal } from './AIStylistModal';

// ─── Announcement Bar ────────────────────────────────────────────────────────

const announcements = [
  '✨ Free shipping on orders above ₹1,499 across India',
  '🎁 Use code WELCOME10 for 10% off your first order',
  '🏺 Handcrafted in India — Made with Soul, Worn with Ease',
  '📦 Easy 7-day returns | Secure payment | Authentic handcrafted',
];

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [items] = useState(() => {
    const saved = localStorage.getItem('meraki_announcements');
    return saved ? JSON.parse(saved) : announcements;
  });

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="bg-primary text-cream text-xs font-sans h-10 flex items-center justify-center overflow-hidden">
      <div key={current} className="animate-fade-in text-center tracking-[0.06em] uppercase px-4">
        {items[current]}
      </div>
    </div>
  );
}

// ─── Navigation Data ─────────────────────────────────────────────────────────

// ─── Search Overlay ───────────────────────────────────────────────────────────

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const suggestions = query.length > 1
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const popularSearches = ['Kurta Sets', 'Sarees', 'Co-ords', 'Festive Wear', 'New Arrivals'];

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-all duration-300',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'absolute top-0 left-0 right-0 bg-white shadow-elevated transition-transform duration-300',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Search size={20} className="text-taupe flex-shrink-0" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Search for sarees, kurtas, lehengas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-lg text-charcoal bg-transparent outline-none placeholder-taupe"
              aria-label="Search products"
            />
            <button onClick={onClose} className="text-taupe hover:text-charcoal transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="divider-gold my-4" />

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-4">
              <p className="nav-label text-taupe mb-3">Suggestions</p>
              <ul className="space-y-2">
                {suggestions.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/collections/${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 text-sm text-charcoal hover:text-primary transition-colors"
                    >
                      <Search size={14} className="text-taupe" />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Popular Searches */}
          {!query && (
            <div>
              <p className="nav-label text-taupe mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    to={`/search?q=${encodeURIComponent(term)}`}
                    onClick={onClose}
                    className="px-4 py-1.5 bg-cream-alt text-sm text-charcoal rounded-full hover:bg-secondary hover:text-charcoal transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Nav ───────────────────────────────────────────────────────────────

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileNav({ isOpen, onClose }: MobileNavProps) {

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[320px] bg-white shadow-elevated flex flex-col transition-transform duration-350 ease-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile nav header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary">
          <Link to="/" onClick={onClose} className="font-serif text-xl text-charcoal">Meraki by Kritika</Link>
          <button onClick={onClose} className="text-taupe hover:text-charcoal">
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="border-b border-secondary/50">
            <Link to="/new-arrivals" onClick={onClose} className="block px-5 py-3.5 text-sm font-medium text-charcoal hover:text-primary transition-colors">
              New Arrivals
            </Link>
          </div>
          {/* Meraki's Collection Group */}
          <div className="border-b border-secondary/50">
            <Link to="/collections" onClick={onClose} className="block px-5 pt-3.5 pb-1 text-sm font-semibold text-charcoal hover:text-primary transition-colors">
              Meraki's Collection
            </Link>
            <div className="pl-4 space-y-0.5 pb-2">
              <Link to="/collections/lehengas" onClick={onClose} className="flex items-center gap-1 px-5 py-1.5 text-sm text-primary font-semibold hover:text-primary-dark transition-colors">✨ Lehengas</Link>
              <Link to="/collections/co-ord-sets" onClick={onClose} className="block px-5 py-1.5 text-sm text-charcoal hover:text-primary transition-colors">Co-ord Sets</Link>
              <Link to="/collections/maxi-dresses" onClick={onClose} className="block px-5 py-1.5 text-sm text-charcoal hover:text-primary transition-colors">Maxi Dresses</Link>
              <Link to="/collections/kurtis" onClick={onClose} className="block px-5 py-1.5 text-sm text-charcoal hover:text-primary transition-colors">Kurtis</Link>
              <Link to="/collections/gen-z-wear" onClick={onClose} className="block px-5 py-1.5 text-sm text-charcoal hover:text-primary transition-colors">Gen-Z Wear</Link>
            </div>
          </div>

          {/* Pretty Women Group (Shop By Edit) */}
          <div className="border-b border-secondary/50">
            <p className="px-5 pt-3.5 pb-1 text-sm font-semibold text-charcoal">Pretty Women</p>
            <div className="pl-4 space-y-0.5 pb-2">
              <Link to="/edit/festive-edit" onClick={onClose} className="block px-5 py-1.5 text-sm text-charcoal hover:text-primary transition-colors">Festive Edit</Link>
              <Link to="/edit/workwear-luxe" onClick={onClose} className="block px-5 py-1.5 text-sm text-charcoal hover:text-primary transition-colors">Workwear Luxe</Link>
              <Link to="/edit/bridal-trousseau" onClick={onClose} className="block px-5 py-1.5 text-sm text-charcoal hover:text-primary transition-colors">Bridal Trousseau</Link>
              <Link to="/edit/everyday-linen" onClick={onClose} className="block px-5 py-1.5 text-sm text-charcoal hover:text-primary transition-colors">Everyday Linen</Link>
              <Link to="/edit/sangeet-glam" onClick={onClose} className="block px-5 py-1.5 text-sm text-charcoal hover:text-primary transition-colors">Sangeet Glam</Link>
            </div>
          </div>
          
          <div className="border-b border-secondary/50">
            <Link to="/craftsmanship" onClick={onClose} className="block px-5 py-3.5 text-sm font-medium text-charcoal hover:text-primary transition-colors">
              Saundarya Craftsmanship
            </Link>
          </div>
          <div className="border-b border-secondary/50">
            <Link to="/sale" onClick={onClose} className="block px-5 py-3.5 text-sm font-medium text-rust hover:text-primary transition-colors">
              Sale
            </Link>
          </div>
        </nav>

        {/* Mobile contact */}
        <div className="px-5 py-4 border-t border-secondary bg-cream-alt text-xs text-taupe space-y-2">
          <div className="flex items-center gap-2"><Phone size={12} /> +91 99XXX XXXXX</div>
          <div className="flex items-center gap-2"><Mail size={12} /> hello@merakibykritika.in</div>
          <div className="flex items-center gap-2"><MapPin size={12} /> Dhanbad, Jharkhand</div>
        </div>
      </div>
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiStylistOpen, setAiStylistOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const openCartDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      // Smart Auto-Hide: Hide when scrolling down past 100px, reveal when scrolling up
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <AIStylistModal isOpen={aiStylistOpen} onClose={() => setAiStylistOpen(false)} />

      <div className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}>
        <AnnouncementBar />

        <header
          className={cn(
            'bg-cream border-b border-secondary/40 transition-all duration-300',
            scrolled ? 'shadow-md bg-cream' : 'shadow-sm'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6 relative">
            {/* Mobile Header Row */}
            <div className="flex lg:hidden items-center h-[68px] justify-between">
              <button
                className="text-charcoal hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full hover:bg-cream-alt active:bg-secondary/40"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              <Link to="/" className="block py-1" aria-label="Meraki by Kritika — home">
                <img
                  src="/logo.png"
                  alt="Meraki by Kritika"
                  className="h-11 object-contain mx-auto"
                />
              </Link>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAiStylistOpen(true)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-primary hover:text-primary-dark transition-colors rounded-full hover:bg-cream-alt"
                  aria-label="AI Stylist"
                >
                  <Sparkles size={20} className="animate-pulse" />
                </button>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-charcoal hover:text-primary transition-colors rounded-full hover:bg-cream-alt"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={openCartDrawer}
                  className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-charcoal hover:text-primary transition-colors rounded-full hover:bg-cream-alt"
                  aria-label={`Shopping bag (${itemCount} items)`}
                >
                  <ShoppingBag size={20} />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Row 1: Left search & AI Stylist, Center logo, Right utilities */}
            <div className={cn(
              "hidden lg:flex items-center justify-between border-b border-secondary/20 transition-all duration-300",
              scrolled ? "h-[64px]" : "h-[80px]"
            )}>
              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 text-taupe hover:text-charcoal transition-colors px-4 py-2 bg-cream-alt/80 rounded-full border border-secondary text-xs"
                >
                  <Search size={14} />
                  <span>Search collections...</span>
                </button>

                <button
                  onClick={() => setAiStylistOpen(true)}
                  className="flex items-center gap-1.5 text-primary hover:bg-primary hover:text-white transition-all px-3 py-1.5 bg-secondary/30 rounded-full border border-primary/30 text-xs font-medium active:scale-95"
                >
                  <Sparkles size={13} className="animate-pulse" />
                  <span>AI Stylist</span>
                </button>
              </div>

              <div className="flex justify-center flex-1">
                <Link to="/" className="block" aria-label="Meraki by Kritika — home">
                  <img
                    src="/logo.png"
                    alt="Meraki by Kritika"
                    className="transition-all duration-300"
                    style={{
                      height: scrolled ? '56px' : '76px',
                      objectFit: 'contain'
                    }}
                  />
                </Link>
              </div>

              <div className="flex items-center justify-end gap-3 flex-1">
                <Link
                  to="/account"
                  className="p-2 text-charcoal hover:text-primary transition-colors rounded-brand"
                  aria-label="My account"
                >
                  <User size={20} />
                </Link>

                <Link
                  to="/wishlist"
                  className="relative p-2 text-charcoal hover:text-primary transition-colors rounded-brand"
                  aria-label={`Wishlist (${wishlistCount} items)`}
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={openCartDrawer}
                  className="relative p-2 text-charcoal hover:text-primary transition-colors rounded-brand"
                  aria-label={`Shopping bag (${itemCount} items)`}
                >
                  <ShoppingBag size={20} />
                  {itemCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Row 2: Navigation Links centered below logo */}
            <div className="hidden lg:flex items-center justify-center h-[52px]">
              <nav className="flex items-center gap-8">
                <Link
                  to="/new-arrivals"
                  className={cn(
                    'block py-2 nav-label transition-colors whitespace-nowrap',
                    location.pathname === '/new-arrivals' ? 'text-primary' : 'text-taupe hover:text-charcoal'
                  )}
                >
                  New Arrivals
                </Link>

                {/* Meraki's Collection Dropdown */}
                <div className="relative group py-2">
                  <Link
                    to="/collections"
                    className={cn(
                      'flex items-center gap-1 nav-label transition-colors whitespace-nowrap',
                      location.pathname.startsWith('/collections') ? 'text-primary' : 'text-taupe hover:text-charcoal'
                    )}
                  >
                    <span>Meraki's Collection</span>
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                  </Link>

                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-elevated border border-secondary/50 rounded-2xl py-2.5 min-w-[210px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 animate-scale-in">
                    <div className="px-3 pb-1 mb-1 border-b border-secondary/40">
                      <p className="text-[10px] uppercase tracking-wider text-taupe font-bold">Categories</p>
                    </div>
                    <Link to="/collections/lehengas" className="flex items-center gap-1.5 px-4 py-2 text-xs text-primary font-semibold hover:bg-cream transition-colors">✨ Lehengas</Link>
                    <Link to="/collections/co-ord-sets" className="block px-4 py-2 text-xs text-charcoal hover:text-primary hover:bg-cream transition-colors">Co-ord Sets</Link>
                    <Link to="/collections/maxi-dresses" className="block px-4 py-2 text-xs text-charcoal hover:text-primary hover:bg-cream transition-colors">Maxi Dresses</Link>
                    <Link to="/collections/kurtis" className="block px-4 py-2 text-xs text-charcoal hover:text-primary hover:bg-cream transition-colors">Kurtis</Link>
                    <Link to="/collections/gen-z-wear" className="block px-4 py-2 text-xs text-charcoal hover:text-primary hover:bg-cream transition-colors">Gen-Z Wear</Link>
                  </div>
                </div>

                {/* Pretty Women Dropdown (Shop by Edit) */}
                <div className="relative group py-2">
                  <button
                    className={cn(
                      'flex items-center gap-1 nav-label transition-colors whitespace-nowrap',
                      location.pathname.startsWith('/edit') ? 'text-primary' : 'text-taupe hover:text-charcoal'
                    )}
                  >
                    <span>Pretty Women</span>
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-elevated border border-secondary/50 rounded-2xl py-2.5 min-w-[210px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 animate-scale-in">
                    <div className="px-3 pb-1 mb-1 border-b border-secondary/40">
                      <p className="text-[10px] uppercase tracking-wider text-taupe font-bold">Shop By Edit</p>
                    </div>
                    <Link to="/edit/festive-edit" className="block px-4 py-2 text-xs text-charcoal hover:text-primary hover:bg-cream transition-colors">Festive Edit</Link>
                    <Link to="/edit/workwear-luxe" className="block px-4 py-2 text-xs text-charcoal hover:text-primary hover:bg-cream transition-colors">Workwear Luxe</Link>
                    <Link to="/edit/bridal-trousseau" className="block px-4 py-2 text-xs text-charcoal hover:text-primary hover:bg-cream transition-colors">Bridal Trousseau</Link>
                    <Link to="/edit/everyday-linen" className="block px-4 py-2 text-xs text-charcoal hover:text-primary hover:bg-cream rounded-brand transition-colors">Everyday Linen</Link>
                    <Link to="/edit/sangeet-glam" className="block px-4 py-2 text-xs text-charcoal hover:text-primary hover:bg-cream rounded-brand transition-colors">Sangeet Glam</Link>
                  </div>
                </div>

                <Link
                  to="/craftsmanship"
                  className={cn(
                    'block py-2 nav-label transition-colors whitespace-nowrap',
                    location.pathname === '/craftsmanship' ? 'text-primary' : 'text-taupe hover:text-charcoal'
                  )}
                >
                  Saundarya Craftsmanship
                </Link>

                <Link
                  to="/sale"
                  className={cn(
                    'block py-2 nav-label transition-colors whitespace-nowrap !text-rust hover:!text-rust'
                  )}
                >
                  Sale
                </Link>
              </nav>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-secondary flex items-center justify-around py-2 shadow-elevated">
        {[
          { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>, label: 'Home', href: '/' },
          { icon: <Search size={20} />, label: 'Search', action: () => setSearchOpen(true) },
          { icon: <Heart size={20} />, label: 'Wishlist', href: '/wishlist', count: wishlistCount },
          { icon: <ShoppingBag size={20} />, label: 'Cart', action: openCartDrawer, count: itemCount },
          { icon: <User size={20} />, label: 'Account', href: '/account' },
        ].map((item) => (
          item.href ? (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 text-taupe hover:text-primary transition-colors relative',
                location.pathname === item.href && 'text-primary'
              )}
            >
              {item.icon}
              <span className="text-[10px] font-sans">{item.label}</span>
              {item.count && item.count > 0 && (
                <span className="absolute top-0 right-1.5 bg-primary text-white text-[9px] rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
                  {item.count}
                </span>
              )}
            </Link>
          ) : (
            <button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-taupe hover:text-primary transition-colors relative"
            >
              {item.icon}
              <span className="text-[10px] font-sans">{item.label}</span>
              {item.count && item.count > 0 && (
                <span className="absolute top-0 right-1.5 bg-primary text-white text-[9px] rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
                  {item.count}
                </span>
              )}
            </button>
          )
        ))}
      </nav>
    </>
  );
}
