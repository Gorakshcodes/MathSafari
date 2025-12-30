import React from 'react';
import { playClick } from '../services/audio';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className = "", variant = "primary", disabled = false }) => {
  const baseStyle = "font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg select-none relative overflow-hidden";
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 border-b-4 border-orange-700",
    secondary: "bg-green-500 text-white hover:bg-green-600 border-b-4 border-green-700",
    outline: "bg-white text-orange-600 border-2 border-orange-200 hover:bg-orange-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
    accent: "bg-purple-500 text-white hover:bg-purple-600 border-b-4 border-purple-700",
    danger: "bg-red-500 text-white hover:bg-red-600 border-b-4 border-red-700",
  };

  const handleClick = () => {
    if (!disabled) {
      playClick();
      onClick();
    }
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''}`}
    >
      {children}
    </button>
  );
};