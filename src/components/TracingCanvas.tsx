import React, { useRef, useEffect, useState } from 'react';

interface TracingCanvasProps {
  letter: string;
  onComplete?: () => void;
}

export default function TracingCanvas({ letter, onComplete }: TracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Setup canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 20;
    context.strokeStyle = '#f43f5e'; // rose-500

    setCtx(context);

    // Draw the letter as a guide
    drawGuide(context, canvas.width, canvas.height, letter);
  }, [letter]);

  const drawGuide = (context: CanvasRenderingContext2D, width: number, height: number, text: string) => {
    context.clearRect(0, 0, width, height);
    context.font = `bold ${height * 0.8}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#e2e8f0'; // slate-200
    context.fillText(text, width / 2, height / 2);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (ctx) ctx.closePath();
    // Basic completion check could be added here
    if (onComplete) onComplete();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    drawGuide(ctx, canvasRef.current.width, canvasRef.current.height, letter);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-64 bg-white rounded-3xl shadow-inner cursor-crosshair touch-none"
      />
      <button 
        onClick={clearCanvas}
        className="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
