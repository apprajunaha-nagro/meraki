import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Sparkles, Check, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui';

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Skip popup on checkout and cart pages
    if (location.pathname.startsWith('/checkout') || location.pathname.startsWith('/cart')) {
      return;
    }

    // Check if user already dismissed or subscribed
    const isSubscribed = localStorage.getItem('meraki_newsletter_subscribed');
    const isDismissed = localStorage.getItem('meraki_newsletter_dismissed');

    if (isSubscribed || isDismissed) {
      return;
    }

    // Timed popup trigger after 6 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 6000);

    // Mouse exit-intent trigger for desktop screens
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true);
      }
    };

    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [location.pathname]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('meraki_newsletter_dismissed', 'true');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !re.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const existingStr = localStorage.getItem('meraki_newsletter_subscribers');
      const existingList = existingStr ? JSON.parse(existingStr) : [];

      const isDuplicate = existingList.some((sub: any) => sub.email.toLowerCase() === email.trim().toLowerCase());
      if (isDuplicate) {
        setStatus('error');
        setErrorMessage('You are already subscribed! Use coupon WELCOME10.');
        return;
      }

      existingList.push({
        id: Date.now(),
        email: email.trim().toLowerCase(),
        source: 'popup',
        created_at: new Date().toISOString(),
      });

      localStorage.setItem('meraki_newsletter_subscribers', JSON.stringify(existingList));
      localStorage.setItem('meraki_newsletter_subscribed', 'true');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage('An unexpected error occurred.');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-cream rounded-2xl shadow-elevated overflow-hidden border border-secondary animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-charcoal/10 hover:bg-charcoal/20 text-charcoal flex items-center justify-center transition-colors"
          aria-label="Close offer"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-1">
          {/* Main Content */}
          <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-secondary-tint to-cream">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider mb-3">
              <Sparkles size={12} className="animate-pulse" />
              <span>VIP Privilege</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mb-2">
              Unlock 10% Off Your Order
            </h3>

            <p className="text-xs sm:text-sm text-taupe max-w-xs mx-auto mb-6">
              Subscribe to Meraki's journal for secret flash sales, early access to new collections, & private style guides.
            </p>

            {status === 'success' ? (
              <div className="bg-white rounded-xl p-5 border border-sage/30 text-center animate-fade-in shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sage/20 text-sage mx-auto flex items-center justify-center mb-2">
                  <Check size={20} />
                </div>
                <p className="font-serif text-lg text-charcoal mb-1">Your Discount Code</p>
                <div className="flex items-center justify-between bg-cream-alt border border-secondary px-3 py-2 rounded-brand max-w-xs mx-auto mb-2">
                  <span className="font-mono font-bold text-primary text-base tracking-wider">WELCOME10</span>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    {copiedCode ? <Check size={12} className="text-sage" /> : <Copy size={12} />}
                    <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <Button variant="primary" size="sm" onClick={handleClose} className="w-full mt-2">
                  Start Shopping Now
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-white border border-secondary-deep text-charcoal placeholder-taupe text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <Button type="submit" variant="primary" size="lg" className="w-full rounded-full py-3">
                  {status === 'loading' ? 'Processing...' : 'Claim My 10% Off'}
                </Button>

                {status === 'error' && (
                  <p className="text-xs text-rust">{errorMessage}</p>
                )}

                <p className="text-[11px] text-taupe flex items-center justify-center gap-1 pt-1">
                  <ShieldCheck size={13} className="text-sage" />
                  <span>No spam. Unsubscribe with 1 click anytime.</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
