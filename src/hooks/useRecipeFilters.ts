import { useState, useEffect, useMemo, useCallback } from 'react';
import { Recipe, BrewMethod, Difficulty, FilterState } from '../types';
import { SEEDED_RECIPES } from '../data/recipes';
import { collection, doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

const BASE_RATINGS: Record<string, { rating: number; count: number }> = {
  'free-recipe-1': { rating: 4.8, count: 42 },
  'free-recipe-2': { rating: 4.7, count: 38 },
  'free-recipe-3': { rating: 4.9, count: 65 },
  'free-recipe-4': { rating: 4.9, count: 54 },
  'free-recipe-5': { rating: 4.8, count: 82 },
  'premium-recipe-6': { rating: 5.0, count: 91 },
  'premium-recipe-7': { rating: 4.9, count: 73 },
  'premium-recipe-8': { rating: 4.8, count: 29 },
  'premium-recipe-9': { rating: 4.9, count: 47 },
  'premium-recipe-10': { rating: 4.7, count: 34 },
  'premium-recipe-11': { rating: 4.6, count: 26 },
  'premium-recipe-12': { rating: 4.8, count: 41 },
  'premium-recipe-13': { rating: 4.7, count: 33 },
  'premium-recipe-14': { rating: 4.9, count: 58 },
  'premium-recipe-15': { rating: 4.8, count: 39 },
  'premium-recipe-16': { rating: 4.7, count: 44 },
  'premium-recipe-17': { rating: 4.8, count: 27 },
  'premium-recipe-18': { rating: 4.9, count: 36 },
  'premium-recipe-19': { rating: 4.9, count: 51 },
  'premium-recipe-20': { rating: 4.9, count: 63 },
  'premium-recipe-21': { rating: 4.7, count: 22 },
  'premium-recipe-22': { rating: 4.8, count: 31 },
  'premium-recipe-23': { rating: 4.6, count: 19 },
  'premium-recipe-24': { rating: 5.0, count: 78 },
  'premium-recipe-25': { rating: 4.8, count: 45 },
};

const DEFAULT_FILTERS: FilterState = {
  coffeeTypes: [],
  methods: [],
  difficulties: [],
  maxPrepTime: 20,
  includeIngredients: [],
  excludeIngredients: [],
  searchQuery: '',
  minRating: 0,
};

export function useRecipeFilters() {
  // Initialize state from URL params if present
  const [filters, setFilters] = useState<FilterState>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        coffeeTypes: params.get('types') ? params.get('types')!.split(',').filter(Boolean) : [],
        methods: params.get('methods') ? (params.get('methods')!.split(',').filter(Boolean) as BrewMethod[]) : [],
        difficulties: params.get('diff') ? (params.get('diff')!.split(',').filter(Boolean) as Difficulty[]) : [],
        maxPrepTime: params.get('maxTime') ? parseInt(params.get('maxTime')!, 10) : 20,
        includeIngredients: params.get('inc') ? params.get('inc')!.split(',').filter(Boolean) : [],
        excludeIngredients: params.get('exc') ? params.get('exc')!.split(',').filter(Boolean) : [],
        searchQuery: params.get('q') || '',
        minRating: params.get('stars') ? parseFloat(params.get('stars')!) : 0,
      };
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  // Dynamic user & community ratings map
  const [dynamicRatings, setDynamicRatings] = useState<Record<string, { rating: number; count: number; userRating?: number }>>(() => {
    try {
      const stored = localStorage.getItem('brewbook_recipe_ratings');
      if (stored) {
        return { ...BASE_RATINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      // fallback
    }
    return BASE_RATINGS;
  });

  // Real-time Firestore sync for community star ratings
  useEffect(() => {
    try {
      const ratingsRef = collection(db, 'ratings');
      const unsubscribe = onSnapshot(ratingsRef, (snapshot) => {
        const ratingsByRecipe: Record<string, number[]> = {};
        const currentUserId = auth.currentUser?.uid;
        const userRatingsMap: Record<string, number> = {};

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.recipeId && typeof data.rating === 'number') {
            if (!ratingsByRecipe[data.recipeId]) {
              ratingsByRecipe[data.recipeId] = [];
            }
            ratingsByRecipe[data.recipeId].push(data.rating);

            if (currentUserId && data.userId === currentUserId) {
              userRatingsMap[data.recipeId] = data.rating;
            }
          }
        });

        setDynamicRatings((prev) => {
          const updated = { ...prev };
          Object.keys(BASE_RATINGS).forEach((recipeId) => {
            const base = BASE_RATINGS[recipeId];
            const liveStars = ratingsByRecipe[recipeId] || [];
            const totalCount = base.count + liveStars.length;
            const sumStars = (base.rating * base.count) + liveStars.reduce((a, b) => a + b, 0);
            const avgRating = totalCount > 0 ? Math.round((sumStars / totalCount) * 10) / 10 : base.rating;

            updated[recipeId] = {
              rating: avgRating,
              count: totalCount,
              userRating: userRatingsMap[recipeId] || prev[recipeId]?.userRating,
            };
          });
          return updated;
        });
      }, (err) => {
        console.warn('Community ratings snapshot listener notice:', err);
      });

      return () => unsubscribe();
    } catch (e) {
      // ignore
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('brewbook_recipe_ratings', JSON.stringify(dynamicRatings));
    } catch (e) {
      // ignore
    }
  }, [dynamicRatings]);

  // Keep URL in sync with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.coffeeTypes.length > 0) params.set('types', filters.coffeeTypes.join(','));
    if (filters.methods.length > 0) params.set('methods', filters.methods.join(','));
    if (filters.difficulties.length > 0) params.set('diff', filters.difficulties.join(','));
    if (filters.maxPrepTime < 20) params.set('maxTime', filters.maxPrepTime.toString());
    if (filters.includeIngredients.length > 0) params.set('inc', filters.includeIngredients.join(','));
    if (filters.excludeIngredients.length > 0) params.set('exc', filters.excludeIngredients.join(','));
    if (filters.searchQuery.trim().length > 0) params.set('q', filters.searchQuery.trim());
    if (filters.minRating > 0) params.set('stars', filters.minRating.toString());

    const queryString = params.toString();
    const newRelativePathQuery = window.location.pathname + (queryString ? `?${queryString}` : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [filters]);

  // Dynamic custom recipes loaded from Firestore database
  const [firestoreRecipes, setFirestoreRecipes] = useState<Recipe[]>([]);

  // Real-time Firestore sync for database recipes added by Owner
  useEffect(() => {
    try {
      const recipesRef = collection(db, 'recipes');
      const unsubscribe = onSnapshot(recipesRef, (snapshot) => {
        const loaded: Recipe[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            id: docSnap.id,
            title: data.title || 'Untitled Recipe',
            coffeeType: data.coffeeType || 'Specialty Coffee',
            method: data.method || 'V60',
            difficulty: data.difficulty || 'Intermediate',
            prepTimeMins: typeof data.prepTimeMins === 'number' ? data.prepTimeMins : 0,
            ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
            steps: Array.isArray(data.steps) ? data.steps : [],
            servings: typeof data.servings === 'number' ? data.servings : 1,
            tasteProfile: data.tasteProfile || '',
            isFree: data.isFree === true,
            image: data.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
            isCustom: true,
            createdAt: data.createdAt,
            createdBy: data.createdBy,
          });
        });
        setFirestoreRecipes(loaded);
      }, (err) => {
        console.warn('Firestore recipes snapshot notice:', err);
      });

      return () => unsubscribe();
    } catch (e) {
      // ignore
    }
  }, []);

  // Merge Firestore recipes (at the front so newest appear first) with seeded recipes
  const allRawRecipes = useMemo(() => {
    const firestoreIds = new Set(firestoreRecipes.map(r => r.id));
    const nonDuplicatedSeeds = SEEDED_RECIPES.filter(r => !firestoreIds.has(r.id));
    return [...firestoreRecipes, ...nonDuplicatedSeeds];
  }, [firestoreRecipes]);

  // Merge seed recipes with dynamic community ratings
  const recipesWithRatings = useMemo(() => {
    return allRawRecipes.map((recipe) => {
      const stats = dynamicRatings[recipe.id] || BASE_RATINGS[recipe.id] || { rating: 5.0, count: 1 };
      return {
        ...recipe,
        rating: stats.rating,
        ratingCount: stats.count,
        userRating: stats.userRating,
      };
    });
  }, [allRawRecipes, dynamicRatings]);

  // Extract all available coffee types and common ingredients for easy multi-select chips
  const allCoffeeTypes = useMemo(() => {
    const set = new Set<string>();
    allRawRecipes.forEach((r) => set.add(r.coffeeType));
    return Array.from(set).sort();
  }, [allRawRecipes]);

  const allIngredients = useMemo(() => {
    return ['milk', 'oat milk', 'sugar', 'honey', 'cardamom', 'cinnamon', 'ice', 'vanilla', 'cacao', 'butter'];
  }, []);

  // Filter recipes using strict AND logic including the Star Rating filter
  const filteredRecipes = useMemo(() => {
    return recipesWithRatings.filter((recipe) => {
      // 1. Star Rating filter (e.g. 4+ stars)
      if (filters.minRating > 0) {
        if ((recipe.rating || 0) < filters.minRating) {
          return false;
        }
      }

      // 2. Text Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchTitle = recipe.title.toLowerCase().includes(q);
        const matchTaste = recipe.tasteProfile.toLowerCase().includes(q);
        const matchType = recipe.coffeeType.toLowerCase().includes(q);
        const matchMethod = recipe.method.toLowerCase().includes(q);
        const matchIngredient = recipe.ingredients.some((ing) => ing.toLowerCase().includes(q));

        if (!matchTitle && !matchTaste && !matchType && !matchMethod && !matchIngredient) {
          return false;
        }
      }

      // 3. Coffee Type (multi-select: any of selected types)
      if (filters.coffeeTypes.length > 0) {
        if (!filters.coffeeTypes.includes(recipe.coffeeType)) {
          return false;
        }
      }

      // 4. Brew Method (multi-select)
      if (filters.methods.length > 0) {
        if (!filters.methods.includes(recipe.method)) {
          return false;
        }
      }

      // 5. Difficulty (multi-select)
      if (filters.difficulties.length > 0) {
        if (!filters.difficulties.includes(recipe.difficulty)) {
          return false;
        }
      }

      // 6. Prep-time slider
      if (recipe.prepTimeMins > filters.maxPrepTime) {
        return false;
      }

      // 7. Include ingredients (must match all selected inclusions)
      if (filters.includeIngredients.length > 0) {
        const matchesAllInclusions = filters.includeIngredients.every((inc) => {
          const lowerInc = inc.toLowerCase();
          return recipe.ingredients.some((ing) => ing.toLowerCase().includes(lowerInc));
        });
        if (!matchesAllInclusions) return false;
      }

      // 8. Exclude ingredients (must NOT match any excluded ingredients)
      if (filters.excludeIngredients.length > 0) {
        const hasExcluded = filters.excludeIngredients.some((exc) => {
          const lowerExc = exc.toLowerCase();
          if (lowerExc === 'dairy' || lowerExc === 'no dairy') {
            return recipe.ingredients.some((ing) => {
              const text = ing.toLowerCase();
              return text.includes('milk') || text.includes('butter') || text.includes('cream');
            });
          }
          return recipe.ingredients.some((ing) => ing.toLowerCase().includes(lowerExc));
        });
        if (hasExcluded) return false;
      }

      return true;
    });
  }, [recipesWithRatings, filters]);

  // Rate a recipe (1 to 5 stars) - updates community score & personal rating
  const rateRecipe = useCallback(async (recipeId: string, stars: number) => {
    if (stars < 1 || stars > 5) return;

    // Optimistically update local state immediately
    setDynamicRatings((prev) => {
      const current = prev[recipeId] || BASE_RATINGS[recipeId] || { rating: 4.8, count: 20 };
      const hadPreviousRating = typeof current.userRating === 'number';
      const prevRating = current.userRating || 0;

      let newCount = current.count;
      let newSum = current.rating * current.count;

      if (hadPreviousRating) {
        // Adjust existing rating
        newSum = newSum - prevRating + stars;
      } else {
        // Add new rating
        newCount += 1;
        newSum += stars;
      }

      const newAvg = Math.round((newSum / newCount) * 10) / 10;

      return {
        ...prev,
        [recipeId]: {
          rating: newAvg,
          count: newCount,
          userRating: stars,
        },
      };
    });

    // Persist to Firestore if user is authenticated or save locally
    const currentUserId = auth.currentUser?.uid;
    if (currentUserId) {
      try {
        const ratingDocId = `rating_${recipeId}_${currentUserId}`;
        const ratingRef = doc(db, 'ratings', ratingDocId);
        await setDoc(ratingRef, {
          id: ratingDocId,
          recipeId,
          userId: currentUserId,
          rating: stars,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not persist rating to Firestore, kept in local state:', err);
      }
    }
  }, []);

  const toggleCoffeeType = useCallback((type: string) => {
    setFilters((prev) => ({
      ...prev,
      coffeeTypes: prev.coffeeTypes.includes(type)
        ? prev.coffeeTypes.filter((t) => t !== type)
        : [...prev.coffeeTypes, type],
    }));
  }, []);

  const toggleMethod = useCallback((method: BrewMethod) => {
    setFilters((prev) => ({
      ...prev,
      methods: prev.methods.includes(method)
        ? prev.methods.filter((m) => m !== method)
        : [...prev.methods, method],
    }));
  }, []);

  const toggleDifficulty = useCallback((diff: Difficulty) => {
    setFilters((prev) => ({
      ...prev,
      difficulties: prev.difficulties.includes(diff)
        ? prev.difficulties.filter((d) => d !== diff)
        : [...prev.difficulties, diff],
    }));
  }, []);

  const setMaxPrepTime = useCallback((time: number) => {
    setFilters((prev) => ({ ...prev, maxPrepTime: time }));
  }, []);

  const setMinRating = useCallback((rating: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating,
    }));
  }, []);

  const toggleIncludeIngredient = useCallback((ing: string) => {
    setFilters((prev) => ({
      ...prev,
      includeIngredients: prev.includeIngredients.includes(ing)
        ? prev.includeIngredients.filter((i) => i !== ing)
        : [...prev.includeIngredients, ing],
    }));
  }, []);

  const toggleExcludeIngredient = useCallback((ing: string) => {
    setFilters((prev) => ({
      ...prev,
      excludeIngredients: prev.excludeIngredients.includes(ing)
        ? prev.excludeIngredients.filter((i) => i !== ing)
        : [...prev.excludeIngredients, ing],
    }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const isFiltered = useMemo(() => {
    return (
      filters.coffeeTypes.length > 0 ||
      filters.methods.length > 0 ||
      filters.difficulties.length > 0 ||
      filters.maxPrepTime < 20 ||
      filters.minRating > 0 ||
      filters.includeIngredients.length > 0 ||
      filters.excludeIngredients.length > 0 ||
      filters.searchQuery.trim().length > 0
    );
  }, [filters]);

  const deleteRecipe = useCallback(async (recipeId: string) => {
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
    } catch (err) {
      console.error('Error deleting recipe from Firestore:', err);
      throw err;
    }
  }, []);

  return {
    filters,
    filteredRecipes,
    allRawRecipes,
    firestoreRecipes,
    totalRecipesCount: allRawRecipes.length,
    allCoffeeTypes,
    allIngredients,
    isFiltered,
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
  };
}
