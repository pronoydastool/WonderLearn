import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Map, Mountain, Droplets, Sun, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GEOGRAPHY_TOPICS = [
  { 
    name: 'Continents', 
    color: 'bg-emerald-500', 
    info: 'Large continuous masses of land. There are seven continents on Earth.', 
    icon: Map,
    examples: ['Asia', 'Africa', 'North America', 'South America', 'Antarctica', 'Europe', 'Australia'],
    fact: 'Asia is the largest continent in both size and population.',
    image: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Oceans', 
    color: 'bg-blue-500', 
    info: 'Huge bodies of saltwater that cover about 71% of the Earth\'s surface.', 
    icon: Droplets,
    examples: ['Pacific', 'Atlantic', 'Indian', 'Southern', 'Arctic'],
    fact: 'The Pacific Ocean is the largest and deepest of Earth\'s oceanic divisions.',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Mountains', 
    color: 'bg-slate-500', 
    info: 'Large landforms that rise prominently above their surroundings.', 
    icon: Mountain,
    examples: ['Himalayas', 'Andes', 'Alps', 'Rockies'],
    fact: 'Mount Everest is the highest mountain above sea level.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Deserts', 
    color: 'bg-orange-400', 
    info: 'Barren areas of landscape where little precipitation occurs.', 
    icon: Sun,
    examples: ['Sahara', 'Arabian', 'Gobi', 'Kalahari'],
    fact: 'Antarctica is actually the largest desert in the world because it receives very little rain!',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=800'
  },
  { 
    name: 'Rivers', 
    color: 'bg-cyan-500', 
    info: 'Natural flowing watercourses, usually freshwater, flowing towards an ocean, sea, lake or another river.', 
    icon: Wind,
    examples: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'],
    fact: 'The Nile is traditionally considered the longest river in the world.',
    image: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800'
  },
];

export default function GeographyExplorer() {
  const [selectedTopic, setSelectedTopic] = useState<typeof GEOGRAPHY_TOPICS[0] | null>(null);
  const navigate = useNavigate();

  if (selectedTopic) {
    return (
      <div className="flex flex-col items-center flex-1 w-full p-4 md:p-8 relative overflow-hidden">
        <div className="w-full max-w-2xl flex items-center mb-8 z-20">
          <button 
            onClick={() => setSelectedTopic(null)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors shadow-md border border-slate-200"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 ml-4">Back to Geography</h2>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-2xl bg-white border border-slate-100 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5">
            <selectedTopic.icon className="w-24 h-24 md:w-32 md:h-32 text-emerald-500" />
          </div>

          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className={`w-16 h-16 md:w-24 md:h-24 ${selectedTopic.color} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg`}>
              <selectedTopic.icon className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-5xl font-black text-slate-800 mb-1">{selectedTopic.name}</h3>
              <span className="text-emerald-500 font-bold text-sm md:text-lg uppercase tracking-widest">Earth Features</span>
            </div>
          </div>
          
          <img 
            src={selectedTopic.image} 
            alt={selectedTopic.name} 
            className="w-full h-48 md:h-64 object-cover rounded-2xl md:rounded-3xl mb-6 md:mb-8 shadow-md"
            referrerPolicy="no-referrer"
          />

          <p className="text-slate-600 text-lg md:text-2xl font-medium mb-6 md:mb-10 leading-relaxed">
            {selectedTopic.info}
          </p>

          <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 mb-6 md:mb-8">
            <h4 className="text-slate-800 font-bold text-lg md:text-xl mb-4">Famous Examples</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {selectedTopic.examples.map((example, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-600 text-sm md:text-base">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                  {example}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-emerald-100">
            <span className="text-[10px] md:text-xs uppercase font-bold text-emerald-500 block mb-1 md:mb-2">Fun Fact</span>
            <span className="text-slate-700 font-bold text-base md:text-xl">{selectedTopic.fact}</span>
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
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors shadow-md border border-slate-200"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 ml-4">Geography Explorer 🌍</h2>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {GEOGRAPHY_TOPICS.map((topic, i) => (
          <motion.button
            key={topic.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTopic(topic)}
            className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col items-center text-center hover:shadow-xl transition-all shadow-md"
          >
            <div className={`w-20 h-20 ${topic.color} rounded-full mb-4 shadow-lg flex items-center justify-center`}>
              <topic.icon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{topic.name}</h3>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
