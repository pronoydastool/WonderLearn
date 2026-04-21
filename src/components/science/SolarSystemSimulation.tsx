import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Info, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PLANETS = [
  { 
    name: 'Mercury', 
    color: 'bg-slate-400', 
    info: 'The smallest and fastest planet! It is closest to the Sun.', 
    temp: '430°C', 
    year: '88 days',
    diameter: '4,879 km',
    distance: '57.9M km',
    features: ['No atmosphere', 'Extreme temperatures', 'Craters like the Moon'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg'
  },
  { 
    name: 'Venus', 
    color: 'bg-orange-300', 
    info: 'The hottest planet in our solar system. It has thick clouds.', 
    temp: '462°C', 
    year: '225 days',
    diameter: '12,104 km',
    distance: '108.2M km',
    features: ['Thick toxic atmosphere', 'Rotates backwards', 'Volcanic surface'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg'
  },
  { 
    name: 'Earth', 
    color: 'bg-blue-500', 
    info: 'Our home! The only planet with life and liquid water.', 
    temp: '15°C', 
    year: '365 days',
    diameter: '12,742 km',
    distance: '149.6M km',
    features: ['Life-sustaining atmosphere', '70% water surface', 'One moon'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg'
  },
  { 
    name: 'Mars', 
    color: 'bg-red-500', 
    info: 'Known as the Red Planet. It has the largest volcano in the solar system!', 
    temp: '-63°C', 
    year: '687 days',
    diameter: '6,779 km',
    distance: '227.9M km',
    features: ['Iron oxide dust (red)', 'Thin atmosphere', 'Polar ice caps'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg'
  },
  { 
    name: 'Jupiter', 
    color: 'bg-orange-500', 
    info: 'The largest planet. It is a gas giant with a Great Red Spot!', 
    temp: '-108°C', 
    year: '12 years',
    diameter: '139,820 km',
    distance: '778.6M km',
    features: ['Gas giant', 'Great Red Spot storm', '79+ moons'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg'
  },
  { 
    name: 'Saturn', 
    color: 'bg-yellow-600', 
    info: 'Famous for its beautiful rings made of ice and rock.', 
    temp: '-138°C', 
    year: '29 years',
    diameter: '116,460 km',
    distance: '1.4B km',
    features: ['Spectacular ring system', 'Gas giant', 'Least dense planet'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg'
  },
];

export default function SolarSystemSimulation() {
  const [selectedPlanet, setSelectedPlanet] = useState<typeof PLANETS[0] | null>(null);
  const navigate = useNavigate();

  if (selectedPlanet) {
    return (
      <div className="flex flex-col items-center flex-1 w-full p-4 md:p-8 relative overflow-hidden">
        <div className="w-full max-w-2xl flex items-center mb-8 z-20">
          <button 
            onClick={() => setSelectedPlanet(null)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors shadow-md border border-slate-200"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 ml-4">Back to Planets</h2>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-2xl bg-white border border-slate-100 p-8 md:p-12 rounded-[3rem] shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Star className="w-32 h-32 text-slate-500" />
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className={`w-24 h-24 ${selectedPlanet.color} rounded-3xl flex items-center justify-center shadow-lg`}>
              <Info className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-800 mb-2">{selectedPlanet.name}</h3>
              <span className="text-indigo-500 font-bold text-lg uppercase tracking-widest">Planet Discovery</span>
            </div>
          </div>
          
          <img 
            src={selectedPlanet.image} 
            alt={selectedPlanet.name} 
            className="w-full h-64 object-cover rounded-3xl mb-8 shadow-md"
            referrerPolicy="no-referrer"
          />

          <p className="text-slate-600 text-xl md:text-2xl font-medium mb-10 leading-relaxed">
            {selectedPlanet.info}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Avg Temperature</span>
              <span className="text-slate-700 font-bold text-2xl">{selectedPlanet.temp}</span>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Year Length</span>
              <span className="text-slate-700 font-bold text-2xl">{selectedPlanet.year}</span>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Diameter</span>
              <span className="text-slate-700 font-bold text-2xl">{selectedPlanet.diameter}</span>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-2">Distance from Sun</span>
              <span className="text-slate-700 font-bold text-2xl">{selectedPlanet.distance}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
            <h4 className="text-slate-800 font-bold text-xl mb-4">Key Features</h4>
            <ul className="space-y-3">
              {selectedPlanet.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-600">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                  {feature}
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
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors shadow-md border border-slate-200"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 ml-4">Space Explorer 🚀</h2>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {PLANETS.map((planet, i) => (
          <motion.button
            key={planet.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPlanet(planet)}
            className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col items-center text-center hover:shadow-xl transition-all shadow-md"
          >
            <div className={`w-20 h-20 ${planet.color} rounded-full mb-4 shadow-lg`} />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{planet.name}</h3>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
