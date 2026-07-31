import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button, Input, Divider } from '@/components/ui';
import { useState } from 'react';
import { NewsletterSection } from '@/components/common/NewsletterSection';

// Custom inline SVG icons for social platforms
const Instagram = (props: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Facebook = (props: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Youtube = (props: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const Pinterest = (props: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={props.size || 18} height={props.size || 18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.08-.66.15-1.68.32-2.4L10 15s-.38-.76-.38-1.9c0-1.77 1.03-3.1 2.3-3.1 1.08 0 1.6.8 1.6 1.78 0 1.09-.7 2.72-1.05 4.23-.3 1.27.64 2.3 1.9 2.3 2.27 0 4.02-2.4 4.02-5.86 0-3.06-2.2-5.2-5.34-5.2-3.64 0-5.78 2.73-5.78 5.56 0 1.1.42 2.28.95 2.92a.37.37 0 0 1 .09.36l-.36 1.45c-.06.24-.2.32-.45.2-1.63-.75-2.65-3.13-2.65-5.04 0-4.1 2.98-7.87 8.59-7.87 4.5 0 8 3.2 8 7.5 0 4.47-2.82 8.08-6.73 8.08-1.31 0-2.55-.68-2.98-1.5l-.8 3.09c-.3 1.12-1.08 2.53-1.61 3.4A10 10 0 1 0 12 2z"></path>
  </svg>
);

const footerLinks = {
  customerCare: [
    { label: 'Track My Order', href: '/track-order' },
    { label: 'Shipping & Returns', href: '/shipping-returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
  ],
  about: [
    { label: 'Our Story', href: '/about' },
    { label: 'Craftsmanship', href: '/craftsmanship' },
    { label: 'Journal', href: '/blog' },
    { label: 'Gifting', href: '/gifting' },
    { label: 'Lookbook', href: '/lookbook' },
  ],
  collections: [
    { label: 'Co-ord Sets', href: '/collections/co-ord-sets' },
    { label: 'Maxi Dresses', href: '/collections/maxi-dresses' },
    { label: 'Kurtis', href: '/collections/kurtis' },
    { label: 'Gen-Z Wear', href: '/collections/gen-z-wear' },
    { label: 'New Arrivals', href: '/new-arrivals' },
    { label: 'Sale', href: '/sale' },
  ],
  legal: [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Admin Portal', href: '/admin' },
  ],
};

const socials = [
  { icon: <Instagram size={18} />, label: 'Instagram', href: 'https://instagram.com' },
  { icon: <Facebook size={18} />, label: 'Facebook', href: 'https://facebook.com' },
  { icon: <Pinterest size={18} />, label: 'Pinterest', href: 'https://pinterest.com' },
  { icon: <Youtube size={18} />, label: 'YouTube', href: 'https://youtube.com' },
];

const paymentMethods = [
  { label: 'Visa', logo: '💳' },
  { label: 'Mastercard', logo: '💳' },
  { label: 'UPI', logo: '📱' },
  { label: 'Razorpay', logo: '🔒' },
  { label: 'COD', logo: '💵' },
];

export function Footer() {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <footer className="bg-charcoal text-white mt-16 lg:mb-0 mb-14" role="contentinfo">
      {/* Newsletter Section (only rendered if not on Homepage to avoid duplication) */}
      {!isHomepage && <NewsletterSection source="footer" />}

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="block font-serif text-xl text-white mb-1">
              Meraki by Kritika
            </Link>
            <p className="text-white/60 text-xs font-sans tracking-widest uppercase mb-4">
              Made with Soul, Worn with Ease
            </p>
            <p className="text-white/60 text-xs leading-relaxed mb-6">
              Handcrafted designer womenswear rooted in Jharkhand's rich craft heritage. Every piece tells a story of artistry, love, and ease.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Admin Portal Button */}
            <div className="mt-6">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-white text-white text-xs font-sans font-medium rounded-brand transition-colors bg-white/5 hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-deep">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <p className="nav-label text-white/50 mb-4">Customer Care</p>
            <ul className="space-y-2.5">
              {footerLinks.customerCare.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <p className="nav-label text-white/50 mb-4">About Meraki</p>
            <ul className="space-y-2.5">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <p className="nav-label text-white/50 mb-4">Shop</p>
            <ul className="space-y-2.5">
              {footerLinks.collections.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="nav-label text-white/50 mb-4">Contact</p>
            <ul className="space-y-3">
              <li>
                <div className="flex items-start gap-2 text-white/70 text-sm">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-primary-light" />
                  <span>Dhanbad, Jharkhand — 826001, India</span>
                </div>
              </li>
              <li>
                <a
                  href="tel:+919900000000"
                  className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors"
                >
                  <Phone size={14} className="text-primary-light" />
                  +91 99XXX XXXXX
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@merakibykritika.in"
                  className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors"
                >
                  <Mail size={14} className="text-primary-light" />
                  hello@merakibykritika.in
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919900000000?text=Hi%20Meraki%20by%20Kritika!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#25D366] text-white text-xs font-sans font-medium rounded-brand hover:bg-[#1ebe5d] transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="border-white/10 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            {footerLinks.legal.map((link, i) => (
              <span key={link.href} className="flex items-center gap-4">
                {i > 0 && <span>·</span>}
                <Link to={link.href} className="hover:text-white/70 transition-colors">
                  {link.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Payment icons */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/30">Secure Checkout</span>
            <div className="flex gap-2">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.label}
                  className="bg-white/10 rounded text-xs px-2 py-1 text-white/60"
                  title={pm.label}
                >
                  {pm.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6 font-sans">
          © {new Date().getFullYear()} Meraki by Kritika. All rights reserved. Handcrafted with ❤️ in Dhanbad, Jharkhand.
        </p>
      </div>
    </footer>
  );
}
