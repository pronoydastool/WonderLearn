import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Music, Play, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NOTES = [
  { note: 'C4', freq: 261.63, color: 'bg-red-400', key: 'a' },
  { note: 'D4', freq: 293.66, color: 'bg-orange-400', key: 's' },
  { note: 'E4', freq: 329.63, color: 'bg-yellow-400', key: 'd' },
  { note: 'F4', freq: 349.23, color: 'bg-green-400', key: 'f' },
  { note: 'G4', freq: 392.00, color: 'bg-teal-400', key: 'g' },
  { note: 'A4', freq: 440.00, color: 'bg-blue-400', key: 'h' },
  { note: 'B4', freq: 493.88, color: 'bg-indigo-400', key: 'j' },
  { note: 'C5', freq: 523.25, color: 'bg-purple-400', key: 'k' },
];

export default function MusicStudio() {
  const navigate = useNavigate();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first interaction to comply with browser policies
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener('touchstart', initAudio, { once: true });
    window.addEventListener('mousedown', initAudio, { once: true });

    return () => {
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('mousedown', initAudio);
      if (audioCtxRef.current?.state !== 'closed') {
        audioCtxRef.current?.close();
      }
    };
  }, []);

  const playNote = (freq: number, noteName: string) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);

    setActiveNote(noteName);
    setTimeout(() => setActiveNote(null), 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const note = NOTES.find(n => n.key === e.key.toLowerCase());
      if (note && activeNote !== note.note) {
        playNote(note.freq, note.note);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNote]);

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 relative">
      <div className="w-full max-w-6xl flex items-center justify-between mb-8 md:mb-12 px-4">
        <button onClick={() => navigate('/create')} className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800">Music Studio 🎹</h1>
        <div className="w-12 md:w-14"></div>
      </div>

      <div className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center px-4">
        <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl w-full flex flex-col items-center">
          <div className="flex items-center gap-4 mb-12">
            <Music className="w-12 h-12 text-emerald-500" />
            <p className="text-xl md:text-2xl text-slate-600 font-medium">Tap the keys or use your keyboard!</p>
          </div>

          <div className="flex justify-center gap-2 md:gap-4 w-full h-64 md:h-96">
            {NOTES.map((n) => (
              <motion.button
                key={n.note}
                whileTap={{ scale: 0.95, y: 10 }}
                onMouseDown={() => playNote(n.freq, n.note)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  playNote(n.freq, n.note);
                }}
                className={`
                  flex-1 rounded-b-3xl rounded-t-lg shadow-lg border-b-8 border-r-2 border-l-2 relative overflow-hidden
                  transition-colors duration-100
                  ${activeNote === n.note ? n.color + ' border-black/20' : 'bg-white border-slate-200 hover:bg-slate-50'}
                `}
              >
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className={`text-xl md:text-3xl font-black ${activeNote === n.note ? 'text-white' : 'text-slate-400'}`}>
                    {n.note[0]}
                  </span>
                  <div className={`text-sm md:text-base font-bold mt-2 ${activeNote === n.note ? 'text-white/80' : 'text-slate-300'}`}>
                    {n.key.toUpperCase()}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
