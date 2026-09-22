import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  size = 'md',
  ariaLabel
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  const boxDimensions = size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  const iconSize = size === 'lg' ? 16 : size === 'sm' ? 12 : 14;

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel || label || 'Checkbox'}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center select-none cursor-pointer group min-w-[36px] min-h-[36px] justify-center ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      <div
        className={`${boxDimensions} rounded-lg border-2 flex items-center justify-center transition-all duration-150 transform group-active:scale-90 ${
          checked
            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
            : 'border-slate-300 bg-white group-hover:border-slate-400'
        }`}
      >
        {checked && (
          <Check size={iconSize} strokeWidth={3} className="text-white" />
        )}
      </div>
      {label && (
        <span className={`ml-2 text-xs select-none ${checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {label}
        </span>
      )}
    </div>
  );
};
