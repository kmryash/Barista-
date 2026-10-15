import React from 'react';
import { Clock, Lock, Sparkles, Eye, ArrowRight, Star, CheckCircle2, RotateCcw, Coffee } from 'lucide-react';
import { Recipe } from '../types';
import { useRecipeProgress } from '../context/RecipeProgressContext';

interface RecipeCardProps {
  recipe: Recipe;
  isLoggedIn: boolean;
  isPremium: boolean;
  onViewRecipe: (recipe: Recipe) => void;
  onOpenAuth: () => void;
  onOpenBidding: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isLoggedIn,
  isPremium,
  onViewRecipe,
  onOpenAuth,
  onOpenBidding,
}) => {
  const isLocked = !recipe.isFree && !isPremium;
  const { getCompletedSteps, resetRecipeProgress, toggleStep } = useRecipeProgress();

  const completedSteps = getCompletedSteps(recipe.id);
  const totalSteps = recipe.steps?.length || 0;
  const completedCount = completedSteps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const isFullyCompleted = totalSteps > 0 && completedCount === totalSteps;
  const isInProgress = completedCount > 0 && !isFullyCompleted;

  const handleResetProgress = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetRecipeProgress(recipe.id);
  };

  const handleStepClick = (e: React.MouseEvent, stepIdx: number) => {
    e.stopPropagation();
    if (!isLocked) {
      toggleStep(recipe.id, stepIdx);
    }
  };

  return (
    <div
      className={`relative group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
        isLocked
          ? 'bg-stone-50/90 border-[#C68642]/20 hover:border-[#C68642]/40 shadow-xs'
          : 'bg-white border-[#C68642]/25 hover:border-[#C68642] shadow-sm hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* Recipe Header Visual */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-[#3B2418]">
        <img
          src={recipe.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'}
          alt={recipe.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isLocked ? 'filter blur-[3px] opacity-75' : 'opacity-95'
          }`}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2418]/85 via-transparent to-black/30" />

        {/* Method Badge & Free/Premium Tag */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="bg-[#3B2418]/90 text-[#FFF6E9] backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex items-center gap-1 shadow-sm border border-white/10">
            <span>☕</span>
            <span>{recipe.method}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {recipe.isCustom && (
              <span className="bg-[#3B2418]/90 text-[#F2B84B] px-2 py-0.5 rounded-full text-[10px] font-bold font-mono shadow-sm border border-[#F2B84B]/40">
                DB
              </span>
            )}
            {recipe.isFree ? (
              <span className="bg-emerald-600/90 text-white px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                Free Brew
              </span>
            ) : (
              <span className="bg-[#F2B84B] text-[#3B2418] px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm font-mono">
                <Sparkles className="w-3 h-3 text-[#E8590C]" />
                <span>Barista Exclusive</span>
              </span>
            )}
          </div>
        </div>

        {/* Progress Floating Pill over bottom of image */}
        {totalSteps > 0 && !isLocked && completedCount > 0 && (
          <div className="absolute top-12 right-3 z-10">
            {isFullyCompleted ? (
              <span className="inline-flex items-center gap-1 bg-emerald-600/95 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold font-mono shadow-md border border-emerald-400/30 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Brewed 100%</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-[#E8590C]/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold font-mono shadow-md border border-white/20">
                <Coffee className="w-3 h-3" />
                <span>{progressPercent}% Done</span>
              </span>
            )}
          </div>
        )}

        {/* Prep Time & Difficulty Bar at bottom of photo */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/95 font-medium">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
            <Clock className="w-3.5 h-3.5 text-[#F2B84B]" />
            <span>{recipe.prepTimeMins} {recipe.prepTimeMins === 1 ? 'min' : 'mins'}</span>
          </span>
          <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md font-mono text-[11px]">
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-bold tracking-widest text-[#C68642] uppercase font-mono truncate">
              {recipe.coffeeType}
            </span>
            {recipe.rating && (
              <span className="inline-flex items-center gap-1 bg-[#FFF6E9] px-2 py-0.5 rounded-md border border-[#C68642]/30 text-[11px] font-bold text-[#3B2418] shrink-0 font-mono shadow-2xs">
                <Star className="w-3 h-3 fill-[#F2B84B] text-[#F2B84B]" />
                <span>{recipe.rating.toFixed(1)}</span>
                <span className="text-[#3B2418]/50 text-[10px] font-normal">({recipe.ratingCount || 0})</span>
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-[#3B2418] leading-snug line-clamp-2 mb-2">
            {recipe.title}
          </h3>

          <p className="text-xs text-[#3B2418]/70 line-clamp-2 italic mb-3">
            "{recipe.tasteProfile}"
          </p>

          {/* Visual Step Progress Indicator */}
          {totalSteps > 0 && !isLocked && (
            <div className="bg-[#FFF6E9]/70 rounded-2xl p-3 border border-[#C68642]/20 mb-2">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-[#3B2418] flex items-center gap-1.5 text-[11px]">
                  {isFullyCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-emerald-700 font-bold">Brew Guide Complete</span>
                    </>
                  ) : isInProgress ? (
                    <>
                      <Coffee className="w-3.5 h-3.5 text-[#E8590C] shrink-0 animate-bounce" />
                      <span className="text-[#3B2418] font-bold">
                        Brewing Guide · Step {completedSteps[completedSteps.length - 1] + 1}
                      </span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-3.5 h-3.5 text-[#C68642] shrink-0" />
                      <span className="text-[#3B2418]/80 font-medium">Brewing Guide</span>
                    </>
                  )}
                </span>

                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className={`font-bold ${isFullyCompleted ? 'text-emerald-700' : isInProgress ? 'text-[#E8590C]' : 'text-[#3B2418]/60'}`}>
                    {completedCount}/{totalSteps} steps
                  </span>
                  {completedCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetProgress}
                      title="Reset brew progress"
                      className="text-[#3B2418]/40 hover:text-[#E8590C] p-0.5 rounded transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Segmented Step Bar */}
              <div className="flex items-center gap-1.5 mb-1.5">
                {recipe.steps.map((_, stepIdx) => {
                  const isDone = completedSteps.includes(stepIdx);
                  return (
                    <button
                      key={stepIdx}
                      type="button"
                      onClick={(e) => handleStepClick(e, stepIdx)}
                      title={`Step ${stepIdx + 1}: ${isDone ? 'Completed (click to uncheck)' : 'Incomplete (click to complete)'}`}
                      className={`h-2 flex-1 rounded-full transition-all duration-200 cursor-pointer ${
                        isDone
                          ? isFullyCompleted
                            ? 'bg-emerald-500 hover:bg-emerald-600 ring-1 ring-emerald-300'
                            : 'bg-[#E8590C] hover:bg-[#d04f0a] ring-1 ring-[#E8590C]/30'
                          : 'bg-[#C68642]/20 hover:bg-[#C68642]/40'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Individual Step Pip Badges with checkmarks */}
              <div className="flex items-center justify-between text-[10px] text-[#3B2418]/60 pt-0.5">
                {recipe.steps.map((_, stepIdx) => {
                  const isDone = completedSteps.includes(stepIdx);
                  return (
                    <button
                      key={stepIdx}
                      type="button"
                      onClick={(e) => handleStepClick(e, stepIdx)}
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full font-mono font-bold text-[10px] transition-all cursor-pointer ${
                        isDone
                          ? isFullyCompleted
                            ? 'bg-emerald-600 text-white shadow-xs scale-105'
                            : 'bg-[#E8590C] text-white shadow-xs scale-105'
                          : 'bg-white/80 border border-[#C68642]/30 text-[#3B2418]/70 hover:border-[#C68642] hover:text-[#3B2418]'
                      }`}
                      title={`Step ${stepIdx + 1}: ${isDone ? 'Done' : 'Click to mark done'}`}
                    >
                      {isDone ? '✓' : stepIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Locked Card Guard Overlay */}
        {isLocked ? (
          <div className="mt-3 pt-3 border-t border-[#C68642]/15 flex flex-col items-center text-center">
            <div className="w-9 h-9 rounded-full bg-[#3B2418]/10 text-[#3B2418] flex items-center justify-center mb-2">
              <Lock className="w-4 h-4 text-[#E8590C]" />
            </div>
            <p className="text-xs font-semibold text-[#3B2418] mb-1">
              This brew is for Baristas only
            </p>
            <p className="text-[11px] text-[#3B2418]/60 mb-3">
              Unlock with a 30-day Barista pass (from $2)
            </p>

            {isLoggedIn ? (
              <button
                onClick={onOpenBidding}
                className="w-full bg-[#E8590C] hover:bg-[#d04f0a] text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Become a Barista ☕</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full bg-[#3B2418] hover:bg-[#3B2418]/90 text-[#FFF6E9] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Sign in to Unlock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          /* Unlocked Recipe Details CTA */
          <div className="mt-3 pt-3 border-t border-[#C68642]/15 flex items-center justify-between">
            <span className="text-xs text-[#3B2418]/60 font-mono">
              {recipe.servings} {recipe.servings > 1 ? 'cups' : 'cup'}
            </span>
            <button
              onClick={() => onViewRecipe(recipe)}
              className="inline-flex items-center gap-1.5 bg-[#3B2418] hover:bg-[#C68642] text-[#FFF6E9] px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#F2B84B]" />
              <span>{completedCount > 0 ? 'Resume Brew' : 'View Recipe'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
