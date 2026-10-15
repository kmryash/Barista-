import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RecipeProgressProvider } from './context/RecipeProgressContext';
import { useRecipeFilters } from './hooks/useRecipeFilters';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { BiddingModal } from './components/BiddingModal';
import { BiddingSuccessModal } from './components/BiddingSuccessModal';
import { AuthModal } from './components/AuthModal';
import { SoftPushPrompt } from './components/SoftPushPrompt';
import { AdminNotifications } from './components/AdminNotifications';
import { SettingsPrivacyModal } from './components/SettingsPrivacyModal';
import { AvatarPickerModal } from './components/AvatarPickerModal';
import { LegalPages } from './components/LegalPages';
import { AddRecipeModal } from './components/AddRecipeModal';
import { Footer } from './components/Footer';
import { Recipe, PerkTier } from './types';
import { detectUserCountry } from './services/payment';
import { Sparkles, AlertCircle, RotateCcw } from 'lucide-react';

function MainApp() {
  const { currentUser, userProfile, isOwner } = useAuth();

  // Navigation tabs (Hall of Fame removed as requested)
  const [currentTab, setCurrentTab] = useState<'recipes' | 'admin' | 'privacy'>('recipes');
  const [legalPage, setLegalPage] = useState<'privacy' | 'terms' | 'refund-policy' | 'support' | 'community-guidelines' | 'delete-account' | null>(null);

  // Country / Currency Mode ('IN' for UPI/INR or 'US' for Card/USD)
  const [countryMode, setCountryMode] = useState<'IN' | 'US'>('IN');

  useEffect(() => {
    setCountryMode(detectUserCountry());
  }, []);

  const handleToggleCountry = () => {
    setCountryMode(prev => (prev === 'IN' ? 'US' : 'IN'));
  };

  // Recipe Filters Hook
  const {
    filters,
    filteredRecipes,
    allCoffeeTypes,
    allIngredients,
    isFiltered,
    totalRecipesCount,
    toggleCoffeeType,
    toggleMethod,
    toggleDifficulty,
    setMaxPrepTime,
    setMinRating,
    toggleIncludeIngredient,
    toggleExcludeIngredient,
    setSearchQuery,
    clearAllFilters,
    rateRecipe,
    deleteRecipe,
  } = useRecipeFilters();

  // Modals state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [biddingModalOpen, setBiddingModalOpen] = useState(false);
  const [addRecipeOpen, setAddRecipeOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{
    open: boolean;
    amount: number;
    tier: PerkTier;
    planName: string;
  }>({ open: false, amount: 0, tier: 'barista', planName: '' });

  const [softPushOpen, setSoftPushOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  // Soft push notification trigger after meaningful action (e.g. view recipe or after login)
  const [hasPromptedPush, setHasPromptedPush] = useState(false);

  const handleRecipeCardView = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    if (!hasPromptedPush && !userProfile?.consents.pushNotifications) {
      setTimeout(() => {
        setSoftPushOpen(true);
        setHasPromptedPush(true);
      }, 4000);
    }
  };

  const handleBiddingSuccess = (amountUsd: number, tier: PerkTier, planName: string) => {
    setBiddingModalOpen(false);
    setSuccessModalData({
      open: true,
      amount: amountUsd,
      tier,
      planName,
    });
  };

  const isUserPremium = Boolean(userProfile?.isPremium);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF6E9] font-sans antialiased text-[#3B2418]">
      {/* 1. Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setLegalPage(null);
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAvatarPicker={() => setAvatarPickerOpen(true)}
        onOpenBidding={() => (currentUser ? setBiddingModalOpen(true) : setAuthModalOpen(true))}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenPushPrompt={() => setSoftPushOpen(true)}
        onOpenAddRecipe={() => setAddRecipeOpen(true)}
        totalRecipes={totalRecipesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 sm:pb-32">
        {/* If a dedicated legal page is active */}
        {legalPage ? (
          <LegalPages
            page={legalPage}
            onBack={() => setLegalPage(null)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        ) : currentTab === 'admin' ? (
          /* ADMIN OWNER TAB */
          <AdminNotifications
            onClose={() => setCurrentTab('recipes')}
            onOpenAddRecipe={() => setAddRecipeOpen(true)}
          />
        ) : (
          /* RECIPES CATALOG TAB */
          <div className="space-y-6">
            {/* Hero Welcome Banner */}
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h1 className="text-3xl sm:text-5xl font-black text-[#3B2418] tracking-tight">
                Brew like a barista
              </h1>
            </div>

            {/* Recipe Cards Grid or Empty State */}
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white/70 rounded-3xl border border-[#C68642]/20 max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#FFF6E9] text-[#C68642] flex items-center justify-center mx-auto text-2xl">
                  ☕
                </div>
                <h3 className="text-lg font-bold text-[#3B2418]">No brews match your criteria</h3>
                <p className="text-xs text-[#3B2418]/70">
                  Try clearing some filter chips or adjusting your prep-time slider to discover more recipes.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 bg-[#3B2418] text-[#FFF6E9] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#C68642] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isLoggedIn={Boolean(currentUser)}
                    isPremium={isUserPremium}
                    onViewRecipe={handleRecipeCardView}
                    onOpenAuth={() => setAuthModalOpen(true)}
                    onOpenBidding={() => (currentUser ? setBiddingModalOpen(true) : setAuthModalOpen(true))}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sticky Bottom Dock: Non-scrolling Filter (Left) & Search Icon (Right) */}
      {currentTab === 'recipes' && !legalPage && (
        <FilterBar
          filters={filters}
          allCoffeeTypes={allCoffeeTypes}
          allIngredients={allIngredients}
          totalResults={filteredRecipes.length}
          totalAvailable={totalRecipesCount || 25}
          isFiltered={isFiltered}
          isOwner={isOwner}
          onOpenAddRecipe={() => setAddRecipeOpen(true)}
          onToggleCoffeeType={toggleCoffeeType}
          onToggleMethod={toggleMethod}
          onToggleDifficulty={toggleDifficulty}
          onSetMaxPrepTime={setMaxPrepTime}
          onSetMinRating={setMinRating}
          onToggleIncludeIngredient={toggleIncludeIngredient}
          onToggleExcludeIngredient={toggleExcludeIngredient}
          onSetSearchQuery={setSearchQuery}
          onClearAll={clearAllFilters}
        />
      )}

      {/* 3. Footer */}
      <Footer
        onNavigateLegal={(page) => {
          setLegalPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* MODALS */}
      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe ? (filteredRecipes.find(r => r.id === selectedRecipe.id) || selectedRecipe) : null}
        onClose={() => setSelectedRecipe(null)}
        onOpenBidding={() => (currentUser ? setBiddingModalOpen(true) : setAuthModalOpen(true))}
        isPremium={isUserPremium}
        onRateRecipe={rateRecipe}
        onDeleteRecipe={deleteRecipe}
      />

      {/* Bidding Game Modal */}
      <BiddingModal
        isOpen={biddingModalOpen}
        onClose={() => setBiddingModalOpen(false)}
        onSuccess={handleBiddingSuccess}
        countryMode={countryMode}
        onToggleCountry={handleToggleCountry}
      />

      {/* Membership Pass Success Modal */}
      <BiddingSuccessModal
        isOpen={successModalData.open}
        onClose={() => setSuccessModalData(prev => ({ ...prev, open: false }))}
        amountPaid={successModalData.amount}
        tier={successModalData.tier}
        planName={successModalData.planName}
      />

      {/* Auth Modal (Signup / Login / Age Gate / DPDP Granular Consent) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenPrivacyPolicy={() => {
          setAuthModalOpen(false);
          setLegalPage('privacy');
        }}
        onSuccess={() => setAvatarPickerOpen(true)}
      />

      {/* Avatar Picker Modal (25 Animal Avatars) */}
      <AvatarPickerModal
        isOpen={avatarPickerOpen}
        onClose={() => setAvatarPickerOpen(false)}
      />

      {/* Soft Push Notification Opt-in Prompt */}
      <SoftPushPrompt
        isOpen={softPushOpen}
        onClose={() => setSoftPushOpen(false)}
      />

      {/* Settings & DPDP Privacy Rights Modal */}
      <SettingsPrivacyModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenPrivacyPolicy={() => {
          setSettingsOpen(false);
          setLegalPage('privacy');
        }}
      />

      {/* Owner Add Recipe Modal (Free or Paid) */}
      <AddRecipeModal
        isOpen={addRecipeOpen}
        onClose={() => setAddRecipeOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RecipeProgressProvider>
        <MainApp />
      </RecipeProgressProvider>
    </AuthProvider>
  );
}
