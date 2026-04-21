import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, CheckCircle2, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

const WORD_LIST = [
  { word: 'CAT', emoji: '🐱' },
  { word: 'DOG', emoji: '🐶' },
  { word: 'SUN', emoji: '☀️' },
  { word: 'CAR', emoji: '🚗' },
  { word: 'BIRD', emoji: '🐦' },
  { word: 'TREE', emoji: '🌳' },
  { word: 'FISH', emoji: '🐟' },
  { word: 'MOON', emoji: '🌙' },
  { word: 'STAR', emoji: '⭐' },
  { word: 'BOOK', emoji: '📖' },
  { word: 'BALL', emoji: '⚽' },
  { word: 'FROG', emoji: '🐸' },
  { word: 'DUCK', emoji: '🦆' },
  { word: 'BEAR', emoji: '🐻' },
  { word: 'LION', emoji: '🦁' },
  { word: 'APPLE', emoji: '🍎' },
  { word: 'HOUSE', emoji: '🏠' },
];

export default function Words() {
  const navigate = useNavigate();
  const { addXP } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(WORD_LIST[0]);
  const [scrambled, setScrambled] = useState<{ id: number, letter: string, used: boolean }[]>([]);
  const [spelled, setSpelled] = useState<string[]>([]);
  const [showReward, setShowReward] = useState(false);

  const initWord = (index: number) => {
    const wordObj = WORD_LIST[index];
    setCurrentWord(wordObj);
    setSpelled([]);
    
    // Scramble letters
    const letters = wordObj.word.split('').map((l, i) => ({ id: i, letter: l, used: false }));
    letters.sort(() => Math.random() - 0.5);
    setScrambled(letters);
  };

  useEffect(() => {
    initWord(currentIndex);
  }, [currentIndex]);

  const handleLetterClick = (item: { id: number, letter: string, used: boolean }) => {
    if (item.used) return;

    // Check if it's the correct next letter
    const expectedLetter = currentWord.word[spelled.length];
    if (item.letter === expectedLetter) {
      const newSpelled = [...spelled, item.letter];
      setSpelled(newSpelled);
      setScrambled(prev => prev.map(l => l.id === item.id ? { ...l, used: true } : l));

      // Check if word is complete
      if (newSpelled.length === currentWord.word.length) {
        setTimeout(() => {
          if (currentIndex < WORD_LIST.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            addXP(100);
            setShowReward(true);
          }
        }, 500);
      }
    } else {
      // Wrong letter - could add a visual shake effect here
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 relative">
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 md:mb-12 px-4">
        <button onClick={() => navigate('/learn')} className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <div className="flex items-center gap-2 md:gap-4 bg-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-sm">
          <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500" />
          <span className="text-lg md:text-xl font-bold text-slate-700">{currentIndex + 1} / {WORD_LIST.length}</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        {/* Selector */}
        <div className="w-full max-w-4xl py-2 mb-6">
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {WORD_LIST.map((wordObj, index) => (
              <button
                key={wordObj.word}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-12 rounded-xl font-bold text-2xl flex items-center justify-center transition-all shrink-0 ${
                  currentIndex === index
                    ? 'bg-teal-500 text-white shadow-lg scale-110'
                    : 'bg-white text-slate-500 hover:bg-teal-50 shadow-sm'
                }`}
                title={wordObj.word}
              >
                {wordObj.emoji}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            className="w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl p-6 md:p-12 flex flex-col items-center relative overflow-hidden"
          >
            <div className="text-[6rem] md:text-[10rem] leading-none mb-8 drop-shadow-lg">
              {currentWord.emoji}
            </div>

            <button 
              onClick={() => {
                const msg = new SpeechSynthesisUtterance(currentWord.word);
                window.speechSynthesis.speak(msg);
              }}
              className="mb-8 flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-bold hover:bg-teal-200 transition-colors"
            >
              <Volume2 className="w-5 h-5" /> Hear Word
            </button>

            {/* Spelled Area */}
            <div className="flex gap-2 md:gap-4 mb-12 min-h-[80px] md:min-h-[100px]">
              {currentWord.word.split('').map((_, i) => (
                <div key={i} className="w-16 h-20 md:w-24 md:h-28 border-b-8 border-slate-200 flex items-center justify-center text-5xl md:text-7xl font-black text-teal-500">
                  {spelled[i] || ''}
                </div>
              ))}
            </div>

            {/* Scrambled Letters */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {scrambled.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: item.used ? 1 : 1.1 }}
                  whileTap={{ scale: item.used ? 1 : 0.9 }}
                  onClick={() => handleLetterClick(item)}
                  disabled={item.used}
                  className={`
                    w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl text-4xl md:text-6xl font-black flex items-center justify-center transition-all
                    ${item.used ? 'bg-slate-100 text-slate-300 shadow-none' : 'bg-teal-500 text-white shadow-lg shadow-teal-200 hover:bg-teal-600'}
                  `}
                >
                  {item.letter}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {showReward && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full shadow-2xl text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Star className="w-16 h-16 md:w-20 md:h-20 text-yellow-500 fill-yellow-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Spelling Bee!</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> +100 XP
              </div>
            </div>
            <button onClick={() => navigate('/learn')} className="w-full py-4 md:py-5 bg-teal-500 text-white rounded-2xl font-bold text-xl md:text-2xl hover:bg-teal-600 transition-colors shadow-lg shadow-teal-200">
              Back to Menu
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
