import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Gamepad2, Brain, Puzzle, Calculator, Zap } from 'lucide-react';

// Sub-modules
import JigsawPuzzle from './play/JigsawPuzzle';
import BrainTraining from './play/BrainTraining';
import MathGame from './learn/MathGame';

import { useStore } from '../store/useStore';

const GAMES = [
  { id: 'puzzle', title: 'Jigsaw Puzzle', icon: Puzzle, color: 'bg-orange-400', path: 'puzzle' },
  { id: 'brain', title: 'Brain Training', icon: Zap, color: 'bg-yellow-400', path: 'brain' },
  { id: 'math-game', title: 'Math Challenge', icon: Calculator, color: 'bg-purple-400', path: 'math-game' },
];

function PlayMenu() {
  const navigate = useNavigate();
  const { disabledModules } = useStore();

  const filteredGames = GAMES.filter(game => !disabledModules.includes(game.id));

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8">
      <div className="w-full max-w-6xl flex items-center mb-8 md:mb-12 px-4">
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 ml-4 md:ml-8">Play Zone 🎮</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl w-full px-4">
        {filteredGames.map((game, i) => (
          <Link key={game.id} to={game.path}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                ${game.color} rounded-[2rem] p-4 md:p-6 text-white shadow-xl cursor-pointer
                flex flex-col items-center justify-center gap-2 md:gap-4 h-40 md:h-48
              `}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <game.icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-center">{game.title}</h2>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Play() {
  return (
    <Routes>
      <Route path="/" element={<PlayMenu />} />
      <Route path="puzzle" element={<JigsawPuzzle />} />
      <Route path="brain" element={<BrainTraining />} />
      <Route path="math-game" element={<MathGame />} />
    </Routes>
  );
}
