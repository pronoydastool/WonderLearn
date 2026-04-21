import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Globe, Zap, Leaf, Heart, ArrowRight, Star, Droplets, Wind, Sun, Moon, CloudRain, Snowflake, Sparkles, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from '@google/genai';

const TOPICS = [
  {
    id: 'space',
    title: 'Solar System',
    icon: Globe,
    color: 'bg-indigo-500',
    textColor: 'text-indigo-500',
    lightBg: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
    concept: {
      description: 'The Solar System is our home in space! It is made up of the Sun and everything that travels around it, including eight planets, moons, asteroids, and comets.',
      keyDetails: [
        'The Sun is a giant star at the center.',
        'There are 8 planets, including Earth.',
        'Gravity keeps everything moving in orbit.'
      ],
      funFact: 'The Solar System is about 4.6 billion years old!'
    }
  },
  {
    id: 'plants',
    title: 'Plants',
    icon: Leaf,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    lightBg: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    concept: {
      description: 'Plants are living things that grow in the earth and turn sunlight into food. They give us food to eat and clean air to breathe!',
      keyDetails: [
        'Roots drink water from the soil.',
        'Leaves catch sunlight to make food.',
        'Flowers help plants make seeds.'
      ],
      funFact: 'Bamboo is the fastest-growing plant in the world!'
    }
  },
  {
    id: 'body',
    title: 'Human Body',
    icon: Heart,
    color: 'bg-rose-500',
    textColor: 'text-rose-500',
    lightBg: 'bg-rose-50',
    borderColor: 'border-rose-100',
    concept: {
      description: 'Your body is an amazing machine! It is made of many different parts and systems that work together to help you live, grow, and play.',
      keyDetails: [
        'The heart pumps blood everywhere.',
        'Lungs help you breathe air.',
        'The brain controls everything you do.'
      ],
      funFact: 'Your body has 206 bones, but you were born with about 300!'
    }
  },
  {
    id: 'weather',
    title: 'Weather',
    icon: Zap,
    color: 'bg-amber-500',
    textColor: 'text-amber-500',
    lightBg: 'bg-amber-50',
    borderColor: 'border-amber-100',
    concept: {
      description: 'Weather is what the sky and air are like outside. It can be sunny, rainy, windy, or snowy, and it changes every day!',
      keyDetails: [
        'The Sun heats the Earth and drives the weather.',
        'Clouds are made of tiny water drops.',
        'Wind is just moving air.'
      ],
      funFact: 'A lightning bolt is 5 times hotter than the surface of the Sun!'
    }
  }
];

