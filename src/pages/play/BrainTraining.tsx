import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

const EMOJI_SETS = [
  ['🍎', '🍌', '🍇', '🍓', '🍊'],
  ['🚗', '🚕', '🚙', '🚌', '🚎'],
  ['🔴', '🔵', '🟢', '🟡', '🟣'],
  ['🐱', '🐶', '🐭', '🐹', '🐰'],
  ['1', '2', '3', '4', '5'],
  ['⭐', '🌙', '☀️', '☁️', '⚡'],
  ['⚽', '🏀', '🎾', '🏐', '🏉'],
  ['🌳', '🌲', '🌴', '🌵', '🌾'],
];

export default function BrainTraining() {
  const navigate = useNavigate();
  const { addXP, updateStats } = useStore();
  const [currentPattern, setCurrentPattern] = useState({ sequence: [''], answer: '', set: [''] });
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const generatePattern = () => {
    const set = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)];
    const patternType = Math.floor(Math.random() * 3); // 0: ABAB, 1: AABB, 2: ABCABC
    
    let sequence: string[] = [];
    let answer = '';
    
    const a = set[Math.floor(Math.random() * set.length)];
    let b = set[Math.floor(Math.random() * set.length)];
    while (b === a) b = set[Math.floor(Math.random() * set.length)];
    let c = set[Math.floor(Math.random() * set.length)];
    while (c === a || c === b) c = set[Math.floor(Math.random() * set.length)];

    if (patternType === 0) { // ABAB
      sequence = [a, b, a, b, '?'];
      answer = a;
    } else if (patternType === 1) { // AABB
      sequence = [a, a, b, b, a, '?'];
      answer = a;
    } else { // ABCABC
      sequence = [a, b, c, a, b, '?'];
      answer = c;
    }
    
    return { sequence, answer, set };
  };

  const initGame = () => {
    const newPattern = generatePattern();
    setCurrentPattern(newPattern);
    setFeedback(null);
    
    // Generate options
    const opts = [newPattern.answer];
    while (opts.length < 4) {
      const randomEmoji = newPattern.set[Math.floor(Math.random() * newPattern.set.length)];
      if (!opts.includes(randomEmoji)) {
        opts.push(randomEmoji);
      }
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleAnswer = (selected: string) => {
    if (feedback) return;

    if (selected === currentPattern.answer) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      addXP(15);
      if (score + 1 === 10) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        updateStats('brain', 100);
      }
      setTimeout(() => {
        initGame();
      }, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 px-4 bg-amber-50">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/play')}
          className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-3xl font-black text-slate-800">Brain Training 🧠</h1>
        <div className="bg-white px-6 py-2 rounded-2xl shadow-sm font-bold text-amber-600">
          Score: {score}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
        <motion.div 
          key={currentPattern.sequence.join('-')}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] p-12 shadow-xl w-full text-center mb-12 relative overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            {currentPattern.sequence.map((item, i) => (
              <div 
                key={i} 
                className={`w-24 h-24 rounded-3xl flex items-center justify-center text-6xl shadow-sm ${item === '?' ? 'bg-amber-100 border-4 border-dashed border-amber-300' : 'bg-slate-50'}`}
              >
                {item === '?' ? '?' : item}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10 ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              >
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {feedback === 'correct' ? <Check className="w-20 h-20 text-white" /> : <X className="w-20 h-20 text-white" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <h2 className="text-2xl font-bold text-slate-700 mb-8">What comes next? 🤔</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(opt)}
              className="bg-white p-8 rounded-3xl shadow-lg text-6xl font-black text-slate-700 hover:bg-amber-50 transition-colors"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
