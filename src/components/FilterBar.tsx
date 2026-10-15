import React, { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Clock, Check, RotateCcw, Star, Plus } from 'lucide-react';
import { BrewMethod, Difficulty, FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  allCoffeeTypes: string[];
  allIngredients: string[];
  totalResults: number;
  totalAvailable: number;
  isFiltered: boolean;
  isOwner?: boolean;
  onOpenAddRecipe?: () => void;
  onToggleCoffeeType: (type: string) => void;
  onToggleMethod: (method: BrewMethod) => void;
  onToggleDifficulty: (diff: Difficulty) => void;
  onSetMaxPrepTime: (time: number) => void;
  onSetMinRating: (rating: number) => void;
  onToggleIncludeIngredient: (ing: string) => void;
  onToggleExcludeIngredient: (ing: string) => void;
  onSetSearchQuery: (query: string) => void;
  onClearAll: () => void;
}

const METHODS: { label: string; value: BrewMethod; icon: string }[] = [
  { label: 'Espresso', value: 'espresso machine', icon: '☕' },
  { label: 'French Press', value: 'French press', icon: '🫖' },
  { label: 'AeroPress', value: 'AeroPress', icon: '🧪' },
  { label: 'Moka Pot', value: 'moka pot', icon: '♨️' },
  { label: 'V60 Pour Over', value: 'V60', icon: '⏳' },
];

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Master'];

const STAR_OPTIONS: { label: string; value: number }[] = [
  { label: '★ 4.8+ Top Rated', value: 4.8 },
  { label: '★ 4.5+ & Above', value: 4.5 },
  { label: '★ 4.0+ & Above', value: 4.0 },
  { label: '★ 3.0+ & Above', value: 3.0 },
];

