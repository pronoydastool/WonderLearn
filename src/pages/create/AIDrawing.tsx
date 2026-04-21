import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Wand2, Eraser, Download, Loader2, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { useStore } from '../../store/useStore';

const COLORS = ['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff'];
const SIZES = [5, 10, 20];

export default function AIDrawing() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { addXP } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      if (e.cancelable) e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const enhanceDrawing = async () => {
    if (!canvasRef.current) return;
    setIsEnhancing(true);
    
    try {
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      const base64Data = dataUrl.split(',')[1];

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg',
              },
            },
            {
              text: 'Enhance this rough drawing into a beautiful, colorful, child-friendly illustration. Keep the original idea but make it look like a professional children\'s book illustration.',
            },
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setEnhancedImage(`data:image/jpeg;base64,${part.inlineData.data}`);
          addXP(50);
          break;
        }
      }
    } catch (error) {
      console.error('Error enhancing drawing:', error);
      alert('Oops! Something went wrong while making magic. Try again!');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 relative bg-teal-50">
      <div className="w-full max-w-6xl flex items-center justify-between mb-4 md:mb-8 px-4">
        <button onClick={() => navigate('/create')} className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <h1 className="text-2xl md:text-4xl font-black text-slate-800">Magic Drawing 🪄</h1>
        <div className="flex gap-2">
          <button onClick={clearCanvas} className="w-12 h-12 md:w-14 md:h-14 bg-red-100 text-red-600 rounded-2xl shadow-md flex items-center justify-center hover:bg-red-200 transition-colors">
            <Trash2 className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button onClick={enhanceDrawing} disabled={isEnhancing} className="w-12 h-12 md:w-auto md:px-6 bg-teal-500 text-white rounded-2xl shadow-md flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors disabled:opacity-50 font-bold">
            {isEnhancing ? <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" /> : <Wand2 className="w-6 h-6 md:w-8 md:h-8" />}
            <span className="hidden md:inline text-lg">Make Magic</span>
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-6xl flex flex-col md:flex-row gap-4 px-4 overflow-hidden">
        {/* Toolbar */}
        <div className="flex md:flex-col gap-4 bg-white p-4 rounded-3xl shadow-xl overflow-x-auto md:overflow-y-auto shrink-0">
          <div className="flex md:flex-col gap-2">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-4 transition-transform ${color === c ? 'scale-110 border-slate-300' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="w-px md:w-full h-full md:h-px bg-slate-200 my-2 shrink-0" />
          <div className="flex md:flex-col items-center justify-center gap-4">
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 flex items-center justify-center transition-colors ${size === s ? 'bg-slate-300' : 'hover:bg-slate-200'}`}
              >
                <div className="bg-slate-800 rounded-full" style={{ width: s, height: s }} />
              </button>
            ))}
            <button
              onClick={() => setColor('#ffffff')}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${color === '#ffffff' ? 'bg-slate-300' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              <Eraser className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl overflow-hidden touch-none relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair"
          />
        </div>
      </div>

      {/* Magic Result Modal */}
      <AnimatePresence>
        {enhancedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] p-6 max-w-2xl w-full flex flex-col shadow-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
                  <Wand2 className="w-6 h-6 md:w-8 md:h-8 text-teal-500" />
                  Magic Masterpiece!
                </h2>
                <button 
                  onClick={() => setEnhancedImage(null)}
                  className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                </button>
              </div>
              
              <div className="flex-1 bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center p-2 min-h-0">
                <img 
                  src={enhancedImage} 
                  alt="Enhanced drawing" 
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-md"
                />
              </div>

              <div className="flex gap-4 mt-4 px-4">
                <button 
                  onClick={() => setEnhancedImage(null)}
                  className="flex-1 py-3 md:py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg md:text-xl transition-colors"
                >
                  Draw Again
                </button>
                <a 
                  href={enhancedImage}
                  download="magic-drawing.jpg"
                  className="flex-1 py-3 md:py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-bold text-lg md:text-xl shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5 md:w-6 md:h-6" /> Save Image
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
