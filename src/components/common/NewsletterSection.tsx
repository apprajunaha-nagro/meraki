import React, { useState } from 'react';
import { Sparkles, Check, Copy, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

interface NewsletterSectionProps {
  source?: 'footer' | 'page' | 'popup' | 'homepage';
  className?: string;
}

export function NewsletterSection({ source = 'footer', className = '' }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wantsSMS, setWantsSMS] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Email format validation helper
  const validateEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val.trim());
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setStatus('loading');

    // Retrieve existing subscribers database
    try {
      const existingStr = localStorage.getItem('meraki_newsletter_subscribers');
      const existingList = existingStr ? JSON.parse(existingStr) : [];

      // Check duplicate subscriber
      const isDuplicate = existingList.some((sub: any) => sub.email.toLowerCase() === email.trim().toLowerCase());
      if (isDuplicate) {
        setStatus('error');
        setErrorMessage('You are already a valued member of Meraki\'s Inner Circle! Use coupon WELCOME10.');
        return;
      }

      const newSubscriber = {
        id: Date.now(),
        email: email.trim().toLowerCase(),
        phone: wantsSMS ? phone.trim() : null,
        source,
        created_at: new Date().toISOString(),
      };

      existingList.push(newSubscriber);
      localStorage.setItem('meraki_newsletter_subscribers', JSON.stringify(existingList));
      localStorage.setItem('meraki_newsletter_subscribed', 'true');

      // Success state reveal
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WELCOME10');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r from-[#5E3747] via-primary to-[#7A4B5D] text-white py-14 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Decorative ambient glow & pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-gold/30 text-gold text-xs font-sans font-medium uppercase tracking-[0.15em] mb-4 shadow-sm">
          <Sparkles size={13} className="animate-pulse" />
          <span>Exclusive Member Privileges</span>
        </div>

        {/* Main Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream font-normal leading-tight mb-3">
          Join Meraki's Inner Circle
        </h2>

        {/* Incentive Subtext */}
        <p className="font-sans text-cream/90 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light leading-relaxed">
          Unlock <strong className="font-semibold text-gold">10% off your first order</strong> and receive private invitations to new artisan drops, seasonal edits, and VIP sales.
        </p>

        {/* Interactive Form or Success Banner */}
        {status === 'success' ? (
          <div className="bg-white/15 backdrop-blur-md border border-gold/40 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto text-center animate-scale-in shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-gold/20 text-gold mx-auto flex items-center justify-center mb-3">
              <Check size={24} />
            </div>
            <h3 className="font-serif text-2xl text-cream mb-1">Welcome to the Family!</h3>
            <p className="text-xs text-cream/80 mb-4 font-sans">
              Your 10% discount code is active. Use it during checkout:
            </p>

            {/* Promo Code Box */}
            <div className="flex items-center justify-between bg-charcoal/80 border border-gold/50 rounded-brand px-4 py-3 max-w-xs mx-auto mb-4">
              <span className="font-mono text-lg font-bold text-gold tracking-wider">WELCOME10</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-cream hover:text-gold transition-colors font-sans px-2.5 py-1 rounded bg-white/10"
              >
                {copiedCode ? <Check size={13} className="text-sage" /> : <Copy size={13} />}
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[11px] text-cream/60 font-sans">
              Discount applied automatically. We've also sent your welcome guide to <span className="underline text-cream">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4 max-w-xl mx-auto">
            {/* Input & Button Container */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/50 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/10 border border-white/25 text-white placeholder-white/60 text-sm outline-none transition-all focus:border-gold focus:bg-white/15 focus:ring-2 focus:ring-gold/30 min-h-[48px]"
                  aria-label="Email address for newsletter"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="min-h-[48px] rounded-full px-7 text-charcoal bg-gold hover:bg-gold-light font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0 active:scale-95 border-none"
              >
                {status === 'loading' ? (
                  <span>Joining...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    Claim 10% Off <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </div>

            {/* Optional VIP SMS Checkbox */}
            <div className="flex items-center justify-center gap-2 text-xs text-cream/80 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={wantsSMS}
                  onChange={(e) => setWantsSMS(e.target.checked)}
                  className="accent-gold rounded w-3.5 h-3.5 cursor-pointer"
                />
                <span>Include VIP SMS previews for flash sales</span>
              </label>
            </div>

            {wantsSMS && (
              <div className="max-w-xs mx-auto animate-fade-in">
                <input
                  type="tel"
                  placeholder="Your Mobile Phone (Optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs text-center outline-none focus:border-gold"
                />
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="bg-rust/20 border border-rust/40 text-cream text-xs px-4 py-2.5 rounded-brand max-w-md mx-auto animate-shake">
                {errorMessage}
              </div>
            )}

            {/* Trust Micro-Copy */}
            <p className="flex items-center justify-center gap-1.5 text-xs text-cream/60 pt-2 font-sans">
              <ShieldCheck size={14} className="text-gold/80" />
              <span>No spam. Only handcrafted elegance. Unsubscribe anytime.</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
