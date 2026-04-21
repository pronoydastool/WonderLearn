import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Hash, Type, Calculator, Square, Palette, Dog, BookA, ArrowLeft, Puzzle, Globe, FlaskConical } from 'lucide-react';
import { useStore } from '../store/useStore';
import confetti from 'canvas-confetti';

// Sub-modules
import Numbers from './learn/Numbers';
import Alphabets from './learn/Alphabets';
import MathLearning from './learn/MathLearning';
import Shapes from './learn/Shapes';
import Colors from './learn/Colors';
import Animals from './learn/Animals';
import Words from './learn/Words';
import MultilingualAlphabets from './learn/MultilingualAlphabets';
import ScienceLearning from './learn/ScienceLearning';

const MODULES = [
  { id: 'numbers', title: 'Numbers', icon: Hash, color: 'bg-blue-400', path: 'numbers' },
  { id: 'alphabets', title: 'Alphabets', icon: Type, color: 'bg-green-400', path: 'alphabets' },
  { id: 'math', title: 'Math', icon: Calculator, color: 'bg-purple-400', path: 'math' },
  { id: 'shapes', title: 'Shapes', icon: Square, color: 'bg-yellow-400', path: 'shapes' },
  { id: 'colors', title: 'Colors', icon: Palette, color: 'bg-pink-400', path: 'colors' },
  { id: 'animals', title: 'Animals', icon: Dog, color: 'bg-orange-400', path: 'animals' },
  { id: 'words', title: 'Words', icon: BookA, color: 'bg-teal-400', path: 'words' },
  { id: 'multilingual', title: 'World ABC', icon: Globe, color: 'bg-rose-400', path: 'multilingual' },
  { id: 'science', title: 'Science', icon: FlaskConical, color: 'bg-cyan-400', path: 'science' },
];

function LearnMenu() {
  const navigate = useNavigate();
  const { disabledModules } = useStore();

  const filteredModules = MODULES.filter(mod => !disabledModules.includes(mod.id));

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8">
      <div className="w-full max-w-6xl flex items-center mb-8 md:mb-12 px-4">
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 ml-4 md:ml-8">Let's Learn! 📚</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl w-full px-4">
        {filteredModules.map((mod, i) => (
          <Link key={mod.id} to={mod.path}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                ${mod.color} rounded-[2rem] p-4 md:p-6 text-white shadow-xl cursor-pointer
                flex flex-col items-center justify-center gap-2 md:gap-4 h-40 md:h-48
              `}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <mod.icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-center">{mod.title}</h2>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Learn() {
  return (
    <Routes>
      <Route path="/" element={<LearnMenu />} />
      <Route path="numbers" element={<Numbers />} />
      <Route path="alphabets" element={<Alphabets />} />
      <Route path="math" element={<MathLearning />} />
      <Route path="shapes" element={<Shapes />} />
      <Route path="colors" element={<Colors />} />
      <Route path="animals" element={<Animals />} />
      <Route path="words" element={<Words />} />
      <Route path="multilingual" element={<MultilingualAlphabets />} />
      <Route path="science" element={<ScienceLearning />} />
    </Routes>
  );
}
