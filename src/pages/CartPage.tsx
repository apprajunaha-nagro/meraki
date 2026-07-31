import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button, Breadcrumb, Divider } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { formatINR } from '@/lib/utils';
import { coupons } from '@/lib/mockData';

export function CartPage() {
  const {
    items, coupon, applyCoupon, removeCoupon, removeItem, updateQty,
    getSubtotal, getDiscount, getShipping, getTax, getTotal,
  } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();
  const freeShippingLeft = Math.max(0, 1499 - (subtotal - discount));

  const handleApplyCoupon = () => {
    const found = coupons.find((c) => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.active);
    if (!found) { setCouponError('Invalid or expired coupon code.'); return; }
    if (found.min_cart_value && subtotal < found.min_cart_value) {
      setCouponError(`Min cart value of ${formatINR(found.min_cart_value)} required.`); return;
    }
    applyCoupon(found);
    setCouponError('');
    setCouponCode('');
  };

  return (
    <div className="header-offset pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} className="mb-6" />
        <h1 className="font-serif text-4xl text-charcoal mb-8">Your Bag</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="text-secondary-deep mx-auto mb-4" strokeWidth={1} />
            <p className="font-serif text-2xl text-charcoal mb-2">Your bag is empty</p>
            <p className="text-taupe mb-6">Add some beautiful pieces to get started</p>
            <Link to="/collections"><Button>Shop Now</Button></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Cart items */}
            <div>
              {freeShippingLeft > 0 && (
                <div className="bg-secondary-tint rounded-brand p-4 mb-6">
                  <p className="text-sm text-charcoal mb-1.5">
                    Add <span className="font-semibold text-primary">{formatINR(freeShippingLeft)}</span> more for free shipping!
                  </p>
                  <div className="h-2 bg-secondary-deep/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, ((1499 - freeShippingLeft) / 1499) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <ul className="space-y-4 divide-y divide-secondary">
                {items.map((item) => {
                  const price = item.variant.price_override ?? item.product.base_price;
                  return (
                    <li key={item.variant.id} className="pt-4 first:pt-0 flex gap-4">
                      <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                        <img
                          src={item.product.images[0]?.image_url}
                          alt={item.product.images[0]?.alt_text}
                          className="w-28 h-36 lg:w-32 lg:h-40 object-cover rounded-brand"
                          loading="lazy"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <Link to={`/product/${item.product.slug}`}>
                            <h3 className="font-sans font-medium text-charcoal hover:text-primary transition-colors">{item.product.name}</h3>
                          </Link>
                          <button onClick={() => removeItem(item.variant.id)} className="text-taupe hover:text-rust transition-colors ml-2">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-taupe mt-1">{item.variant.color} · Size {item.variant.size}</p>
                        <p className="text-sm text-taupe">{item.product.fabric}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-secondary-deep rounded-brand overflow-hidden">
                            <button onClick={() => updateQty(item.variant.id, item.qty - 1)} className="px-3 py-2 text-taupe hover:text-charcoal hover:bg-cream">
                              <Minus size={12} />
                            </button>
                            <span className="px-4 text-sm font-medium">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.variant.id, item.qty + 1)}
                              disabled={item.qty >= item.variant.stock_qty}
                              className="px-3 py-2 text-taupe hover:text-charcoal hover:bg-cream disabled:opacity-40"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-semibold text-charcoal">{formatINR(price * item.qty)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-brand shadow-soft p-6 h-fit">
              <h2 className="font-serif text-xl text-charcoal mb-5">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-5">
                {coupon ? (
                  <div className="flex items-center justify-between bg-sage/10 text-sage rounded-brand px-3 py-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <Tag size={14} />
                      <span className="font-medium">{coupon.code}</span>
                      <span className="text-taupe">{coupon.description}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-rust text-xs">Remove</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon or gift card code"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                        className="flex-1 px-3 py-2.5 text-sm border border-secondary-deep rounded-brand outline-none focus:border-primary"
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <Button variant="outline" size="sm" onClick={handleApplyCoupon}>Apply</Button>
                    </div>
                    {couponError && <p className="text-xs text-rust">{couponError}</p>}
                    <p className="text-xs text-taupe">Try: WELCOME10 or FESTIVE500</p>
                  </div>
                )}
              </div>

              <Divider className="mb-5" />

              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex justify-between text-taupe"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-sage"><span>Discount</span><span>-{formatINR(discount)}</span></div>}
                <div className="flex justify-between text-taupe">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-sage font-medium">FREE</span> : formatINR(shipping)}</span>
                </div>
                <div className="flex justify-between text-taupe"><span>GST (5%)</span><span>{formatINR(tax)}</span></div>
              </div>

              <Divider className="mb-4" />
              <div className="flex justify-between font-semibold text-charcoal text-lg mb-6">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>

              <Button fullWidth size="lg" onClick={() => navigate('/checkout')} rightIcon={<ArrowRight size={16} />}>
                Proceed to Checkout
              </Button>

              <p className="text-center text-xs text-taupe mt-4">🔒 Secure checkout — powered by Razorpay</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
