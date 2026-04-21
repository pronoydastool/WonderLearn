import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, Globe, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import TracingCanvas from '../../components/TracingCanvas';

const LANGUAGES = [
  { name: 'English', code: 'en', alphabet: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ') },
  { name: 'Spanish', code: 'es', alphabet: 'A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z'.split(' ') },
  { name: 'French', code: 'fr', alphabet: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ') },
  { name: 'German', code: 'de', alphabet: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z Ä Ö Ü ß'.split(' ') },
  { name: 'Hindi', code: 'hi', alphabet: 'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह'.split(' ') },
];

export default function MultilingualAlphabets() {
  const navigate = useNavigate();
  const { nativeLanguage } = useStore();
  
  const selectedLang = LANGUAGES.find(l => l.name === nativeLanguage) || LANGUAGES[0];
  const [tracingLetter, setTracingLetter] = useState<string | null>(null);

  const speak = (letter: string) => {
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = selectedLang.code;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 px-4 bg-rose-50">
      <div className="w-full max-w-6xl flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/learn')}
          className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="flex flex-wrap justify-center gap-2 max-w-[60%]">
          <div className="px-8 py-3 rounded-full font-bold bg-rose-500 text-white shadow-lg text-xl">
            {selectedLang.name} Alphabet
          </div>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center">
          <Globe className="w-6 h-6 text-rose-500" />
        </div>
      </div>

      <div className="flex-1 w-full max-w-6xl">
        <AnimatePresence mode="wait">
          {tracingLetter ? (
            <motion.div 
              key="tracing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl mx-auto bg-white rounded-[3rem] p-8 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => setTracingLetter(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full font-bold text-slate-600 transition-colors"
                >
                  Back to Alphabet
                </button>
                <button 
                  onClick={() => speak(tracingLetter)}
                  className="w-12 h-12 bg-rose-100 hover:bg-rose-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <Volume2 className="w-6 h-6 text-rose-500" />
                </button>
              </div>
              <TracingCanvas letter={tracingLetter} />
            </motion.div>
          ) : (
            <motion.div 
              key={selectedLang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-4"
            >
              {selectedLang.alphabet.map((letter, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTracingLetter(letter)}
                  className="aspect-square bg-white rounded-3xl shadow-md flex flex-col items-center justify-center gap-2 hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <span className="text-4xl font-black text-slate-800 group-hover:text-rose-500 transition-colors">
                    {letter}
                  </span>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-4 h-4 text-rose-300" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
