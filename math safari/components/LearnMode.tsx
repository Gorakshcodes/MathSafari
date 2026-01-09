import React, { useState } from 'react';
import { ArrowLeft, Rocket, Zap, Copy, MoveRight, ArrowLeftRight, Scissors, Hand, Brain, ChevronsUp } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Translator } from '../types';
import { LEARN_CONTENT } from '../constants';

interface LearnModeProps {
  onBack: () => void;
  t: Translator;
  language: string;
}

// Map icons and colors to IDs since JSON constant only has text
const MODULE_META: Record<string, { icon: React.ReactNode, color: string }> = {
  'start-big': { icon: <Rocket />, color: 'bg-blue-100 text-blue-600' },
  'plus-nine': { icon: <Zap />, color: 'bg-yellow-100 text-yellow-600' },
  'doubles': { icon: <Copy />, color: 'bg-purple-100 text-purple-600' },
  'nine-ten': { icon: <Brain />, color: 'bg-red-100 text-red-600' },
  'reverse': { icon: <ArrowLeftRight />, color: 'bg-green-100 text-green-600' },
  'same-change': { icon: <MoveRight />, color: 'bg-orange-100 text-orange-600' },
  'ten-jump': { icon: <ChevronsUp />, color: 'bg-indigo-100 text-indigo-600' },
  'number-bonds': { icon: <Hand />, color: 'bg-teal-100 text-teal-600' },
  'break': { icon: <Scissors />, color: 'bg-pink-100 text-pink-600' }
};

