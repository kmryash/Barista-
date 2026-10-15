import React from 'react';
import { Coffee, Crown, Shield, Bell, Settings, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimalAvatarBadge } from './AnimalAvatarBadge';

interface NavbarProps {
  currentTab: 'recipes' | 'admin' | 'privacy';
  onSelectTab: (tab: 'recipes' | 'admin' | 'privacy') => void;
  onOpenAuth: () => void;
  onOpenAvatarPicker: () => void;
  onOpenBidding: () => void;
  onOpenSettings: () => void;
  onOpenPushPrompt: () => void;
  onOpenAddRecipe?: () => void;
  totalRecipes?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenAvatarPicker,
  onOpenBidding,
  onOpenSettings,
  onOpenPushPrompt,
  onOpenAddRecipe,
  totalRecipes,
}) => {
  const { currentUser, userProfile, isOwner } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#FFF6E9]/95 backdrop-blur-md border-b border-[#C68642]/20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Steam Effect */}
          <div
            onClick={() => onSelectTab('recipes')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#3B2418] text-[#F2B84B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Coffee className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-[#3B2418]">BrewBook</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#C68642]/20 text-[#3B2418] font-mono">
                  Specialty
                </span>
              </div>
              <p className="text-[11px] text-[#C68642] -mt-1 hidden sm:block font-medium">
                Artisanal Coffee & Barista League
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('recipes')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentTab === 'recipes'
                  ? 'bg-[#3B2418] text-[#FFF6E9]'
                  : 'text-[#3B2418] hover:bg-[#C68642]/15'
              }`}
            >
              Recipes {totalRecipes ? `(${totalRecipes})` : ''}
            </button>

            {/* Owner Exclusive Push Console link */}
            {isOwner && (
              <button
                onClick={() => onSelectTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-[#E8590C] text-white'
                    : 'bg-[#E8590C]/10 text-[#E8590C] hover:bg-[#E8590C]/20 border border-[#E8590C]/30'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Owner Console</span>
              </button>
            )}

            {/* Owner Direct Add Recipe Button */}
            {isOwner && onOpenAddRecipe && (
              <button
                type="button"
                onClick={onOpenAddRecipe}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer ml-1"
                title="Add recipe to database (Free or Paid)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Recipe</span>
              </button>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Push Notifications soft button */}
            <button
              onClick={onOpenPushPrompt}
              title="Get brew alerts"
              className="p-2 rounded-lg text-[#3B2418] hover:bg-[#C68642]/15 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Premium CTA Button */}
            {!userProfile?.isPremium ? (
              <button
                onClick={onOpenBidding}
                className="hidden sm:flex items-center gap-1.5 bg-[#E8590C] hover:bg-[#d04f0a] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4 text-[#F2B84B]" />
                <span>Become a Barista ☕</span>
              </button>
            ) : (
              <button
                onClick={onOpenBidding}
                className="hidden sm:flex items-center gap-1.5 bg-[#F2B84B] hover:bg-[#e2aa3e] text-[#3B2418] px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Pass Active ☕</span>
              </button>
            )}

            {/* Auth / Profile Area */}
            {currentUser && userProfile ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={onOpenAvatarPicker}
                  title="Choose Barista Animal Avatar (25 animals)"
                  className="relative group p-0.5 rounded-full hover:ring-2 hover:ring-[#F2B84B] transition-all cursor-pointer"
                >
                  <AnimalAvatarBadge avatarId={userProfile.avatarId} size="sm" />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#3B2418] text-[#F2B84B] rounded-full text-[8px] flex items-center justify-center font-bold border border-white shadow-xs">
                    ★
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  title="Settings & DPDP Privacy"
                  className="hidden sm:flex items-center gap-1.5 bg-[#3B2418] text-[#FFF6E9] px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#3B2418]/90 transition-colors cursor-pointer"
                >
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">
                    {userProfile.displayName}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  title="Account Settings"
                  className="p-1.5 rounded-lg text-[#3B2418] hover:bg-[#C68642]/15 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                title="Profile"
                className="p-0.5 rounded-full hover:ring-2 hover:ring-[#C68642] transition-all cursor-pointer group"
                aria-label="Profile"
              >
                <AnimalAvatarBadge avatarId={null} size="sm" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#C68642]/15 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('recipes')}
            className={`py-1 px-2 rounded ${currentTab === 'recipes' ? 'text-[#E8590C] font-bold' : 'text-[#3B2418]'}`}
          >
            Recipes {totalRecipes ? `(${totalRecipes})` : ''}
          </button>
          {isOwner && onOpenAddRecipe && (
            <button
              onClick={onOpenAddRecipe}
              className="py-1 px-2 rounded text-emerald-700 font-bold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Recipe</span>
            </button>
          )}
          {isOwner && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`py-1 px-2 rounded ${currentTab === 'admin' ? 'text-[#E8590C] font-bold' : 'text-[#E8590C]'}`}
            >
              Owner
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
