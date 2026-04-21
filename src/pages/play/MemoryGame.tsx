import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

const ALL_EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆'];

const DIFFICULTIES = [
  { name: 'Easy', pairs: 6, cols: 'grid-cols-3 md:grid-cols-4' },
  { name: 'Medium', pairs: 8, cols: 'grid-cols-4' },
  { name: 'Hard', pairs: 10, cols: 'grid-cols-4 md:grid-cols-5' },
];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const navigate = useNavigate();
  const { addXP } = useStore();
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]);

  const initGame = (diff: typeof DIFFICULTIES[0]) => {
    const selectedEmojis = [...ALL_EMOJIS].sort(() => Math.random() - 0.5).slice(0, diff.pairs);
    const shuffled = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMatches(0);
    setShowReward(false);
    setIsLocked(false);
  };

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = newFlipped;

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // Match
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatches(prev => prev + 1);
          setIsLocked(false);

          if (matches + 1 === difficulty.pairs) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            addXP(100);
            setShowReward(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 relative">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 px-4 gap-4">
        <div className="flex items-center w-full md:w-auto justify-between md:justify-start gap-4">
          <button onClick={() => navigate('/play')} className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
          </button>
          <div className="flex items-center gap-2 md:gap-4 bg-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-sm">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-lg md:text-xl font-bold text-slate-700">Matches: {matches} / {difficulty.pairs}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-2xl shadow-sm w-full md:w-auto">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.name}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-2 rounded-xl font-bold text-sm md:text-base whitespace-nowrap transition-all ${
                difficulty.name === diff.name
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {diff.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        <div className={`grid ${difficulty.cols} gap-3 md:gap-6 w-full max-w-2xl`}>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
              onClick={() => handleCardClick(index)}
              className="relative aspect-square cursor-pointer perspective-1000"
            >
              <motion.div
                initial={false}
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full h-full preserve-3d relative"
              >
                {/* Front (Hidden) */}
                <div className="absolute inset-0 backface-hidden bg-amber-400 rounded-2xl md:rounded-3xl shadow-lg flex items-center justify-center border-4 border-amber-300">
                  <Star className="w-8 h-8 md:w-12 md:h-12 text-amber-200 fill-amber-200" />
                </div>
                {/* Back (Revealed) */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-2xl md:rounded-3xl shadow-lg flex items-center justify-center rotate-y-180 border-4 border-amber-100">
                  <span className="text-4xl md:text-6xl">{card.emoji}</span>
                  {card.isMatched && (
                    <div className="absolute inset-0 bg-white/50 rounded-2xl md:rounded-3xl flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 md:w-16 md:h-16 text-green-500" />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {showReward && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full shadow-2xl text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Star className="w-16 h-16 md:w-20 md:h-20 text-yellow-500 fill-yellow-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Memory Master!</h2>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> +100 XP
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => initGame(difficulty)} className="flex-1 py-4 md:py-5 bg-amber-100 text-amber-700 rounded-2xl font-bold text-xl md:text-2xl hover:bg-amber-200 transition-colors">
                Play Again
              </button>
              <button onClick={() => navigate('/play')} className="flex-1 py-4 md:py-5 bg-amber-500 text-white rounded-2xl font-bold text-xl md:text-2xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200">
                Menu
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
