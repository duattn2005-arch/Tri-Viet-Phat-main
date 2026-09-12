/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PageTab, Product, Article } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AiChatBubble } from './components/AiChatBubble';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { ConsultationModal } from './components/ConsultationModal';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const handleSelectTab = (tab: PageTab, cat?: string) => {
    setCurrentTab(tab);
    if (cat) {
      setCategoryFilter(cat);
    }
  };

  const handleOpenConsultation = (prefilledProd?: string) => {
    setConsultationProduct(prefilledProd || '');
    setIsConsultationOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f172a] font-sans antialiased selection:bg-[#cce5ff] selection:text-[#006194] overflow-x-hidden w-full max-w-full">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenConsultation={handleOpenConsultation}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Body (with padding top for fixed header h-20 + topbar h-9 = 116px) */}
      <main className="flex-1 pt-[116px] w-full max-w-full overflow-x-hidden">
        {currentTab === 'trang-chu' && (
          <HomeScreen
            onSelectProduct={(p) => setSelectedProduct(p)}
            onSelectArticle={(a) => setSelectedArticle(a)}
            onNavigateTab={handleSelectTab}
            onOpenConsultation={handleOpenConsultation}
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
          <ContactScreen onOpenConsultation={() => handleOpenConsultation()} />
        )}
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

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onSelectArticle={(a) => setSelectedArticle(a)}
      />
    </div>
  );
}

