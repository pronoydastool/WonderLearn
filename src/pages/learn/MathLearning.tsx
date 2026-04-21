import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X, Plus, Minus, X as Multiply, Divide } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export default function MathLearning() {
  const navigate = useNavigate();
  const { ageGroup, addXP, updateStats } = useStore();
  const [operation, setOperation] = useState<Operation>('addition');
  const [problem, setProblem] = useState({ a: 0, b: 0, answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const generateProblem = (op: Operation) => {
    let a = 0, b = 0, answer = 0;
    const max = ageGroup === '3-5' ? 10 : ageGroup === '6-8' ? 20 : 100;

    switch (op) {
      case 'addition':
        a = Math.floor(Math.random() * max) + 1;
        b = Math.floor(Math.random() * max) + 1;
        answer = a + b;
        break;
      case 'subtraction':
        a = Math.floor(Math.random() * max) + 1;
        b = Math.floor(Math.random() * a) + 1;
        answer = a - b;
        break;
      case 'multiplication':
        a = Math.floor(Math.random() * (ageGroup === '9-12' ? 12 : 5)) + 1;
        b = Math.floor(Math.random() * (ageGroup === '9-12' ? 12 : 5)) + 1;
        answer = a * b;
        break;
      case 'division':
        b = Math.floor(Math.random() * (ageGroup === '9-12' ? 10 : 5)) + 1;
        answer = Math.floor(Math.random() * (ageGroup === '9-12' ? 10 : 5)) + 1;
        a = b * answer;
        break;
    }

    setProblem({ a, b, answer });

    // Generate options
    const opts = [answer];
    while (opts.length < 4) {
      const wrong = answer + Math.floor(Math.random() * 10) - 5;
      if (wrong >= 0 && !opts.includes(wrong)) {
        opts.push(wrong);
      }
    }
    setOptions(opts.sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  useEffect(() => {
    generateProblem(operation);
  }, [operation]);

  const handleAnswer = (selected: number) => {
    if (feedback) return;

    setTotalQuestions(prev => prev + 1);
    if (selected === problem.answer) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      addXP(10);
      if (score + 1 === 10) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        updateStats('math', 100);
      }
      setTimeout(() => generateProblem(operation), 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const getOpIcon = (op: Operation) => {
    switch (op) {
      case 'addition': return <Plus className="w-8 h-8" />;
      case 'subtraction': return <Minus className="w-8 h-8" />;
      case 'multiplication': return <Multiply className="w-8 h-8" />;
      case 'division': return <Divide className="w-8 h-8" />;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 px-4 bg-blue-50">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/learn')}
          className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="flex gap-2">
          {(['addition', 'subtraction', 'multiplication', 'division'] as Operation[]).map((op) => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={`p-3 rounded-xl transition-all ${operation === op ? 'bg-blue-500 text-white shadow-lg scale-110' : 'bg-white text-slate-400'}`}
            >
              {getOpIcon(op)}
            </button>
          ))}
        </div>
        <div className="bg-white px-6 py-2 rounded-2xl shadow-sm font-bold text-blue-600">
          Score: {score}/10
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
        <motion.div 
          key={`${problem.a}-${problem.b}-${operation}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] p-12 shadow-xl w-full text-center relative overflow-hidden"
        >
          <div className="text-8xl font-black text-slate-800 flex items-center justify-center gap-8">
            <span>{problem.a}</span>
            <span className="text-blue-500">{getOpIcon(operation)}</span>
            <span>{problem.b}</span>
            <span className="text-slate-300">=</span>
            <span className="text-blue-500">?</span>
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10 ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
              >
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {feedback === 'correct' ? <Check className="w-20 h-20 text-white" /> : <X className="w-20 h-20 text-white" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 w-full mt-12">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(opt)}
              className="bg-white p-8 rounded-3xl shadow-lg text-4xl font-black text-slate-700 hover:bg-blue-50 transition-colors"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
