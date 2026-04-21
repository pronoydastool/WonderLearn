import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

const SHAPES = [
  { name: 'Circle', icon: '🔴', color: 'text-red-500' },
  { name: 'Square', icon: '🟦', color: 'text-blue-500' },
  { name: 'Triangle', icon: '🔺', color: 'text-green-500' },
  { name: 'Star', icon: '⭐', color: 'text-yellow-400' },
  { name: 'Heart', icon: '❤️', color: 'text-rose-500' },
  { name: 'Diamond', icon: '♦️', color: 'text-cyan-500' },
  { name: 'Oval', icon: '🥚', color: 'text-orange-400' },
  { name: 'Pentagon', icon: '⬟', color: 'text-purple-500' },
  { name: 'Hexagon', icon: '⬢', color: 'text-indigo-500' },
  { name: 'Octagon', icon: '🛑', color: 'text-red-600' },
  { name: 'Crescent', icon: '🌙', color: 'text-yellow-300' },
  { name: 'Cross', icon: '➕', color: 'text-emerald-500' },
  { name: 'Arrow', icon: '➡️', color: 'text-blue-400' },
];

export default function Shapes() {
  const navigate = useNavigate();
  const { addXP } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const playSound = (text: string) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.8;
    msg.pitch = 1.2;
    window.speechSynthesis.speak(msg);
  };

  const handleNext = () => {
    if (currentIndex < SHAPES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      addXP(50);
      setShowReward(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const currentShape = SHAPES[currentIndex];

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 relative">
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 md:mb-12 px-4">
        <button onClick={() => navigate('/learn')} className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <div className="flex items-center gap-2 md:gap-4 bg-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-sm">
          <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500" />
          <span className="text-lg md:text-xl font-bold text-slate-700">{currentIndex + 1} / {SHAPES.length}</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        {/* Selector */}
        <div className="w-full max-w-4xl py-2 mb-6">
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {SHAPES.map((shape, index) => (
              <button
                key={shape.name}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-12 rounded-xl font-bold text-2xl flex items-center justify-center transition-all shrink-0 ${
                  currentIndex === index
                    ? 'bg-yellow-400 text-white shadow-lg scale-110'
                    : 'bg-white text-slate-500 hover:bg-yellow-50 shadow-sm'
                }`}
              >
                {shape.icon}
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
            className="w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl p-8 md:p-12 flex flex-col items-center relative overflow-hidden"
          >
            <div className="text-[8rem] md:text-[12rem] leading-none mb-8 drop-shadow-lg">
              {currentShape.icon}
            </div>
            <h2 className={`text-5xl md:text-7xl font-black mb-12 ${currentShape.color}`}>
              {currentShape.name}
            </h2>

            <div className="flex items-center gap-4 md:gap-8 w-full justify-center">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-slate-200 transition-colors">
                <ArrowLeft className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
              </button>
              <button onClick={() => playSound(currentShape.name)} className="w-20 h-20 md:w-24 md:h-24 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200">
                <Volume2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </button>
              <button onClick={handleNext} className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
                <ArrowLeft className="w-8 h-8 md:w-10 md:h-10 text-white rotate-180" />
              </button>
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
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Shape Master!</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> +50 XP
              </div>
            </div>
            <button onClick={() => navigate('/learn')} className="w-full py-4 md:py-5 bg-blue-500 text-white rounded-2xl font-bold text-xl md:text-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200">
              Back to Menu
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
