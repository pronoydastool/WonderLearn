import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Droplets, Sun, Sprout, Leaf, TreeDeciduous, Flower } from 'lucide-react';

export default function PlantSimulation() {
  const [growth, setGrowth] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0);
  const [sunLevel, setSunLevel] = useState(0);

  const handleWater = () => {
    setWaterLevel(prev => Math.min(prev + 20, 100));
    checkGrowth();
  };

  const handleSun = () => {
    setSunLevel(prev => Math.min(prev + 20, 100));
    checkGrowth();
  };

  const checkGrowth = () => {
    if (waterLevel > 40 && sunLevel > 40) {
      setGrowth(prev => Math.min(prev + 1, 3));
      setWaterLevel(0);
      setSunLevel(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-sky-50 rounded-3xl p-6 relative overflow-hidden">
      <h3 className="text-2xl font-bold text-slate-800 mb-4">Grow a Plant!</h3>
      <p className="text-slate-600 mb-8 text-center">Plants need water and sunlight to grow. Tap the buttons to help it grow!</p>

      <div className="flex gap-4 mb-12 relative z-10">
        <button 
          onClick={handleWater}
          className="flex flex-col items-center gap-2 p-4 bg-blue-100 hover:bg-blue-200 rounded-2xl transition-colors"
        >
          <Droplets className="w-8 h-8 text-blue-500" />
          <span className="font-bold text-blue-700">Water</span>
          <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${waterLevel}%` }} />
          </div>
        </button>

        <button 
          onClick={handleSun}
          className="flex flex-col items-center gap-2 p-4 bg-amber-100 hover:bg-amber-200 rounded-2xl transition-colors"
        >
          <Sun className="w-8 h-8 text-amber-500" />
          <span className="font-bold text-amber-700">Sunlight</span>
          <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all" style={{ width: `${sunLevel}%` }} />
          </div>
        </button>
      </div>

      <div className="relative w-64 h-64 flex items-end justify-center border-b-4 border-amber-800">
        {/* Soil */}
        <div className="absolute bottom-0 w-full h-8 bg-amber-900/50 rounded-t-lg" />
        
        {/* Plant Stages */}
        <motion.div 
          className="relative z-10 origin-bottom flex flex-col items-center justify-end h-full pb-8"
          animate={{ scale: 1 + (growth * 0.3) }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          {growth === 0 && <Sprout className="w-16 h-16 text-emerald-500" strokeWidth={1.5} />}
          {growth === 1 && <Leaf className="w-20 h-20 text-emerald-600" strokeWidth={1.5} />}
          {growth === 2 && <TreeDeciduous className="w-24 h-24 text-emerald-700" strokeWidth={1.5} />}
          {growth >= 3 && <Flower className="w-32 h-32 text-rose-500" strokeWidth={1.5} />}
        </motion.div>
      </div>
    </div>
  );
}
