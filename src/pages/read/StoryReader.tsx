import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, Star, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

const STORIES = {
  'brave-bear': {
    title: 'The Brave Little Bear',
    color: 'bg-amber-500',
    pages: [
      { text: 'Once upon a time, there was a little bear named Barnaby.', emoji: '🐻' },
      { text: 'Barnaby lived in a big, green forest with his friends.', emoji: '🌲' },
      { text: 'One day, he found a shiny red apple high up in a tree.', emoji: '🍎' },
      { text: 'He was scared to climb, but he took a deep breath and tried.', emoji: '🧗' },
      { text: 'He reached the top, got the apple, and shared it with his friends!', emoji: '🎉' },
    ]
  },
  'space-adventure': {
    title: 'Space Adventure',
    color: 'bg-indigo-500',
    pages: [
      { text: 'Zoom! The rocket ship blasted off into the starry night.', emoji: '🚀' },
      { text: 'Astronaut Alex looked out the window and saw the moon.', emoji: '🌕' },
      { text: 'Suddenly, a friendly green alien waved hello from a passing comet.', emoji: '👽' },
      { text: 'They raced each other around the rings of Saturn.', emoji: '🪐' },
      { text: 'It was the best space adventure ever!', emoji: '✨' },
    ]
  },
  'magic-garden': {
    title: 'The Magic Garden',
    color: 'bg-emerald-500',
    pages: [
      { text: 'Lily found a hidden gate behind the old oak tree.', emoji: '🚪' },
      { text: 'Inside, the flowers glowed with all colors of the rainbow.', emoji: '🌸' },
      { text: 'A tiny fairy fluttered down and said hello.', emoji: '🧚' },
      { text: 'They danced together until the sun went down.', emoji: '💃' },
      { text: 'Lily promised to return to the magic garden tomorrow.', emoji: '🌅' },
    ]
  },
  'ocean-friends': {
    title: 'Ocean Friends',
    color: 'bg-cyan-500',
    pages: [
      { text: 'Sammy the Seahorse loved to swim in the coral reef.', emoji: '🌊' },
      { text: 'He met a wise old turtle named Timmy.', emoji: '🐢' },
      { text: 'Together, they explored a sunken pirate ship.', emoji: '🚢' },
      { text: 'They found a treasure chest full of shiny pearls.', emoji: '💎' },
      { text: 'The ocean is full of wonderful surprises!', emoji: '🐠' },
    ]
  }
};

export default function StoryReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addXP } = useStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const story = id ? STORIES[id as keyof typeof STORIES] : null;

  const playSound = (text: string) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.85;
    msg.pitch = 1.1;
    window.speechSynthesis.speak(msg);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  if (!story) return <div>Story not found</div>;

  const handleNext = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      addXP(100);
      setShowReward(true);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const page = story.pages[currentPage];

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 relative">
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 md:mb-12 px-4">
        <button onClick={() => navigate('/read')} className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <div className="flex items-center gap-2 md:gap-4 bg-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-sm">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
          <span className="text-lg md:text-xl font-bold text-slate-700">Page {currentPage + 1} / {story.pages.length}</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl p-8 md:p-12 flex flex-col items-center relative overflow-hidden min-h-[400px] md:min-h-[500px]"
          >
            <div className="text-[6rem] md:text-[10rem] leading-none mb-8 md:mb-12 drop-shadow-lg">
              {page.emoji}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 text-center leading-relaxed mb-12">
              {page.text}
            </h2>

            <div className="flex items-center gap-4 md:gap-8 w-full justify-center mt-auto">
              <button onClick={handlePrev} disabled={currentPage === 0} className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-slate-200 transition-colors">
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
              </button>
              <button onClick={() => playSound(page.text)} className={`w-20 h-20 md:w-24 md:h-24 ${story.color} rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg`}>
                <Volume2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </button>
              <button onClick={handleNext} className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
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
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">The End!</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> +100 XP
              </div>
            </div>
            <button onClick={() => navigate('/read')} className={`w-full py-4 md:py-5 ${story.color} text-white rounded-2xl font-bold text-xl md:text-2xl hover:opacity-90 transition-opacity shadow-lg`}>
              Back to Library
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Need to import BookOpen for the header
import { BookOpen } from 'lucide-react';
