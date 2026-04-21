import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Book, Sparkles, Rocket } from 'lucide-react';

const STORIES = [
  { id: 'brave-bear', title: 'The Brave Little Bear', icon: Sparkles, color: 'bg-amber-500', path: 'story/brave-bear', desc: 'A story about courage' },
  { id: 'space-adventure', title: 'Space Adventure', icon: Rocket, color: 'bg-indigo-500', path: 'story/space-adventure', desc: 'Journey to the stars' },
  { id: 'magic-garden', title: 'The Magic Garden', icon: Book, color: 'bg-emerald-500', path: 'story/magic-garden', desc: 'A magical discovery' },
  { id: 'ocean-friends', title: 'Ocean Friends', icon: Sparkles, color: 'bg-cyan-500', path: 'story/ocean-friends', desc: 'Under the sea' },
];

function ReadMenu() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8">
      <div className="w-full max-w-6xl flex items-center mb-8 md:mb-12 px-4">
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 ml-4 md:ml-8">Story Library 📖</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl w-full px-4">
        {STORIES.map((story, i) => (
          <Link key={story.id} to={story.path}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                ${story.color} rounded-[2rem] p-6 text-white shadow-xl cursor-pointer
                flex flex-col items-center justify-center gap-4 h-48 md:h-64 relative overflow-hidden
              `}
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm z-10">
                <story.icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
              </div>
              <div className="z-10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{story.title}</h2>
                <p className="text-white/90 font-medium">{story.desc}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import StoryReader from './read/StoryReader';

export default function Read() {
  return (
    <Routes>
      <Route path="/" element={<ReadMenu />} />
      <Route path="story/:id" element={<StoryReader />} />
    </Routes>
  );
}
