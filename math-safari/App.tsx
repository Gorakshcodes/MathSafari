import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, BookOpen, Map, X } from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from './constants';
import { Button } from './components/Button';
import { LearnMode } from './components/LearnMode';
import { LevelSelect } from './components/LevelSelect';
import { QuizMode } from './components/QuizMode';
import { Level } from './types';
import { playClick } from './services/audio';

// Use window.Tone if available
const Tone = (window as any).Tone;

export default function App() {
  const [view, setView] = useState<'menu' | 'learn' | 'levelselect' | 'game'>('menu'); 
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const synthRef = useRef<any>(null);

  const t = (key: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key];

  useEffect(() => {
    if (typeof Tone !== 'undefined') {
        // Start muted by default
        Tone.Destination.mute = true;

        if (!synthRef.current) {
            try {
                // --- Bird Synth (High, pure chirps) ---
                const birdSynth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.02, decay: 0.1, sustain: 0, release: 0.1 },
                    volume: -12
                }).toDestination();
                // Add a little echo to birds so they sound like they are in a forest
                const birdDelay = new Tone.FeedbackDelay("8n", 0.3).toDestination();
                birdSynth.connect(birdDelay);

                // --- Monkey/Exotic Percussion (Pluck/Woody) ---
                const monkeySynth = new Tone.MembraneSynth({
                    pitchDecay: 0.05,
                    octaves: 2,
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
                    volume: -10
                }).toDestination();

                // --- Frog Synth (Croak) ---
                // Replaces the previous NoiseSynth to eliminate "white noise" feel
                const frogSynth = new Tone.FMSynth({
                    harmonicity: 3,
                    modulationIndex: 10,
                    detune: 0,
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.1, decay: 0.3, sustain: 0, release: 0.1 },
                    modulation: { type: "square" },
                    modulationEnvelope: { attack: 0.1, decay: 0.2, sustain: 0, release: 0.1 },
                    volume: -12
                }).toDestination();

                // --- Intermittent Trigger Loop ---
                // Triggers randomly to simulate a natural environment
                const loopB = new Tone.Loop((time: any) => {
                    const r = Math.random();
                    
                    // 30% chance to hear an animal sound every 2 seconds (at 60bpm)
                    if (r > 0.7) { 
                        const type = Math.random();
                        
                        if (type < 0.4) {
                            // Bird Chirps (Double chirp often)
                            const pitch1 = Math.random() > 0.5 ? "C6" : "E6";
                            birdSynth.triggerAttackRelease(pitch1, "32n", time + Math.random() * 0.1);
                            if (Math.random() > 0.5) {
                                birdSynth.triggerAttackRelease("G6", "32n", time + 0.15);
                            }
                        } else if (type < 0.7) {
                            // Monkey 'Ooh-ooh' (Two membrane hits)
                            monkeySynth.triggerAttackRelease("C3", "16n", time);
                            monkeySynth.triggerAttackRelease("E3", "16n", time + 0.12);
                        } else {
                            // Frog Ribbit
                            frogSynth.triggerAttackRelease("F2", "8n", time);
                        }
                    }
                }, "2n"); 

                synthRef.current = { 
                    loopB
                };
                
                Tone.Transport.bpm.value = 60; // Slow pace
            } catch (e) {
                console.error("Tone.js initialization failed", e);
            }
        }
    }
  }, []);

  const toggleMusic = async () => {
    if (!Tone) return;
    
    if (!isAudioOn) {
        // Turning on
        await Tone.start();
        Tone.Destination.mute = false;
        
        // Start Loop for intermittent sounds
        if (synthRef.current?.loopB) {
            synthRef.current.loopB.start(0);
        }
        
        if (Tone.Transport.state !== 'started') {
            Tone.Transport.start();
        }
        
        setIsAudioOn(true);
        playClick(); // Feedback for turning on
    } else {
        // Turning off
        Tone.Destination.mute = true;
        
        setIsAudioOn(false);
    }
  };

  const LanguageSelectorModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-orange-900/40 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-8 border-8 border-orange-100 relative">
            <button onClick={() => { playClick(); setShowLanguageModal(false); }} className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg border-4 border-orange-100 text-orange-500 hover:scale-110 transition-transform"><X size={24} strokeWidth={3} /></button>
            <div className="text-center mb-6">
                <div className="text-5xl mb-2 animate-bounce">🦁</div>
                <h2 className="text-2xl font-black text-orange-900">{t('selectLang')}</h2>
                <p className="text-sm font-bold text-orange-400 mt-1">{t('hiGuide')}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {LANGUAGES.map((lang) => (
                    <button key={lang.code} onClick={() => { playClick(); setLanguage(lang.code); setShowLanguageModal(false); }} className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all transform active:scale-90 border-4 ${language === lang.code ? 'bg-orange-50 border-orange-500' : 'bg-white border-transparent hover:bg-gray-50'}`}>
                        <div className={`w-14 h-14 ${lang.color} rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg mb-2 ring-4 ring-white`}>{lang.icon}</div>
                        <span className={`font-black text-xs ${language === lang.code ? 'text-orange-600' : 'text-gray-600'}`}>{lang.label}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans text-gray-800 p-4 sm:p-6 overflow-hidden" style={{ background: `radial-gradient(circle at 50% 50%, #FFF7ED 0%, #FED7AA 100%)` }}>
      
      {/* Utility Bar */}
      <div className="fixed top-4 right-4 z-50 flex gap-3">
          <Button onClick={() => setShowLanguageModal(true)} variant="ghost" className="p-3 bg-white/60 rounded-full shadow-lg text-orange-600 border-2 border-white/50 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 ${LANGUAGES.find(l=>l.code === language)?.color || 'bg-gray-400'} rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-inner`}>{LANGUAGES.find(l=>l.code === language)?.icon || '??'}</div>
                <span className="text-xs font-black uppercase tracking-widest">{language}</span>
            </div>
          </Button>
          {typeof Tone !== 'undefined' && (
              <Button onClick={toggleMusic} variant="ghost" className="p-3 bg-white/60 rounded-full shadow-lg text-orange-600 border-2 border-white/50 backdrop-blur-md">
                  {isAudioOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </Button>
          )}
      </div>

      {showLanguageModal && <LanguageSelectorModal />}

      <div className="max-w-xl mx-auto h-full pt-16">
          {view === 'menu' && (
              <div className="flex flex-col h-full max-w-md mx-auto justify-center items-center gap-8 animate-fade-in">
                  <div className="text-center relative">
                    <div className="text-7xl mb-6 animate-bounce">🦁</div>
                    <h1 className="text-5xl font-black text-orange-900 tracking-tight mb-2 drop-shadow-sm leading-tight">{t('appTitle')}</h1>
                    <p className="text-orange-800/70 font-bold text-xl">{t('appSubtitle')}</p>
                  </div>
                  <div className="w-full space-y-4 px-8">
                    <Button onClick={() => setView('learn')} className="w-full py-6 text-xl bg-teal-500 hover:bg-teal-600 border-teal-700"><BookOpen size={28} /> {t('learnBtn')}</Button>
                    <Button onClick={() => setView('levelselect')} className="w-full py-6 text-xl bg-orange-500 hover:bg-orange-600 border-orange-700"><Map size={28} className="fill-current" /> {t('startBtn')}</Button>
                  </div>
              </div>
          )}
          {view === 'learn' && <LearnMode onBack={() => setView('menu')} t={t} language={language} />}
          {view === 'levelselect' && <LevelSelect onBack={() => setView('menu')} onSelect={(l: Level) => { setCurrentLevel(l); setView('game'); }} t={t} />}
          {view === 'game' && currentLevel && <QuizMode selectedLevel={currentLevel} onBack={() => setView('menu')} language={language} t={t} />}
      </div>
    </div>
  );
}