import React, { useState } from 'react';
import { X, Check, Search, Sparkles } from 'lucide-react';
import { ANIMAL_AVATARS, AnimalAvatar, getAnimalById } from '../data/animals';
import { useAuth } from '../context/AuthContext';
import { AnimalAvatarBadge } from './AnimalAvatarBadge';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarSaved?: (avatarId: string) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  onAvatarSaved,
}) => {
  const { userProfile, updateAvatar } = useAuth();
  const [selectedId, setSelectedId] = useState<string>(userProfile?.avatarId || 'lion');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const currentChosen: AnimalAvatar | null = getAnimalById(selectedId) || ANIMAL_AVATARS[0];

  const filteredAnimals = ANIMAL_AVATARS.filter(a => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.coffeePersona.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );
  });

  const handleSave = async (animalIdToSave: string = selectedId) => {
    setSaving(true);
    try {
      await updateAvatar(animalIdToSave);
      setSuccessNotice(true);
      if (onAvatarSaved) onAvatarSaved(animalIdToSave);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to save avatar:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#FFF6E9] rounded-3xl max-w-2xl w-full border border-[#C68642]/30 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col text-[#3B2418]">
        {/* Header */}
        <div className="bg-[#3B2418] text-[#FFF6E9] p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F2B84B] text-[#3B2418] text-[11px] font-black uppercase tracking-wider font-mono">
              25 Animal Avatars
            </span>
            <span className="text-xs text-[#FFF6E9]/80 font-medium hidden sm:inline">
              Choose your profile picture
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black mt-2 text-[#FFF6E9] tracking-tight">
            Choose Your Barista Animal
          </h2>
          <p className="text-xs sm:text-sm text-[#FFF6E9]/80 mt-1 max-w-xl">
            Select one of 25 unique animal personas to represent your taste and brewing style across BrewBook.
          </p>

          {/* Active Selection Preview Card inside Header */}
          {currentChosen && (
            <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AnimalAvatarBadge avatarId={currentChosen.id} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">
                      {currentChosen.name}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F2B84B] text-[#3B2418] font-bold font-mono">
                      {currentChosen.coffeePersona}
                    </span>
                  </div>
                  <p className="text-xs text-[#FFF6E9]/75 mt-0.5 line-clamp-1">
                    {currentChosen.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSave(currentChosen.id)}
                disabled={saving}
                className="shrink-0 bg-[#F2B84B] hover:bg-[#e2aa3e] text-[#3B2418] font-black px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : successNotice ? 'Saved! ✓' : 'Set as Avatar'}
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#C68642]/20 bg-[#FFF6E9] shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C6D58] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 25 animals (e.g. Panda, Tiger, Fox, Espresso, Cold Brew)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C68642]/30 bg-white text-[#3B2418] placeholder-[#8C6D58] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C68642]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C6D58] hover:text-[#3B2418]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 25 Animals Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#FAF4ED]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {filteredAnimals.map((animal) => {
              const isSelected = selectedId === animal.id;
              const isUserCurrent = userProfile?.avatarId === animal.id;

              return (
                <button
                  key={animal.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(animal.id);
                  }}
                  onDoubleClick={() => {
                    setSelectedId(animal.id);
                    handleSave(animal.id);
                  }}
                  className={`relative p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-white ring-2 ring-[#3B2418] shadow-md scale-[1.03]'
                      : 'bg-white/80 hover:bg-white hover:shadow-xs border border-[#C68642]/15'
                  }`}
                >
                  {/* Selected / Current Check badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#3B2418] text-[#F2B84B] flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Animal Badge */}
                  <AnimalAvatarBadge avatarId={animal.id} size="md" className="group-hover:scale-110 transition-transform" />

                  {/* Name */}
                  <div className="mt-2 font-black text-xs text-[#3B2418] tracking-tight">
                    {animal.name}
                  </div>

                  {/* Persona Tag */}
                  <div className="text-[10px] text-[#8C6D58] font-medium leading-tight mt-0.5 line-clamp-1">
                    {animal.coffeePersona}
                  </div>

                  {isUserCurrent && (
                    <span className="mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                      Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {filteredAnimals.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm font-semibold text-[#8C6D58]">No animals found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-[#E8590C] underline cursor-pointer"
              >
                Reset search
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FFF6E9] border-t border-[#C68642]/20 flex items-center justify-between shrink-0">
          <div className="text-xs text-[#8C6D58]">
            <span className="font-semibold text-[#3B2418]">Tip:</span> Click any animal to preview, then hit Save.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#3B2418] hover:bg-[#C68642]/15 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(selectedId)}
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#3B2418] text-[#FFF6E9] hover:bg-[#3B2418]/90 transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F2B84B]" />
              <span>{saving ? 'Saving...' : successNotice ? 'Avatar Updated!' : 'Select & Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
