import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Leaf, Flower, Sprout, TreeDeciduous } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PLANT_PARTS = [
  { 
    name: 'Roots', 
    color: 'bg-amber-700', 
    info: 'Roots hold the plant in the ground and absorb water and nutrients from the soil.', 
    icon: Sprout,
    importance: 'High',
    location: 'Underground',
    details: ['Absorb water', 'Store food', 'Anchor the plant'],
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Stem', 
    color: 'bg-emerald-600', 
    info: 'The stem supports the plant and carries water and nutrients to the leaves.', 
    icon: TreeDeciduous,
    importance: 'Medium',
    location: 'Above ground',
    details: ['Support leaves', 'Transport water', 'Carry nutrients'],
    image: 'https://images.unsplash.com/photo-1530569673472-307dc017a82d?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Leaves', 
    color: 'bg-green-500', 
    info: 'Leaves make food for the plant using sunlight, water, and air (photosynthesis).', 
    icon: Leaf,
    importance: 'Critical',
    location: 'On stems',
    details: ['Photosynthesis', 'Gas exchange', 'Transpiration'],
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Flower', 
    color: 'bg-rose-500', 
    info: 'Flowers help the plant reproduce by making seeds. They are often colorful to attract insects.', 
    icon: Flower,
    importance: 'High',
    location: 'Top of stems',
    details: ['Reproduction', 'Attract pollinators', 'Produce seeds'],
    image: 'https://images.unsplash.com/photo-1490750967868-88cb44cb8cb0?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Fruit', 
    color: 'bg-orange-500', 
    info: 'Fruit protects the seeds and helps them spread to new places to grow.', 
    icon: Leaf,
    importance: 'Medium',
    location: 'From flowers',
    details: ['Protect seeds', 'Seed dispersal', 'Food source'],
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Seed', 
    color: 'bg-yellow-600', 
    info: 'Seeds contain a tiny plant waiting to grow when it gets water and warmth.', 
    icon: Sprout,
    importance: 'Critical',
    location: 'Inside fruit',
    details: ['New life', 'Genetic storage', 'Survival'],
    image: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?auto=format&fit=crop&q=80&w=800'
  },
];

export default function PlantExplorer() {
  const [selectedPart, setSelectedPart] = useState<typeof PLANT_PARTS[0] | null>(null);
  const navigate = useNavigate();

  if (selectedPart) {
    return (
      <div className="flex flex-col items-center flex-1 w-full p-4 md:p-8 relative overflow-hidden">
        <div className="w-full max-w-2xl flex items-center mb-8 z-20">
          <button 
            onClick={() => setSelectedPart(null)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-md"
          >
            <ArrowLeft className="w-6 h-6 text-emerald-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 ml-4">Back to Plant Parts</h2>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-2xl bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5">
            <selectedPart.icon className="w-24 h-24 md:w-32 md:h-32 text-emerald-500" />
          </div>

          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className={`w-16 h-16 md:w-24 md:h-24 ${selectedPart.color} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg`}>
              <selectedPart.icon className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-5xl font-black text-slate-800 mb-1">{selectedPart.name}</h3>
              <span className="text-emerald-500 font-bold text-sm md:text-lg uppercase tracking-widest">Plant Anatomy</span>
            </div>
          </div>
          
          <img 
            src={selectedPart.image} 
            alt={selectedPart.name} 
            className="w-full h-48 md:h-64 object-cover rounded-2xl md:rounded-3xl mb-6 md:mb-8 shadow-md"
            referrerPolicy="no-referrer"
          />

          <p className="text-slate-600 text-lg md:text-2xl font-medium mb-6 md:mb-10 leading-relaxed">
            {selectedPart.info}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-emerald-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-emerald-100">
              <span className="text-[10px] md:text-xs uppercase font-bold text-emerald-400 block mb-1 md:mb-2">Importance</span>
              <span className="text-slate-700 font-bold text-lg md:text-xl">{selectedPart.importance}</span>
            </div>
            <div className="bg-emerald-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-emerald-100">
              <span className="text-[10px] md:text-xs uppercase font-bold text-emerald-400 block mb-1 md:mb-2">Location</span>
              <span className="text-slate-700 font-bold text-lg md:text-xl">{selectedPart.location}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 mb-6 md:mb-8">
            <h4 className="text-slate-800 font-bold text-lg md:text-xl mb-4">Key Details</h4>
            <ul className="space-y-2 md:space-y-3">
              {selectedPart.details.map((detail, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-600 text-sm md:text-base">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
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
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-md"
        >
          <ArrowLeft className="w-6 h-6 text-emerald-600" />
        </button>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 ml-4">Plant Explorer 🌱</h2>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {PLANT_PARTS.map((part, i) => (
          <motion.button
            key={part.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPart(part)}
            className="bg-white p-6 rounded-[2rem] flex flex-col items-center text-center hover:shadow-xl transition-all shadow-md border border-emerald-100"
          >
            <div className={`w-20 h-20 ${part.color} rounded-full mb-4 shadow-lg flex items-center justify-center`}>
              <part.icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{part.name}</h3>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
