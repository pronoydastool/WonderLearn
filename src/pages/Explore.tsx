import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Rocket, Leaf, Atom, Heart, Sparkles, Grid, Map, Flag } from 'lucide-react';
import SolarSystemSimulation from '../components/science/SolarSystemSimulation';
import PlantExplorerComponent from '../components/science/PlantExplorer';
import PeriodicTable from '../components/science/PeriodicTable';
import HumanBodySimulation from '../components/science/HumanBodySimulation';
import GeographyExplorerComponent from '../components/science/GeographyExplorer';
import CountryExplorerComponent from '../components/science/CountryExplorer';

const MODULES = [
  { id: 'space', title: 'Space Explorer', icon: Rocket, color: 'bg-indigo-500', path: 'space', description: 'Journey through the stars!' },
  { id: 'plants', title: 'Plant Explorer', icon: Leaf, color: 'bg-emerald-500', path: 'plants', description: 'Details of plant parts.' },
  { id: 'periodic', title: 'Periodic Table', icon: Grid, color: 'bg-teal-500', path: 'periodic', description: 'The elements of the universe.' },
  { id: 'body', title: 'Human Body', icon: Heart, color: 'bg-rose-400', path: 'body', description: 'Explore your inner world!' },
  { id: 'geography', title: 'Geography', icon: Map, color: 'bg-cyan-500', path: 'geography', description: 'Discover Earth\'s features.' },
  { id: 'country', title: 'Countries', icon: Flag, color: 'bg-blue-600', path: 'country', description: 'Explore nations of the world.' },
];

function ExploreMenu() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 md:py-8 bg-slate-50">
      <div className="w-full max-w-6xl flex items-center mb-8 md:mb-12 px-4">
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
        </button>
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 ml-4 md:ml-8">Explore 🌍</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full px-4">
        {MODULES.map((mod, i) => (
          <Link key={mod.id} to={mod.path}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', bounce: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`
                ${mod.color} rounded-[2.5rem] p-8 text-white shadow-xl cursor-pointer
                flex items-center gap-6 h-40 md:h-48 relative overflow-hidden
              `}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24" />
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <mod.icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black mb-1">{mod.title}</h2>
                <p className="text-white/80 font-medium">{mod.description}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Wrapper components for the explore modules
function SpaceExplorer() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-slate-50">
      <div className="flex-1 w-full overflow-hidden">
        <SolarSystemSimulation />
      </div>
    </div>
  );
}

function PlantExplorer() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-emerald-50">
      <div className="flex-1 w-full overflow-hidden">
        <PlantExplorerComponent />
      </div>
    </div>
  );
}

function PeriodicTableExplorer() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-slate-50">
      <div className="flex-1 w-full overflow-hidden">
        <PeriodicTable />
      </div>
    </div>
  );
}

function BodyExplorer() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-rose-50">
      <div className="flex-1 w-full overflow-hidden">
        <HumanBodySimulation />
      </div>
    </div>
  );
}

function GeographyExplorer() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-cyan-50">
      <div className="flex-1 w-full overflow-hidden">
        <GeographyExplorerComponent />
      </div>
    </div>
  );
}

function CountryExplorer() {
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-blue-50">
      <div className="flex-1 w-full overflow-hidden">
        <CountryExplorerComponent />
      </div>
    </div>
  );
}

export default function Explore() {
  return (
    <Routes>
      <Route path="/" element={<ExploreMenu />} />
      <Route path="space" element={<SpaceExplorer />} />
      <Route path="plants" element={<PlantExplorer />} />
      <Route path="periodic" element={<PeriodicTableExplorer />} />
      <Route path="body" element={<BodyExplorer />} />
      <Route path="geography" element={<GeographyExplorer />} />
      <Route path="country" element={<CountryExplorer />} />
    </Routes>
  );
}
