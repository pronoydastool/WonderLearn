import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from './store/useStore';
import { BookOpen, Gamepad2, Palette, Book, Bot, Settings, Star, Shield, Lock, Clock, Home as HomeIcon, BarChart3, Loader2 } from 'lucide-react';
import { cn } from './lib/utils';
import { AuthProvider, useAuth } from './AuthProvider';

// Pages
import Home from './pages/Home';
import Learn from './pages/Learn';
import Play from './pages/Play';
import Create from './pages/Create';
import Read from './pages/Read';
import AITutor from './pages/AITutor';
import Parents from './pages/Parents';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Explore from './pages/Explore';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const mainElement = document.getElementById('main-scroll-container');
    if (mainElement) {
      mainElement.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { isFirstLogin, name, level, xp, screenTimeLimit, timeSpentToday, updateTimeSpent, resetDailyStats, lastLoginDate, theme } = useStore();
  const navigate = useNavigate();
  const [showParentalGate, setShowParentalGate] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const { loading } = useAuth();

  // Screen time tracking
  useEffect(() => {
    // Check if it's a new day
    const today = new Date().toISOString().split('T')[0];
    if (today !== lastLoginDate) {
      resetDailyStats();
    }

    const interval = setInterval(() => {
      updateTimeSpent(1);
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [lastLoginDate, resetDailyStats, updateTimeSpent]);

  useEffect(() => {
    if (screenTimeLimit && timeSpentToday >= screenTimeLimit) {
      setIsTimeUp(true);
    } else {
      setIsTimeUp(false);
    }
  }, [timeSpentToday, screenTimeLimit]);

  const handleParentalClick = () => {
    const pin = useStore.getState().parentalPin;
    if (pin) {
      setShowParentalGate(true);
    } else {
      navigate('/parents');
    }
  };

  const verifyPin = () => {
    if (pinInput === useStore.getState().parentalPin) {
      setShowParentalGate(false);
      setPinInput('');
      setError('');
      setIsTimeUp(false); // Temporarily bypass time limit for parents
      navigate('/parents');
    } else {
      setError('Incorrect PIN');
      setPinInput('');
    }
  };

  const getThemeColor = () => {
    switch (theme) {
      case 'ocean': return 'bg-blue-100';
      case 'forest': return 'bg-emerald-100';
      case 'sunset': return 'bg-orange-100';
      case 'galaxy': return 'bg-indigo-100';
      case 'space': return 'bg-slate-900';
      default: return 'bg-sky-100';
    }
  };

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", getThemeColor())}>
        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (isFirstLogin) {
    return <Onboarding />;
  }

  if (isTimeUp) {
    return (
      <div className={cn("min-h-screen flex flex-col items-center justify-center p-6", getThemeColor())}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl text-center"
        >
          <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="w-20 h-20 text-orange-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">Time's Up!</h1>
          <p className="text-2xl text-slate-600 mb-8">You've reached your screen time limit for today. Great job learning!</p>
          <button 
            onClick={handleParentalClick}
            className="text-slate-500 font-bold hover:text-slate-700 underline"
          >
            Parents Only
          </button>
        </motion.div>

        {/* Parental Gate Modal for Time Up */}
        {showParentalGate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-slate-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Parents Only</h2>
              <p className="text-center text-slate-500 mb-6">Enter your PIN to access settings.</p>
              
              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold",
                      pinInput.length > i ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200 bg-slate-50"
                    )}
                  >
                    {pinInput[i] ? '•' : ''}
                  </div>
                ))}
              </div>

              {error && <p className="text-red-500 text-center font-bold mb-4">{error}</p>}

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPinInput(prev => (prev.length < 4 ? prev + num : prev))}
                    className="h-14 bg-slate-100 hover:bg-slate-200 rounded-xl text-xl font-bold text-slate-700 transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowParentalGate(false);
                    setPinInput('');
                    setError('');
                  }}
                  className="h-14 bg-red-100 hover:bg-red-200 rounded-xl text-red-600 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setPinInput(prev => (prev.length < 4 ? prev + '0' : prev))}
                  className="h-14 bg-slate-100 hover:bg-slate-200 rounded-xl text-xl font-bold text-slate-700 transition-colors"
                >
                  0
                </button>
                <button
                  onClick={verifyPin}
                  disabled={pinInput.length !== 4}
                  className="h-14 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:hover:bg-sky-500 rounded-xl text-white font-bold transition-colors"
                >
                  Go
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen font-sans flex flex-col overflow-hidden", getThemeColor())}>
      {/* Main Content */}
      <main id="main-scroll-container" className="flex-1 overflow-y-auto relative pb-24 md:pb-0 flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-4 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link to="/" className="flex flex-col items-center text-slate-500 hover:text-sky-500">
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs font-bold mt-1">Home</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-slate-500 hover:text-sky-500">
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs font-bold mt-1">Dashboard</span>
        </Link>
        <button onClick={handleParentalClick} className="flex flex-col items-center text-slate-500 hover:text-sky-500">
          <Settings className="w-6 h-6" />
          <span className="text-xs font-bold mt-1">Settings</span>
        </button>
      </nav>

      {/* Parental Gate Modal */}
      {showParentalGate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-slate-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Parents Only</h2>
            <p className="text-center text-slate-500 mb-6">Enter your PIN to access settings.</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold",
                    pinInput.length > i ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200 bg-slate-50"
                  )}
                >
                  {pinInput[i] ? '•' : ''}
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-center font-bold mb-4">{error}</p>}

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => setPinInput(prev => (prev.length < 4 ? prev + num : prev))}
                  className="h-14 bg-slate-100 hover:bg-slate-200 rounded-xl text-xl font-bold text-slate-700 transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowParentalGate(false);
                  setPinInput('');
                  setError('');
                }}
                className="h-14 bg-red-100 hover:bg-red-200 rounded-xl text-red-600 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setPinInput(prev => (prev.length < 4 ? prev + '0' : prev))}
                className="h-14 bg-slate-100 hover:bg-slate-200 rounded-xl text-xl font-bold text-slate-700 transition-colors"
              >
                0
              </button>
              <button
                onClick={verifyPin}
                disabled={pinInput.length !== 4}
                className="h-14 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:hover:bg-sky-500 rounded-xl text-white font-bold transition-colors"
              >
                Go
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn/*" element={<Learn />} />
            <Route path="/play/*" element={<Play />} />
            <Route path="/create/*" element={<Create />} />
            <Route path="/read/*" element={<Read />} />
            <Route path="/explore/*" element={<Explore />} />
            <Route path="/tutor" element={<AITutor />} />
            <Route path="/parents" element={<Parents />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
