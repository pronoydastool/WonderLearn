import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

interface WordData {
  letter: string;
  word: string;
  emoji: string;
  image?: string;
}

const ALPHABETS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const WORDS: WordData[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎'},
  { letter: 'B', word: 'Ball', emoji: '⚽' },
  { letter: 'C', word: 'Cat', emoji: '🐱' },
  { letter: 'D', word: 'Dog', emoji: '🐶' },
  { letter: 'E', word: 'Elephant', emoji: '🐘' },
  { letter: 'F', word: 'Fish', emoji: '🐟' },
  { letter: 'G', word: 'Giraffe', emoji: '🦒' },
  { letter: 'H', word: 'Hat', emoji: '🎩' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦' },
  { letter: 'J', word: 'Juice', emoji: '🧃' },
  { letter: 'K', word: 'Kite', emoji: '🪁' },
  { letter: 'L', word: 'Lion', emoji: '🦁' },
  { letter: 'M', word: 'Monkey', emoji: '🐒' },
  { letter: 'N', word: 'Nest', emoji: '🪹' },
  { letter: 'O', word: 'Orange', emoji: '🍊' },
  { letter: 'P', word: 'Pig', emoji: '🐷' },
  { letter: 'Q', word: 'Queen', emoji: '👑' },
  { letter: 'R', word: 'Rabbit', emoji: '🐰' },
  { letter: 'S', word: 'Sun', emoji: '☀️' },
  { letter: 'T', word: 'Tiger', emoji: '🐯' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️' },
  { letter: 'V', word: 'Van', emoji: '🚐' },
  { letter: 'W', word: 'Watermelon', emoji: '🍉' },
  { letter: 'X', word: 'Xylophone', emoji: '🎹' },
  { letter: 'Y', word: 'Yak', emoji: '🐃' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓' },
];

export default function Alphabets() {
  const navigate = useNavigate();
  const { addXP } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const playSound = (letter: string, word: string) => {
    // In a real app, we'd use actual audio files
    const msg = new SpeechSynthesisUtterance(`${letter} is for ${word}`);
    msg.rate = 0.8; // Slower for kids
    msg.pitch = 1.2; // Higher pitch for friendly voice
    window.speechSynthesis.speak(msg);
  };

  const handleNext = () => {
    if (currentIndex < 25) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
      });
      addXP(100);
      setShowReward(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentData = WORDS[currentIndex];

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 relative">
      <div className="w-full max-w-6xl flex items-center justify-between mb-12 px-4">
        <button 
          onClick={() => navigate('/learn')}
          className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-8 h-8 text-slate-600" />
        </button>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <span className="text-xl font-bold text-slate-700">{currentIndex + 1} / 26</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        {/* Selector */}
        <div className="w-full max-w-4xl py-2 mb-6">
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {ALPHABETS.map((letter, index) => (
              <button
                key={letter}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-12 rounded-xl font-bold text-xl flex items-center justify-center transition-all shrink-0 ${
                  currentIndex === index
                    ? 'bg-green-500 text-white shadow-lg scale-110'
                    : 'bg-white text-slate-500 hover:bg-green-50 shadow-sm'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.8, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: -50 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-full bg-white rounded-[3rem] shadow-2xl p-12 flex flex-col items-center relative overflow-hidden"
          >
            {/* Big Letter */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-[12rem] font-black text-green-500 leading-none drop-shadow-lg">
                {currentData.letter}
              </span>
              <span className="text-[8rem] font-bold text-green-400 leading-none drop-shadow-md">
                {currentData.letter.toLowerCase()}
              </span>
            </div>

            {/* Visual Object */}
            <div className="flex flex-col items-center mb-12">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
                className="text-8xl drop-shadow-md mb-4 flex items-center justify-center h-32"
              >
                {currentData.image ? (
                  <img src={currentData.image} alt={currentData.word} className="w-32 h-32 object-contain" referrerPolicy="no-referrer" />
                ) : (
                  currentData.emoji
                )}
              </motion.div>
              <h3 className="text-5xl font-black text-slate-700 tracking-tight">
                {currentData.word}
              </h3>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 w-full justify-center">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-10 h-10 text-slate-600" />
              </button>

              <button
                onClick={() => playSound(currentData.letter, currentData.word)}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
              >
                <Volume2 className="w-12 h-12 text-white" />
              </button>

              <button
                onClick={handleNext}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
              >
                <ArrowLeft className="w-10 h-10 text-white rotate-180" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reward Modal */}
      {showReward && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl text-center"
          >
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Star className="w-20 h-20 text-yellow-500 fill-yellow-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4">Incredible!</h2>
            <p className="text-2xl text-slate-600 mb-8">You mastered the A to Z!</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> +100 XP
              </div>
            </div>
            <button
              onClick={() => navigate('/learn')}
              className="w-full py-5 bg-green-500 text-white rounded-2xl font-bold text-2xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
            >
              Back to Menu
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
