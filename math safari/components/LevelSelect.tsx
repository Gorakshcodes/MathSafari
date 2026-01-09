import React from 'react';
import { Home, Play } from 'lucide-react';
import { Button } from './Button';
import { Translator, Level } from '../types';
import { playLevelSelect } from '../services/audio';

interface LevelSelectProps {
  onSelect: (level: Level) => void;
  onBack: () => void;
  t: Translator;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ onSelect, onBack, t }) => (
    <div className="flex flex-col h-full max-w-md mx-auto">
        <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={onBack} className="p-2 mr-2 rounded-full"><Home size={24} /></Button>
            <h2 className="text-3xl font-black text-orange-800">{t('chooseLevel')}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-4">
            {[1,2,3,4,5,6,7].map((id) => (
                <button 
                    key={id} 
                    onClick={() => { playLevelSelect(); onSelect({id, name: t(`l${id}_name`)}) }} 
                    className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-orange-100 flex items-center gap-4 hover:bg-orange-50 transition-all text-left transform active:scale-95"
                >
                    <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                        {id === 1 ? "🐾" : id === 2 ? "🦓" : id === 3 ? "🛠️" : id === 4 ? "🐛" : id === 5 ? "🐘" : id === 6 ? "🦁" : "📜"}
                    </div>
                    <div className="grow">
                        <div className="font-black text-lg text-gray-800">{t(`l${id}_name`)}</div>
                        <div className="text-sm text-gray-500 font-medium">{t(`l${id}_desc`)}</div>
                    </div>
                    <Play size={24} className="ml-auto text-orange-300 fill-current" />
                </button>
            ))}
        </div>
    </div>
);