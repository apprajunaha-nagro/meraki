import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, Copy, ShieldCheck, Mail, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui';

interface NewsletterSectionProps {
  source?: 'footer' | 'page' | 'popup' | 'homepage';
  className?: string;
}

// Curated fashion images from the public folder for the collage panel
const FASHION_IMAGES = [
  { src: '/lehenga-1.jpg',            alt: 'Meraki Lehenga',        label: 'Lehengas' },
  { src: '/coord-set-1.png',          alt: 'Meraki Co-ord Set',     label: 'Co-ord Sets' },
  { src: '/maxi-dress-1.png',         alt: 'Meraki Maxi Dress',     label: 'Maxi Dresses' },
  { src: '/kurti-uploaded-1.png',     alt: 'Meraki Kurti',          label: 'Kurtis' },
  { src: '/gen-z-wear-1.jpg',         alt: 'Meraki Gen Z Wear',     label: 'Gen-Z Wear' },
  { src: '/lehenga-uploaded-1.jpg',   alt: 'Meraki Bridal Lehenga', label: 'Bridal' },
];

export function NewsletterSection({ source = 'footer', className = '' }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wantsSMS, setWantsSMS] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [imageRevealed, setImageRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Staggered image reveal on scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setImageRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    setStatus('loading');

    try {
      const existingStr = localStorage.getItem('meraki_newsletter_subscribers');
      const existingList = existingStr ? JSON.parse(existingStr) : [];

      const isDuplicate = existingList.some(
        (sub: any) => sub.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (isDuplicate) {
        setStatus('error');
        setErrorMessage("You're already a valued member of Meraki's Inner Circle! Use coupon WELCOME10.");
        return;
      }

      existingList.push({
        id: Date.now(),
        email: email.trim().toLowerCase(),
        phone: wantsSMS ? phone.trim() : null,
        source,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('meraki_newsletter_subscribers', JSON.stringify(existingList));
      localStorage.setItem('meraki_newsletter_subscribed', 'true');
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
    <section
      ref={sectionRef}
      aria-labelledby="newsletter-heading"
      className={`relative overflow-hidden ${className}`}
    >
      {/* ── Full-width split layout ────────────────────────────── */}
      <div className="flex flex-col lg:flex-row min-h-[560px]">

        {/* ── LEFT PANEL: Image collage ────────────────────────── */}
        <div className="relative lg:w-[48%] xl:w-[45%] bg-[#3B2232] overflow-hidden flex-shrink-0 min-h-[320px] lg:min-h-0">

          {/* Dark editorial overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#3B2232]/60 via-transparent to-[#3B2232]/20 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3B2232]/80 via-transparent to-transparent z-10 pointer-events-none" />

          {/* 2×3 Masonry-style grid of fashion photos */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 p-1">
            {FASHION_IMAGES.map((img, i) => (
              <div
                key={img.src}
                className="relative overflow-hidden group"
                style={{
                  // Staggered reveal: each image fades in with a delay
                  opacity: imageRevealed ? 1 : 0,
                  transform: imageRevealed ? 'scale(1)' : 'scale(1.06)',
                  transition: `opacity 700ms ease-out ${i * 100}ms, transform 700ms ease-out ${i * 100}ms`,
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Category label pill */}
                <div className="absolute bottom-1.5 left-1.5 z-20">
                  <span className="bg-black/50 backdrop-blur-sm text-white text-[9px] font-sans px-1.5 py-0.5 rounded-full tracking-wide">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating editorial card overlay */}
          <div
            className="absolute bottom-6 left-6 right-6 z-20 bg-black/40 backdrop-blur-md border border-white/15 rounded-2xl p-4"
            style={{
              opacity: imageRevealed ? 1 : 0,
              transform: imageRevealed ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 700ms ease-out 650ms, transform 700ms ease-out 650ms',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-gold text-gold" />
              ))}
              <span className="text-white/70 text-[10px] font-sans ml-1">Loved by 500+ women</span>
            </div>
            <p className="text-white font-serif text-sm leading-snug">
              "Every piece from Meraki feels like it was made just for me."
            </p>
            <p className="text-white/60 text-[10px] font-sans mt-1">— Priya S., Dhanbad</p>
          </div>
        </div>

        {/* ── RIGHT PANEL: Signup form ─────────────────────────── */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-[#5E3747] via-primary to-[#7A4B5D] text-white flex items-center">

          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/30 rounded-full blur-2xl pointer-events-none" />

          {/* Decorative dot pattern */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #C7A96B 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative w-full px-8 sm:px-12 py-12 lg:py-10 max-w-xl mx-auto lg:mx-0">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-gold/30 text-gold text-xs font-sans font-medium uppercase tracking-[0.15em] mb-5 shadow-sm">
              <Sparkles size={12} className="animate-pulse" />
              <span>Exclusive Member Privileges</span>
            </div>

            {/* Headline */}
            <h2
              id="newsletter-heading"
              className="font-serif text-3xl sm:text-4xl text-cream font-normal leading-tight mb-3"
            >
              Join Meraki's<br />
              <span className="text-gold">Inner Circle</span>
            </h2>

            {/* Subtext */}
            <p className="font-sans text-cream/85 text-sm sm:text-base mb-6 font-light leading-relaxed max-w-sm">
              Unlock{' '}
              <strong className="font-semibold text-gold">10% off your first order</strong>{' '}
              and get private invitations to artisan drops, seasonal edits & VIP sales.
            </p>

            {/* Perks row */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-7">
              {['Early access to new arrivals', 'Members-only offers', 'Styling tips & lookbooks'].map((perk) => (
                <div key={perk} className="flex items-center gap-1.5 text-xs text-cream/80 font-sans">
                  <Check size={12} className="text-gold flex-shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            {/* Form or Success state */}
            {status === 'success' ? (
              <div className="bg-white/15 backdrop-blur-md border border-gold/40 rounded-2xl p-6 text-center animate-scale-in shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-gold/20 text-gold mx-auto flex items-center justify-center mb-3">
                  <Check size={24} />
                </div>
                <h3 className="font-serif text-2xl text-cream mb-1">Welcome to the Family!</h3>
                <p className="text-xs text-cream/80 mb-4 font-sans">
                  Your 10% discount code is ready. Use it at checkout:
                </p>
                <div className="flex items-center justify-between bg-charcoal/80 border border-gold/50 rounded-brand px-4 py-3 mb-4">
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
                  Welcome guide sent to{' '}
                  <span className="underline text-cream">{email}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                {/* Email input */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/50 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 rounded-full bg-white/10 border border-white/25 text-white placeholder-white/55 text-sm outline-none transition-all focus:border-gold focus:bg-white/15 focus:ring-2 focus:ring-gold/30 min-h-[48px]"
                      aria-label="Email address for newsletter"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="min-h-[48px] rounded-full px-6 text-charcoal bg-gold hover:bg-gold-light font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0 active:scale-95 border-none whitespace-nowrap"
                  >
                    {status === 'loading' ? (
                      <span>Joining…</span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Claim 10% Off <ArrowRight size={15} />
                      </span>
                    )}
                  </Button>
                </div>

                {/* SMS checkbox */}
                <div className="flex items-center gap-2 text-xs text-cream/75">
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
                  <div className="max-w-xs">
                    <input
                      type="tel"
                      placeholder="Your Mobile Phone (Optional)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs outline-none focus:border-gold"
                    />
                  </div>
                )}

                {/* Error message */}
                {status === 'error' && (
                  <div className="bg-rust/20 border border-rust/40 text-cream text-xs px-4 py-2.5 rounded-brand max-w-md">
                    {errorMessage}
                  </div>
                )}

                {/* Trust copy */}
                <p className="flex items-center gap-1.5 text-xs text-cream/55 pt-1 font-sans">
                  <ShieldCheck size={13} className="text-gold/70 flex-shrink-0" />
                  <span>No spam. Only handcrafted elegance. Unsubscribe anytime.</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
