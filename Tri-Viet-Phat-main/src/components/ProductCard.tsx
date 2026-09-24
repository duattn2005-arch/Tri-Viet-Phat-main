import React from 'react';
import { Product } from '../types';
import { brandName, originName } from '../data/productMeta';
import { Tilt } from './motion/Tilt';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onRequestQuote: (productName: string) => void;
}

/** Shared product card (home + products page): framed card that lifts on hover, centred title, red price line. */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onRequestQuote }) => (
  <article className="group h-full flex flex-col rounded-xl bg-white border border-[#e3ebf3] p-2.5 sm:p-3 shadow-[0_2px_10px_rgba(10,37,64,0.05)] hover:-translate-y-1.5 hover:border-[#0a94dc]/40 hover:shadow-[0_22px_44px_-14px_rgba(10,37,64,0.28)] transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
    <Tilt className="w-full aspect-square overflow-hidden rounded-lg bg-[#f3f7fb] fx-shine">
      {/* Brand chip */}
      <span className="absolute left-2 top-2 z-10 px-2 py-0.5 rounded-full bg-white/90 text-[11px] font-semibold text-[#0a2540] shadow-sm">
        {brandName(product)}
      </span>
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
          className="w-full h-full object-contain p-5 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          alt={product.alt}
          src={product.image}
          loading="lazy"
        />
      </button>

      {/* Hover actions — desktop only; on touch screens tapping the photo opens the detail view */}
      <div className="absolute inset-x-2 bottom-2 z-10 hidden lg:flex gap-2 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:focus-within:opacity-100 lg:focus-within:translate-y-0 transition-all duration-300">
        <button
          type="button"
          onClick={() => onRequestQuote(product.name)}
          className="flex-1 h-10 rounded-full bg-white text-[12px] font-bold uppercase tracking-wide text-[#0a2540] shadow-md inline-flex items-center justify-center gap-1.5 hover:bg-linear-to-r hover:from-[#0a94dc] hover:to-[#e11d2a] hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">request_quote</span>
          <span>Báo giá</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect(product)}
          aria-label={`Xem nhanh ${product.name}`}
          className="w-10 h-10 rounded-full bg-[#0a2540] text-white shadow-md inline-flex items-center justify-center hover:bg-[#0a94dc] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">visibility</span>
        </button>
      </div>
    </Tilt>

    <div className="px-1 pt-3.5 pb-1 flex flex-col flex-1 text-center">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="text-[14px] sm:text-[15.5px] font-semibold text-[#0a2540] leading-snug line-clamp-2 min-h-[2.6em] group-hover:text-[#0a94dc] transition-colors duration-300 cursor-pointer"
      >
        {product.name}
      </button>
      <div className="mt-1 text-[12px] sm:text-[13px] text-[#777777]">Xuất xứ: {originName(product)}</div>
      <div className="mt-auto pt-2.5 inline-flex items-center justify-center gap-1 text-[14px] sm:text-[15px] font-bold text-[#e11d2a]">
        <span className="material-symbols-outlined text-[17px]">call</span>
        Liên hệ báo giá
      </div>
    </div>
  </article>
);
