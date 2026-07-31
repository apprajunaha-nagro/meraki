import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, ChevronRight, MapPin, Truck, RefreshCw, Shield, Minus, Plus, Star, Scissors } from 'lucide-react';
import { Button, Badge, Rating, Breadcrumb, Accordion, Divider, Skeleton } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import { TailoringDrawer } from '@/components/product/TailoringDrawer';
import type { TailoringOptions } from '@/components/product/TailoringDrawer';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { products, reviews } from '@/lib/mockData';
import { formatINR, getDiscountPercent, getStockStatus } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ProductGallery({ images, productName }: { images: typeof products[0]['images']; productName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: 'y', dragFree: true });

  const selected = images[selectedIndex];

  return (
    <div className="flex gap-3 lg:sticky lg:top-[120px]">
      {/* Thumbnails */}
      <div className="hidden lg:block w-16 flex-shrink-0">
        <div className="embla overflow-hidden max-h-[540px]" ref={emblaRef}>
          <div className="embla__container flex-col gap-2">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedIndex(i)}
                className={`embla__slide flex-shrink-0 w-16 h-20 overflow-hidden rounded-brand border-2 transition-all duration-200 ${
                  i === selectedIndex ? 'border-primary' : 'border-transparent hover:border-secondary-deep'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main image */}
      <div className="flex-1">
        <div className="relative overflow-hidden rounded-brand bg-cream-alt aspect-[3/4] cursor-zoom-in group">
          <img
            src={selected?.image_url}
            alt={selected?.alt_text ?? productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        {/* Mobile thumbnails */}
        <div className="flex gap-2 mt-3 lg:hidden overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className={`flex-shrink-0 w-14 h-16 overflow-hidden rounded border-2 transition-all duration-200 ${
                i === selectedIndex ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Pincode Checker ──────────────────────────────────────────────────────────

function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<{ available: boolean; days: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const check = () => {
    if (pincode.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      setResult({ available: true, days: '5–7 business days' });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="border border-secondary rounded-brand p-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} className="text-taupe" />
        <span className="text-sm font-medium text-charcoal">Check Delivery</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter pincode"
          value={pincode}
          maxLength={6}
          onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '')); setResult(null); }}
          className="flex-1 px-3 py-2 text-sm border border-secondary-deep rounded-brand outline-none focus:border-primary"
        />
        <Button variant="outline" size="sm" onClick={check} loading={loading}>Check</Button>
      </div>
      {result && (
        <p className={`mt-2 text-xs flex items-center gap-1 ${result.available ? 'text-sage' : 'text-rust'}`}>
          <Truck size={12} />
          {result.available
            ? `Estimated delivery in ${result.days}. Free shipping!`
            : 'Delivery not available to this pincode.'}
        </p>
      )}
    </div>
  );
}

import { api } from '@/lib/api';

