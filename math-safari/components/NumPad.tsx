import React from 'react';
import { Translator } from '../types';
import { playClick, playPop } from '../services/audio';

interface NumPadProps {
  onInput: (val: string) => void;
  onDelete: () => void;
  onGo: () => void;
  disabled: boolean;
  t: Translator;
}

export const NumPad: React.FC<NumPadProps> = ({ onInput, onDelete, onGo, disabled, t }) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto mt-4 animate-fade-in">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <button 
          key={n} 
          onClick={() => { playPop(); onInput(n.toString()); }} 
          disabled={disabled}
          className="h-12 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 text-2xl font-bold text-gray-700 active:border-b-0 active:translate-y-1 hover:bg-gray-50 disabled:opacity-50"
        >
          {n}
        </button>
      ))}
      <button 
        onClick={() => { playClick(); onDelete(); }} 
        disabled={disabled} 
        className="h-12 bg-red-100 rounded-xl shadow-sm border-b-4 border-red-200 text-red-600 font-bold active:border-b-0 active:translate-y-1 hover:bg-red-200 disabled:opacity-50"
      >
        {t('del')}
      </button>
      <button 
        onClick={() => { playPop(); onInput('0'); }} 
        disabled={disabled} 
        className="h-12 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 text-2xl font-bold text-gray-700 active:border-b-0 active:translate-y-1 hover:bg-gray-50 disabled:opacity-50"
      >
        0
      </button>
      <button 
        onClick={() => { playClick(); onGo(); }} 
        disabled={disabled} 
        className="h-12 bg-green-500 rounded-xl shadow-sm border-b-4 border-green-700 text-white font-bold active:border-b-0 active:translate-y-1 hover:bg-green-600 disabled:opacity-50"
      >
        {t('go')}
      </button>
    </div>
  );
};