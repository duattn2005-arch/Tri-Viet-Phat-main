import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MAJOR_CITIES, PROVINCES_26 } from '../data/provinces';

interface ProvinceSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  variant?: 'light' | 'white';
  includeAllNationOption?: boolean;
  className?: string;
  hasIcon?: boolean;
}

export const ProvinceSelect: React.FC<ProvinceSelectProps> = ({
  value,
  onChange,
  id,
  placeholder = 'Chọn tỉnh/thành phố',
  variant = 'light',
  includeAllNationOption = false,
  className = '',
  hasIcon = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
      // Auto focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filtered lists
  const query = searchQuery.toLowerCase().trim();

  const filteredCities = useMemo(() => {
    if (!query) return MAJOR_CITIES;
    return MAJOR_CITIES.filter((c) => c.toLowerCase().includes(query));
  }, [query]);

  const filteredProvinces = useMemo(() => {
    if (!query) return PROVINCES_26;
    return PROVINCES_26.filter((p) => p.toLowerCase().includes(query));
  }, [query]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const bgStyle =
    variant === 'white'
      ? 'bg-white border border-[#e2e8f0]'
      : 'bg-[#f1f5f9] border border-transparent';

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Trigger Button - Looks identical to the form input */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full ${hasIcon ? 'pl-9' : 'pl-3.5'} pr-9 py-2.5 rounded-xl ${bgStyle} text-[13.5px] text-[#0f172a] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006194] flex items-center justify-between transition-all text-left cursor-pointer shadow-xs`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {hasIcon && (
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#475569] text-[20px] pointer-events-none">
            location_on
          </span>
        )}

        <span className={`truncate font-medium ${!value ? 'text-[#94a3b8]' : 'text-[#0f172a]'}`}>
          {value || placeholder}
        </span>

        <span
          className={`material-symbols-outlined absolute right-3 top-2.5 text-[#64748b] text-[20px] transition-transform duration-200 pointer-events-none ${
            isOpen ? 'rotate-180 text-[#006194]' : ''
          }`}
        >
          keyboard_arrow_down
        </span>
      </button>

      {/* DROPDOWN MENU - STRICTLY POSITIONED DOWNWARDS */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl shadow-2xl border border-[#cbd5e1] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ maxHeight: '340px' }}
        >
          {/* Search box inside dropdown */}
          <div className="p-2 border-b border-[#f1f5f9] bg-[#f8fafc]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#94a3b8] text-[17px]">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhanh tỉnh, thành..."
                className="w-full pl-8 pr-3 py-1.5 text-[12.5px] rounded-lg bg-white border border-[#e2e8f0] focus:outline-none focus:border-[#006194] text-[#0f172a]"
                onClick={(e) => e.stopPropagation()}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-[#94a3b8] hover:text-[#475569]"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* List items */}
          <div className="max-h-[260px] overflow-y-auto divide-y divide-[#f8fafc] overscroll-contain">
            {includeAllNationOption && (
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => handleSelect('Toàn quốc')}
                  className={`w-full px-3 py-2 text-left text-[13px] rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    value === 'Toàn quốc'
                      ? 'bg-[#e0f2fe] text-[#006194] font-semibold'
                      : 'text-[#334155] hover:bg-[#f1f5f9]'
                  }`}
                >
                  <span>Khu vực (Toàn quốc)</span>
                  {value === 'Toàn quốc' && (
                    <span className="material-symbols-outlined text-[#006194] text-[16px]">check</span>
                  )}
                </button>
              </div>
            )}

            {/* 8 Thành phố trực thuộc Trung ương */}
            {filteredCities.length > 0 && (
              <div className="p-1">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#006194] uppercase tracking-wider bg-[#f0f9ff] rounded-md flex items-center justify-between mb-1">
                  <span>8 Thành phố trực thuộc TW</span>
                  <span className="text-[10px] bg-[#006194] text-white px-1.5 py-0.2 rounded-full font-semibold">
                    {filteredCities.length}
                  </span>
                </div>
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className={`w-full px-3 py-1.5 text-left text-[13px] rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      value === city
                        ? 'bg-[#e0f2fe] text-[#006194] font-bold'
                        : 'text-[#1e293b] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <span>{city}</span>
                    {value === city && (
                      <span className="material-symbols-outlined text-[#006194] text-[16px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* 26 Tỉnh sau sáp nhập */}
            {filteredProvinces.length > 0 && (
              <div className="p-1">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#475569] uppercase tracking-wider bg-[#f8fafc] rounded-md flex items-center justify-between mb-1">
                  <span>26 Tỉnh sau sáp nhập</span>
                  <span className="text-[10px] bg-[#64748b] text-white px-1.5 py-0.2 rounded-full font-semibold">
                    {filteredProvinces.length}
                  </span>
                </div>
                {filteredProvinces.map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => handleSelect(prov)}
                    className={`w-full px-3 py-1.5 text-left text-[13px] rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      value === prov
                        ? 'bg-[#e0f2fe] text-[#006194] font-bold'
                        : 'text-[#1e293b] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <span>{prov}</span>
                    {value === prov && (
                      <span className="material-symbols-outlined text-[#006194] text-[16px]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {filteredCities.length === 0 && filteredProvinces.length === 0 && (
              <div className="py-6 px-4 text-center text-[12.5px] text-[#94a3b8]">
                Không tìm thấy tỉnh/thành phù hợp với "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
