import React, { useState } from 'react';
import { motion } from 'motion/react';

const ELEMENTS = [
  { name: 'Hydrogen', symbol: 'H', protons: 1, info: 'The most common element in the universe!' },
  { name: 'Helium', symbol: 'He', protons: 2, info: 'Used to make balloons float!' },
  { name: 'Lithium', symbol: 'Li', protons: 3, info: 'Used in batteries for phones and cars.' },
  { name: 'Beryllium', symbol: 'Be', protons: 4, info: 'A strong, lightweight metal used in space telescopes.' },
  { name: 'Boron', symbol: 'B', protons: 5, info: 'Used to make strong glass and rocket fuel.' },
  { name: 'Carbon', symbol: 'C', protons: 6, info: 'The building block of all life on Earth!' },
];

export default function AtomSimulation() {
  const [electrons, setElectrons] = useState(1);
  const currentElement = ELEMENTS[electrons - 1];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-indigo-950 rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-[100px]" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-2 z-20">Atom Builder</h3>
      <p className="text-indigo-200 mb-6 text-center z-20">Add electrons to build different elements!</p>

      <div className="flex gap-4 mb-8 z-20">
        <button 
          onClick={() => setElectrons(Math.max(1, electrons - 1))}
          className="w-12 h-12 bg-indigo-800 hover:bg-indigo-700 text-white rounded-full text-2xl font-bold flex items-center justify-center transition-colors shadow-lg"
        >
          -
        </button>
        <div className="flex flex-col items-center justify-center px-8 bg-indigo-900/50 backdrop-blur-md rounded-2xl border border-indigo-700 min-w-[160px]">
          <span className="text-2xl font-black text-white">{currentElement.symbol}</span>
          <span className="text-sm font-bold text-indigo-300">{currentElement.name}</span>
        </div>
        <button 
          onClick={() => setElectrons(Math.min(6, electrons + 1))}
          className="w-12 h-12 bg-indigo-800 hover:bg-indigo-700 text-white rounded-full text-2xl font-bold flex items-center justify-center transition-colors shadow-lg"
        >
          +
        </button>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Nucleus - More realistic with protons and neutrons */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: 360 }}
          transition={{ 
            scale: { repeat: Infinity, duration: 2 },
            rotate: { repeat: Infinity, duration: 20, ease: "linear" }
          }}
          className="absolute w-20 h-20 z-10 flex items-center justify-center"
        >
          {/* Protons and Neutrons cluster */}
          <div className="relative w-full h-full">
            <div className="absolute top-2 left-2 w-8 h-8 bg-rose-500 rounded-full shadow-lg" />
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-rose-600 rounded-full shadow-lg" />
            <div className="absolute top-2 right-2 w-8 h-8 bg-slate-400 rounded-full shadow-lg" />
            <div className="absolute bottom-2 left-2 w-8 h-8 bg-slate-500 rounded-full shadow-lg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-rose-500 rounded-full shadow-xl flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">+{electrons}</span>
            </div>
          </div>
        </motion.div>

        {/* Electrons */}
        {Array.from({ length: electrons }).map((_, i) => {
          // Shell logic: 2 in first shell, rest in second
          const shellIndex = i < 2 ? 0 : 1;
          const orbitSize = shellIndex === 0 ? 120 : 200;
          const speed = shellIndex === 0 ? 3 : 5;
          const angleOffset = shellIndex === 0 ? (i * 180) : ((i - 2) * 90);
          
          return (
            <div key={i} className="absolute inset-0 flex items-center justify-center">
              {/* Orbit Path */}
              <div 
                className="absolute rounded-full border border-indigo-500/20"
                style={{ width: orbitSize, height: orbitSize }}
              />
              
              {/* Electron Container */}
              <motion.div
                animate={{ rotate: 360 + angleOffset }}
                initial={{ rotate: angleOffset }}
                transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
                className="absolute"
                style={{ width: orbitSize, height: orbitSize }}
              >
                {/* Electron with glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-sky-400 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.8)] border-2 border-white/30" />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Info Panel */}
      <motion.div 
        key={electrons}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl z-20 max-w-xs text-center"
      >
        <p className="text-indigo-100 text-sm italic">"{currentElement.info}"</p>
      </motion.div>
    </div>
  );
}
