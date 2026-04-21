import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function AITutor() {
  const navigate = useNavigate();
  const { name, ageGroup } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: `Hi ${name}! I'm your AI Tutor. I can help you learn anything! What do you want to explore today? 🚀`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Create a chat session with system instructions tailored for kids
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are a friendly, encouraging, and highly educational AI tutor for a child aged ${ageGroup}. 
          Your name is "TutorBot". 
          The child's name is ${name}.
          Keep your answers simple, engaging, and easy to understand. 
          Use emojis to make it fun. 
          If they ask a complex question, break it down into simple concepts. 
          Always encourage curiosity and praise them for asking good questions.
          Do not use complex markdown, just simple text and emojis.
          Keep responses relatively short (2-4 sentences) so they don't get overwhelmed.`,
          temperature: 0.7,
        }
      });

      // Send the entire history (simplified for this example, we just send the latest message, 
      // but ideally we'd pass the history if we weren't using the chat object directly. 
      // Since we create a new chat object each time here, it doesn't have history. 
      // Let's just use generateContent with history for simplicity, or maintain the chat object.)
      
      // Actually, let's just use generateContent with the system instruction and the user's prompt
      // to keep it simple and stateless for this demo, or we can pass the history.
      
      const historyContents = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      historyContents.push({
        role: 'user',
        parts: [{ text: userMsg }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: historyContents,
        config: {
          systemInstruction: `You are a friendly, encouraging, and highly educational AI tutor for a child aged ${ageGroup}. 
          Your name is "TutorBot". 
          The child's name is ${name}.
          Keep your answers simple, engaging, and easy to understand. 
          Use emojis to make it fun. 
          If they ask a complex question, break it down into simple concepts. 
          Always encourage curiosity and praise them for asking good questions.
          Do not use complex markdown, just simple text and emojis.
          Keep responses relatively short (2-4 sentences) so they don't get overwhelmed.`,
          temperature: 0.7,
        }
      });

      if (response.text) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response.text! }]);
      }

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "Oops! My robot brain had a little hiccup. Can you ask me again? 🤖" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-4 relative">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 px-4">
        <button 
          onClick={() => navigate('/')}
          className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-8 h-8 text-slate-600" />
        </button>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm">
          <Bot className="w-8 h-8 text-violet-500" />
          <h1 className="text-2xl font-black text-slate-800">AI Tutor</h1>
        </div>
        <div className="w-14 h-14"></div> {/* Spacer */}
      </div>

      {/* Chat Container */}
      <div className="flex-1 w-full max-w-4xl bg-white rounded-[2rem] shadow-xl flex flex-col overflow-hidden border-4 border-violet-100">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md
                  ${msg.role === 'user' ? 'bg-sky-100' : 'bg-violet-100'}
                `}>
                  {msg.role === 'user' ? (
                    <User className="w-6 h-6 text-sky-600" />
                  ) : (
                    <Bot className="w-6 h-6 text-violet-600" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`
                  max-w-[75%] p-5 rounded-3xl text-lg font-medium leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-sky-500 text-white rounded-tr-sm' 
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'}
                `}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-6 h-6 text-violet-600" />
              </div>
              <div className="bg-slate-100 p-5 rounded-3xl rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
                <span className="text-slate-500 font-medium">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-100">
          <div className="flex items-center gap-4 max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 h-16 bg-white rounded-2xl px-6 text-xl font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-violet-200 shadow-sm transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-16 h-16 bg-violet-500 rounded-2xl flex items-center justify-center hover:bg-violet-600 disabled:opacity-50 disabled:hover:bg-violet-500 transition-colors shadow-lg shadow-violet-200 shrink-0"
            >
              <Send className="w-8 h-8 text-white ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
