import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, ArrowLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Rating, Divider } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import {
  heroBanners,
  products,
  categories,
  curatedEdits,
  testimonials,
  blogPosts,
} from '@/lib/mockData';

import { api } from '@/lib/api';
import { NewsletterSection } from '@/components/common/NewsletterSection';

// Hero Carousel
function HeroCarousel() {
  const [banners, setBanners] = useState<any[]>(heroBanners);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 20,        // Lower = faster slide animation (default ~25). 20 gives a snappy-smooth feel.
      dragFree: false,     // Snap to slides cleanly
      containScroll: 'trimSnaps', // Prevent overscroll at edges
    },
    [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('meraki_hero_banners');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically clear cache if it doesn't contain all 5 current hero banner slides
        if (parsed.length !== 5) {
          localStorage.setItem('meraki_hero_banners', JSON.stringify(heroBanners));
          setBanners(heroBanners);
        } else {
          setBanners(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem('meraki_hero_banners', JSON.stringify(heroBanners));
    }
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#E8E1DA]" 
      style={{ aspectRatio: '4096 / 1732' }}
      aria-label="Hero banner"
    >
      <div
        className="embla h-full"
        ref={emblaRef}
        style={{ willChange: 'transform' }}  /* GPU-layer hint for smooth compositing */
      >
        <div className="embla__container h-full" style={{ backfaceVisibility: 'hidden' }}>
          {banners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.cta_link}
              className="embla__slide relative w-full h-full flex-shrink-0 block bg-[#E8E1DA]"
              draggable={false}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full select-none object-cover pointer-events-none"
                style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Prev/Next */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
        aria-label="Previous slide"
      >
        <ArrowLeft size={18} />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
        aria-label="Next slide"
      >
        <ArrowRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === selectedIndex ? 'bg-primary w-4' : 'bg-white/60 hover:bg-white'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Category Grid with Staggered Scroll-Reveal Animation ────────────────────

function CategoryGrid({ categoriesList }: { categoriesList: typeof categories }) {
  // Refs for each row of cards — IntersectionObserver watches these containers
  const primaryRowRef = useRef<HTMLDivElement>(null);
  const secondaryRowRef = useRef<HTMLDivElement>(null);

  // Track which rows have been revealed (one-time trigger per session)
  const [primaryRevealed, setPrimaryRevealed] = useState(false);
  const [secondaryRevealed, setSecondaryRevealed] = useState(false);

  useEffect(() => {
    // Respect user's motion preference — skip animation entirely
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPrimaryRevealed(true);
      setSecondaryRevealed(true);
      return;
    }

    /**
     * Observe a row container. When 20% of it enters the viewport,
     * mark it as revealed and disconnect (so it never re-triggers).
     */
    const makeObserver = (setter: (v: boolean) => void) =>
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
          }
        },
        { threshold: 0.2 } // 20% visibility before firing
      );

    const primaryObs = makeObserver(setPrimaryRevealed);
    const secondaryObs = makeObserver(setSecondaryRevealed);

    if (primaryRowRef.current) primaryObs.observe(primaryRowRef.current);
    if (secondaryRowRef.current) secondaryObs.observe(secondaryRowRef.current);

    return () => {
      primaryObs.disconnect();
      secondaryObs.disconnect();
    };
  }, []);

  const primaryCats = categoriesList.slice(0, 5);
  const secondaryCats = categoriesList.slice(5);

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-16 pt-10 pb-20" aria-labelledby="categories-heading">
      <div className="text-center mb-10">
        <p className="section-subtitle mb-3">What are you looking for?</p>
        <h2 id="categories-heading" className="section-title">Shop by Category</h2>
      </div>

      {/* ── Primary row: 5 portrait cards with staggered reveal ── */}
      <div
        ref={primaryRowRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        {primaryCats.map((cat, index) => (
          <Link
            key={cat.slug}
            to={`/collections/${cat.slug}`}
            className="group"
            aria-label={`Shop ${cat.name}`}
            // scroll-reveal-card: starts hidden (opacity:0, translateY:30px)
            // When `primaryRevealed` is true, .revealed class is added and
            // the card animates in with delay = index × 120ms (see index.css)
            style={{ '--index': index } as React.CSSProperties}
          >
            <div
              className={`scroll-reveal-card${primaryRevealed ? ' revealed' : ''} relative overflow-hidden rounded-brand aspect-[3/4.3] transition-all duration-300 group-hover:shadow-[0_12px_28px_rgba(140,91,110,0.22),_0_4px_12px_rgba(199,169,107,0.16)] group-hover:translate-y-[-2px]`}
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1610189844589-3c3e58a04ba1?w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-serif text-lg leading-tight">{cat.name}</p>
                <p className="text-white/70 text-xs mt-0.5">{cat.product_count || 0} pieces</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Secondary row: landscape cards with staggered reveal ── */}
      {secondaryCats.length > 0 && (
        <div
          ref={secondaryRowRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6"
        >
          {secondaryCats.map((cat, index) => (
            <Link
              key={cat.slug}
              to={`/collections/${cat.slug}`}
              className="group"
              aria-label={`Shop ${cat.name}`}
              // Continue stagger index after primary row (primaryCats.length + index)
              // so the reveal feels sequential across both rows
              style={{ '--index': primaryCats.length + index } as React.CSSProperties}
            >
              <div
                className={`scroll-reveal-card${secondaryRevealed ? ' revealed' : ''} relative overflow-hidden rounded-brand aspect-[4/3] transition-all duration-300 group-hover:shadow-[0_12px_28px_rgba(140,91,110,0.22),_0_4px_12px_rgba(199,169,107,0.16)] group-hover:translate-y-[-2px]`}
              >
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1610189844589-3c3e58a04ba1?w=600&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-serif text-base">{cat.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link to="/collections">
          <Button variant="outline" rightIcon={<ArrowRight size={14} />}>View All Collections</Button>
        </Link>
      </div>
    </section>
  );
}

// ─── Product Carousel Section ─────────────────────────────────────────────────

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: typeof products;
  viewAllHref?: string;
}

function ProductCarousel({ title, subtitle, products: prods, viewAllHref }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', slidesToScroll: 1 });

  return (
    <section className="py-14 bg-cream-alt" aria-labelledby={`${title.replace(/\s+/g, '-')}-heading`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && <p className="section-subtitle mb-2">{subtitle}</p>}
            <h2 id={`${title.replace(/\s+/g, '-')}-heading`} className="section-title">{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-9 h-9 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:border-primary hover:text-primary transition-colors"
              aria-label="Previous"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-9 h-9 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal hover:border-primary hover:text-primary transition-colors"
              aria-label="Next"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container gap-4">
            {prods.map((product) => (
              <div key={product.id} className="embla__slide" style={{ flex: '0 0 calc(25% - 12px)', minWidth: '220px' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {viewAllHref && (
          <div className="text-center mt-8">
            <Link to={viewAllHref}>
              <Button variant="ghost" rightIcon={<ChevronRight size={14} />}>View All</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Shop by Edit ─────────────────────────────────────────────────────────────

function ShopByEdit({ editsList }: { editsList: typeof curatedEdits }) {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16" aria-labelledby="edits-heading">
      <div className="text-center mb-10">
        <p className="section-subtitle mb-3">Curated for you</p>
        <h2 id="edits-heading" className="section-title">Shop by Edit</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {editsList.map((edit) => (
          <Link key={edit.slug} to={`/edit/${edit.slug}`} className="group" aria-label={edit.title}>
            <div className="relative overflow-hidden rounded-brand aspect-lookbook transition-all duration-300 group-hover:shadow-[0_12px_28px_rgba(140,91,110,0.22),_0_4px_12px_rgba(199,169,107,0.16)] group-hover:translate-y-[-2px]">
              <img
                src={edit.image}
                alt={edit.title}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white font-serif text-xl mb-1">{edit.title}</p>
                <p className="text-white/70 text-xs leading-relaxed hidden sm:block">{edit.subtitle}</p>
                <div className="flex items-center gap-1 mt-3 text-white text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Shop the Edit</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Brand Story Teaser ───────────────────────────────────────────────────────

function BrandStory() {
  return (
    <section className="py-16 bg-gradient-brand overflow-hidden" aria-labelledby="brand-story-heading">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-subtitle mb-4">The Meraki Philosophy</p>
            <h2 id="brand-story-heading" className="font-serif text-4xl lg:text-5xl text-charcoal leading-tight mb-6">
              Made with Soul,<br /><em className="serif-italic text-primary">Worn with Ease</em>
            </h2>
            <p className="text-taupe leading-relaxed mb-4 text-base">
              Meraki is a Greek word that means doing something with soul, creativity, and love — leaving a piece of yourself in your work. That is exactly what drives every piece we create.
            </p>
            <p className="text-taupe leading-relaxed mb-8 text-base">
              Founded by Kritika in Dhanbad, Jharkhand, Meraki by Kritika celebrates India's rich craft heritage — from the handlooms of Chanderi to the weaving traditions of Varanasi — and brings them to modern women who want to wear their values.
            </p>
            <Link to="/about">
              <Button variant="outline" rightIcon={<ArrowRight size={14} />}>
                Read Our Story
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center relative">
            <div className="relative group">
              <div className="w-84 h-84 sm:w-[400px] sm:h-[400px] md:w-[460px] md:h-[460px] rounded-full overflow-hidden border-4 border-primary/20 shadow-[0_25px_60px_rgba(140,91,110,0.3)] bg-white transition-transform duration-500 group-hover:scale-105">
                <img
                  src="/meraki-story-logo.jpg"
                  alt="Meraki by Kritika Official Logo Emblem"
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-3 right-2 sm:right-6 bg-white/95 backdrop-blur shadow-card rounded-full px-6 py-2.5 border border-primary/20 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-serif text-charcoal font-medium">Est. 2020 · Dhanbad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Craftsmanship Spotlight ──────────────────────────────────────────────────

function CraftsmanshipSpotlight() {
  const crafts = [
    { title: 'Block Printing', desc: 'Natural dyes on Chanderi silk by artisans of Bagh, MP', icon: '🖨️' },
    { title: 'Kantha Embroidery', desc: 'Running stitches that tell stories — a Bengal tradition', icon: '🧵' },
    { title: 'Banarasi Weaving', desc: 'Zari-interlaced silk from the looms of Varanasi', icon: '✨' },
    { title: 'Tussar Silk', desc: 'Wild silk spun in Jharkhand\'s forests, close to home', icon: '🌿' },
  ];

  return (
    <section className="py-16" aria-labelledby="craft-heading">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <p className="section-subtitle mb-3">From artisan to wardrobe</p>
          <h2 id="craft-heading" className="section-title">Our Craftsmanship</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {crafts.map((craft) => (
            <div key={craft.title} className="text-center p-6 bg-white rounded-brand shadow-soft hover:shadow-card transition-shadow group">
              <div className="text-4xl mb-4">{craft.icon}</div>
              <h3 className="font-serif text-lg text-charcoal mb-2">{craft.title}</h3>
              <p className="text-taupe text-sm leading-relaxed">{craft.desc}</p>
            </div>
          ))}
        </div>

        <Divider gold className="mb-8" />

        <div className="text-center">
          <Link to="/craftsmanship">
            <Button variant="ghost" rightIcon={<ArrowRight size={14} />}>
              Explore Our Craft Story
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4500, stopOnInteraction: false })]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-16 bg-cream-alt overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                ★ 5.0 Rating
              </span>
              <span className="text-xs text-taupe">Google & Justdial Verified Reviews</span>
            </div>
            <h2 id="testimonials-heading" className="section-title">Loved by Women Across India</h2>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={scrollPrev}
              className="p-2.5 rounded-full border border-secondary bg-white text-charcoal hover:bg-primary hover:text-white transition-colors"
              aria-label="Previous review"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={scrollNext}
              className="p-2.5 rounded-full border border-secondary bg-white text-charcoal hover:bg-primary hover:text-white transition-colors"
              aria-label="Next review"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="embla__slide flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="bg-white rounded-brand shadow-soft p-6 h-full flex flex-col justify-between border border-secondary/30 hover:border-primary/30 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Quote size={22} className="text-secondary-deep" />
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {(t as any).source || 'Verified Customer'}
                      </span>
                    </div>
                    <p className="text-charcoal text-sm leading-relaxed mb-6 italic font-serif">"{t.text}"</p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-secondary/20">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-secondary"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-charcoal text-sm font-semibold truncate">{t.name}</p>
                      <p className="text-taupe text-xs truncate">{t.city} · {t.product}</p>
                    </div>
                    <Rating value={t.rating} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Blog Teasers ─────────────────────────────────────────────────────────────

function BlogTeasers() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 lg:px-6" aria-labelledby="journal-heading">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-subtitle mb-2">Stories, tips & craft</p>
          <h2 id="journal-heading" className="section-title">From the Journal</h2>
        </div>
        <Link to="/blog">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
            View All Posts
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {blogPosts.slice(0, 3).map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group" aria-label={post.title}>
            <div className="overflow-hidden rounded-brand aspect-[4/3] mb-4">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="flex gap-2 mb-2 flex-wrap">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs text-primary font-sans uppercase tracking-wider">{tag}</span>
              ))}
            </div>
            <h3 className="font-serif text-xl text-charcoal group-hover:text-primary transition-colors leading-snug mb-2">
              {post.title}
            </h3>
            <p className="text-taupe text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-2 mt-3 text-primary text-sm font-sans opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Read More</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export function HomePage() {
  const [categoriesList, setCategoriesList] = useState<typeof categories>(categories);
  const [newArrivals, setNewArrivals] = useState<typeof products>(products.filter((p) => p.is_new_arrival));
  const [bestsellers, setBestsellers] = useState<typeof products>(products.filter((p) => p.is_bestseller));
  const [editsList, setEditsList] = useState<typeof curatedEdits>(curatedEdits);

  useEffect(() => {
    // 1. Fetch categories
    api.products.getCategories().then((res) => {
      if (res.status === 'success' && res.data?.categories) {
        setCategoriesList(res.data.categories);
      }
    });

    // 2. Fetch new arrivals
    api.products.list({ new_arrival: 1, limit: 8 }).then((res) => {
      if (res.status === 'success' && res.data?.products) {
        setNewArrivals(res.data.products);
      }
    });

    // 3. Fetch bestsellers
    api.products.list({ bestseller: 1, limit: 8 }).then((res) => {
      if (res.status === 'success' && res.data?.products) {
        setBestsellers(res.data.products);
      }
    });

    // 4. Fetch curated edits
    api.products.getCuratedEdits().then((res) => {
      if (res.status === 'success' && res.data?.curated_edits) {
        setEditsList(res.data.curated_edits);
      }
    });
  }, []);

  return (
    <main className="header-offset">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Shop by Category */}
      <CategoryGrid categoriesList={categoriesList} />

      {/* 3. New Arrivals */}
      <ProductCarousel
        title="New Arrivals"
        subtitle="Fresh from the atelier"
        products={newArrivals}
        viewAllHref="/new-arrivals"
      />

      {/* 4. Bestsellers */}
      <ProductCarousel
        title="Our Bestsellers"
        subtitle="Loved by thousands"
        products={bestsellers}
        viewAllHref="/collections"
      />

      {/* 5. Shop by Edit */}
      <ShopByEdit editsList={editsList} />

      {/* 6. Craftsmanship spotlight */}
      <CraftsmanshipSpotlight />

      {/* 7. Testimonials (Reviews) */}
      <Testimonials />

      {/* 8. Brand story (Our Story) */}
      <BrandStory />

      {/* 9. Blog teasers */}
      <BlogTeasers />

      {/* 10. Dedicated Homepage Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 my-12">
        <NewsletterSection source="homepage" className="rounded-2xl shadow-elevated" />
      </div>
    </main>
  );
}
