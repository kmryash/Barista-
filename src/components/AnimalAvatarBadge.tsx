import React from 'react';
import { User } from 'lucide-react';
import { getAnimalById, AnimalAvatar } from '../data/animals';

interface AnimalAvatarBadgeProps {
  avatarId?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

export const AnimalAvatarBadge: React.FC<AnimalAvatarBadgeProps> = ({
  avatarId,
  size = 'md',
  className = '',
  showBorder = true,
}) => {
  const animal: AnimalAvatar | null = getAnimalById(avatarId);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-xl',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-4xl',
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
  }[size];

  if (animal) {
    return (
      <div
        className={`relative shrink-0 rounded-full flex items-center justify-center select-none shadow-xs transition-transform ${sizeClasses} ${animal.bgColor} ${
          showBorder ? `border-2 ${animal.borderColor}` : ''
        } ${className}`}
        title={`${animal.emoji} ${animal.name} · ${animal.coffeePersona}`}
      >
        <span>{animal.emoji}</span>
      </div>
    );
  }

  // Blank Profile Placeholder
  return (
    <div
      className={`relative shrink-0 rounded-full flex items-center justify-center select-none shadow-xs bg-[#EFE8DC] text-[#8C6D58] ${sizeClasses} ${
        showBorder ? 'border-2 border-[#D8C9B5]' : ''
      } ${className}`}
      title="Profile"
    >
      <User className={iconSizes} strokeWidth={2.2} />
    </div>
  );
};
