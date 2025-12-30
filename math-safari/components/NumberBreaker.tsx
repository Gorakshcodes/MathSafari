import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Translator } from '../types';
import { playCorrect } from '../services/audio';

interface NumberBreakerProps {
  number: number;
  onBreak: (isBroken: boolean) => void;
  isBroken: boolean;
  t: Translator;
}

export const NumberBreaker: React.FC<NumberBreakerProps> = ({ number, onBreak, isBroken, t }) => {
  const [val, setVal] = useState(0);
  const target = Math.floor(number / 10) * 10;
  
  useEffect(() => {
    if (isBroken) setVal(target);
  }, [isBroken, target]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isBroken) return;
    const newVal = parseInt(e.target.value);
    setVal(newVal);
    if (newVal === target) {
      playCorrect();
      onBreak(true);
    } else {
      onBreak(false);
    }
  };

  return (
    <div className={`w-full bg-orange-50 rounded-xl p-3 mb-2 border-2 ${isBroken ? 'border-green-400 bg-green-50' : 'border-orange-200'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-gray-600 text-sm">{t('breakNum')} {number}</span>
        {isBroken && <Star size={16} className="text-yellow-500 fill-current animate-bounce" />}
      </div>
      
      <div className="h-8 w-full bg-gray-200 rounded-lg overflow-hidden flex mb-2 relative shadow-inner">
        <div style={{ width: `${(val / number) * 100}%` }} className="bg-orange-400 h-full transition-all duration-75 flex items-center justify-center text-white font-bold text-xs">
          {val > 0 && val}
        </div>
        <div style={{ width: `${((number - val) / number) * 100}%` }} className="bg-blue-400 h-full transition-all duration-75 flex items-center justify-center text-white font-bold text-xs">
          {number - val > 0 && (number - val)}
        </div>
      </div>

      <input 
        type="range" min="0" max={number} value={val} onChange={handleChange} disabled={isBroken}
        className="w-full h-4 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600 hover:accent-orange-500"
      />
      <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
        <span>0</span>
        <span className={isBroken ? "text-green-600" : ""}>{isBroken ? t('perfect') : t('findTen')}</span>
        <span>{number}</span>
      </div>
    </div>
  );
};