import React from 'react';
import { Product } from '../types';
import { brandName, originName } from '../data/productMeta';
import { Tilt } from './motion/Tilt';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onRequestQuote: (productName: string) => void;
}

/** Shared product tile (home + products page), modelled on torano.vn's listing card. */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onRequestQuote }) => (
  <article className="group flex flex-col">
    <Tilt className="w-full aspect-square overflow-hidden bg-white fx-shine">
      <span
        className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-linear-to-r from-[#0a94dc] to-[#e11d2a] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => onSelect(product)}
        aria-label={`Xem chi tiết ${product.name}`}
        className="absolute inset-0 cursor-pointer"
      >
        <img
          className="w-full h-full object-contain p-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          alt={product.alt}
          src={product.image}
          loading="lazy"
        />
      </button>

      {/* Hover actions — desktop only; on touch screens tapping the photo opens the detail view */}
      <div className="absolute inset-x-2 bottom-2 hidden lg:flex gap-2 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:focus-within:opacity-100 lg:focus-within:translate-y-0 transition-all duration-200">
        <button
          type="button"
          onClick={() => onRequestQuote(product.name)}
          className="flex-1 h-11 bg-white border border-[#e5e5e5] text-[12px] sm:text-[13px] font-bold uppercase tracking-wide text-[#111111] inline-flex items-center justify-center gap-1.5 hover:bg-[#0a2540] hover:text-white hover:border-[#0a2540] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">request_quote</span>
          <span>Báo giá</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect(product)}
          aria-label={`Xem nhanh ${product.name}`}
          className="w-11 h-11 bg-[#333333] text-white inline-flex items-center justify-center hover:bg-[#0a2540] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">visibility</span>
        </button>
      </div>
    </Tilt>

    <div className="pt-4 flex flex-col flex-1">
      <div className="flex items-center justify-between gap-2 text-[13px] sm:text-[14px] text-[#555555]">
        <span className="truncate">{brandName(product)}</span>
        <span className="truncate text-right">{originName(product)}</span>
      </div>
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="mt-2 text-left text-[14px] sm:text-[15px] text-[#111111] leading-snug line-clamp-2 group-hover:text-[#0a94dc] transition-colors duration-300 cursor-pointer"
      >
        {product.name}
      </button>
      <div className="mt-1.5 text-[14px] sm:text-[15px] font-bold text-[#e11d2a]">Liên hệ báo giá</div>
    </div>
  </article>
);