// ─── Product Page ─────────────────────────────────────────────────────────────

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [tailoringOpen, setTailoringOpen] = useState(false);
  const [tailoringOptions, setTailoringOptions] = useState<TailoringOptions | null>(null);
  const addToCart = useCartStore((s) => s.addItem);

  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?.id ?? 0));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.products.getDetails(slug).then((res) => {
      if (res.status === 'success' && res.data?.product) {
        setProduct(res.data.product);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (product) {
      const uniqueColors = [...new Set(product.variants.map((v: any) => v.color))];
      if (uniqueColors.length > 0 && uniqueColors[0]) {
        setSelectedColor(uniqueColors[0] as string);
      }
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center header-offset">
        <div className="text-center space-y-4">
          <p className="font-serif text-lg text-charcoal">Gathering product details...</p>
          <div className="flex justify-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center header-offset">
        <div className="text-center">
          <p className="font-serif text-2xl text-charcoal mb-4">Product not found</p>
          <Link to="/collections"><Button>Continue Shopping</Button></Link>
        </div>
      </div>
    );
  }

  const colors = [...new Map(product.variants.map((v: any) => [v.color, v])).values()] as any[];
  const sizesForColor = product.variants.filter((v) => v.color === selectedColor);
  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );
  const discount = getDiscountPercent(product.mrp, product.base_price);
  const stockStatus = selectedVariant ? getStockStatus(selectedVariant.stock_qty) : 'in-stock';

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, qty);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // In real app, navigate to checkout
  };

  const relatedProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const accordionItems = [
    {
      id: 'description',
      title: 'Product Details',
      content: <p className="whitespace-pre-line">{product.description}</p>,
    },
    {
      id: 'fabric',
      title: 'Fabric & Care',
      content: (
        <div className="space-y-2">
          <p><strong>Fabric:</strong> {product.fabric}</p>
          <p><strong>Care Instructions:</strong> {product.care_instructions}</p>
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & Returns',
      content: (
        <div className="space-y-2">
          <p>Free shipping on orders above ₹1,499. Standard delivery: 5–7 business days.</p>
          <p>Easy 7-day returns for unworn, unwashed items. Sarees & bridal pieces are final sale.</p>
          <Link to="/shipping-returns" className="text-primary hover:underline text-sm">Full policy →</Link>
        </div>
      ),
    },
    {
      id: 'size',
      title: 'Size & Fit',
      content: (
        <div className="space-y-2">
          <p>This style is available in standard Indian sizes XS–XL. If between sizes, we recommend sizing up.</p>
          <Link to="/size-guide" className="text-primary hover:underline text-sm">View full size chart →</Link>
        </div>
      ),
    },
  ];

  return (
    <div className="header-offset pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-6"
          items={[
            { label: 'Home', href: '/' },
            { label: product.category?.name ?? 'Collections', href: `/collections/${product.category?.slug}` },
            { label: product.name },
          ]}
        />

        {/* Main content */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">
          {/* Image gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Product info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {product.is_new_arrival && <Badge variant="new">New Arrival</Badge>}
              {product.is_bestseller && <Badge variant="bestseller">Bestseller</Badge>}
              {discount > 0 && <Badge variant="sale">{discount}% Off</Badge>}
            </div>

            <h1 className="font-serif text-3xl text-charcoal leading-tight mb-2">{product.name}</h1>
            <p className="text-taupe text-sm mb-3">{product.fabric}</p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <Rating value={product.rating} size="md" />
                <span className="text-sm text-taupe">
                  {product.rating} ({product.review_count} reviews)
                </span>
                <a href="#reviews" className="text-primary text-sm hover:underline">See all</a>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-sans font-bold text-2xl text-charcoal">{formatINR(product.base_price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-taupe text-base line-through">{formatINR(product.mrp)}</span>
                  <span className="text-rust text-sm font-medium">You save {formatINR(product.mrp - product.base_price)}</span>
                </>
              )}
            </div>
            <p className="text-xs text-taupe mb-6">Inclusive of all taxes. Free shipping on orders above ₹1,499.</p>

            <Divider className="mb-6" />

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-medium text-charcoal mb-3">
                  Colour: <span className="font-normal text-taupe">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((v) => (
                    <button
                      key={v.color}
                      onClick={() => { setSelectedColor(v.color); setSelectedSize(''); }}
                      title={v.color}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === v.color
                          ? 'border-primary ring-2 ring-primary/30 scale-110'
                          : 'border-white ring-1 ring-taupe/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: v.color_hex ?? '#ccc' }}
                      aria-label={v.color}
                      aria-pressed={selectedColor === v.color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-medium ${sizeError ? 'text-rust' : 'text-charcoal'}`}>
                  {sizeError ? 'Please select a size' : 'Size'}:
                  {selectedSize && <span className="font-normal text-taupe ml-1">{selectedSize}</span>}
                </p>
                <Link to="/size-guide" className="text-primary text-xs hover:underline flex items-center gap-0.5">
                  Size Guide <ChevronRight size={10} />
                </Link>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizesForColor.map((v) => {
                  const stockSt = getStockStatus(v.stock_qty);
                  return (
                    <button
                      key={v.size}
                      onClick={() => { setSelectedSize(v.size); setSizeError(false); }}
                      disabled={stockSt === 'out-of-stock'}
                      className={`min-w-[48px] h-10 px-3 text-sm font-medium rounded-brand border transition-all duration-200 ${
                        selectedSize === v.size
                          ? 'border-primary bg-primary/5 text-primary'
                          : stockSt === 'out-of-stock'
                          ? 'border-secondary text-taupe/40 line-through cursor-not-allowed'
                          : 'border-secondary-deep text-charcoal hover:border-primary hover:text-primary'
                      }`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && stockStatus === 'low-stock' && (
                <p className="mt-2 text-xs text-amber-600 font-medium">
                  Only {selectedVariant.stock_qty} left in this size!
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-sm font-medium text-charcoal">Qty:</p>
              <div className="flex items-center border border-secondary-deep rounded-brand overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-taupe hover:text-charcoal hover:bg-cream">
                  <Minus size={14} />
                </button>
                <span className="px-4 text-sm font-medium text-charcoal">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(selectedVariant?.stock_qty ?? 10, q + 1))}
                  className="px-3 py-2.5 text-taupe hover:text-charcoal hover:bg-cream"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Custom Tailoring Banner */}
            <div className="mb-6 p-4 bg-secondary/30 border border-primary/30 rounded-brand flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal">
                  <Scissors size={14} className="text-primary" />
                  <span>Custom Tailoring & Stitching Atelier</span>
                </div>
                <p className="text-[11px] text-taupe mt-0.5">
                  {tailoringOptions ? `Selected: ${tailoringOptions.neckline} (${tailoringOptions.sleeveLength})` : 'Customize necklines, sleeve length & exact measurements'}
                </p>
              </div>
              <Button
                variant="outline"
                size="xs"
                onClick={() => setTailoringOpen(true)}
                className="shrink-0 text-xs"
              >
                {tailoringOptions ? 'Edit Options' : 'Customize Fit'}
              </Button>
            </div>

            <TailoringDrawer
              isOpen={tailoringOpen}
              onClose={() => setTailoringOpen(false)}
              product={product}
              onSaveOptions={(opts) => setTailoringOptions(opts)}
            />

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-4">
              <Button fullWidth size="lg" onClick={handleAddToCart}>
                Add to Bag
              </Button>
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="flex-shrink-0 w-12 h-12 rounded-brand border border-secondary-deep flex items-center justify-center hover:border-primary transition-colors"
              >
                <Heart size={18} className={isWishlisted ? 'fill-primary text-primary' : 'text-charcoal'} />
              </button>
            </div>
            <Button fullWidth size="lg" variant="secondary" onClick={handleBuyNow} className="mb-6">
              Buy Now
            </Button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: <RefreshCw size={16} />, label: 'Easy Returns', sub: '7-day returns' },
                { icon: <Shield size={16} />, label: 'Secure Payment', sub: 'SSL encrypted' },
                { icon: <Truck size={16} />, label: 'Free Shipping', sub: 'On ₹1,499+' },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center text-center p-3 bg-cream rounded-brand">
                  <span className="text-primary mb-1">{badge.icon}</span>
                  <p className="text-xs font-medium text-charcoal">{badge.label}</p>
                  <p className="text-[10px] text-taupe">{badge.sub}</p>
                </div>
              ))}
            </div>

            {/* Pincode checker */}
            <PincodeChecker />

            {/* Accordion tabs */}
            <div className="mt-6">
              <Accordion items={accordionItems} />
            </div>

            {/* Share */}
            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-secondary">
              <Share2 size={14} className="text-taupe" />
              <span className="text-sm text-taupe">Share:</span>
              {['WhatsApp', 'Instagram', 'Copy link'].map((s) => (
                <button key={s} className="text-xs text-taupe hover:text-primary transition-colors">{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-16 pt-12 border-t border-secondary">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl text-charcoal">Customer Reviews</h2>
              {product.rating && (
                <div className="flex items-center gap-2 mt-1">
                  <Rating value={product.rating} size="md" />
                  <span className="text-taupe text-sm">{product.rating} out of 5 · {product.review_count} reviews</span>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" leftIcon={<Star size={14} />}>Write a Review</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {(product.reviews || []).map((review: any) => (
              <div key={review.id} className="bg-white rounded-brand shadow-soft p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-charcoal text-sm">{review.user_name}</p>
                    <Rating value={review.rating} size="sm" className="mt-0.5" />
                  </div>
                  <span className="text-xs text-taupe">{new Date(review.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <p className="text-sm text-taupe leading-relaxed">{review.comment}</p>
              </div>
            ))}

            {(product.reviews || []).length === 0 && (
              <div className="col-span-2 text-center py-8 text-taupe">
                <Star size={32} className="mx-auto mb-3 text-secondary-deep" strokeWidth={1} />
                <p>No reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-secondary">
            <h2 className="font-serif text-2xl text-charcoal mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
