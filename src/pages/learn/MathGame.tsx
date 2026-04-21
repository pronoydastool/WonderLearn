import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';

type Operator = '+' | '-';

interface MathProblem {
  num1: number;
  num2: number;
  operator: Operator;
  answer: number;
  options: number[];
}

export default function MathGame() {
  const navigate = useNavigate();
  const { addXP } = useStore();
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showReward, setShowReward] = useState(false);

  const generateProblem = () => {
    const operator: Operator = Math.random() > 0.5 ? '+' : '-';
    let num1, num2, answer;

    if (operator === '+') {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 10) + 5; // Ensure num1 is larger
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
    }

    // Generate 3 wrong options
    const options = new Set<number>();
    options.add(answer);
    while (options.size < 4) {
      const wrongAnswer = answer + Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
      if (wrongAnswer >= 0 && wrongAnswer !== answer) {
        options.add(wrongAnswer);
      }
    }

    setProblem({
      num1,
      num2,
      operator,
      answer,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    });
    setSelectedOption(null);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleOptionClick = (option: number) => {
    if (selectedOption !== null || !problem) return; // Prevent multiple clicks

    setSelectedOption(option);
    const correct = option === problem.answer;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (score + 1 >= 5) {
          // Completed 5 problems
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
          });
          addXP(150);
          setShowReward(true);
        } else {
          setScore(prev => prev + 1);
          generateProblem();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  if (!problem) return null;

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 relative">
      <div className="w-full max-w-6xl flex items-center justify-between mb-12 px-4">
        <button 
          onClick={() => navigate('/learn')}
          className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-8 h-8 text-slate-600" />
        </button>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <span className="text-xl font-bold text-slate-700">Score: {score} / 5</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={score} // Re-animate on new problem
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-full bg-white rounded-[3rem] shadow-2xl p-12 flex flex-col items-center relative overflow-hidden"
          >
            {/* The Problem */}
            <div className="flex items-center justify-center gap-8 mb-16">
              <div className="text-8xl font-black text-purple-500 drop-shadow-md">{problem.num1}</div>
              <div className="text-8xl font-black text-slate-400 drop-shadow-md">{problem.operator}</div>
              <div className="text-8xl font-black text-purple-500 drop-shadow-md">{problem.num2}</div>
              <div className="text-8xl font-black text-slate-400 drop-shadow-md">=</div>
              <div className="text-8xl font-black text-purple-300 drop-shadow-md border-b-8 border-purple-200 min-w-[120px] text-center">
                {selectedOption !== null ? selectedOption : '?'}
              </div>
            </div>

            {/* Visual Aid (Apples) */}
            <div className="flex items-center justify-center gap-12 mb-16 min-h-[100px]">
              <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
                {Array.from({ length: problem.num1 }).map((_, i) => (
                  <span key={`a1-${i}`} className="text-4xl">🍎</span>
                ))}
              </div>
              <div className="text-4xl font-black text-slate-300">{problem.operator}</div>
              <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
                {Array.from({ length: problem.num2 }).map((_, i) => (
                  <span key={`a2-${i}`} className="text-4xl">🍎</span>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {problem.options.map((option, i) => {
                let btnColor = "bg-slate-100 hover:bg-slate-200 text-slate-700";
                let icon = null;

                if (selectedOption === option) {
                  if (isCorrect) {
                    btnColor = "bg-green-500 text-white shadow-lg shadow-green-200";
                    icon = <CheckCircle2 className="w-8 h-8 absolute top-4 right-4" />;
                  } else {
                    btnColor = "bg-red-500 text-white shadow-lg shadow-red-200";
                    icon = <XCircle className="w-8 h-8 absolute top-4 right-4" />;
                  }
                } else if (selectedOption !== null && option === problem.answer && !isCorrect) {
                  // Show correct answer if they guessed wrong
                  btnColor = "bg-green-200 text-green-800 border-4 border-green-500";
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: selectedOption === null ? 1.05 : 1 }}
                    whileTap={{ scale: selectedOption === null ? 0.95 : 1 }}
                    onClick={() => handleOptionClick(option)}
                    disabled={selectedOption !== null}
                    className={`
                      relative h-32 rounded-3xl text-5xl font-black transition-all duration-300
                      ${btnColor}
                    `}
                  >
                    {option}
                    {icon}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Reward Modal */}
      {showReward && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl text-center"
          >
            <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Star className="w-20 h-20 text-yellow-500 fill-yellow-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4">Math Genius!</h2>
            <p className="text-2xl text-slate-600 mb-8">You solved all 5 problems!</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold text-xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> +150 XP
              </div>
            </div>
            <button
              onClick={() => navigate('/learn')}
              className="w-full py-5 bg-purple-500 text-white rounded-2xl font-bold text-2xl hover:bg-purple-600 transition-colors shadow-lg shadow-purple-200"
            >
              Back to Menu
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
