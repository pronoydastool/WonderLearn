import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, Sparkles, Loader2, Play, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { useStore } from '../../store/useStore';

const CHARACTERS = [
  { id: 'fox', emoji: '🦊', name: 'Felix the Fox' },
  { id: 'dragon', emoji: '🐉', name: 'Dante the Dragon' },
  { id: 'robot', emoji: '🤖', name: 'Robo-Buddy' },
  { id: 'unicorn', emoji: '🦄', name: 'Sparkle the Unicorn' },
];

const SCENES = [
  { id: 'forest', emoji: '🌲', name: 'Magical Forest' },
  { id: 'space', emoji: '🚀', name: 'Outer Space' },
  { id: 'castle', emoji: '🏰', name: 'Crystal Castle' },
  { id: 'ocean', emoji: '🌊', name: 'Deep Ocean' },
];

export default function StoryCreator() {
  const navigate = useNavigate();
  const { addXP, name } = useStore();
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [storyIdea, setStoryIdea] = useState('');
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStory = async () => {
    if (!selectedChar || !selectedScene) return;
    setIsGenerating(true);

    try {
      const char = CHARACTERS.find(c => c.id === selectedChar);
      const scene = SCENES.find(s => s.id === selectedScene);
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Write a very short, fun, child-friendly story (about 3-4 sentences) for a kid named ${name}. 
      The main character is ${char?.name} ${char?.emoji}. 
      The story takes place in a ${scene?.name} ${scene?.emoji}. 
      ${storyIdea ? `The story should be about: ${storyIdea}` : ''}
      Make it engaging and use simple words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setGeneratedStory(response.text || 'Once upon a time, there was a magical adventure!');
      addXP(30);
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Oops! Could not generate the story. Try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  const readStory = () => {
    if (!generatedStory) return;
    const utterance = new SpeechSynthesisUtterance(generatedStory);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 px-4 bg-emerald-50 overflow-y-auto">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/create')}
          className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-3xl font-black text-slate-800">Story Creator 📖</h1>
        <div className="w-12 h-12" />
      </div>

      <div className="w-full max-w-4xl bg-white rounded-[3rem] p-8 shadow-xl">
        {!generatedStory ? (
          <div className="space-y-8">
            {/* Character Selection */}
            <div>
              <h2 className="text-xl font-bold text-slate-700 mb-4">1. Choose a Character</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CHARACTERS.map(char => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedChar(char.id)}
                    className={`p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 ${selectedChar === char.id ? 'border-emerald-500 bg-emerald-50 scale-105' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                  >
                    <span className="text-5xl">{char.emoji}</span>
                    <span className="font-bold text-slate-600 text-sm text-center">{char.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scene Selection */}
            <div>
              <h2 className="text-xl font-bold text-slate-700 mb-4">2. Choose a Scene</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SCENES.map(scene => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene.id)}
                    className={`p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 ${selectedScene === scene.id ? 'border-sky-500 bg-sky-50 scale-105' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                  >
                    <span className="text-5xl">{scene.emoji}</span>
                    <span className="font-bold text-slate-600 text-sm text-center">{scene.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Idea */}
            <div>
              <h2 className="text-xl font-bold text-slate-700 mb-4">3. What happens? (Optional)</h2>
              <input 
                type="text"
                value={storyIdea}
                onChange={(e) => setStoryIdea(e.target.value)}
                placeholder="e.g., They find a hidden treasure!"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 text-lg font-medium text-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button 
              onClick={generateStory}
              disabled={!selectedChar || !selectedScene || isGenerating}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-2xl font-bold text-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Writing Story...</>
              ) : (
                <><Sparkles className="w-6 h-6" /> Create My Story!</>
              )}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-8"
          >
            <div className="flex gap-4 mb-8 text-6xl">
              <span>{CHARACTERS.find(c => c.id === selectedChar)?.emoji}</span>
              <span>{SCENES.find(s => s.id === selectedScene)?.emoji}</span>
            </div>
            
            <div className="bg-amber-50 p-8 rounded-3xl border-4 border-amber-100 mb-8 relative">
              <button 
                onClick={readStory}
                className="absolute -top-6 -right-6 w-16 h-16 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              >
                <Volume2 className="w-8 h-8" />
              </button>
              <p className="text-2xl font-medium text-slate-800 leading-relaxed">
                {generatedStory}
              </p>
            </div>

            <button 
              onClick={() => {
                setGeneratedStory(null);
                setSelectedChar(null);
                setSelectedScene(null);
                setStoryIdea('');
              }}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xl transition-colors"
            >
              Write Another Story
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
