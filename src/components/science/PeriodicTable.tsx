import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Atom } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', number: 1, group: 'Nonmetal', color: 'bg-emerald-400', mass: '1.008', phase: 'Gas', discovered: '1766', fact: 'The most abundant element in the universe.' },
  { symbol: 'He', name: 'Helium', number: 2, group: 'Noble Gas', color: 'bg-purple-400', mass: '4.0026', phase: 'Gas', discovered: '1868', fact: 'Used in balloons because it is lighter than air.' },
  { symbol: 'Li', name: 'Lithium', number: 3, group: 'Alkali Metal', color: 'bg-rose-400', mass: '6.94', phase: 'Solid', discovered: '1817', fact: 'The lightest metal, used in rechargeable batteries.' },
  { symbol: 'Be', name: 'Beryllium', number: 4, group: 'Alkaline Earth', color: 'bg-orange-400', mass: '9.0122', phase: 'Solid', discovered: '1798', fact: 'Used in gears and cogs particularly in the aviation industry.' },
  { symbol: 'B', name: 'Boron', number: 5, group: 'Metalloid', color: 'bg-teal-400', mass: '10.81', phase: 'Solid', discovered: '1808', fact: 'Used in fireworks to give them a green color.' },
  { symbol: 'C', name: 'Carbon', number: 6, group: 'Nonmetal', color: 'bg-emerald-400', mass: '12.011', phase: 'Solid', discovered: 'Ancient', fact: 'The basis of all known life on Earth.' },
  { symbol: 'N', name: 'Nitrogen', number: 7, group: 'Nonmetal', color: 'bg-emerald-400', mass: '14.007', phase: 'Gas', discovered: '1772', fact: 'Makes up about 78% of Earth\'s atmosphere.' },
  { symbol: 'O', name: 'Oxygen', number: 8, group: 'Nonmetal', color: 'bg-emerald-400', mass: '15.999', phase: 'Gas', discovered: '1774', fact: 'Essential for respiration of most living organisms.' },
  { symbol: 'F', name: 'Fluorine', number: 9, group: 'Halogen', color: 'bg-yellow-400', mass: '18.998', phase: 'Gas', discovered: '1886', fact: 'Added to toothpaste to help prevent tooth decay.' },
  { symbol: 'Ne', name: 'Neon', number: 10, group: 'Noble Gas', color: 'bg-purple-400', mass: '20.180', phase: 'Gas', discovered: '1898', fact: 'Glows reddish-orange in vacuum discharge tubes.' },
];

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<typeof ELEMENTS[0] | null>(null);
  const navigate = useNavigate();

  if (selectedElement) {
    return (
      <div className="flex flex-col items-center flex-1 w-full p-4 md:p-8 relative overflow-hidden">
        <div className="w-full max-w-2xl flex items-center mb-8 z-20">
          <button 
            onClick={() => setSelectedElement(null)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors shadow-md"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 ml-4">Back to Elements</h2>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[3rem] shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Atom className="w-32 h-32 text-slate-500" />
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className={`w-24 h-24 ${selectedElement.color} rounded-3xl flex items-center justify-center shadow-lg`}>
              <span className="text-4xl font-black text-white">{selectedElement.symbol}</span>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-800 mb-2">{selectedElement.name}</h3>
              <span className="text-slate-500 font-bold text-lg uppercase tracking-widest">Atomic Number: {selectedElement.number}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Element Group</span>
              <span className="text-slate-700 font-bold text-xl">{selectedElement.group}</span>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Atomic Mass</span>
              <span className="text-slate-700 font-bold text-xl">{selectedElement.mass}</span>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Phase at Room Temp</span>
              <span className="text-slate-700 font-bold text-xl">{selectedElement.phase}</span>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Discovered</span>
              <span className="text-slate-700 font-bold text-xl">{selectedElement.discovered}</span>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
            <span className="text-xs uppercase font-bold text-indigo-400 block mb-2">Fun Fact</span>
            <span className="text-slate-700 font-bold text-xl">{selectedElement.fact}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center flex-1 w-full p-4 md:p-8 relative overflow-y-auto">
      <div className="w-full max-w-4xl flex items-center mb-8 z-20">
        <button 
          onClick={() => navigate('/explore')}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors shadow-md"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 ml-4">Periodic Table 🧪</h2>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 z-10">
        {ELEMENTS.map((element, i) => (
          <motion.button
            key={element.symbol}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedElement(element)}
            className={`${element.color} p-4 rounded-2xl flex flex-col items-center text-center hover:shadow-xl transition-all shadow-md text-white`}
          >
            <span className="text-sm font-bold opacity-80 self-start">{element.number}</span>
            <span className="text-4xl font-black my-2">{element.symbol}</span>
            <span className="text-sm font-medium truncate w-full">{element.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
