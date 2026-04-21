import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Eraser, Check, RotateCcw, Type, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = '0123456789'.split('');

export default function WritingPractice() {
  const navigate = useNavigate();
  const { addXP } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'alpha' | 'num'>('alpha');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const items = mode === 'alpha' ? ALPHABETS : NUMBERS;
  const currentItem = items[currentIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const size = Math.min(window.innerWidth * 0.8, 500);
    canvas.width = size;
    canvas.height = size;

    // Initial clear
    clearCanvas();
  }, [mode, currentIndex]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw guide lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    
    // Horizontal center
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw the character as a faint guide
    ctx.setLineDash([]);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = `bold ${canvas.height * 0.8}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentItem, canvas.width / 2, canvas.height / 2);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Draw a dot
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#6366f1';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#6366f1'; // Indigo-500

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleComplete = () => {
    setShowSuccess(true);
    addXP(10);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      setShowSuccess(false);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 2000);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 px-4 bg-emerald-50 overflow-y-auto">
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('/create')}
          className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 shrink-0"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="flex bg-white p-1 rounded-2xl shadow-md">
          <button
            onClick={() => { setMode('alpha'); setCurrentIndex(0); }}
            className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${mode === 'alpha' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
          >
            <Type className="w-5 h-5" /> ABC
          </button>
          <button
            onClick={() => { setMode('num'); setCurrentIndex(0); }}
            className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${mode === 'num' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}
          >
            <Hash className="w-5 h-5" /> 123
          </button>
        </div>
        <div className="w-12 h-12 shrink-0" />
      </div>

      {/* Selector */}
      <div className="w-full max-w-4xl py-2 mb-6">
        <div className="flex flex-wrap gap-2 px-4 justify-center">
          {items.map((item, index) => (
            <button
              key={item}
              onClick={() => setCurrentIndex(index)}
              className={`w-12 h-12 rounded-xl font-bold text-xl flex items-center justify-center transition-all shrink-0 ${
                currentIndex === index
                  ? 'bg-emerald-500 text-white shadow-lg scale-110'
                  : 'bg-white text-slate-500 hover:bg-emerald-50 shadow-sm'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
        <motion.div 
          key={`${mode}-${currentIndex}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative overflow-hidden w-full max-w-lg flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="bg-white rounded-[3rem] cursor-crosshair touch-none shadow-xl"
          />

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center text-white z-10"
              >
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6">
                  <Check className="w-20 h-20 text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black">Great Job!</h2>
                <p className="text-xl font-medium mt-2">+10 XP Earned</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex gap-4 mt-12 w-full max-w-md">
          <button
            onClick={clearCanvas}
            className="flex-1 py-4 bg-white text-slate-600 rounded-2xl font-bold text-xl shadow-md hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-6 h-6" /> Clear
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 flex items-center justify-center gap-2"
          >
            <Check className="w-6 h-6" /> Done
          </button>
        </div>

        <p className="mt-8 text-slate-500 font-medium text-xl text-center">
          Trace the {mode === 'alpha' ? 'letter' : 'number'} with your finger! ✍️
        </p>
      </div>
    </div>
  );
}
