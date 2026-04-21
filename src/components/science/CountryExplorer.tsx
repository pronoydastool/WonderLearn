import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COUNTRIES = [
  { 
    name: 'United States', 
    capital: 'Washington, D.C.',
    continent: 'North America',
    language: 'English',
    population: '331 Million',
    color: 'bg-blue-600', 
    info: 'A country of 50 states covering a vast swath of North America.', 
    fact: 'The US has the largest economy in the world.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
    flagCode: 'us'
  },
  { 
    name: 'Brazil', 
    capital: 'Brasília',
    continent: 'South America',
    language: 'Portuguese',
    population: '214 Million',
    color: 'bg-green-600', 
    info: 'The largest country in both South America and Latin America.', 
    fact: 'Home to the Amazon Rainforest, the largest tropical rainforest in the world.',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=800',
    flagCode: 'br'
  },
  { 
    name: 'United Kingdom', 
    capital: 'London',
    continent: 'Europe',
    language: 'English',
    population: '67 Million',
    color: 'bg-red-600', 
    info: 'An island nation in northwestern Europe made up of England, Scotland, Wales, and Northern Ireland.', 
    fact: 'London was the first city in the world to have an underground railway system.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800',
    flagCode: 'gb'
  },
  { 
    name: 'France', 
    capital: 'Paris',
    continent: 'Europe',
    language: 'French',
    population: '67 Million',
    color: 'bg-blue-500', 
    info: 'A country in Western Europe famous for its culture, art, and landmarks.', 
    fact: 'France is the most visited country in the world.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e907a5ea82c?auto=format&fit=crop&q=80&w=800',
    flagCode: 'fr'
  },
  { 
    name: 'Egypt', 
    capital: 'Cairo',
    continent: 'Africa',
    language: 'Arabic',
    population: '109 Million',
    color: 'bg-yellow-600', 
    info: 'A country linking northeast Africa with the Middle East, dating to the time of the pharaohs.', 
    fact: 'The Great Pyramid of Giza is the oldest of the Seven Wonders of the Ancient World.',
    image: 'https://images.unsplash.com/photo-1539667468225-eebb663053e6?auto=format&fit=crop&q=80&w=800',
    flagCode: 'eg'
  },
  { 
    name: 'South Africa', 
    capital: 'Pretoria, Cape Town, Bloemfontein',
    continent: 'Africa',
    language: '11 Official Languages',
    population: '60 Million',
    color: 'bg-emerald-600', 
    info: 'A country on the southernmost tip of the African continent, marked by several distinct ecosystems.', 
    fact: 'It is the only country in the world to have three capital cities.',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800',
    flagCode: 'za'
  },
  { 
    name: 'India', 
    capital: 'New Delhi',
    continent: 'Asia',
    language: 'Hindi, English',
    population: '1.4 Billion',
    color: 'bg-orange-500', 
    info: 'A vast South Asian country with diverse terrain – from Himalayan peaks to Indian Ocean coastline.', 
    fact: 'India is the world\'s most populous democracy.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800',
    flagCode: 'in'
  },
  { 
    name: 'China', 
    capital: 'Beijing',
    continent: 'Asia',
    language: 'Mandarin',
    population: '1.4 Billion',
    color: 'bg-red-500', 
    info: 'A populous nation in East Asia whose vast landscape encompasses grassland, desert, mountains, lakes, rivers and more.', 
    fact: 'The Great Wall of China is the longest wall in the world.',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800',
    flagCode: 'cn'
  },
  { 
    name: 'Japan', 
    capital: 'Tokyo',
    continent: 'Asia',
    language: 'Japanese',
    population: '125 Million',
    color: 'bg-rose-500', 
    info: 'An island country in East Asia, located in the northwest Pacific Ocean.', 
    fact: 'Japan consists of over 6,800 islands.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
    flagCode: 'jp'
  },
  { 
    name: 'Australia', 
    capital: 'Canberra',
    continent: 'Oceania',
    language: 'English',
    population: '25 Million',
    color: 'bg-teal-500', 
    info: 'A sovereign country comprising the mainland of the Australian continent, the island of Tasmania, and numerous smaller islands.', 
    fact: 'Australia is the only continent covered by a single country.',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=800',
    flagCode: 'au'
  },
];

export default function CountryExplorer() {
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const navigate = useNavigate();

  if (selectedCountry) {
    return (
      <div className="flex flex-col items-center flex-1 w-full p-4 md:p-8 relative overflow-hidden">
        <div className="w-full max-w-2xl flex items-center mb-8 z-20">
          <button 
            onClick={() => setSelectedCountry(null)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors shadow-md border border-slate-200"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 ml-4">Back to Countries</h2>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-2xl bg-white border border-slate-100 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5">
            <Flag className="w-24 h-24 md:w-32 md:h-32 text-slate-500" />
          </div>

          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
            <div className={`w-16 h-16 md:w-24 md:h-24 ${selectedCountry.color} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-white`}>
              <img src={`https://flagcdn.com/w320/${selectedCountry.flagCode}.png`} alt={`${selectedCountry.name} flag`} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl md:text-5xl font-black text-slate-800 mb-1">{selectedCountry.name}</h3>
              <span className="text-indigo-500 font-bold text-sm md:text-lg uppercase tracking-widest">Country Profile</span>
            </div>
          </div>
          
          <img 
            src={selectedCountry.image} 
            alt={selectedCountry.name} 
            className="w-full h-48 md:h-64 object-cover rounded-2xl md:rounded-3xl mb-6 md:mb-8 shadow-md"
            referrerPolicy="no-referrer"
          />

          <p className="text-slate-600 text-lg md:text-2xl font-medium mb-6 md:mb-10 leading-relaxed">
            {selectedCountry.info}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
              <span className="text-[10px] md:text-xs uppercase font-bold text-slate-400 block mb-1 md:mb-2">Capital</span>
              <span className="text-slate-700 font-bold text-lg md:text-xl">{selectedCountry.capital}</span>
            </div>
            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
              <span className="text-[10px] md:text-xs uppercase font-bold text-slate-400 block mb-1 md:mb-2">Continent</span>
              <span className="text-slate-700 font-bold text-lg md:text-xl">{selectedCountry.continent}</span>
            </div>
            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
              <span className="text-[10px] md:text-xs uppercase font-bold text-slate-400 block mb-1 md:mb-2">Language</span>
              <span className="text-slate-700 font-bold text-lg md:text-xl">{selectedCountry.language}</span>
            </div>
            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
              <span className="text-[10px] md:text-xs uppercase font-bold text-slate-400 block mb-1 md:mb-2">Population</span>
              <span className="text-slate-700 font-bold text-lg md:text-xl">{selectedCountry.population}</span>
            </div>
          </div>

          <div className="bg-indigo-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-indigo-100">
            <span className="text-[10px] md:text-xs uppercase font-bold text-indigo-500 block mb-1 md:mb-2">Fun Fact</span>
            <span className="text-slate-700 font-bold text-base md:text-xl">{selectedCountry.fact}</span>
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
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 ml-4">Country Explorer 🗺️</h2>
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {COUNTRIES.map((country, i) => (
          <motion.button
            key={country.name}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCountry(country)}
            className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col items-center text-center hover:shadow-xl transition-all shadow-md"
          >
            <div className={`w-20 h-20 ${country.color} rounded-full mb-4 shadow-lg flex items-center justify-center overflow-hidden border-4 border-white`}>
              <img src={`https://flagcdn.com/w320/${country.flagCode}.png`} alt={`${country.name} flag`} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{country.name}</h3>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
