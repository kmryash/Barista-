import React, { useState } from 'react';
import { X, Plus, Trash2, Coffee, Sparkles, Check, AlertCircle, Image as ImageIcon, Award } from 'lucide-react';
import { BrewMethod, Difficulty, Recipe } from '../types';
import { useAuth } from '../context/AuthContext';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeAdded?: (recipe: Recipe) => void;
}

const PRESET_IMAGES = [
  {
    name: 'V60 Pour Over',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Espresso Crema',
    url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'French Press',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Latte Art Swirl',
    url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cold Brew / Ice',
    url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Moka Pot Classic',
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80',
  },
];

const COFFEE_TYPE_SUGGESTIONS = [
  'Pour Over',
  'Espresso',
  'Cold Brew',
  'Latte',
  'Cappuccino',
  'Flat White',
  'Cortado',
  'Immersion Filter',
  'Stovetop Espresso',
  'AeroPress Filter',
];

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  isOpen,
  onClose,
  onRecipeAdded,
}) => {
  const { isOwner, currentUser } = useAuth();

  // Recipe Form State
  const [title, setTitle] = useState('');
  const [coffeeType, setCoffeeType] = useState('Pour Over');
  const [method, setMethod] = useState<BrewMethod>('V60');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [prepTimeString, setPrepTimeString] = useState<string>('0');
  const [servings, setServings] = useState(1);
  const [tasteProfile, setTasteProfile] = useState('');
  const [isFree, setIsFree] = useState<boolean>(true); // Free vs Paid toggle
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  // Dynamic lists
  const [ingredients, setIngredients] = useState<string[]>([
    '18g single-origin coffee beans (medium-fine grind)',
    '280g filtered water at 93°C (200°F)',
  ]);
  const [steps, setSteps] = useState<string[]>([
    'Rinse paper filter with hot water and discard rinse water.',
    'Add freshly ground coffee to dripper and tare your scale.',
    'Pour 50g of hot water for blooming; swirl gently and wait 45 seconds.',
    'Pour remaining water in steady concentric circles finishing at 2:30.',
    'Swirl the decanter and pour into a warmed ceramic cup.',
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Ingredient handlers
  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, '']);
  };

  const handleUpdateIngredient = (index: number, val: string) => {
    setIngredients(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  // Step handlers
  const handleAddStep = () => {
    setSteps(prev => [...prev, '']);
  };

  const handleUpdateStep = (index: number, val: string) => {
    setSteps(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isOwner) {
      setError('Only the verified BrewBook app owner can add recipes to the database.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for the recipe.');
      return;
    }

    const cleanedIngredients = ingredients.map(i => i.trim()).filter(Boolean);
    if (cleanedIngredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    const cleanedSteps = steps.map(s => s.trim()).filter(Boolean);
    if (cleanedSteps.length === 0) {
      setError('Please add at least one brewing step.');
      return;
    }

    // Prep time validation: Default is 0, can write 1, 3, etc. No floats or invalid words allowed.
    const rawPrep = prepTimeString.trim();
    let finalPrepTime = 0;

    if (rawPrep === '') {
      finalPrepTime = 0;
    } else if (rawPrep.includes('.') || rawPrep.includes(',')) {
      setError('Prep time cannot be a float or decimal (e.g. 1.5). Please enter a whole number like 0, 1, or 3.');
      return;
    } else {
      const wordMap: Record<string, number> = {
        zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
        six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
        fifteen: 15, twenty: 20, thirty: 30, forty: 40, sixty: 60
      };
      const lower = rawPrep.toLowerCase();

      if (wordMap[lower] !== undefined) {
        finalPrepTime = wordMap[lower];
      } else if (!/^\d+$/.test(rawPrep)) {
        setError('Prep time must only contain a whole number (e.g. 0, 1, 3), not words or floats.');
        return;
      } else {
        finalPrepTime = parseInt(rawPrep, 10);
      }
    }

    if (isNaN(finalPrepTime) || finalPrepTime < 0) {
      setError('Prep time must be 0 or greater.');
      return;
    }

    setSaving(true);
    try {
      const recipeDocRef = doc(collection(db, 'recipes'));
      const newRecipe: Recipe = {
        id: recipeDocRef.id,
        title: title.trim(),
        coffeeType: coffeeType.trim() || 'Specialty Coffee',
        method,
        difficulty,
        prepTimeMins: finalPrepTime,
        servings: Number(servings) || 1,
        tasteProfile: tasteProfile.trim() || 'Bright, balanced, and aromatic',
        isFree,
        image: imageUrl.trim() || PRESET_IMAGES[0].url,
        ingredients: cleanedIngredients,
        steps: cleanedSteps,
        isCustom: true,
        createdAt: new Date().toISOString(),
      };

      await setDoc(recipeDocRef, {
        id: newRecipe.id,
        title: newRecipe.title,
        coffeeType: newRecipe.coffeeType,
        method: newRecipe.method,
        difficulty: newRecipe.difficulty,
        prepTimeMins: newRecipe.prepTimeMins,
        servings: newRecipe.servings,
        tasteProfile: newRecipe.tasteProfile,
        isFree: newRecipe.isFree,
        image: newRecipe.image,
        ingredients: newRecipe.ingredients,
        steps: newRecipe.steps,
        createdBy: currentUser?.uid || 'owner',
        createdAt: newRecipe.createdAt,
      });

      setSuccess(true);
      if (onRecipeAdded) {
        onRecipeAdded(newRecipe);
      }

      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setPrepTimeString('0');
        setTasteProfile('');
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error saving recipe to Firestore:', err);
      setError(err?.message || 'Failed to save recipe to database. Please check Firestore connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#FFF6E9] rounded-3xl max-w-2xl w-full border border-[#C68642]/30 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#3B2418] text-[#FFF6E9] flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8590C]/20 border border-[#E8590C]/50 flex items-center justify-center text-[#F2B84B]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Add Recipe to Database</h2>
                <span className="bg-[#E8590C] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full font-mono">
                  Owner Portal
                </span>
              </div>
              <p className="text-xs text-[#FFF6E9]/70 mt-0.5">
                Configure coffee profile, steps, and choose whether it goes to Free or Paid tier.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#3B2418]">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Recipe successfully published to database as {isFree ? 'Free Brew' : 'Paid Barista Exclusive'}!</span>
            </div>
          )}

          {/* ACCESS TIER SELECTOR: FREE VS PAID */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#3B2418] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#E8590C]" />
              <span>Access Tier (Choose Free or Paid)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Free Recipe */}
              <button
                type="button"
                onClick={() => setIsFree(true)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isFree
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-white border-[#C68642]/30 hover:border-[#C68642]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                    <span>☕</span> Free Recipe
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full font-mono">
                    Free Brew
                  </span>
                </div>
                <p className="text-[11px] text-[#3B2418]/70">
                  Accessible to all visitors and free accounts. No pass required to view guide or track steps.
                </p>
              </button>

              {/* Option 2: Paid Recipe */}
              <button
                type="button"
                onClick={() => setIsFree(false)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  !isFree
                    ? 'bg-[#F2B84B]/20 border-[#E8590C] ring-2 ring-[#E8590C]/30'
                    : 'bg-white border-[#C68642]/30 hover:border-[#C68642]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-[#3B2418] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#E8590C]" /> Paid Recipe
                  </span>
                  <span className="bg-[#F2B84B] text-[#3B2418] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full font-mono">
                    Barista League
                  </span>
                </div>
                <p className="text-[11px] text-[#3B2418]/70">
                  Exclusive to paid Barista Pass members & Owner. Locked for non-paying users.
                </p>
              </button>
            </div>
          </div>

          {/* Title & Coffee Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3B2418]">Recipe Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Geisha Citrus Pour Over"
                maxLength={120}
                required
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#C68642]/30 focus:outline-hidden focus:ring-2 focus:ring-[#E8590C] text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3B2418]">Coffee Type</label>
              <input
                type="text"
                value={coffeeType}
                onChange={e => setCoffeeType(e.target.value)}
                placeholder="e.g. Pour Over, Cold Brew"
                maxLength={50}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#C68642]/30 focus:outline-hidden focus:ring-2 focus:ring-[#E8590C] text-sm"
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {COFFEE_TYPE_SUGGESTIONS.slice(0, 5).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCoffeeType(s)}
                    className="text-[10px] font-mono px-1.5 py-0.5 bg-[#C68642]/10 hover:bg-[#C68642]/20 rounded text-[#3B2418] cursor-pointer"
                  >
                    +{s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Brew Method & Difficulty & Prep Time & Servings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3B2418]">Method</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as BrewMethod)}
                className="w-full px-2.5 py-2 bg-white rounded-xl border border-[#C68642]/30 text-xs font-medium focus:ring-2 focus:ring-[#E8590C]"
              >
                <option value="V60">V60</option>
                <option value="espresso machine">Espresso Machine</option>
                <option value="French press">French Press</option>
                <option value="AeroPress">AeroPress</option>
                <option value="moka pot">Moka Pot</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3B2418]">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-2.5 py-2 bg-white rounded-xl border border-[#C68642]/30 text-xs font-medium focus:ring-2 focus:ring-[#E8590C]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Master">Master</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3B2418]">Prep Time (min)</label>
              <input
                type="text"
                inputMode="numeric"
                value={prepTimeString}
                onChange={e => {
                  setPrepTimeString(e.target.value);
                  setError(null);
                }}
                placeholder="0"
                maxLength={4}
                className="w-full px-2.5 py-2 bg-white rounded-xl border border-[#C68642]/30 text-xs font-medium focus:ring-2 focus:ring-[#E8590C]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3B2418]">Servings</label>
              <input
                type="number"
                min={1}
                max={12}
                value={servings}
                onChange={e => setServings(parseInt(e.target.value, 10) || 1)}
                className="w-full px-2.5 py-2 bg-white rounded-xl border border-[#C68642]/30 text-xs font-medium focus:ring-2 focus:ring-[#E8590C]"
              />
            </div>
          </div>

          {/* Taste Profile */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#3B2418]">Taste Profile</label>
            <input
              type="text"
              value={tasteProfile}
              onChange={e => setTasteProfile(e.target.value)}
              placeholder="e.g. Bright notes of bergamot, orange blossom, and raw sugar sweetness"
              maxLength={150}
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#C68642]/30 focus:outline-hidden focus:ring-2 focus:ring-[#E8590C] text-sm"
            />
          </div>

          {/* Photo Preset & Image URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#3B2418] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#E8590C]" />
              <span>Recipe Photo</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all h-16 group cursor-pointer ${
                    imageUrl === preset.url
                      ? 'border-[#E8590C] ring-2 ring-[#E8590C]/40'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-mono text-center truncate px-1 py-0.5">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="Or enter custom image URL (https://...)"
              className="w-full px-3 py-1.5 bg-white rounded-xl border border-[#C68642]/30 text-xs text-[#3B2418]"
            />
          </div>

          {/* Ingredients list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#3B2418]">Ingredients</label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-xs text-[#E8590C] font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs font-mono text-[#3B2418]/60">•</span>
                  <input
                    type="text"
                    value={ing}
                    onChange={e => handleUpdateIngredient(idx, e.target.value)}
                    placeholder={`Ingredient ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-[#C68642]/30 text-xs text-[#3B2418]"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-1.5 text-[#3B2418]/50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#3B2418]">Brewing Steps (Guide)</label>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs text-[#E8590C] font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>
            <div className="space-y-2">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-5 text-center text-xs font-mono font-bold text-[#E8590C] pt-2">
                    {idx + 1}.
                  </span>
                  <textarea
                    rows={2}
                    value={st}
                    onChange={e => handleUpdateStep(idx, e.target.value)}
                    placeholder={`Step ${idx + 1} instructions...`}
                    className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-[#C68642]/30 text-xs text-[#3B2418] resize-none"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1.5 text-[#3B2418]/50 hover:text-rose-600 transition-colors cursor-pointer pt-2"
                      title="Remove step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-[#C68642]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#3B2418] hover:bg-[#C68642]/15 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E8590C] hover:bg-[#d04f0a] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Coffee className="w-4 h-4 text-[#F2B84B]" />
                  <span>Publish Recipe to Database ({isFree ? 'Free' : 'Paid'})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