const COMMON_INCLUDES = ['oat milk', 'honey', 'vanilla', 'cardamom', 'cinnamon', 'ice'];
const COMMON_EXCLUDES = ['dairy', 'sugar', 'milk', 'butter'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  allCoffeeTypes,
  totalResults,
  totalAvailable,
  isFiltered,
  isOwner,
  onOpenAddRecipe,
  onToggleCoffeeType,
  onToggleMethod,
  onToggleDifficulty,
  onSetMaxPrepTime,
  onSetMinRating,
  onToggleIncludeIngredient,
  onToggleExcludeIngredient,
  onSetSearchQuery,
  onClearAll,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Close search or filter on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isFilterModalOpen) setIsFilterModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isFilterModalOpen]);

  // Click outside search container to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isSearchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Count active non-search filters for the badge
  const activeFiltersCount =
    (filters.minRating > 0 ? 1 : 0) +
    filters.methods.length +
    filters.difficulties.length +
    (filters.maxPrepTime < 20 ? 1 : 0) +
    filters.coffeeTypes.length +
    filters.includeIngredients.length +
    filters.excludeIngredients.length;

  return (
    <>
      {/* Sticky Bottom Dock: Fixed at bottom of viewport, non-scrolling */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FFF6E9]/95 backdrop-blur-md border-t border-[#C68642]/30 px-4 sm:px-6 py-2.5 shadow-[0_-4px_25px_rgba(59,36,24,0.12)]">
        {/* Active Filters Pill Bar (Shown right above the bottom dock if any filter or search is active) */}
        {isFiltered && (
          <div className="max-w-4xl mx-auto mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold text-[#3B2418]/60 uppercase tracking-wider shrink-0 font-mono">
              Active:
            </span>

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[#3B2418] text-[#FFF6E9] px-2.5 py-0.5 rounded-full text-[11px] shrink-0 font-medium">
                <span>"{filters.searchQuery}"</span>
                <button
                  onClick={() => onSetSearchQuery('')}
                  className="hover:text-[#F2B84B] cursor-pointer"
                  title="Remove search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.minRating > 0 && (
              <span className="inline-flex items-center gap-1 bg-[#F2B84B] text-[#3B2418] px-2 py-0.5 rounded-full text-[11px] shrink-0 font-bold">
                <Star className="w-2.5 h-2.5 fill-[#3B2418]" />
                <span>★ {filters.minRating}+</span>
                <button
                  onClick={() => onSetMinRating(0)}
                  className="hover:text-red-700 cursor-pointer"
                  title="Remove star filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.methods.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 bg-[#C68642]/20 text-[#3B2418] px-2 py-0.5 rounded-full text-[11px] shrink-0 font-medium"
              >
                <span>{m}</span>
                <button
                  onClick={() => onToggleMethod(m)}
                  className="hover:text-[#E8590C] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.difficulties.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1 bg-[#C68642]/20 text-[#3B2418] px-2 py-0.5 rounded-full text-[11px] shrink-0 font-medium"
              >
                <span>{d}</span>
                <button
                  onClick={() => onToggleDifficulty(d)}
                  className="hover:text-[#E8590C] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.maxPrepTime < 20 && (
              <span className="inline-flex items-center gap-1 bg-[#C68642]/20 text-[#3B2418] px-2 py-0.5 rounded-full text-[11px] shrink-0 font-medium">
                <span>≤ {filters.maxPrepTime}m</span>
                <button
                  onClick={() => onSetMaxPrepTime(20)}
                  className="hover:text-[#E8590C] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.coffeeTypes.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 bg-[#3B2418]/10 text-[#3B2418] px-2 py-0.5 rounded-full text-[11px] shrink-0 font-medium"
              >
                <span>{t}</span>
                <button
                  onClick={() => onToggleCoffeeType(t)}
                  className="hover:text-[#E8590C] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.includeIngredients.map((i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px] shrink-0 font-medium capitalize"
              >
                <span>+{i}</span>
                <button
                  onClick={() => onToggleIncludeIngredient(i)}
                  className="hover:text-emerald-950 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.excludeIngredients.map((e) => (
              <span
                key={e}
                className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[11px] shrink-0 font-medium capitalize"
              >
                <span>-{e}</span>
                <button
                  onClick={() => onToggleExcludeIngredient(e)}
                  className="hover:text-rose-950 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              onClick={onClearAll}
              className="text-[11px] text-[#E8590C] hover:underline font-bold shrink-0 ml-1 cursor-pointer flex items-center gap-0.5"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* Main Dock Row: Filter on Left | Counter in Middle | Search Icon Only on Right */}
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 relative">
          {/* LEFT SIDE: Filter Button */}
          <button
            onClick={() => {
              setIsFilterModalOpen(true);
              setIsSearchOpen(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer select-none ${
              activeFiltersCount > 0
                ? 'bg-[#E8590C] text-white hover:bg-[#d04f0a] ring-2 ring-[#E8590C]/30'
                : 'bg-[#3B2418] text-[#FFF6E9] hover:bg-[#4d3020]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#F2B84B]" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#E8590C] text-[11px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* CENTER: Results Counter + Quick Reset */}
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#3B2418]/80 select-none">
            <span className="hidden xs:inline">Showing</span>
            <span className="font-bold text-[#E8590C]">{totalResults}</span>
            <span className="text-[#3B2418]/50">/</span>
            <span>{totalAvailable} recipes</span>
            {isFiltered && (
              <button
                onClick={onClearAll}
                className="hidden sm:inline-flex items-center gap-1 text-[#E8590C] hover:text-[#d04f0a] font-bold ml-1 cursor-pointer text-[11px]"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* RIGHT SIDE: Add Recipe (Owner) + Search Icon */}
          <div className="flex items-center gap-2">
            {isOwner && onOpenAddRecipe && (
              <button
                type="button"
                onClick={onOpenAddRecipe}
                className="flex items-center gap-1.5 px-3 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Add recipe to database (Free or Paid)"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Recipe</span>
              </button>
            )}

            <div className="relative" ref={searchContainerRef}>
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              title={isSearchOpen ? 'Close search' : 'Search recipes'}
              className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all shadow-sm cursor-pointer select-none ${
                isSearchOpen || filters.searchQuery
                  ? 'bg-[#3B2418] text-[#F2B84B] ring-2 ring-[#F2B84B]/50'
                  : 'bg-white text-[#3B2418] border border-[#C68642]/30 hover:bg-[#FFF6E9]'
              }`}
            >
              <Search className="w-5 h-5" />
              {filters.searchQuery.trim().length > 0 && !isSearchOpen && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E8590C] rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Expandable Search Popover anchored above the Search Icon */}
            {isSearchOpen && (
              <div className="absolute bottom-full right-0 mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-80 bg-white/95 backdrop-blur-xl border border-[#C68642]/30 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C68642]" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={filters.searchQuery}
                      onChange={(e) => onSetSearchQuery(e.target.value)}
                      placeholder="Search recipes, beans, notes..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FFF6E9]/60 border border-[#C68642]/30 focus:border-[#C68642] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#3B2418] placeholder-[#3B2418]/50"
                    />
                    {filters.searchQuery && (
                      <button
                        onClick={() => onSetSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#C68642] hover:text-[#3B2418] cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {filters.searchQuery && (
                  <div className="mt-2 pt-2 border-t border-[#C68642]/15 flex items-center justify-between text-[11px] text-[#3B2418]/70 px-1 font-mono">
                    <span>
                      <strong className="text-[#E8590C]">{totalResults}</strong> matching brews
                    </span>
                    <button
                      onClick={() => onSetSearchQuery('')}
                      className="text-[#E8590C] hover:underline font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* FILTER BOTTOM SHEET / MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
          <div
            className="bg-[#FFF6E9] w-full max-w-2xl max-h-[85vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl border border-[#C68642]/30 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Drag Handle on mobile */}
            <div className="w-12 h-1 bg-[#C68642]/40 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#C68642]/20 flex items-center justify-between bg-white/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3B2418] text-[#F2B84B] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#3B2418]">Filter Recipes</h3>
                  <p className="text-xs text-[#3B2418]/60 font-mono">
                    {totalResults} of {totalAvailable} recipes match
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isFiltered && (
                  <button
                    onClick={onClearAll}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#E8590C] hover:bg-[#E8590C]/10 border border-[#E8590C]/30 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#3B2418]/70 hover:text-[#3B2418] hover:bg-[#C68642]/15 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Star Rating Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2418]/70 mb-2.5 font-mono flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#F2B84B] fill-[#F2B84B]" />
                  <span>Star Rating</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onSetMinRating(0)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      filters.minRating === 0
                        ? 'bg-[#3B2418] text-[#FFF6E9] shadow-xs'
                        : 'bg-white text-[#3B2418] border border-[#C68642]/20 hover:border-[#C68642]'
                    }`}
                  >
                    All Ratings
                  </button>

                  {STAR_OPTIONS.map((opt) => {
                    const isSelected = filters.minRating === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onSetMinRating(opt.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3B2418] text-[#F2B84B] ring-2 ring-[#F2B84B] shadow-xs'
                            : 'bg-white text-[#3B2418] border border-[#C68642]/20 hover:border-[#C68642]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#F2B84B]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brew Method Multi-Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2418]/70 mb-2.5 font-mono">
                  Brew Method
                </label>
                <div className="flex flex-wrap gap-2">
                  {METHODS.map((m) => {
                    const isSelected = filters.methods.includes(m.value);
                    return (
                      <button
                        key={m.value}
                        onClick={() => onToggleMethod(m.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3B2418] text-[#FFF6E9] shadow-xs'
                            : 'bg-white text-[#3B2418] border border-[#C68642]/20 hover:border-[#C68642]/50'
                        }`}
                      >
                        <span>{m.icon}</span>
                        <span>{m.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#F2B84B]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty & Prep Time Slider */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2418]/70 mb-2.5 font-mono">
                    Difficulty Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTIES.map((diff) => {
                      const isSelected = filters.difficulties.includes(diff);
                      return (
                        <button
                          key={diff}
                          onClick={() => onToggleDifficulty(diff)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#C68642] text-white shadow-xs'
                              : 'bg-white text-[#3B2418] border border-[#C68642]/20 hover:border-[#C68642]'
                          }`}
                        >
                          {diff}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prep-Time Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#3B2418]/70 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C68642]" />
                      <span>Max Prep Time</span>
                    </label>
                    <span className="text-xs font-bold text-[#3B2418] font-mono bg-[#C68642]/15 px-2 py-0.5 rounded">
                      ≤ {filters.maxPrepTime} mins
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={filters.maxPrepTime}
                    onChange={(e) => onSetMaxPrepTime(parseInt(e.target.value, 10))}
                    className="w-full accent-[#E8590C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#3B2418]/50 mt-1 font-mono">
                    <span>Fast (2 min)</span>
                    <span>Medium (10 min)</span>
                    <span>Steeped (20 min)</span>
                  </div>
                </div>
              </div>

              {/* Coffee Types Multi-Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2418]/70 mb-2.5 font-mono">
                  Coffee Type
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {allCoffeeTypes.map((type) => {
                    const isSelected = filters.coffeeTypes.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => onToggleCoffeeType(type)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#3B2418] text-[#F2B84B] font-semibold'
                            : 'bg-white text-[#3B2418]/80 border border-[#C68642]/20 hover:bg-[#C68642]/20'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ingredient Include & Exclude filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#C68642]/10">
                {/* Include */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 font-mono">
                    + Include Ingredient
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_INCLUDES.map((ing) => {
                      const isSelected = filters.includeIngredients.includes(ing);
                      return (
                        <button
                          key={ing}
                          onClick={() => onToggleIncludeIngredient(ing)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-700 text-white font-semibold'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          +{ing}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Exclude */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 font-mono">
                    - Exclude Ingredient (e.g. No Dairy)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_EXCLUDES.map((exc) => {
                      const isSelected = filters.excludeIngredients.includes(exc);
                      return (
                        <button
                          key={exc}
                          onClick={() => onToggleExcludeIngredient(exc)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-rose-700 text-white font-semibold'
                              : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {exc === 'dairy' ? 'No Dairy' : `No ${exc}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Apply Button */}
            <div className="p-4 sm:p-5 border-t border-[#C68642]/20 bg-white/80 flex items-center justify-between gap-3">
              <span className="text-xs text-[#3B2418]/70 font-mono">
                {totalResults} matching brews
              </span>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-[#3B2418] hover:bg-[#C68642] text-[#FFF6E9] px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Apply & View {totalResults} Recipes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
