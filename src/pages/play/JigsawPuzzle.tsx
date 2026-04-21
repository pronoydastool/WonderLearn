import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, RotateCcw, Puzzle as PuzzleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

const PUZZLE_IMAGES = [
  { id: 'animals', src: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=800&h=800', title: 'Safari Animals' },
  { id: 'space', src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=800', title: 'Outer Space' },
  { id: 'ocean', src: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=800&h=800', title: 'Deep Ocean' },
  { id: 'forest', src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800&h=800', title: 'Magic Forest' },
  { id: 'dinosaurs', src: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34f5?auto=format&fit=crop&q=80&w=800&h=800', title: 'Dinosaurs' },
  { id: 'city', src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800&h=800', title: 'City Lights' },
];

const GRID_SIZE = 3; // 3x3 grid

interface Piece {
  id: number;
  currentPos: number;
  correctPos: number;
}

export default function JigsawPuzzle() {
  const navigate = useNavigate();
  const addXP = useStore((state) => state.addXP);
  const [selectedImage, setSelectedImage] = useState(PUZZLE_IMAGES[0]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isSelecting, setIsSelecting] = useState(true);

  const initGame = (image: typeof PUZZLE_IMAGES[0]) => {
    setSelectedImage(image);
    setIsSelecting(false);
    setIsSolved(false);

    // Create pieces
    const newPieces: Piece[] = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({
      id: i,
      correctPos: i,
      currentPos: i,
    }));

    // Shuffle pieces
    for (let i = newPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPieces[i].currentPos, newPieces[j].currentPos] = [newPieces[j].currentPos, newPieces[i].currentPos];
    }

    setPieces(newPieces);
  };

  const handlePieceClick = (clickedPos: number) => {
    if (isSolved) return;

    // Find the empty space (we'll use the last position as the "empty" space for sliding puzzle logic, or just allow swapping any two pieces for a simpler jigsaw)
    // For a simple jigsaw, let's allow swapping the clicked piece with the currently selected piece.
    // Actually, a simpler approach for kids: click a piece, then click another to swap them.
    // Let's implement a "click to select, click to swap" mechanism.
  };

  // Simpler approach: Drag and drop is hard on mobile without libraries. Let's do a "click piece A, click piece B to swap"
  const [selectedPiecePos, setSelectedPiecePos] = useState<number | null>(null);

  const handleSwap = (pos: number) => {
    if (isSolved) return;

    if (selectedPiecePos === null) {
      setSelectedPiecePos(pos);
    } else {
      if (selectedPiecePos === pos) {
        setSelectedPiecePos(null); // Deselect
        return;
      }

      // Swap pieces
      const newPieces = [...pieces];
      const piece1Index = newPieces.findIndex(p => p.currentPos === selectedPiecePos);
      const piece2Index = newPieces.findIndex(p => p.currentPos === pos);

      newPieces[piece1Index].currentPos = pos;
      newPieces[piece2Index].currentPos = selectedPiecePos;

      setPieces(newPieces);
      setSelectedPiecePos(null);

      // Check win condition
      const won = newPieces.every(p => p.currentPos === p.correctPos);
      if (won) {
        setIsSolved(true);
        addXP(50);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFB800', '#FF3D00', '#00E676', '#2979FF']
        });
      }
    }
  };

  if (isSelecting) {
    return (
      <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 overflow-y-auto">
        <div className="w-full max-w-4xl flex items-center mb-8 px-4">
          <button 
            onClick={() => navigate('/play')}
            className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
          </button>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 ml-4 md:ml-8">Jigsaw Puzzle 🧩</h1>
        </div>

        <h2 className="text-2xl font-bold text-slate-700 mb-6">Choose a picture!</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4 max-w-4xl w-full">
          {PUZZLE_IMAGES.map((img) => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => initGame(img)}
              className="bg-white rounded-3xl p-4 shadow-xl cursor-pointer flex flex-col items-center"
            >
              <img src={img.src} alt={img.title} className="w-full aspect-square object-cover rounded-2xl mb-4" />
              <h3 className="text-xl font-bold text-slate-800">{img.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 overflow-y-auto">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 px-4">
        <div className="flex items-center">
          <button 
            onClick={() => setIsSelecting(true)}
            className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
          </button>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 ml-4 hidden sm:block">
            {selectedImage.title}
          </h1>
        </div>
        
        <button
          onClick={() => initGame(selectedImage)}
          className="flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 bg-orange-100 text-orange-600 rounded-2xl font-bold hover:bg-orange-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>

      <div className="flex-1 w-full max-w-2xl px-4 flex flex-col items-center justify-center">
        {isSolved ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-8 shadow-2xl text-center max-w-md w-full"
          >
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4">Puzzle Solved!</h2>
            <p className="text-xl text-slate-600 font-medium mb-8">+50 XP Earned!</p>
            
            <img src={selectedImage.src} alt="Completed" className="w-full rounded-2xl mb-8 shadow-md" />

            <button
              onClick={() => setIsSelecting(true)}
              className="w-full py-5 bg-orange-500 text-white rounded-2xl font-bold text-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
            >
              Play Another
            </button>
          </motion.div>
        ) : (
          <div className="w-full max-w-[500px] aspect-square bg-slate-200 rounded-2xl p-2 shadow-inner relative">
            <div 
              className="w-full h-full grid gap-1"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, posIndex) => {
                const piece = pieces.find(p => p.currentPos === posIndex);
                if (!piece) return null;

                const row = Math.floor(piece.correctPos / GRID_SIZE);
                const col = piece.correctPos % GRID_SIZE;
                
                const bgPosX = (col / (GRID_SIZE - 1)) * 100;
                const bgPosY = (row / (GRID_SIZE - 1)) * 100;

                const isSelected = selectedPiecePos === posIndex;

                return (
                  <motion.div
                    key={piece.id}
                    layoutId={`piece-${piece.id}`}
                    onClick={() => handleSwap(posIndex)}
                    className={`
                      relative rounded-xl overflow-hidden cursor-pointer shadow-sm
                      ${isSelected ? 'ring-4 ring-orange-500 z-10 scale-95' : 'hover:scale-[0.98]'}
                    `}
                    style={{
                      backgroundImage: `url(${selectedImage.src})`,
                      backgroundSize: `${GRID_SIZE * 100}%`,
                      backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-orange-500/20" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        
        {!isSolved && (
          <p className="mt-8 text-slate-500 font-medium text-lg text-center">
            Tap a piece, then tap another to swap them!
          </p>
        )}
      </div>
    </div>
  );
}
