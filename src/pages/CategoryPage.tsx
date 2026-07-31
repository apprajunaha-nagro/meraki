import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button, Badge, Breadcrumb, Skeleton, Rating } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import { products as allProducts, categories } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import type { ProductFilters } from '@/types/product';

// ─── Filter Panel ─────────────────────────────────────────────────────────────

interface FilterPanelProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onClose?: () => void;
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const colors = ['Blush Pink', 'Sage Green', 'Ivory', 'Dusty Mauve', 'Terracotta', 'Midnight Blue', 'Crimson & Gold', 'Champagne Gold'];
const fabrics = ['Chanderi Silk', 'Handloom Cotton', 'Banarasi Silk', 'Organza', 'Rayon', 'Georgette', 'Crushed Silk', 'Cotton-Silk Blend'];
const occasions = ['Festive', 'Wedding', 'Everyday', 'Workwear', 'Fusion', 'Bridal'];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-secondary pb-4 mb-4">
      <button
        className="flex items-center justify-between w-full text-sm font-medium text-charcoal mb-3"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown size={14} className={cn('text-taupe transition-transform', !open && '-rotate-90')} />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function FilterPanel({ filters, onChange, onClose }: FilterPanelProps) {
  const toggleArray = (key: keyof ProductFilters, value: string) => {
    const arr = (filters[key] as string[] | undefined) ?? [];
    const updated = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: updated.length > 0 ? updated : undefined });
  };

  const chipClass = (active: boolean) =>
    cn(
      'px-3 py-1.5 text-xs rounded-full border cursor-pointer transition-all',
      active
        ? 'bg-primary text-white border-primary'
        : 'bg-white text-charcoal border-secondary-deep hover:border-primary hover:text-primary'
    );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-lg text-charcoal">Filters</h3>
        {onClose && (
          <button onClick={onClose} className="text-taupe hover:text-charcoal lg:hidden">
            <X size={18} />
          </button>
        )}
        <button
          onClick={() => onChange({})}
          className="text-xs text-primary hover:underline hidden lg:block"
        >
          Clear all
        </button>
      </div>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button key={s} className={chipClass((filters.sizes ?? []).includes(s))} onClick={() => toggleArray('sizes', s)}>
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Colour">
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button key={c} className={chipClass((filters.colors ?? []).includes(c))} onClick={() => toggleArray('colors', c)}>
              {c}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Fabric">
        <div className="flex flex-wrap gap-2">
          {fabrics.map((f) => (
            <button key={f} className={chipClass((filters.fabrics ?? []).includes(f))} onClick={() => toggleArray('fabrics', f)}>
              {f}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Occasion">
        <div className="flex flex-wrap gap-2">
          {occasions.map((o) => (
            <button key={o} className={chipClass((filters.occasions ?? []).includes(o))} onClick={() => toggleArray('occasions', o)}>
              {o}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-2">
          {[
            { label: 'Under ₹2,000', min: 0, max: 2000 },
            { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
            { label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
            { label: 'Above ₹15,000', min: 15000, max: Infinity },
          ].map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                className="accent-primary"
                checked={filters.priceMin === range.min && filters.priceMax === range.max}
                onChange={() => onChange({ ...filters, priceMin: range.min, priceMax: range.max })}
              />
              <span className="text-sm text-charcoal">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="space-y-2">
          {[
            { label: 'In Stock', value: 'in-stock' as const },
            { label: 'Pre-order', value: 'pre-order' as const },
          ].map((av) => (
            <label key={av.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary"
                checked={filters.availability === av.value}
                onChange={(e) => onChange({ ...filters, availability: e.target.checked ? av.value : undefined })}
              />
              <span className="text-sm text-charcoal">{av.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

// ─── Category Page (PLP) ──────────────────────────────────────────────────────

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<ProductFilters['sort']>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [categoriesList, setCategoriesList] = useState<typeof categories>(categories);
  const [productsList, setProductsList] = useState<any[]>([]);

  useEffect(() => {
    api.products.getCategories().then((res) => {
      if (res.status === 'success' && res.data?.categories) {
        setCategoriesList(res.data.categories);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api.products.list({ category: slug, sort: sort, limit: 100 }).then((res) => {
      if (res.status === 'success' && res.data?.products) {
        setProductsList(res.data.products);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [slug, sort]);

  const category = useMemo(() => categoriesList.find((c) => c.slug === slug), [categoriesList, slug]);

  const filteredProducts = useMemo(() => {
    let result = productsList;

    // Apply filters
    if (filters.sizes?.length) {
      result = result.filter((p) =>
        p.variants.some((v) => filters.sizes!.includes(v.size))
      );
    }
    if (filters.colors?.length) {
      result = result.filter((p) =>
        p.variants.some((v) => filters.colors!.includes(v.color))
      );
    }
    if (filters.fabrics?.length) {
      result = result.filter((p) => filters.fabrics!.includes(p.fabric));
    }
    if (filters.priceMax !== undefined) {
      result = result.filter((p) => p.base_price >= (filters.priceMin ?? 0) && p.base_price <= filters.priceMax!);
    }

    // local sort fallback
    switch (sort) {
      case 'price-asc': result = [...result].sort((a, b) => a.base_price - b.base_price); break;
      case 'price-desc': result = [...result].sort((a, b) => b.base_price - a.base_price); break;
      case 'popularity': result = [...result].sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0)); break;
      case 'newest': result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }

    return result;
  }, [productsList, filters, sort]);

  const activeFilterCount = (filters.sizes?.length ?? 0) +
    (filters.colors?.length ?? 0) +
    (filters.fabrics?.length ?? 0) +
    (filters.occasions?.length ?? 0) +
    (filters.priceMax !== undefined ? 1 : 0);

  return (
    <div className="header-offset pb-16">
      {/* Category hero */}
      <div className="relative h-40 lg:h-56 overflow-hidden">
        {category?.image && (
          <img
            src={category.image}
            alt={category.name ?? 'Collections'}
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-charcoal/50 flex flex-col items-center justify-center text-center px-4">
          <p className="nav-label text-white/70 mb-2">Browse Collection</p>
          <h1 className="font-serif text-4xl text-white">{category?.name ?? 'All Collections'}</h1>
          {category?.description && (
            <p className="text-white/70 text-sm mt-2 max-w-lg">{category.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
            ...(category ? [{ label: category.name }] : []),
          ]}
        />

        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-[120px] self-start">
            <FilterPanel filters={filters} onChange={setFilters} />
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-taupe">{filteredProducts.length} products</span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => setFilters({})}
                    className="text-xs text-rust hover:underline"
                  >
                    Clear filters ({activeFilterCount})
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  className="lg:hidden flex items-center gap-2 text-sm text-charcoal border border-secondary-deep px-3 py-2 rounded-brand"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal size={14} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as ProductFilters['sort'])}
                  className="text-sm border border-secondary-deep rounded-brand px-3 py-2 outline-none focus:border-primary cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popularity">Popularity</option>
                </select>

                {/* View toggle */}
                <div className="hidden sm:flex border border-secondary-deep rounded-brand overflow-hidden">
                  <button
                    onClick={() => setView('grid')}
                    className={cn('p-2 transition-colors', view === 'grid' ? 'bg-primary text-white' : 'text-taupe hover:text-charcoal')}
                    aria-label="Grid view"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={cn('p-2 transition-colors', view === 'list' ? 'bg-primary text-white' : 'text-taupe hover:text-charcoal')}
                    aria-label="List view"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-product mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-charcoal mb-3">No products found</p>
                <p className="text-taupe text-sm mb-6">Try adjusting your filters or browse all collections</p>
                <Button variant="outline" onClick={() => setFilters({})}>Clear Filters</Button>
              </div>
            )}

            {/* Grid */}
            {!loading && filteredProducts.length > 0 && (
              <div className={cn(
                'grid gap-4',
                view === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              )}>
                {filteredProducts.map((product) => (
                  view === 'grid' ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    // List view
                    <div key={product.id} className="flex gap-4 bg-white rounded-brand shadow-soft p-4">
                      <Link to={`/product/${product.slug}`} className="flex-shrink-0">
                        <img
                          src={product.images[0]?.image_url}
                          alt={product.images[0]?.alt_text}
                          className="w-28 h-36 object-cover rounded-brand"
                          loading="lazy"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-sans font-medium text-charcoal hover:text-primary transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-taupe mt-1">{product.fabric}</p>
                        {product.rating && <Rating value={product.rating} size="sm" className="mt-1" />}
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="font-semibold text-charcoal">{filteredProducts.length > 0 && 'From'} ₹{product.base_price.toLocaleString('en-IN')}</span>
                        </div>
                        <Button size="sm" className="mt-3" variant="outline">View Details</Button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-charcoal/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-[300px] h-full bg-white p-5 overflow-y-auto animate-slide-in-right">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onClose={() => setMobileFiltersOpen(false)}
            />
            <Button fullWidth onClick={() => setMobileFiltersOpen(false)} className="mt-4">
              View {filteredProducts.length} Products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Collections Overview ─────────────────────────────────────────────────────

export function CollectionsPage() {
  const [categoriesList, setCategoriesList] = useState<typeof categories>(categories);

  useEffect(() => {
    api.products.getCategories().then((res) => {
      if (res.status === 'success' && res.data?.categories) {
        setCategoriesList(res.data.categories);
      }
    });
  }, []);

  return (
    <div className="header-offset pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">Browse by category</p>
          <h1 className="font-serif text-5xl text-charcoal">All Collections</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categoriesList.map((cat) => (
            <Link key={cat.slug} to={`/collections/${cat.slug}`} className="group" aria-label={`Shop ${cat.name}`}>
              <div className="relative overflow-hidden rounded-brand aspect-[4/5]">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1610189844589-3c3e58a04ba1?w=600&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-serif text-xl">{cat.name}</p>
                  <p className="text-white/70 text-xs mt-0.5">{cat.product_count || 0} pieces</p>
                  {cat.description && (
                    <p className="text-white text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
