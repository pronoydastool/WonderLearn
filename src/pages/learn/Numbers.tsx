import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

const NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);
const FRUITS = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍉', '🍍', '🥭', '🥝', '🍒'];

export default function Numbers() {
  const navigate = useNavigate();
  const { addXP } = useStore();
  const [currentNum, setCurrentNum] = useState(1);
  const [showReward, setShowReward] = useState(false);

  const playSound = (num: number) => {
    // In a real app, we'd use actual audio files
    const msg = new SpeechSynthesisUtterance(num.toString());
    msg.rate = 0.8; // Slower for kids
    msg.pitch = 1.2; // Higher pitch for friendly voice
    window.speechSynthesis.speak(msg);
  };

  const handleNext = () => {
    if (currentNum < 10) {
      setCurrentNum(prev => prev + 1);
    } else {
      // Completed!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
      });
      addXP(50);
      setShowReward(true);
    }
  };

  const handlePrev = () => {
    if (currentNum > 1) {
      setCurrentNum(prev => prev - 1);
    }
  };

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
          <span className="text-xl font-bold text-slate-700">{currentNum} / 10</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        {/* Selector */}
        <div className="w-full max-w-4xl py-2 mb-6">
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {NUMBERS.map((num) => (
              <button
                key={num}
                onClick={() => setCurrentNum(num)}
                className={`w-12 h-12 rounded-xl font-bold text-xl flex items-center justify-center transition-all shrink-0 ${
                  currentNum === num
                    ? 'bg-blue-500 text-white shadow-lg scale-110'
                    : 'bg-white text-slate-500 hover:bg-blue-50 shadow-sm'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentNum}
            initial={{ scale: 0.8, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: -50 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-full bg-white rounded-[3rem] shadow-2xl p-12 flex flex-col items-center relative overflow-hidden"
          >
            {/* Big Number */}
            <div className="text-[12rem] font-black text-blue-500 leading-none mb-8 drop-shadow-lg">
              {currentNum}
            </div>

            {/* Visual Objects */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 min-h-[120px]">
              {Array.from({ length: currentNum }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', bounce: 0.6 }}
                  className="text-6xl drop-shadow-md"
                >
                  {FRUITS[currentNum - 1]}
                </motion.div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 w-full justify-center">
              <button
                onClick={handlePrev}
                disabled={currentNum === 1}
                className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-10 h-10 text-slate-600" />
              </button>

              <button
                onClick={() => playSound(currentNum)}
                className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
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
            <h2 className="text-4xl font-black text-slate-800 mb-4">Amazing!</h2>
            <p className="text-2xl text-slate-600 mb-8">You learned all numbers up to 10!</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> +50 XP
              </div>
            </div>
            <button
              onClick={() => navigate('/learn')}
              className="w-full py-5 bg-blue-500 text-white rounded-2xl font-bold text-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
            >
              Back to Menu
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