export default function ScienceLearning() {
  const navigate = useNavigate();
  const { addXP, updateStats } = useStore();
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [customTopicQuery, setCustomTopicQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAI = async () => {
    if (!customTopicQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Explain the basic concept of "${customTopicQuery}" for children.
        Format the response as a JSON object with the following structure:
        {
          "title": "Topic Name",
          "description": "A simple, engaging paragraph explaining the basic concept.",
          "keyDetails": ["Detail 1", "Detail 2", "Detail 3"],
          "funFact": "A fun, surprising fact about the topic."
        }`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || '{}');
      
      const newTopic = {
        id: 'custom-' + Date.now(),
        title: data.title || customTopicQuery,
        icon: Sparkles,
        color: 'bg-fuchsia-500',
        textColor: 'text-fuchsia-500',
        lightBg: 'bg-fuchsia-50',
        borderColor: 'border-fuchsia-100',
        concept: {
          description: data.description,
          keyDetails: data.keyDetails,
          funFact: data.funFact
        }
      };

      setSelectedTopic(newTopic);
      setIsAskingAI(false);
      setCustomTopicQuery('');
    } catch (error) {
      console.error("Error generating topic:", error);
      alert("Oops! Something went wrong while asking the AI. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const finishTopic = () => {
    addXP(20);
    updateStats('science', 10, 100, 5);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSelectedTopic(null);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 px-4 bg-slate-50 overflow-y-auto">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button 
          onClick={() => {
            if (isAskingAI) {
              setIsAskingAI(false);
            } else if (selectedTopic) {
              setSelectedTopic(null);
            } else {
              navigate('/learn');
            }
          }}
          className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-3xl font-black text-slate-800">Science Concepts 🔬</h1>
        <div className="w-12 h-12" />
      </div>

      {!selectedTopic && !isAskingAI ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {TOPICS.map((topic) => (
            <motion.button
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTopic(topic)}
              className={`p-6 rounded-3xl text-white ${topic.color} shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center gap-4`}
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <topic.icon className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold">{topic.title}</h2>
            </motion.button>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAskingAI(true)}
            className="p-6 rounded-3xl text-white bg-gradient-to-br from-fuchsia-500 to-purple-600 shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center gap-4"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold">Ask AI Any Topic!</h2>
          </motion.button>
        </div>
      ) : isAskingAI ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[3rem] shadow-xl text-center"
        >
          <div className="w-24 h-24 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-fuchsia-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">What do you want to learn about?</h2>
          <p className="text-slate-500 font-medium mb-8">Type any topic like "Dinosaurs", "Volcanoes", or "Magnets"!</p>
          
          <div className="relative mb-8">
            <input
              type="text"
              value={customTopicQuery}
              onChange={(e) => setCustomTopicQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
              placeholder="E.g., Black Holes"
              className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl px-6 py-4 text-xl font-bold text-slate-700 focus:outline-none focus:border-fuchsia-400 transition-colors pl-14"
              disabled={isLoading}
            />
            <Search className="w-6 h-6 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={handleAskAI}
            disabled={!customTopicQuery.trim() || isLoading}
            className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 disabled:opacity-50 text-white font-black text-xl py-4 rounded-2xl shadow-lg shadow-fuchsia-200 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Learn Concept!
              </>
            )}
          </button>
        </motion.div>
      ) : selectedTopic && (
        <div className="w-full max-w-2xl flex flex-col items-center pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTopic.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5">
                <selectedTopic.icon className={`w-24 h-24 md:w-32 md:h-32 ${selectedTopic.textColor}`} />
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
                <div className={`w-16 h-16 md:w-24 md:h-24 ${selectedTopic.color} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg shrink-0`}>
                  <selectedTopic.icon className="w-8 h-8 md:w-12 md:h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-4xl font-black text-slate-800 mb-1">{selectedTopic.title}</h3>
                  <span className={`${selectedTopic.textColor} font-bold text-sm md:text-base uppercase tracking-widest`}>Basic Concept</span>
                </div>
              </div>

              <p className="text-slate-600 text-lg md:text-xl font-medium mb-6 md:mb-8 leading-relaxed relative z-10">
                {selectedTopic.concept.description}
              </p>

              <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 mb-6 md:mb-8 relative z-10">
                <h4 className="text-slate-800 font-bold text-lg md:text-xl mb-4">Key Details</h4>
                <ul className="space-y-3">
                  {selectedTopic.concept.keyDetails.map((detail: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm md:text-base font-medium">
                      <div className={`w-2 h-2 mt-2 ${selectedTopic.color} rounded-full shrink-0`} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`${selectedTopic.lightBg} p-5 md:p-6 rounded-2xl md:rounded-3xl border ${selectedTopic.borderColor} mb-8 relative z-10`}>
                <span className={`text-[10px] md:text-xs uppercase font-bold ${selectedTopic.textColor} block mb-1 md:mb-2`}>Fun Fact</span>
                <span className="text-slate-700 font-bold text-base md:text-lg">{selectedTopic.concept.funFact}</span>
              </div>

              <button
                onClick={finishTopic}
                className={`w-full py-4 ${selectedTopic.color} hover:opacity-90 text-white rounded-2xl font-black text-xl shadow-lg transition-all flex items-center justify-center gap-2 relative z-10`}
              >
                Finish Topic <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
