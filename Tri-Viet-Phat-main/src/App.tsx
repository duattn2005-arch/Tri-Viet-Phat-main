/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { PageTab, Product } from './types';
import { SiteArticle, REAL_NEWS_ARTICLES } from './data/realSiteContent';
import { PRODUCTS } from './data/mockData';
import { parseRoute, routePath, seoFor, type Route, type SeoLookups } from './seo/routes';
import { applySeo } from './seo/head';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AiChatBubble } from './components/AiChatBubble';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ConsultationModal } from './components/ConsultationModal';
import { RepairServiceModal } from './components/RepairServiceModal';
import { SearchModal } from './components/SearchModal';

import { HomeScreen } from './components/screens/HomeScreen';
import { AboutScreen } from './components/screens/AboutScreen';
import { ProductsScreen } from './components/screens/ProductsScreen';
import { DocumentsScreen } from './components/screens/DocumentsScreen';
import { NewsScreen } from './components/screens/NewsScreen';
import { CareersScreen } from './components/screens/CareersScreen';
import { ContactScreen } from './components/screens/ContactScreen';

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

const SEO_LOOKUPS: SeoLookups = {
  article: (id) => REAL_NEWS_ARTICLES.find((a) => a.id === id),
  product: (id) => PRODUCTS.find((p) => p.id === id),
};

const findProduct = (id?: string) => (id ? PRODUCTS.find((p) => p.id === id) ?? null : null);

export default function App() {
  // Each page has its own URL (see src/seo/routes.ts); the first render follows the address bar.
  const [initialRoute] = useState(() => parseRoute(window.location.pathname));
  const [currentTab, setCurrentTab] = useState<PageTab>(initialRoute.tab);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialRoute.cat || 'all');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => findProduct(initialRoute.productId));
  const [newsArticleId, setNewsArticleId] = useState<string>(initialRoute.articleId || '');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationProduct, setConsultationProduct] = useState<string>('');
  const [isRepairServiceOpen, setIsRepairServiceOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Feed the pointer position to any `.fx-spotlight` section under the cursor (CSS draws the light).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = (e.target as Element | null)?.closest?.('.fx-spotlight') as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Keep the address bar, page title and meta tags in step with what is on screen
  const route: Route = {
    tab: currentTab,
    cat: categoryFilter,
    articleId: currentTab === 'tin-tuc' ? newsArticleId || undefined : undefined,
    productId: selectedProduct?.id,
  };
  const path = routePath(route);
  const firstSync = useRef(true);
  useEffect(() => {
    if (window.location.pathname !== path) {
      // The first sync only normalises the address (e.g. an unknown path), so it replaces instead of adding history
      window.history[firstSync.current ? 'replaceState' : 'pushState'](null, '', path);
    }
    firstSync.current = false;
    applySeo(seoFor(route, SEO_LOOKUPS), SITE_URL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  // Browser back / forward
  useEffect(() => {
    const onPopState = () => {
      const next = parseRoute(window.location.pathname);
      setSelectedProduct(findProduct(next.productId));
      if (next.productId) return;
      setCurrentTab(next.tab);
      setCategoryFilter(next.cat || 'all');
      setNewsArticleId(next.articleId || '');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleSelectTab = (tab: PageTab, cat?: string) => {
    setCurrentTab(tab);
    setCategoryFilter(cat || 'all');
    setNewsArticleId('');
  };

  const handleOpenNewsArticle = (article: SiteArticle) => {
    setCurrentTab('tin-tuc');
    setCategoryFilter('all');
    setNewsArticleId(article.id);
    window.scrollTo({ top: 0 });
  };

  const handleOpenConsultation = (prefilledProd?: string) => {
    setConsultationProduct(prefilledProd || '');
    setIsConsultationOpen(true);
  };

  const handleOpenRepairService = () => {
    setIsRepairServiceOpen(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-white text-[#111111] font-sans antialiased selection:bg-[#e5e5e5] selection:text-[#111111] overflow-x-hidden w-full max-w-full">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenConsultation={handleOpenConsultation}
          onOpenRepairService={handleOpenRepairService}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Offset for the fixed header: 96px phone, 116px tablet, 168px desktop (top bar + brand row + nav bar) */}
        <main className="flex-1 pt-[96px] sm:pt-[116px] lg:pt-[168px] w-full max-w-full overflow-x-hidden">
          {/* Page transition: the incoming screen fades up after the outgoing one fades out */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentTab === 'trang-chu' && (
                <HomeScreen
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onSelectArticle={handleOpenNewsArticle}
                  onNavigateTab={handleSelectTab}
                  onOpenConsultation={handleOpenConsultation}
                  onOpenRepairService={handleOpenRepairService}
                />
              )}

              {currentTab === 'gioi-thieu' && (
                <AboutScreen onOpenConsultation={() => handleOpenConsultation()} />
              )}

              {currentTab === 'san-pham' && (
                <ProductsScreen
                  initialCategory={categoryFilter}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onOpenConsultation={handleOpenConsultation}
                />
              )}

              {currentTab === 'tai-lieu' && (
                <DocumentsScreen
                  initialCategory={categoryFilter}
                  onNavigateCategory={(cat) => handleSelectTab('tai-lieu', cat)}
                  onNavigateTab={handleSelectTab}
                />
              )}

              {currentTab === 'tin-tuc' && (
                <NewsScreen
                  initialCategory={categoryFilter}
                  onNavigateCategory={(cat) => handleSelectTab('tin-tuc', cat)}
                  onNavigateTab={handleSelectTab}
                  initialArticleId={newsArticleId}
                  onArticleChange={(id) => setNewsArticleId(id)}
                />
              )}

              {currentTab === 'tuyen-dung' && <CareersScreen />}

              {currentTab === 'lien-he' && (
                <ContactScreen
                  onOpenConsultation={() => handleOpenConsultation()}
                  onOpenRepairService={handleOpenRepairService}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Footer */}
        <Footer
          onSelectTab={handleSelectTab}
          onOpenConsultation={handleOpenConsultation}
        />

        {/* Floating Action Buttons: AI Chat, Quick Support, Back to Top */}
        <FloatingActions
          onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
          isAiChatOpen={isAiChatOpen}
          onNavigateContact={() => handleSelectTab('lien-he')}
        />

        {/* AI Assistant Chat Window */}
        <AiChatBubble
          isOpen={isAiChatOpen}
          onClose={() => setIsAiChatOpen(false)}
          onOpenConsultation={handleOpenConsultation}
        />

        {/* Modals */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onRequestQuote={(prodName) => handleOpenConsultation(prodName)}
        />

        <ConsultationModal
          isOpen={isConsultationOpen}
          onClose={() => setIsConsultationOpen(false)}
          prefilledProduct={consultationProduct}
        />

        <RepairServiceModal
          isOpen={isRepairServiceOpen}
          onClose={() => setIsRepairServiceOpen(false)}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onSelectArticle={handleOpenNewsArticle}
        />
      </div>
    </MotionConfig>
  );
}

