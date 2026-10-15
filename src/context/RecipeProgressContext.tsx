import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'brewbook_recipe_progress';

interface RecipeProgressContextType {
  progressMap: Record<string, number[]>;
  getCompletedSteps: (recipeId: string) => number[];
  isStepCompleted: (recipeId: string, stepIndex: number) => boolean;
  toggleStep: (recipeId: string, stepIndex: number) => void;
  resetRecipeProgress: (recipeId: string) => void;
  markAllStepsCompleted: (recipeId: string, totalSteps: number) => void;
}

const RecipeProgressContext = createContext<RecipeProgressContextType | undefined>(undefined);

export const RecipeProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressMap, setProgressMap] = useState<Record<string, number[]>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored recipe progress:', e);
    }
    return {};
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
    } catch (e) {
      console.warn('Failed to save recipe progress to localStorage:', e);
    }
  }, [progressMap]);

  const getCompletedSteps = useCallback((recipeId: string): number[] => {
    return progressMap[recipeId] || [];
  }, [progressMap]);

  const isStepCompleted = useCallback((recipeId: string, stepIndex: number): boolean => {
    const steps = progressMap[recipeId] || [];
    return steps.includes(stepIndex);
  }, [progressMap]);

  const toggleStep = useCallback((recipeId: string, stepIndex: number) => {
    setProgressMap(prev => {
      const current = prev[recipeId] || [];
      const updated = current.includes(stepIndex)
        ? current.filter(i => i !== stepIndex)
        : [...current, stepIndex].sort((a, b) => a - b);
      return {
        ...prev,
        [recipeId]: updated
      };
    });
  }, []);

  const resetRecipeProgress = useCallback((recipeId: string) => {
    setProgressMap(prev => {
      const next = { ...prev };
      delete next[recipeId];
      return next;
    });
  }, []);

  const markAllStepsCompleted = useCallback((recipeId: string, totalSteps: number) => {
    setProgressMap(prev => ({
      ...prev,
      [recipeId]: Array.from({ length: totalSteps }, (_, i) => i)
    }));
  }, []);

  return (
    <RecipeProgressContext.Provider
      value={{
        progressMap,
        getCompletedSteps,
        isStepCompleted,
        toggleStep,
        resetRecipeProgress,
        markAllStepsCompleted,
      }}
    >
      {children}
    </RecipeProgressContext.Provider>
  );
};

export const useRecipeProgress = () => {
  const context = useContext(RecipeProgressContext);
  if (!context) {
    throw new Error('useRecipeProgress must be used within a RecipeProgressProvider');
  }
  return context;
};
