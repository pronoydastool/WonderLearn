import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eraser, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff'];
const SIZES = [5, 10, 20];

export default function DrawingBoard() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual size in memory (scaled to account for extra pixel density)
    // We'll just use the display size for simplicity in this demo
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
      // Prevent scrolling while drawing on touch devices
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

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 relative">
      <div className="w-full max-w-6xl flex items-center justify-between mb-4 md:mb-8 px-4">
        <button onClick={() => navigate('/create')} className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <h1 className="text-2xl md:text-4xl font-black text-slate-800">Drawing Board 🎨</h1>
        <div className="flex gap-2">
          <button onClick={clearCanvas} className="w-12 h-12 md:w-14 md:h-14 bg-red-100 text-red-600 rounded-2xl shadow-md flex items-center justify-center hover:bg-red-200 transition-colors">
            <Trash2 className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <button onClick={downloadCanvas} className="w-12 h-12 md:w-14 md:h-14 bg-emerald-100 text-emerald-600 rounded-2xl shadow-md flex items-center justify-center hover:bg-emerald-200 transition-colors">
            <Download className="w-6 h-6 md:w-8 md:h-8" />
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
    </div>
  );
}
