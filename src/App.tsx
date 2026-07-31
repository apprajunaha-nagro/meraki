import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy, useEffect } from 'react';

// Layout
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ScrollUXControls } from '@/components/layout/ScrollUXControls';

// Pages - eager loaded (above the fold / nav-critical)
import { HomePage } from '@/pages/HomePage';
import { ProductPage } from '@/pages/ProductPage';
import { CategoryPage, CollectionsPage } from '@/pages/CategoryPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage, OrderConfirmationPage } from '@/pages/CheckoutPage';
import {
  LoginPage,
  AccountOrdersPage,
  AccountWishlistPage,
  AccountProfilePage,
  AccountAddressesPage,
  WishlistPage,
} from '@/pages/AccountPages';
import {
  NewArrivalsPage, SalePage, EditPage, AboutPage, CraftsmanshipPage,
  LookbookPage, BlogPage, ContactPage, FaqPage, SizeGuidePage,
  TrackOrderPage, ShippingReturnsPage, GiftingPage, NotFoundPage,
} from '@/pages/OtherPages';

// Admin pages
import {
  AdminLoginPage,
  AdminLayout,
  AdminDashboardPage,
  AdminProductsPage,
  AdminCategoriesPage,
  AdminOrdersPage,
  AdminCustomersPage,
  AdminCouponsPage,
  AdminReviewsPage,
  AdminMarketingPage,
  AdminGiftCardsPage,
  AdminReportsPage,
  AdminSettingsPage,
} from '@/pages/admin/AdminPages';

// Auth guard
import { useAuthStore } from '@/store/authStore';

// ─── Route Guards ──────────────────────────────────────────────────────────────

import { NewsletterModal } from '@/components/common/NewsletterModal';

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <CartDrawer />
      <ScrollUXControls />
      <NewsletterModal />
      <div id="main-content">
        {children}
      </div>
      <Footer />
    </>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdminAuthenticated = useAuthStore((s) => s.isAdminAuthenticated);
  if (!isAdminAuthenticated) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/account/login" replace />;
  return <>{children}</>;
}

// ─── Page Loading Fallback ────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-secondary border-t-primary animate-spin mx-auto mb-4" />
        <p className="text-taupe text-sm font-sans">Loading...</p>
      </div>
    </div>
  );
}

// ─── Cookie Banner ────────────────────────────────────────────────────────────

function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:max-w-md z-40 bg-charcoal text-white rounded-brand shadow-elevated p-4 flex items-center gap-4">
      <p className="text-xs flex-1">
        We use cookies to enhance your experience. By continuing to browse, you agree to our{' '}
        <a href="/cookie-policy" className="underline hover:text-primary-light">Cookie Policy</a>.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 bg-primary text-white text-xs px-3 py-1.5 rounded-brand hover:bg-primary-dark transition-colors"
      >
        Accept
      </button>
    </div>
  );
}

// ─── Scroll to Top on Route Change ───────────────────────────────────────────

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

// ─── App Router ────────────────────────────────────────────────────────────────

import { useState } from 'react';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid #F3D9CE',
          },
          success: { iconTheme: { primary: '#7C9473', secondary: '#fff' } },
          error: { iconTheme: { primary: '#B5544A', secondary: '#fff' } },
        }}
      />
      <CookieBanner />

      <Routes>
        {/* ── Admin Routes (no storefront layout) ── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><AdminCustomersPage /></AdminRoute>} />
        <Route path="/admin/coupons" element={<AdminRoute><AdminCouponsPage /></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><AdminReviewsPage /></AdminRoute>} />
        <Route path="/admin/marketing" element={<AdminRoute><AdminMarketingPage /></AdminRoute>} />
        <Route path="/admin/gift-cards" element={<AdminRoute><AdminGiftCardsPage /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReportsPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />

        {/* ── Storefront Routes (with header/footer) ── */}
        <Route path="*" element={
          <StorefrontLayout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                <Route path="/sale" element={<SalePage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/:slug" element={<CategoryPage />} />
                <Route path="/edit/:slug" element={<EditPage />} />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/lookbook" element={<LookbookPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
                <Route path="/gifting" element={<GiftingPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/size-guide" element={<SizeGuidePage />} />
                <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                {/* Account */}
                <Route path="/account/login" element={<LoginPage />} />
                <Route path="/account" element={<ProtectedRoute><Navigate to="/account/orders" replace /></ProtectedRoute>} />
                <Route path="/account/orders" element={<ProtectedRoute><AccountOrdersPage /></ProtectedRoute>} />
                <Route path="/account/addresses" element={<ProtectedRoute><AccountAddressesPage /></ProtectedRoute>} />
                <Route path="/account/wishlist" element={<ProtectedRoute><AccountWishlistPage /></ProtectedRoute>} />
                <Route path="/account/profile" element={<ProtectedRoute><AccountProfilePage /></ProtectedRoute>} />
                {/* Catch-all */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </StorefrontLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}
