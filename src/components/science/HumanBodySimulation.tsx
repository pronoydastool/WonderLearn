import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Activity, Brain, Wind, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ORGANS = [
  { 
    name: 'Brain', 
    color: 'bg-pink-500', 
    info: 'The control center of your body. It helps you think, feel, and move.', 
    fact: 'Your brain generates enough electricity to power a small light bulb.', 
    icon: Brain,
    system: 'Nervous System',
    location: 'Inside the Skull',
    functions: ['Thinking and Memory', 'Controlling Movement', 'Processing Senses'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Human_brain_NIH.jpg/800px-Human_brain_NIH.jpg'
  },
  { 
    name: 'Heart', 
    color: 'bg-red-500', 
    info: 'Pumps blood throughout your body. It beats about 100,000 times a day!', 
    fact: 'Your heart is about the size of your fist.', 
    icon: Heart,
    system: 'Circulatory System',
    location: 'Center of the Chest',
    functions: ['Pumping Blood', 'Delivering Oxygen', 'Removing Waste'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Heart_anterior_exterior_view.jpg/800px-Heart_anterior_exterior_view.jpg'
  },
  { 
    name: 'Lungs', 
    color: 'bg-blue-400', 
    info: 'Helps you breathe. They take in oxygen and breathe out carbon dioxide.', 
    fact: 'Your left lung is slightly smaller than your right lung to make room for your heart.', 
    icon: Wind,
    system: 'Respiratory System',
    location: 'Inside the Ribcage',
    functions: ['Breathing', 'Oxygen Exchange', 'Protecting the Heart'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Lungs_diagram_simple.svg/800px-Lungs_diagram_simple.svg.png'
  },
  { 
    name: 'Stomach', 
    color: 'bg-orange-500', 
    info: 'Breaks down the food you eat so your body can use it for energy.', 
    fact: 'Your stomach can stretch to hold about 1 liter of food.', 
    icon: Activity,
    system: 'Digestive System',
    location: 'Upper Abdomen',
    functions: ['Digesting Food', 'Killing Bacteria', 'Storing Food'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Stomach_diagram.svg/800px-Stomach_diagram.svg.png'
  },
  { 
    name: 'Liver', 
    color: 'bg-amber-700', 
    info: 'Cleans your blood and helps with digestion.', 
    fact: 'The liver is the only organ that can regenerate itself.', 
    icon: Droplets,
    system: 'Digestive System',
    location: 'Right side of Abdomen',
    functions: ['Cleaning Blood', 'Storing Energy', 'Producing Bile'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Liver_diagram_simple.svg/800px-Liver_diagram_simple.svg.png'
  },
];

export default function HumanBodySimulation() {
  const [selectedOrgan, setSelectedOrgan] = useState<typeof ORGANS[0] | null>(null);
  const navigate = useNavigate();

  if (selectedOrgan) {
    return (
      <div className="flex flex-col items-center flex-1 w-full p-4 md:p-8 relative overflow-hidden">
        <div className="w-full max-w-2xl flex items-center mb-8 z-20">
          <button 
            onClick={() => setSelectedOrgan(null)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-rose-100 transition-colors shadow-md"
          >
            <ArrowLeft className="w-6 h-6 text-rose-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 ml-4">Back to Organs</h2>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-2xl bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5">
            <selectedOrgan.icon className="w-24 h-24 md:w-32 md:h-32 text-rose-500" />
          </div>

          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className={`w-16 h-16 md:w-24 md:h-24 ${selectedOrgan.color} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg`}>
              <selectedOrgan.icon className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-5xl font-black text-slate-800 mb-1">{selectedOrgan.name}</h3>
              <span className="text-rose-500 font-bold text-sm md:text-lg uppercase tracking-widest">Organ Discovery</span>
            </div>
          </div>
          
          <img 
            src={selectedOrgan.image} 
            alt={selectedOrgan.name} 
            className="w-full h-48 md:h-64 object-cover rounded-2xl md:rounded-3xl mb-6 md:mb-8 shadow-md"
            referrerPolicy="no-referrer"
          />

          <p className="text-slate-600 text-lg md:text-2xl font-medium mb-6 md:mb-10 leading-relaxed">
            {selectedOrgan.info}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-rose-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-rose-100">
              <span className="text-[10px] md:text-xs uppercase font-bold text-rose-400 block mb-1 md:mb-2">System</span>
              <span className="text-slate-700 font-bold text-lg md:text-xl">{selectedOrgan.system}</span>
            </div>
            <div className="bg-rose-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-rose-100">
              <span className="text-[10px] md:text-xs uppercase font-bold text-rose-400 block mb-1 md:mb-2">Location</span>
              <span className="text-slate-700 font-bold text-lg md:text-xl">{selectedOrgan.location}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 mb-6 md:mb-8">
            <h4 className="text-slate-800 font-bold text-lg md:text-xl mb-4">Main Functions</h4>
            <ul className="space-y-2 md:space-y-3">
              {selectedOrgan.functions.map((func, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-600 text-sm md:text-base">
                  <div className="w-2 h-2 bg-rose-500 rounded-full shrink-0" />
                  {func}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-rose-100">
            <span className="text-[10px] md:text-xs uppercase font-bold text-rose-400 block mb-1 md:mb-2">Fun Fact</span>
            <span className="text-slate-700 font-bold text-base md:text-xl">{selectedOrgan.fact}</span>
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
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-rose-100 transition-colors shadow-md"
        >
          <ArrowLeft className="w-6 h-6 text-rose-600" />
        </button>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 ml-4">Human Body 🫀</h2>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {ORGANS.map((organ, i) => (
          <motion.button
            key={organ.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedOrgan(organ)}
            className="bg-white p-6 rounded-[2rem] flex flex-col items-center text-center hover:shadow-xl transition-all shadow-md border border-rose-100"
          >
            <div className={`w-20 h-20 ${organ.color} rounded-full mb-4 shadow-lg flex items-center justify-center`}>
              <organ.icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{organ.name}</h3>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
