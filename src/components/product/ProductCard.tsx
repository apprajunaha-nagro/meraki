import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { cn, formatINR, getDiscountPercent, getStockStatus } from '@/lib/utils';
import { Badge, Rating, Button } from '@/components/ui';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, className, onQuickView }: ProductCardProps) {
  const [hoveredImg, setHoveredImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const addToCart = useCartStore((s) => s.addItem);

  const primaryImage = product.images[hoveredImg] ?? product.images[0];
  const secondImage = product.images[1];
  const discount = getDiscountPercent(product.mrp, product.base_price);
  const hasDiscount = discount > 0;
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock_qty, 0);
  const stockStatus = getStockStatus(totalStock);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add first available variant
    const firstAvailable = product.variants.find((v) => v.stock_qty > 0);
    if (!firstAvailable) return;
    addToCart(product, firstAvailable, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <div className={cn('group relative', className)}>
      <Link to={`/product/${product.slug}`} className="block" aria-label={product.name}>
        {/* Image container */}
        <div className="relative overflow-hidden rounded-brand bg-cream-alt aspect-product transition-all duration-300 group-hover:shadow-[0_12px_28px_rgba(140,91,110,0.18),_0_4px_12px_rgba(199,169,107,0.12)] group-hover:translate-y-[-2.5px]">
          {/* Primary image */}
          <img
            src={primaryImage?.image_url}
            alt={primaryImage?.alt_text ?? product.name}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-all duration-500',
              secondImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            )}
            loading="lazy"
          />
          {/* Hover image */}
          {secondImage && (
            <img
              src={secondImage.image_url}
              alt={secondImage.alt_text}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
          )}

          {/* Action buttons (always visible on mobile, hover reveal on desktop) */}
          <div className={cn(
            'absolute top-3 right-3 flex flex-col gap-2 z-10',
            'transition-all duration-300',
            'opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:translate-x-2 lg:group-hover:translate-x-0'
          )}>
            <button
              onClick={handleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-white/90 backdrop-blur-xs shadow-card flex items-center justify-center hover:bg-primary hover:text-white active:scale-110 transition-all duration-200"
            >
              <Heart
                size={18}
                className={cn('transition-colors', isWishlisted ? 'fill-primary text-primary' : 'text-charcoal')}
              />
            </button>
            {onQuickView && (
              <button
                onClick={handleQuickView}
                aria-label="Quick view"
                className="w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center hover:bg-primary hover:text-white active:scale-90 transition-all duration-200"
              >
                <Eye size={16} className="text-charcoal hover:text-white transition-colors" />
              </button>
            )}
          </div>

          {/* Quick add overlay */}
          <div className={cn(
            'absolute bottom-0 left-0 right-0 transition-all duration-300',
            'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          )}>
            <button
              onClick={handleQuickAdd}
              disabled={stockStatus === 'out-of-stock'}
              className={cn(
                'w-full py-3 text-sm font-sans font-medium transition-all duration-200 active:scale-95',
                'flex items-center justify-center gap-2',
                stockStatus === 'out-of-stock'
                  ? 'bg-taupe/70 text-white cursor-not-allowed'
                  : addedToCart
                  ? 'bg-sage text-white'
                  : 'bg-charcoal text-white hover:bg-primary'
              )}
            >
              <ShoppingBag size={14} />
              {stockStatus === 'out-of-stock' ? 'Sold Out' : addedToCart ? 'Added to Bag!' : 'Quick Add'}
            </button>
          </div>
        </div>

        {/* Product info (Badges now positioned HERE below photos) */}
        <div className="mt-3 px-1">
          {/* Badges Bar (Cleanly positioned below photo, NOT on photo) */}
          {(product.is_new_arrival || product.is_bestseller || hasDiscount || stockStatus === 'out-of-stock' || stockStatus === 'low-stock') && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {product.is_new_arrival && <Badge variant="new">New</Badge>}
              {product.is_bestseller && <Badge variant="bestseller">Bestseller</Badge>}
              {hasDiscount && <Badge variant="sale">{discount}% Off</Badge>}
              {stockStatus === 'out-of-stock' && <Badge variant="sold-out">Sold Out</Badge>}
              {stockStatus === 'low-stock' && <Badge variant="low-stock">Only {totalStock} left</Badge>}
            </div>
          )}
          {/* Color swatches mini */}
          {product.variants.some((v) => v.color_hex) && (
            <div className="flex gap-1.5 mb-2">
              {[...new Map(product.variants.map((v) => [v.color, v])).values()]
                .slice(0, 4)
                .map((v) => (
                  <span
                    key={v.color}
                    className="w-3 h-3 rounded-full border border-white ring-1 ring-taupe/20"
                    style={{ backgroundColor: v.color_hex }}
                    title={v.color}
                  />
                ))}
            </div>
          )}

          <h3 className="font-sans text-sm font-medium text-charcoal group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {product.rating && (
            <div className="flex items-center gap-1.5 mt-1">
              <Rating value={product.rating} size="sm" />
              <span className="text-xs text-taupe">({product.review_count})</span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-sans font-semibold text-charcoal text-sm">{formatINR(product.base_price)}</span>
            {hasDiscount && (
              <>
                <span className="text-taupe text-xs line-through">{formatINR(product.mrp)}</span>
                <span className="text-rust text-xs font-medium">({discount}% off)</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
