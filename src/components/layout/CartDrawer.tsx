import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Drawer } from '@/components/ui/Overlays';
import { Button, Skeleton } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { formatINR } from '@/lib/utils';
import { useState } from 'react';
import { coupons } from '@/lib/mockData';

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQty,
    coupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();
  const freeShippingLeft = Math.max(0, 1499 - (subtotal - discount));

  const handleApplyCoupon = () => {
    const found = coupons.find((c) => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.active);
    if (!found) {
      setCouponError('Invalid or expired coupon code.');
      return;
    }
    if (found.min_cart_value && subtotal < found.min_cart_value) {
      setCouponError(`Minimum cart value of ${formatINR(found.min_cart_value)} required.`);
      return;
    }
    applyCoupon(found);
    setCouponError('');
    setCouponCode('');
  };

  const drawerFooter = items.length > 0 ? (
    <div className="space-y-3">
      {/* Order summary */}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-taupe">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sage">
            <span>Discount ({coupon?.code})</span>
            <span>-{formatINR(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-taupe">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-sage">Free</span> : formatINR(shipping)}</span>
        </div>
        <div className="flex justify-between text-taupe">
          <span>GST (5%)</span>
          <span>{formatINR(tax)}</span>
        </div>
        <div className="flex justify-between font-semibold text-charcoal text-base pt-1.5 border-t border-secondary">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
      </div>
      <Link to="/checkout" onClick={closeDrawer}>
        <Button fullWidth size="lg" rightIcon={<ArrowRight size={16} />}>
          Proceed to Checkout
        </Button>
      </Link>
      <Link to="/cart" onClick={closeDrawer}>
        <Button fullWidth variant="ghost" size="sm">View Full Cart</Button>
      </Link>
    </div>
  ) : undefined;

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title={`Your Bag (${items.length})`}
      footer={drawerFooter}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center px-8">
          <ShoppingBag size={48} className="text-secondary-deep mb-4" strokeWidth={1} />
          <p className="font-serif text-xl text-charcoal mb-2">Your bag is empty</p>
          <p className="text-sm text-taupe mb-6">Add something beautiful to get started</p>
          <Link to="/collections" onClick={closeDrawer}>
            <Button variant="outline">Shop Now</Button>
          </Link>
        </div>
      ) : (
        <div className="p-5 space-y-4">
          {/* Free shipping bar */}
          {freeShippingLeft > 0 && (
            <div className="bg-secondary-tint rounded-brand p-3">
              <p className="text-xs text-charcoal mb-1.5">
                Add <span className="font-semibold text-primary">{formatINR(freeShippingLeft)}</span> more for free shipping
              </p>
              <div className="h-1.5 bg-secondary-deep/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((1499 - freeShippingLeft) / 1499) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart items */}
          <ul className="space-y-4 divide-y divide-secondary">
            {items.map((item) => {
              const price = item.variant.price_override ?? item.product.base_price;
              return (
                <li key={item.variant.id} className="pt-4 first:pt-0 flex gap-3">
                  <Link to={`/product/${item.product.slug}`} onClick={closeDrawer} className="flex-shrink-0">
                    <img
                      src={item.product.images[0]?.image_url}
                      alt={item.product.images[0]?.alt_text}
                      className="w-20 h-24 object-cover rounded-brand"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={closeDrawer}
                      className="font-sans text-sm font-medium text-charcoal hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-taupe mt-0.5">
                      {item.variant.color} · {item.variant.size}
                    </p>
                    <p className="font-semibold text-charcoal text-sm mt-1">{formatINR(price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      {/* Qty control */}
                      <div className="flex items-center border border-secondary-deep rounded-brand overflow-hidden">
                        <button
                          onClick={() => updateQty(item.variant.id, item.qty - 1)}
                          className="min-w-[36px] min-h-[36px] flex items-center justify-center p-2 text-taupe hover:text-charcoal hover:bg-cream transition-colors active:bg-secondary/30"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-medium text-charcoal">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.variant.id, item.qty + 1)}
                          disabled={item.qty >= item.variant.stock_qty}
                          className="min-w-[36px] min-h-[36px] flex items-center justify-center p-2 text-taupe hover:text-charcoal hover:bg-cream transition-colors disabled:opacity-40 active:bg-secondary/30"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variant.id)}
                        className="text-taupe hover:text-rust transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center p-2 rounded-full hover:bg-rust/10"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Coupon input */}
          <div className="border border-secondary rounded-brand p-3 space-y-2">
            {coupon ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sage text-sm">
                  <Tag size={14} />
                  <span className="font-medium">{coupon.code}</span>
                  <span className="text-taupe">applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rust hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon / Gift card code"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                    className="flex-1 text-sm px-3 py-2 border border-secondary-deep rounded-brand outline-none focus:border-primary"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <Button variant="outline" size="sm" onClick={handleApplyCoupon}>Apply</Button>
                </div>
                {couponError && <p className="text-xs text-rust">{couponError}</p>}
              </>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
