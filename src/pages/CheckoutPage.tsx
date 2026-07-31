import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, CreditCard, Truck, FileText } from 'lucide-react';
import { Button, Input, Select, Divider } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { formatINR } from '@/lib/utils';
import { api } from '@/lib/api';

type Step = 'address' | 'shipping' | 'payment' | 'review';

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'address', label: 'Address', icon: <FileText size={14} /> },
  { id: 'shipping', label: 'Shipping', icon: <Truck size={14} /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard size={14} /> },
  { id: 'review', label: 'Review', icon: <Check size={14} /> },
];

const STEP_ORDER: Step[] = ['address', 'shipping', 'payment', 'review'];

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEP_ORDER.indexOf(current);
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, i) => {
        const isComplete = i < currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                ${isComplete ? 'bg-primary text-white' : isCurrent ? 'bg-primary/10 text-primary border-2 border-primary' : 'bg-cream-alt text-taupe'}`}>
                {isComplete ? <Check size={16} /> : step.icon}
              </div>
              <p className={`text-xs mt-1.5 font-sans ${isCurrent ? 'text-primary font-medium' : 'text-taupe'}`}>{step.label}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-16 lg:w-24 h-0.5 mb-5 mx-2 transition-colors ${i < currentIdx ? 'bg-primary' : 'bg-secondary'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const stateOptions = [
  { value: '', label: 'Select state' },
  { value: 'Jharkhand', label: 'Jharkhand' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Gujarat', label: 'Gujarat' },
];

export function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<Step>('address');
  const [address, setAddress] = useState({
    name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  });
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { items, getSubtotal, getDiscount, getTax, getTotal, clearCart, coupon } = useCartStore();
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const tax = getTax();
  const shipping = shippingMethod === 'express' ? 199 : (subtotal - discount >= 1499 ? 0 : 99);
  const total = subtotal - discount + shipping + tax;

  const next = async () => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[idx + 1]);
      setErrorMessage('');
    } else {
      // Place order step
      setSubmitting(true);
      setErrorMessage('');
      
      const orderPayload = {
        guest_email: address.email,
        items: items.map((i) => ({
          product_id: i.product.id,
          variant_id: i.variant.id,
          qty: i.qty,
        })),
        shipping_details: {
          name: address.name,
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone,
        },
        coupon_code: coupon?.code || undefined,
      };

      try {
        if (paymentMethod === 'cod') {
          // COD Flow
          const res = await api.checkout.createCodOrder(orderPayload);
          if (res.status === 'success' && res.data) {
            clearCart();
            navigate(`/order-confirmation?order=${res.data.order_number}`);
          } else {
            setErrorMessage(res.message || 'Failed to place COD order.');
          }
        } else {
          // Razorpay Flow
          const res = await api.checkout.createRazorpayOrder(orderPayload);
          if (res.status === 'success' && res.data) {
            const options = {
              key: res.data.razorpay_key_id,
              amount: res.data.amount,
              currency: res.data.currency,
              name: 'Meraki by Kritika',
              description: 'Apparel Purchase',
              order_id: res.data.razorpay_order_id,
              handler: async function (response: any) {
                try {
                  const verifyRes = await api.checkout.verifyPayment({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                  });
                  if (verifyRes.status === 'success') {
                    clearCart();
                    navigate(`/order-confirmation?order=${res.data.order_number || res.data.receipt || 'MBK'}`);
                  } else {
                    setErrorMessage('Payment verification failed. Please contact support.');
                  }
                } catch (err: any) {
                  setErrorMessage('Verification error: ' + (err.message || 'Verification failed.'));
                }
              },
              prefill: {
                name: address.name,
                email: address.email,
                contact: address.phone,
              },
              theme: {
                color: '#9B7A93', // Primary Mauve
              },
              modal: {
                ondismiss: function () {
                  setSubmitting(false);
                }
              }
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          } else {
            setErrorMessage(res.message || 'Failed to initiate online payment.');
            setSubmitting(false);
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'An error occurred during checkout. Please try again.');
        setSubmitting(false);
      }
    }
  };

  const back = () => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEP_ORDER[idx - 1]);
      setErrorMessage('');
    }
  };

  return (
    <div className="header-offset pb-16 bg-cream-alt min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-charcoal">Checkout</h1>
        </div>

        <StepIndicator current={currentStep} />

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Step content */}
          <div className="bg-white rounded-brand shadow-soft p-6">
            {/* Step 1: Address */}
            {currentStep === 'address' && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl text-charcoal mb-5">Contact & Delivery Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name" placeholder="Ananya Krishnan" value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })} required />
                  <Input label="Email" type="email" placeholder="you@email.com" value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })} required />
                </div>
                <Input label="Phone Number" type="tel" placeholder="+91 9876543210" value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                <Input label="Address Line 1" placeholder="House / Flat No, Street" value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })} required />
                <Input label="Address Line 2 (optional)" placeholder="Area, Landmark" value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input label="City" placeholder="Dhanbad" value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                  <Select label="State" options={stateOptions} value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                  <Input label="Pincode" placeholder="826001" maxLength={6} value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })} required />
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 'shipping' && (
              <div>
                <h2 className="font-serif text-xl text-charcoal mb-5">Shipping Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'standard', label: 'Standard Delivery', sub: '5–7 business days', price: subtotal - discount >= 1499 ? 'Free' : '₹99' },
                    { id: 'express', label: 'Express Delivery', sub: '2–3 business days', price: '₹199' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 border rounded-brand cursor-pointer transition-all ${
                        shippingMethod === method.id ? 'border-primary bg-primary/5' : 'border-secondary-deep hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={shippingMethod === method.id as 'standard' | 'express'}
                          onChange={() => setShippingMethod(method.id as 'standard' | 'express')}
                          className="accent-primary"
                        />
                        <div>
                          <p className="font-medium text-charcoal text-sm">{method.label}</p>
                          <p className="text-taupe text-xs">{method.sub}</p>
                        </div>
                      </div>
                      <span className={`font-semibold text-sm ${method.price === 'Free' ? 'text-sage' : 'text-charcoal'}`}>
                        {method.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 'payment' && (
              <div>
                <h2 className="font-serif text-xl text-charcoal mb-5">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'razorpay', label: 'Pay Online', sub: 'Cards, UPI, Net Banking, Wallets — powered by Razorpay', icon: '🔒' },
                    { id: 'cod', label: 'Cash on Delivery', sub: 'Available on orders up to ₹10,000', icon: '💵' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border rounded-brand cursor-pointer transition-all ${
                        paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-secondary-deep hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id as 'razorpay' | 'cod'}
                        onChange={() => setPaymentMethod(method.id as 'razorpay' | 'cod')}
                        className="accent-primary"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-medium text-charcoal text-sm">{method.label}</p>
                        <p className="text-taupe text-xs">{method.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {paymentMethod === 'razorpay' && (
                  <div className="mt-5 p-4 bg-sage/10 rounded-brand text-sm text-charcoal">
                    <p className="font-medium mb-1">Secure Payment</p>
                    <p className="text-taupe">Clicking "Place Order" will open the Razorpay payment window. Your card details are never stored on our servers.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 'review' && (
              <div>
                <h2 className="font-serif text-xl text-charcoal mb-5">Review Your Order</h2>

                {/* Address summary */}
                <div className="bg-cream rounded-brand p-4 mb-4">
                  <p className="text-xs text-taupe uppercase tracking-wider mb-2">Delivering to</p>
                  <p className="text-sm font-medium text-charcoal">{address.name}</p>
                  <p className="text-sm text-taupe">{address.line1}{address.line2 && `, ${address.line2}`}</p>
                  <p className="text-sm text-taupe">{address.city}, {address.state} — {address.pincode}</p>
                  <p className="text-sm text-taupe">{address.phone}</p>
                </div>

                {/* Items */}
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.variant.id} className="flex gap-3">
                      <img src={item.product.images[0]?.image_url} alt={item.product.name}
                        className="w-16 h-20 object-cover rounded-brand" loading="lazy" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-charcoal">{item.product.name}</p>
                        <p className="text-xs text-taupe">{item.variant.color} · {item.variant.size} · Qty {item.qty}</p>
                        <p className="text-sm font-semibold text-charcoal mt-1">
                          {formatINR((item.variant.price_override ?? item.product.base_price) * item.qty)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="text-rust text-sm bg-rust/10 border border-rust/20 p-3 rounded-brand mt-6">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep !== 'address' && (
                <Button variant="ghost" onClick={back} disabled={submitting}>Back</Button>
              )}
              <Button 
                fullWidth 
                onClick={next} 
                loading={submitting} 
                disabled={submitting || items.length === 0}
                rightIcon={!submitting && <ChevronRight size={16} />}
              >
                {currentStep === 'review'
                  ? paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'
                  : 'Continue'}
              </Button>
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="bg-white rounded-brand shadow-soft p-5 h-fit">
            <h3 className="font-serif text-lg text-charcoal mb-4">Order Summary</h3>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li key={item.variant.id} className="flex gap-3 items-center">
                  <div className="relative flex-shrink-0">
                    <img src={item.product.images[0]?.image_url} alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-brand" loading="lazy" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-charcoal line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-taupe">{item.variant.size}</p>
                  </div>
                  <p className="text-xs font-semibold text-charcoal flex-shrink-0">
                    {formatINR((item.variant.price_override ?? item.product.base_price) * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
            <Divider className="my-3" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-taupe"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-sage">
                  <span>Discount ({coupon?.code})</span><span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-taupe">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-sage">Free</span> : formatINR(shipping)}</span>
              </div>
              <div className="flex justify-between text-taupe"><span>GST (5%)</span><span>{formatINR(tax)}</span></div>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between font-bold text-charcoal text-base">
              <span>Total</span><span>{formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderConfirmationPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const orderNumber = searchParams.get('order') ?? 'MBK00000000';
  return (
    <div className="header-offset min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-sage" />
        </div>
        <h1 className="font-serif text-4xl text-charcoal mb-3">Order Placed! 🎉</h1>
        <p className="text-taupe mb-2">Thank you for shopping with Meraki by Kritika.</p>
        <p className="text-charcoal font-medium mb-1">Order #{orderNumber}</p>
        <p className="text-taupe text-sm mb-8">
          You'll receive a confirmation email with tracking details within 24 hours. Your order will arrive in 5–7 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.href = '/account/orders'}>Track My Order</Button>
          <Button onClick={() => window.location.href = '/collections'}>Continue Shopping</Button>
        </div>
      </div>
    </div>
  );
}