// --- Visualization Component ---
const HackVisualizer = ({ moduleId, visualStep }: { moduleId: string, visualStep: string }) => {
  const baseBox = "w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black shadow-sm transition-all";
  
  // Start Big
  if (moduleId === 'start-big') {
    return (
      <div className="flex items-center gap-4 h-32 justify-center">
        <div className={`${baseBox} ${visualStep !== 'slow' ? 'bg-gray-100 scale-75 opacity-50' : 'bg-orange-200 scale-100'}`}>3</div>
        <div className="text-xl text-gray-400">+</div>
        <div className={`${baseBox} ${visualStep === 'slow' ? 'bg-orange-200' : 'bg-green-400 text-white scale-125 shadow-xl'}`}>12</div>
        {visualStep === 'fast' && <div className="absolute mt-24 font-bold text-green-600 animate-bounce">Start here!</div>}
      </div>
    );
  }

  // Plus Nine
  if (moduleId === 'plus-nine') {
    return (
      <div className="flex flex-col items-center justify-center h-40 w-full">
         <div className="text-4xl font-black text-gray-800 mb-4">24 + 9</div>
         <div className="relative w-full max-w-xs h-2 bg-gray-200 rounded mt-4">
            <div className={`absolute top-0 left-[20%] w-4 h-4 rounded-full bg-blue-500 transition-all duration-500 ${visualStep !== 'compare' ? 'left-[80%]' : ''}`}></div>
            {visualStep !== 'compare' && (
                <div className="absolute -top-8 left-[50%] text-blue-500 font-bold whitespace-nowrap animate-pulse">+ 10</div>
            )}
            {visualStep === 'solve' && (
                <>
                <div className="absolute top-0 left-[75%] w-4 h-4 rounded-full bg-green-500 z-10"></div>
                <div className="absolute -bottom-8 left-[77%] text-green-600 font-bold whitespace-nowrap">- 1</div>
                </>
            )}
         </div>
         <div className="flex justify-between w-full max-w-xs mt-2 text-gray-400 font-bold text-xs">
            <span>24</span>
            <span>33</span>
            <span>34</span>
         </div>
      </div>
    );
  }

  // Doubles
  if (moduleId === 'doubles') {
    return (
      <div className="flex gap-4 justify-center items-end h-40 pb-4">
         <div className="flex flex-col-reverse gap-1">
            {[...Array(6)].map((_, i) => <div key={i} className="w-8 h-8 bg-blue-400 rounded-md"></div>)}
            <div className="text-center font-bold text-blue-600">6</div>
         </div>
         <div className="text-2xl font-black text-gray-300 mb-4">+</div>
         <div className="flex flex-col-reverse gap-1 relative">
            {[...Array(6)].map((_, i) => <div key={i} className="w-8 h-8 bg-blue-400 rounded-md"></div>)}
            {visualStep !== 'doubles' && <div className="w-8 h-8 bg-yellow-400 rounded-md animate-bounce"></div>}
            <div className="text-center font-bold text-blue-600">{visualStep === 'doubles' ? '7' : '6+1'}</div>
         </div>
      </div>
    );
  }

  // 9 & 10 Rule
  if (moduleId === 'nine-ten') {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        {visualStep === 'intro' ? (
           <div className="text-5xl font-black text-gray-800">100 <span className="text-red-400">- 36</span></div>
        ) : (
           <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                 <div className="text-sm font-bold text-red-500 mb-2">From 9</div>
                 <div className="text-4xl font-bold text-gray-300">9 - 3</div>
                 <div className="text-6xl font-black text-orange-500 mt-2">{visualStep === 'step1' || visualStep === 'step2' ? '6' : '?'}</div>
              </div>
              <div className="flex flex-col items-center">
                 <div className="text-sm font-bold text-red-500 mb-2">From 10</div>
                 <div className="text-4xl font-bold text-gray-300">10 - 6</div>
                 <div className="text-6xl font-black text-orange-500 mt-2">{visualStep === 'step2' ? '4' : '?'}</div>
              </div>
           </div>
        )}
      </div>
    )
  }

  // Reverse
  if (moduleId === 'reverse') {
      return (
          <div className="flex flex-col items-center h-32 justify-center">
              {visualStep === 'intro' ? (
                  <div className="text-4xl font-bold text-gray-400">13 - 9 = ?</div>
              ) : (
                  <div className="flex items-center gap-4">
                      <div className="text-5xl font-black text-orange-500">9</div>
                      <div className="text-3xl text-gray-400">+</div>
                      <div className={`w-20 h-20 border-4 border-dashed rounded-xl flex items-center justify-center text-4xl font-black ${visualStep === 'solve' ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-300 text-gray-300'}`}>
                          {visualStep === 'solve' ? '4' : '?'}
                      </div>
                      <div className="text-3xl text-gray-400">=</div>
                      <div className="text-5xl font-black text-gray-800">13</div>
                  </div>
              )}
          </div>
      )
  }

  // Same Change
  if (moduleId === 'same-change') {
      return (
          <div className="flex flex-col gap-4 w-full max-w-xs mx-auto pt-8">
              <div className="flex items-center">
                  <div className="h-8 bg-blue-400 rounded-l-md w-3/4 flex items-center justify-center text-white font-bold">15</div>
                  {visualStep !== 'messy' && <div className="h-8 bg-green-400 rounded-r-md w-1/4 animate-fade-in flex items-center justify-center text-white text-xs">+2</div>}
              </div>
              <div className="flex items-center">
                  <div className="h-8 bg-red-400 rounded-l-md w-1/2 flex items-center justify-center text-white font-bold">8</div>
                  {visualStep !== 'messy' && <div className="h-8 bg-green-400 rounded-r-md w-1/4 animate-fade-in flex items-center justify-center text-white text-xs">+2</div>}
              </div>
              {visualStep === 'solve' && (
                  <div className="text-center font-bold text-xl text-green-600 mt-2">17 - 10 = 7</div>
              )}
          </div>
      )
  }

  // Ten Jump
  if (moduleId === 'ten-jump') {
      return (
          <div className="flex flex-col items-center justify-center h-40 w-full">
              {visualStep === 'intro' && (
                   <div className="flex items-end gap-6">
                       <div className="flex flex-col items-center">
                           <div className="h-24 w-4 bg-red-300 rounded-full"></div>
                           <span className="text-xs font-bold text-red-400 mt-2">Big Jump</span>
                       </div>
                       <div className="flex flex-col gap-1 items-center animate-pulse">
                            <div className="h-7 w-4 bg-indigo-400 rounded-full"></div>
                            <div className="h-7 w-4 bg-indigo-400 rounded-full"></div>
                            <div className="h-7 w-4 bg-indigo-400 rounded-full"></div>
                            <span className="text-xs font-bold text-indigo-500 mt-2">Small Jumps</span>
                       </div>
                   </div>
              )}
              {visualStep === 'split' && (
                   <div className="flex flex-col items-center">
                      <div className="text-4xl font-black text-gray-800 mb-2">26</div>
                      <div className="text-gray-400 mb-2">becomes</div>
                      <div className="flex gap-2">
                           <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-sm">10</div>
                           <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-sm">10</div>
                           <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center font-bold text-xl shadow-sm border-2 border-indigo-100">6</div>
                      </div>
                   </div>
              )}
              {visualStep === 'climb' && (
                  <div className="flex items-center gap-2 text-xl font-bold text-gray-600 flex-wrap justify-center">
                      <span className="text-gray-400">25</span>
                      <MoveRight size={16} className="text-indigo-300" />
                      <span className="text-indigo-400">35</span>
                      <MoveRight size={16} className="text-indigo-300" />
                      <span className="text-indigo-500">45</span>
                      <MoveRight size={16} className="text-indigo-300" />
                      <span className="text-green-600 text-3xl">51</span>
                  </div>
              )}
          </div>
      )
  }

  // Number Bonds
  if (moduleId === 'number-bonds') {
      return (
          <div className="flex flex-col items-center justify-center h-40">
              <div className="flex gap-2 mb-4">
                  {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-6 h-12 rounded-full transition-all duration-500 ${i < 3 && visualStep !== 'hands' ? 'bg-gray-200 h-6 mt-6' : 'bg-teal-400'}`}></div>
                  ))}
              </div>
              <div className="text-2xl font-bold text-teal-800">
                  {visualStep === 'hands' ? '10 Fingers' : visualStep === 'fold' ? '3 Folded, 7 Up' : '3 + 7 = 10'}
              </div>
          </div>
      )
  }

  // Break Apart
  if (moduleId === 'break') {
      return (
          <div className="flex flex-col items-center h-40 justify-center">
              {visualStep === 'split' && <div className="text-5xl font-black text-gray-800">23 + 45</div>}
              {visualStep === 'group' && (
                  <div className="flex gap-8">
                      <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-400 uppercase font-bold">Tens</span>
                          <div className="text-3xl font-bold text-pink-600">20 + 40</div>
                      </div>
                      <div className="flex flex-col items-center">
                          <span className="text-sm text-gray-400 uppercase font-bold">Ones</span>
                          <div className="text-3xl font-bold text-pink-600">3 + 5</div>
                      </div>
                  </div>
              )}
              {visualStep === 'solve' && (
                  <div className="text-center">
                      <div className="text-4xl font-black text-pink-600 mb-2">60 + 8</div>
                      <div className="text-6xl font-black text-green-500">= 68</div>
                  </div>
              )}
          </div>
      )
  }

  return <div className="h-40 flex items-center justify-center text-gray-300">Graphic loading...</div>;
};

export const LearnMode: React.FC<LearnModeProps> = ({ onBack, t, language }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  // Get localized content or fallback to English
  const modulesData = LEARN_CONTENT[language] || LEARN_CONTENT['en'];
  
  // Merge text data with visual metadata
  const modules = modulesData.map((mod: any) => ({
      ...mod,
      ...MODULE_META[mod.id]
  }));

  const activeModule = activeModuleIndex !== null ? modules[activeModuleIndex] : null;

  if (activeModule) return (
    <div className="flex flex-col h-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => { setActiveModuleIndex(null); setStep(0); }}><ArrowLeft /></Button>
            <div className="text-sm font-bold text-gray-400">{t('step')} {step + 1}</div>
        </div>
        
        <div className={`p-4 rounded-t-3xl ${activeModule.color.split(' ')[0]} flex items-center gap-3 border-b-2 border-white/50`}>
             <div className="p-2 bg-white/50 rounded-xl">{activeModule.icon}</div>
             <h3 className="text-2xl font-black text-gray-800">{activeModule.title}</h3>
        </div>

        <Card className="flex-1 flex flex-col rounded-t-none border-t-0">
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 shadow-inner border border-gray-100 flex-grow flex flex-col justify-center">
                <HackVisualizer moduleId={activeModule.id} visualStep={activeModule.steps[step].visual} />
            </div>
            
            <p className="text-gray-700 font-medium text-lg text-center mb-8 min-h-[4rem]">
                {activeModule.steps[step].text}
            </p>

            <div className="flex gap-2 mt-auto">
                {step > 0 && (
                    <Button variant="secondary" onClick={() => setStep(s => s-1)} className="flex-1">
                        {t('back')}
                    </Button>
                )}
                {step < activeModule.steps.length - 1 ? (
                    <Button onClick={() => setStep(s => s+1)} className="flex-1">
                        {t('next')}
                    </Button>
                ) : (
                    <Button onClick={() => { setActiveModuleIndex(null); setStep(0); }} className="flex-1">
                        {t('finish')}
                    </Button>
                )}
            </div>
        </Card>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2 mr-2 rounded-full"><ArrowLeft size={24} /></Button>
        <h2 className="text-3xl font-black text-orange-800">{t('fieldGuide')}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 overflow-y-auto custom-scrollbar">
        {modules.map((mod: any, idx: number) => (
            <button 
                key={mod.id}
                onClick={() => setActiveModuleIndex(idx)}
                className="bg-white p-4 rounded-2xl shadow-md border-b-4 border-gray-200 flex flex-col gap-3 hover:bg-orange-50 hover:border-orange-200 transition-all text-left group"
            >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${mod.color}`}>
                    {mod.icon}
                </div>
                <div>
                    <h3 className="font-black text-gray-700 text-lg leading-tight group-hover:text-orange-700">{mod.title}</h3>
                    <div className="h-1 w-8 bg-gray-200 mt-2 rounded-full group-hover:bg-orange-300 transition-colors"></div>
                </div>
            </button>
        ))}
      </div>
    </div>
  );
};
