import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Palette, Music, PenTool, PenLine, Wand2, BookOpen } from 'lucide-react';

const TOOLS = [
  { id: 'draw', title: 'Drawing Board', icon: PenTool, color: 'bg-emerald-400', path: 'draw' },
  { id: 'aidraw', title: 'Magic Drawing', icon: Wand2, color: 'bg-teal-500', path: 'aidraw' },
  { id: 'story', title: 'Story Creator', icon: BookOpen, color: 'bg-emerald-500', path: 'story' },
  { id: 'music', title: 'Music Studio', icon: Music, color: 'bg-teal-400', path: 'music' },
  { id: 'writing', title: 'Writing Practice', icon: PenLine, color: 'bg-emerald-600', path: 'writing' },
];

function CreateMenu() {
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
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 ml-4 md:ml-8">Creative Studio 🎨</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl w-full px-4">
        {TOOLS.map((tool, i) => (
          <Link key={tool.id} to={tool.path}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                ${tool.color} rounded-[2rem] p-6 text-white shadow-xl cursor-pointer
                flex flex-col items-center justify-center gap-4 h-48 md:h-64
              `}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <tool.icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-center">{tool.title}</h2>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import DrawingBoard from './create/DrawingBoard';
import MusicStudio from './create/MusicStudio';
import WritingPractice from './create/WritingPractice';
import AIDrawing from './create/AIDrawing';
import StoryCreator from './create/StoryCreator';

export default function Create() {
  return (
    <Routes>
      <Route path="/" element={<CreateMenu />} />
      <Route path="draw" element={<DrawingBoard />} />
      <Route path="aidraw" element={<AIDrawing />} />
      <Route path="story" element={<StoryCreator />} />
      <Route path="music" element={<MusicStudio />} />
      <Route path="writing" element={<WritingPractice />} />
    </Routes>
  );
}
