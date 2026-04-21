import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Gamepad2, Palette, Book, Bot, Star, Zap, ArrowRight, BarChart3, Globe2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const CARDS = [
  {
    id: 'learn',
    title: 'Learn',
    description: 'Numbers, Letters, Math & More!',
    icon: BookOpen,
    color: 'bg-rose-400',
    hoverColor: 'hover:bg-rose-500',
    shadow: 'shadow-rose-200',
    path: '/learn',
    delay: 0.1
  },
  {
    id: 'play',
    title: 'Play',
    description: 'Fun Games & Puzzles',
    icon: Gamepad2,
    color: 'bg-amber-400',
    hoverColor: 'hover:bg-amber-500',
    shadow: 'shadow-amber-200',
    path: '/play',
    delay: 0.2
  },
  {
    id: 'create',
    title: 'Create',
    description: 'Draw, Write & Make Music',
    icon: Palette,
    color: 'bg-emerald-400',
    hoverColor: 'hover:bg-emerald-500',
    shadow: 'shadow-emerald-200',
    path: '/create',
    delay: 0.3
  },
  {
    id: 'read',
    title: 'Read',
    description: 'Stories & Adventures',
    icon: Book,
    color: 'bg-indigo-400',
    hoverColor: 'hover:bg-indigo-500',
    shadow: 'shadow-indigo-200',
    path: '/read',
    delay: 0.4
  },
  {
    id: 'explore',
    title: 'Explore',
    description: 'Space, Body & Oceans',
    icon: Globe2,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    shadow: 'shadow-blue-200',
    path: '/explore',
    delay: 0.5
  },
  {
    id: 'tutor',
    title: 'AI Tutor',
    description: 'Ask Questions & Learn',
    icon: Bot,
    color: 'bg-violet-400',
    hoverColor: 'hover:bg-violet-500',
    shadow: 'shadow-violet-200',
    path: '/tutor',
    delay: 0.6
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'My Profile & Stats',
    icon: BarChart3,
    color: 'bg-sky-400',
    hoverColor: 'hover:bg-sky-500',
    shadow: 'shadow-sky-200',
    path: '/profile',
    delay: 0.7
  }
];

export default function Home() {
  const { name, disabledModules } = useStore();

  const filteredCards = CARDS.filter(card => !disabledModules.includes(card.id));

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 px-4 overflow-y-auto">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center mb-12 flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-7xl font-black text-slate-800 tracking-tight mb-4 mt-8">
          Hi, {name}!
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 font-medium px-4">What would you like to do today?</p>
      </motion.div>

      {/* Daily Challenge & Recommendations */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12 px-2 md:px-0">
        {!disabledModules.includes('math') && (
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-xl border-4 border-amber-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 md:p-4">
              <Star className="w-8 h-8 md:w-12 md:h-12 text-amber-400 animate-pulse" />
            </div>
            <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-2 md:mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-amber-500" /> Daily Challenge
            </h3>
            <div className="flex flex-row items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-amber-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-5xl shrink-0">
                🔢
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-base md:text-xl font-bold text-slate-700 mb-1">Math Master!</h4>
                <p className="text-xs md:text-base text-slate-500 font-medium mb-3 md:mb-4 leading-tight">Complete 5 addition problems to earn a bonus badge!</p>
                <Link 
                  to="/learn/math"
                  className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 md:px-6 md:py-2 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200 text-xs md:text-base"
                >
                  Start Challenge <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {!disabledModules.includes('read') && (
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`${disabledModules.includes('math') ? 'lg:col-span-3' : ''} bg-indigo-500 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-xl text-white relative overflow-hidden`}
          >
            <h3 className="text-lg md:text-2xl font-black mb-2 md:mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 md:w-6 md:h-6" /> Smart Pick
            </h3>
            <p className="text-xs md:text-base text-indigo-100 font-medium mb-4 md:mb-6">Based on your progress, you might like:</p>
            <Link to="/read" className="block bg-white/20 hover:bg-white/30 p-3 md:p-4 rounded-2xl transition-colors backdrop-blur-sm">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-2xl md:text-3xl">🚀</div>
                <div>
                  <h4 className="font-bold text-sm md:text-base">Space Adventure</h4>
                  <p className="text-[10px] md:text-xs text-indigo-100">Interactive Story</p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl w-full px-2 md:px-0">
        {filteredCards.map((card) => (
          <Link key={card.id} to={card.path}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: card.delay, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className={`
                ${card.color} ${card.hoverColor} ${card.shadow}
                rounded-[2rem] p-6 md:p-8 text-white shadow-2xl cursor-pointer
                transition-all duration-300 relative overflow-hidden group
              `}
            >
              {/* Decorative background circle */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6 backdrop-blur-sm">
                  <card.icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-1 md:mb-2">{card.title}</h2>
                <p className="text-white/90 text-base md:text-lg font-medium">{card.description}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
