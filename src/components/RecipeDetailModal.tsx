import React, { useState } from 'react';
import { X, Clock, Coffee, Sparkles, CheckCircle2, Circle, Heart, Share2, Star, ThumbsUp, RotateCcw, Trash2, Lightbulb, Thermometer, Sliders, Flame, Zap, Wrench } from 'lucide-react';
import { Recipe } from '../types';
import { useRecipeProgress } from '../context/RecipeProgressContext';
import { useAuth } from '../context/AuthContext';
import { getExpertBrewingAdvice } from '../utils/proTips';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onOpenBidding: () => void;
  isPremium: boolean;
  onRateRecipe: (recipeId: string, stars: number) => Promise<void>;
  onDeleteRecipe?: (recipeId: string) => Promise<void>;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onOpenBidding,
  isPremium,
  onRateRecipe,
  onDeleteRecipe,
}) => {
  const { isOwner } = useAuth();
  const { getCompletedSteps, toggleStep, resetRecipeProgress, markAllStepsCompleted } = useRecipeProgress();
  const [copied, setCopied] = useState(false);
  const [hoverStar, setHoverStar] = useState<number | null>(null);
  const [ratedSuccess, setRatedSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showProTips, setShowProTips] = useState(false);

  if (!recipe) return null;

  const proTips = getExpertBrewingAdvice(recipe.method, recipe.coffeeType);

  const completedSteps = getCompletedSteps(recipe.id);
  const totalSteps = recipe.steps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0;
  const isFullyCompleted = totalSteps > 0 && completedSteps.length === totalSteps;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStarClick = async (starValue: number) => {
    await onRateRecipe(recipe.id, starValue);
    setRatedSuccess(true);
    setTimeout(() => setRatedSuccess(false), 3000);
  };

  const currentDisplayRating = recipe.rating || 4.8;
  const currentDisplayCount = recipe.ratingCount || 24;
  const userStar = recipe.userRating;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#FFF6E9] rounded-3xl max-w-2xl w-full border border-[#C68642]/30 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Hero Banner */}
        <div className="relative h-60 sm:h-72 w-full bg-[#3B2418] shrink-0">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'}
            alt={recipe.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFF6E9] via-transparent to-black/40" />

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#3B2418] text-[#F2B84B] px-3 py-1 rounded-full text-xs font-bold capitalize font-mono">
                {recipe.method}
              </span>
              <span className="bg-[#C68642] text-white px-3 py-1 rounded-full text-xs font-bold">
                {recipe.difficulty}
              </span>

              {/* Star Rating Header Badge */}
              <span className="bg-[#F2B84B] text-[#3B2418] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 font-mono shadow-xs">
                <Star className="w-3.5 h-3.5 fill-[#3B2418] text-[#3B2418]" />
                <span>{currentDisplayRating.toFixed(1)}</span>
                <span className="opacity-70 font-normal">({currentDisplayCount})</span>
              </span>

              {recipe.isFree ? (
                <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  Free
                </span>
              ) : (
                <span className="bg-[#E8590C] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  Premium
                </span>
              )}

              {recipe.isCustom && (
                <span className="bg-[#3B2418] text-[#F2B84B] border border-[#F2B84B]/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono">
                  Database Recipe
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#3B2418] leading-tight">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Recipe Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#3B2418]">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-white/80 p-3.5 rounded-2xl border border-[#C68642]/20 text-center text-xs">
            <div>
              <div className="text-[#C68642] font-semibold">Prep Time</div>
              <div className="text-base font-bold text-[#3B2418] font-mono mt-0.5">
                {recipe.prepTimeMins} {recipe.prepTimeMins === 1 ? 'min' : 'mins'}
              </div>
            </div>
            <div className="border-x border-[#C68642]/20">
              <div className="text-[#C68642] font-semibold">Servings</div>
              <div className="text-base font-bold text-[#3B2418] font-mono mt-0.5">
                {recipe.servings} {recipe.servings > 1 ? 'cups' : 'cup'}
              </div>
            </div>
            <div>
              <div className="text-[#C68642] font-semibold">Type</div>
              <div className="text-sm font-bold text-[#3B2418] truncate mt-0.5">
                {recipe.coffeeType}
              </div>
            </div>
          </div>

          {/* Taste Profile Quote Box */}
          <div className="bg-[#3B2418]/5 border-l-4 border-[#C68642] p-4 rounded-r-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-[#C68642] font-mono mb-1">
              Taste Notes & Sensory Profile
            </div>
            <p className="text-sm italic font-medium text-[#3B2418]">
              "{recipe.tasteProfile}"
            </p>
          </div>

          {/* PRO-TIPS INTERACTIVE TOGGLE */}
          <div className="bg-white rounded-2xl border border-[#C68642]/30 overflow-hidden shadow-xs transition-all">
            <div className="p-4 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-white">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    showProTips ? 'bg-[#E8590C] text-white shadow-xs' : 'bg-[#C68642]/15 text-[#E8590C]'
                  }`}
                >
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#3B2418]">Barista Pro-Tips</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F2B84B] text-[#3B2418] font-mono">
                      Masterclass
                    </span>
                  </div>
                  <p className="text-xs text-[#3B2418]/70 mt-0.5">
                    {showProTips
                      ? 'Expert advice revealed for this brew method'
                      : 'Toggle on to reveal master brewing secrets & dialing parameters'}
                  </p>
                </div>
              </div>

              {/* The Toggle Switch Button */}
              <button
                type="button"
                onClick={() => setShowProTips(prev => !prev)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  showProTips ? 'bg-[#E8590C]' : 'bg-stone-300'
                }`}
                role="switch"
                aria-checked={showProTips}
                title={showProTips ? 'Hide Pro-Tips' : 'Show Pro-Tips'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    showProTips ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Expanded Pro-Tips Content */}
            {showProTips && (
              <div className="p-4 sm:p-5 border-t border-[#C68642]/20 bg-[#FFF6E9]/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between text-xs text-[#E8590C] font-bold font-mono">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F2B84B]" />
                    <span>{proTips.methodHeadline}</span>
                  </span>
                  <span className="text-stone-500 font-normal capitalize">
                    {recipe.method} · {recipe.coffeeType}
                  </span>
                </div>

                {/* Key Brewing Parameters: Temperature & Grind Dial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Temperature */}
                  <div className="bg-white p-3 rounded-xl border border-[#C68642]/20">
                    <div className="font-bold text-[#3B2418] flex items-center gap-1.5 text-xs mb-1">
                      <Thermometer className="w-3.5 h-3.5 text-[#E8590C]" />
                      <span>Water Temperature & Quality</span>
                    </div>
                    <p className="text-[11px] text-[#3B2418]/80 leading-relaxed font-mono">
                      {proTips.temperature}
                    </p>
                  </div>

                  {/* Grind Dial */}
                  <div className="bg-white p-3 rounded-xl border border-[#C68642]/20">
                    <div className="font-bold text-[#3B2418] flex items-center gap-1.5 text-xs mb-1">
                      <Sliders className="w-3.5 h-3.5 text-[#E8590C]" />
                      <span>Grind Size Calibration</span>
                    </div>
                    <p className="text-[11px] text-[#3B2418]/80 leading-relaxed">
                      {proTips.grindSetting}
                    </p>
                  </div>
                </div>

                {/* Golden Rule */}
                <div className="bg-amber-500/10 border-l-4 border-[#F2B84B] p-3 rounded-r-xl text-xs space-y-1">
                  <div className="font-bold text-[#3B2418] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#E8590C]" />
                    <span>Barista's Golden Rule</span>
                  </div>
                  <p className="text-[11px] text-[#3B2418]/90 leading-relaxed">
                    {proTips.goldenRule}
                  </p>
                </div>

                {/* Extraction Secret */}
                <div className="bg-orange-500/10 border-l-4 border-[#E8590C] p-3 rounded-r-xl text-xs space-y-1">
                  <div className="font-bold text-[#3B2418] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#E8590C]" />
                    <span>The Master Extraction Secret</span>
                  </div>
                  <p className="text-[11px] text-[#3B2418]/90 leading-relaxed">
                    {proTips.baristaSecret}
                  </p>
                </div>

                {/* Troubleshooting */}
                <div className="bg-white p-3 rounded-xl border border-[#C68642]/20 text-xs space-y-1">
                  <div className="font-bold text-[#3B2418] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#C68642]" />
                    <span>Dialing & Taste Troubleshooting</span>
                  </div>
                  <p className="text-[11px] text-[#3B2418]/80 leading-relaxed">
                    {proTips.troubleshooting}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ingredients Checklist */}
          <div>
            <h3 className="text-base font-bold text-[#3B2418] mb-3 flex items-center gap-2">
              <span>Ingredients & Proportions</span>
              <span className="text-xs font-normal text-[#3B2418]/60">({recipe.ingredients.length} items)</span>
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#C68642]/15 text-sm font-medium"
                >
                  <span className="text-[#E8590C] font-bold font-mono mt-0.5">▪</span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-Step Interactive Guide */}
          <div>
            <div className="bg-[#FFF6E9] p-4 rounded-2xl border border-[#C68642]/25 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#3B2418]">
                    Brewing Guide Steps
                  </h3>
                  {isFullyCompleted && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
                      Completed!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#C68642]">
                    {completedSteps.length} of {recipe.steps.length} completed ({progressPercent}%)
                  </span>
                  {completedSteps.length > 0 && (
                    <button
                      type="button"
                      onClick={() => resetRecipeProgress(recipe.id)}
                      className="text-xs text-[#3B2418]/60 hover:text-[#E8590C] inline-flex items-center gap-1 font-medium transition-colors cursor-pointer"
                      title="Reset brew progress"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Visual Linear / Segmented Progress Bar */}
              <div className="h-2.5 w-full bg-[#C68642]/15 rounded-full overflow-hidden flex gap-1 p-0.5 mb-2">
                {recipe.steps.map((_, stepIdx) => {
                  const isDone = completedSteps.includes(stepIdx);
                  return (
                    <div
                      key={stepIdx}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        isDone
                          ? isFullyCompleted
                            ? 'bg-emerald-500 shadow-xs'
                            : 'bg-[#E8590C] shadow-xs'
                          : 'bg-transparent'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#3B2418]/70">
                <span>Check off each step as you brew to track progress.</span>
                {!isFullyCompleted && (
                  <button
                    type="button"
                    onClick={() => markAllStepsCompleted(recipe.id, recipe.steps.length)}
                    className="text-[#E8590C] hover:text-[#d04f0a] font-bold cursor-pointer transition-colors"
                  >
                    Mark all done ✓
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {recipe.steps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(recipe.id, idx)}
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300 text-stone-500'
                        : 'bg-white border-[#C68642]/20 hover:border-[#C68642] shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(recipe.id, idx);
                      }}
                      className="mt-0.5 shrink-0 cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#C68642] hover:text-[#E8590C] transition-colors" />
                      )}
                    </button>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#C68642] font-mono mb-0.5 flex items-center gap-2">
                        <span>Step {idx + 1}</span>
                        {isDone && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-semibold">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${isDone ? 'line-through text-stone-400' : 'font-medium text-[#3B2418]'}`}>
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive "Rate this Recipe 1-5 Stars" Card */}
          <div className="bg-white rounded-2xl border-2 border-[#C68642]/30 p-5 shadow-sm text-center space-y-3">
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF6E9] text-[#3B2418] text-xs font-bold uppercase tracking-wider font-mono mb-1.5">
                <Coffee className="w-3.5 h-3.5 text-[#C68642]" />
                <span>Brewed This Cup?</span>
              </div>
              <h4 className="text-base font-bold text-[#3B2418]">
                Rate this Recipe (1 to 5 Stars)
              </h4>
              <p className="text-xs text-[#3B2418]/70 max-w-sm mt-0.5">
                Your rating helps fellow baristas discover the best brews.
              </p>
            </div>

            {/* 1-5 Interactive Stars */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((starNum) => {
                const isFilled = hoverStar !== null ? starNum <= hoverStar : (userStar ? starNum <= userStar : starNum <= Math.round(currentDisplayRating));
                return (
                  <button
                    key={starNum}
                    type="button"
                    onMouseEnter={() => setHoverStar(starNum)}
                    onMouseLeave={() => setHoverStar(null)}
                    onClick={() => handleStarClick(starNum)}
                    className="p-1 rounded-lg transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                    title={`Rate ${starNum} star${starNum > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        isFilled
                          ? 'fill-[#F2B84B] text-[#F2B84B] drop-shadow-xs'
                          : 'fill-stone-100 text-stone-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Rating Feedback and Community Stats */}
            <div className="text-xs text-[#3B2418]/80 font-mono flex items-center justify-center gap-2 pt-1 border-t border-[#C68642]/10">
              <span>Community Score:</span>
              <span className="font-bold text-[#3B2418] text-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#F2B84B] text-[#F2B84B]" />
                <span>{currentDisplayRating.toFixed(1)} / 5.0</span>
              </span>
              <span className="text-[#3B2418]/50">({currentDisplayCount} ratings)</span>
            </div>

            {userStar && (
              <div className="bg-emerald-50 text-emerald-800 text-xs py-1.5 px-3 rounded-xl font-medium inline-block animate-fade-in">
                ✓ You rated this {userStar} star{userStar > 1 ? 's' : ''}! Thank you for your feedback.
              </div>
            )}
            {ratedSuccess && !userStar && (
              <div className="bg-emerald-50 text-emerald-800 text-xs py-1.5 px-3 rounded-xl font-medium inline-block animate-fade-in">
                ✓ Rating recorded! Community stars updated.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#C68642]/20 flex items-center justify-between shrink-0 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#3B2418] hover:bg-[#C68642]/10 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#C68642]" />
              <span>{copied ? 'Link Copied!' : 'Share Recipe'}</span>
            </button>

            {isOwner && recipe.isCustom && onDeleteRecipe && (
              <div>
                {confirmDelete ? (
                  <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl">
                    <span className="text-[11px] text-rose-800 font-bold">Delete permanently?</span>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={async () => {
                        setDeleting(true);
                        try {
                          await onDeleteRecipe(recipe.id);
                          onClose();
                        } finally {
                          setDeleting(false);
                        }
                      }}
                      className="text-xs bg-rose-600 text-white font-bold px-2 py-0.5 rounded cursor-pointer hover:bg-rose-700"
                    >
                      {deleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs text-stone-500 hover:text-stone-800 px-1.5 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Owner: Remove from Firestore database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete from DB</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isPremium && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBidding();
                }}
                className="bg-[#E8590C] hover:bg-[#d04f0a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Unlock All 25 Brews</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#3B2418] text-[#FFF6E9] hover:bg-[#3B2418]/90 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
