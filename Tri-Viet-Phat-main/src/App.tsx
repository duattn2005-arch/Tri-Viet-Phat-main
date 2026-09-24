/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { PageTab, Product, Article } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AiChatBubble } from './components/AiChatBubble';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('trang-chu');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
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

  const handleSelectTab = (tab: PageTab, cat?: string) => {
    setCurrentTab(tab);
    setCategoryFilter(cat || 'all');
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
                  onSelectArticle={(a) => setSelectedArticle(a)}
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
                  onSelectArticle={(a) => setSelectedArticle(a)}
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

        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onOpenConsultation={() => handleOpenConsultation()}
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
          onSelectArticle={(a) => setSelectedArticle(a)}
        />
      </div>
    </MotionConfig>
  );
}

