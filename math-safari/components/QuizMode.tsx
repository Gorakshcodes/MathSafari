import React, { useState, useEffect } from 'react';
import { Home, Trophy, SkipForward, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { NumberBreaker } from './NumberBreaker';
import { NumPad } from './NumPad';
import { Translator, Level, StoryPage, Question } from '../types';
import { getSafariHint, getSafariStory } from '../services/gemini';
import { playCorrect, playWrong, playClick } from '../services/audio';

interface QuizModeProps {
  onBack: () => void;
  selectedLevel: Level;
  language: string;
  t: Translator;
}

export const QuizMode: React.FC<QuizModeProps> = ({ onBack, selectedLevel, language, t }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'input' | 'correct' | 'wrong' | 'story-wrong'>('input');
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [breakStatus, setBreakStatus] = useState({ n1: false, n2: false });
  const [story, setStory] = useState<StoryPage[] | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [loadingStory, setLoadingStory] = useState(false);

  useEffect(() => {
    if (selectedLevel.id === 7) {
        loadNewStory(score);
    } else {
        generateQuestion();
    }
  }, [selectedLevel, language]);

  const loadNewStory = async (currentScore: number) => {
    setLoadingStory(true);
    setStory(null);
    setStoryIndex(0);
    const newStory = await getSafariStory(currentScore, language);
    setStory(newStory);
    setLoadingStory(false);
    setUserAnswer('');
    setStatus('input');
  };

  const generateQuestion = () => {
    let n1 = 0, n2 = 0, op = '+';
    setHint(null);
    switch (selectedLevel.id) {
      case 1: n1 = Math.floor(Math.random() * 9) + 1; n2 = Math.floor(Math.random() * 9) + 1; break;
      case 2: n1 = (Math.floor(Math.random() * 8) + 1) * 10; n2 = (Math.floor(Math.random() * (9 - (n1/10))) + 1) * 10; break;
      case 3: n1 = Math.floor(Math.random() * 30) + 11; n2 = Math.floor(Math.random() * 30) + 11; break;
      case 4: n1 = Math.floor(Math.random() * 9) + 2; n2 = Math.floor(Math.random() * (n1 - 1)) + 1; op = '-'; break;
      case 5: n1 = (Math.floor(Math.random() * 8) + 2) * 10; n2 = (Math.floor(Math.random() * ((n1/10) - 1)) + 1) * 10; op = '-'; break;
      case 6: if (Math.random() > 0.5) { n1 = Math.floor(Math.random() * 40) + 10; n2 = Math.floor(Math.random() * 40) + 10; } 
              else { n1 = Math.floor(Math.random() * 50) + 40; n2 = Math.floor(Math.random() * 30) + 10; op = '-'; } break;
      default: n1 = 5; n2 = 5;
    }
    setQuestion({ n1, n2, op });
    setUserAnswer('');
    setStatus('input');
    setBreakStatus({ n1: false, n2: false });
  };

  const handleAiHint = async () => {
    if (selectedLevel.id === 7 || !question || loadingHint) return;
    playClick();
    setLoadingHint(true);
    const result = await getSafariHint(question.n1, question.n2, question.op, language);
    setHint(result);
    setLoadingHint(false);
  };

  const checkAnswer = () => {
    if (!userAnswer) return;
    let correct = 0;
    
    if (selectedLevel.id === 7 && story) {
        correct = story[storyIndex].answer;
    } else if (question) {
        correct = (question.op === '+' ? question.n1 + question.n2 : question.n1 - question.n2);
    }

    if (parseInt(userAnswer) === correct) {
      playCorrect();
      setStatus('correct');
      const newScore = score + 10 + (streak * 2);
      if (Math.floor(newScore / 100) > Math.floor(score / 100)) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
      setScore(newScore);
      setStreak(streak + 1);
    } else {
      playWrong();
      setStatus(selectedLevel.id === 7 ? 'story-wrong' : 'wrong');
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative">
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-4 text-center overflow-hidden">
             {/* Dynamic background particles */}
             <div className="absolute inset-0 pointer-events-none">
                 {[...Array(30)].map((_, i) => (
                     <div 
                         key={i}
                         className="absolute animate-float"
                         style={{
                             left: `${Math.random() * 100}%`,
                             top: `${Math.random() * 100}%`,
                             animationDelay: `${Math.random() * 5}s`,
                             animationDuration: `${3 + Math.random() * 4}s`,
                             fontSize: `${1 + Math.random() * 2}rem`,
                             opacity: 0.6
                         }}
                     >
                         {['⭐', '🌟', '✨', '🎉', '🦁', '🏆', '🎈'][Math.floor(Math.random() * 7)]}
                     </div>
                 ))}
             </div>

             <div className="relative z-10 transform transition-all animate-bounce-in">
                 <div className="bg-gradient-to-b from-orange-400 to-red-500 p-1 rounded-[2rem] shadow-2xl rotate-1">
                     <div className="bg-white rounded-[1.8rem] p-8 border-4 border-yellow-300 flex flex-col items-center gap-4 relative overflow-hidden">
                        
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>

                        <div className="text-7xl mb-2 filter drop-shadow-lg animate-bounce">🏆</div>
                        
                        <div className="space-y-2">
                             <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 uppercase tracking-wider">
                                {t('congrats')}
                             </h2>
                             <p className="text-gray-500 font-bold text-lg">{t('points')}</p>
                             <div className="text-6xl font-black text-orange-500 drop-shadow-sm font-mono">
                                {Math.floor(score/100) * 100}
                             </div>
                        </div>

                        <div className="flex gap-2 mt-4 text-yellow-400 text-2xl">
                            {'⭐'.repeat(3)}
                        </div>
                     </div>
                 </div>
             </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 px-2">
        <Button variant="ghost" onClick={onBack} className="p-2 bg-white/50 backdrop-blur-sm rounded-full"><Home size={24} /></Button>
        <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t(`l${selectedLevel.id}_name`)}</span>
            <div className="flex items-center gap-2 bg-white/80 px-4 py-1 rounded-full shadow-sm"><Trophy className="text-yellow-500 fill-current" size={20} /><span className="font-black text-xl text-gray-800">{score}</span></div>
        </div>
        {selectedLevel.id !== 7 ? (
            <Button onClick={handleAiHint} className={`p-2 bg-orange-100 rounded-full text-2xl ${loadingHint ? 'animate-spin opacity-50' : ''}`}>🦁</Button>
        ) : <div className="w-10"></div>}
      </div>

      <Card className={`relative ${status === 'wrong' ? 'animate-shake' : ''}`}>
        {status === 'input' && (
            <button onClick={() => { playClick(); selectedLevel.id === 7 ? loadNewStory(score) : generateQuestion(); }} className="absolute top-4 right-4 text-gray-300 flex items-center text-xs font-bold uppercase gap-1 hover:text-orange-500 transition-colors">{t('skip')} <SkipForward size={16} /></button>
        )}

        {selectedLevel.id === 7 ? (
          loadingStory ? <div className="text-center py-10 animate-pulse"><p className="text-lg font-bold text-orange-800">{t('writingStory')}</p></div> : 
          story && story[storyIndex] && (
            <div className="animate-fade-in">
              <span className="text-xs font-bold text-orange-400 uppercase">{t('step')} {storyIndex + 1} {t('of')} {story.length}</span>
              <div className="bg-orange-50 p-4 rounded-xl border-l-4 border-orange-400 my-4"><p className="text-lg text-gray-800 font-medium">"{story[storyIndex].text}"</p></div>
              <div className="text-center">
                <p className="text-lg font-bold text-orange-900 mb-4">{story[storyIndex].question}</p>
                <div className={`w-40 h-16 rounded-2xl border-4 flex items-center justify-center text-4xl font-bold bg-white mx-auto ${status === 'correct' ? 'border-green-400 text-green-700' : status.includes('wrong') ? 'border-red-300 text-red-500' : 'border-gray-300'}`}>{userAnswer || "|"}</div>
              </div>
              {status === 'story-wrong' && (
                <div className="mt-4 p-4 bg-blue-50 rounded-2xl text-sm border-l-4 border-blue-400">
                  <div className="font-bold text-blue-700 mb-1">{t('letsLearn')}</div>
                  <p>{t('correctIs')} <b>{story[storyIndex].answer}</b>. {story[storyIndex].explanation}</p>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-6">
            <div className="text-6xl font-black mb-6">{question?.n1} <span className="text-orange-500">{question?.op}</span> {question?.n2}</div>
            {selectedLevel.id === 3 && question && (
              <div className="space-y-2 mb-4">
                <NumberBreaker number={question.n1} isBroken={breakStatus.n1} onBreak={(s) => setBreakStatus(p => ({...p, n1: s}))} t={t} />
                <NumberBreaker number={question.n2} isBroken={breakStatus.n2} onBreak={(s) => setBreakStatus(p => ({...p, n2: s}))} t={t} />
              </div>
            )}
            <div className={`w-48 h-20 rounded-2xl border-4 flex items-center justify-center text-5xl font-bold mx-auto ${status === 'correct' ? 'bg-green-100 border-green-400' : status === 'wrong' ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-300'}`}>{userAnswer || "|"}</div>
          </div>
        )}

        {hint && <div className="mt-4 p-4 bg-orange-50 rounded-2xl border-2 border-orange-200 text-sm font-medium flex gap-3">🦁 <div><span className="text-[10px] uppercase font-black text-orange-400">{t('guideSays')}</span><br/>{hint}</div></div>}

        {status === 'correct' && (
            <div className="mt-4 animate-bounce-in">
                <Button onClick={() => selectedLevel.id === 7 && story && storyIndex < story.length - 1 ? (setStoryIndex(s => s+1), setStatus('input'), setUserAnswer('')) : (selectedLevel.id === 7 ? loadNewStory(score) : generateQuestion())} variant="secondary" className="w-full py-3">
                    {selectedLevel.id === 7 && story && storyIndex < story.length - 1 ? t('nextPart') : t('nextChallenge')} <ArrowRight />
                </Button>
            </div>
        )}

        {status === 'story-wrong' && story && (
            <div className="mt-4 animate-bounce-in">
                 <Button onClick={() => storyIndex < story.length - 1 ? (setStoryIndex(s => s+1), setStatus('input'), setUserAnswer('')) : loadNewStory(score)} variant="primary" className="w-full py-3">
                    {storyIndex < story.length - 1 ? t('gotIt') : t('finishStory')} <ArrowRight />
                </Button>
            </div>
        )}
      </Card>

      {(status === 'input' && (selectedLevel.id !== 3 || (breakStatus.n1 && breakStatus.n2))) && (
         <NumPad 
            onInput={(val) => setUserAnswer(prev => prev + val)} 
            onDelete={() => setUserAnswer(prev => prev.slice(0, -1))}
            onGo={checkAnswer}
            disabled={status === 'story-wrong' || status === 'correct'}
            t={t}
         />
      )}
      {selectedLevel.id === 3 && !breakStatus.n1 && !breakStatus.n2 && <div className="text-center p-4 text-gray-400 font-bold">{t('findHidden')}</div>}
    </div>
  );
};