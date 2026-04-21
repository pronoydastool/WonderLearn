import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from './store/useStore';
import { BookOpen, Gamepad2, Palette, Book, Bot, Settings, Star, Shield, Lock, Clock, Home as HomeIcon, BarChart3, Loader2 } from 'lucide-react';
import { cn } from './lib/utils';
import { AuthProvider, useAuth } from './AuthProvider';

// ✅ Lazy Loading Pages
const Home = React.lazy(() => import('./pages/Home'));
const Learn = React.lazy(() => import('./pages/Learn'));
const Play = React.lazy(() => import('./pages/Play'));
const Create = React.lazy(() => import('./pages/Create'));
const Read = React.lazy(() => import('./pages/Read'));
const AITutor = React.lazy(() => import('./pages/AITutor'));
const Parents = React.lazy(() => import('./pages/Parents'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Explore = React.lazy(() => import('./pages/Explore'));

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
  const { isFirstLogin, screenTimeLimit, timeSpentToday, updateTimeSpent, resetDailyStats, lastLoginDate, theme } = useStore();
  const navigate = useNavigate();
  const [showParentalGate, setShowParentalGate] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [isTimeUp, setIsTimeUp] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (today !== lastLoginDate) {
      resetDailyStats();
    }

    const interval = setInterval(() => {
      updateTimeSpent(1);
    }, 60000);

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
      setIsTimeUp(false);
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

  // 🔄 Loading screen
  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", getThemeColor())}>
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  // 🚀 Lazy Onboarding
  if (isFirstLogin) {
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>}>
        <Onboarding />
      </Suspense>
    );
  }

  return (
    <div className={cn("min-h-screen flex flex-col", getThemeColor())}>
      <main id="main-scroll-container" className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-4">
        <Link to="/">Home</Link>
        <Link to="/profile">Dashboard</Link>
        <button onClick={handleParentalClick}>Settings</button>
      </nav>

      {/* Parental Modal */}
      {showParentalGate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl">
            <input
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN"
              className="border p-2"
            />
            <button onClick={verifyPin}>Go</button>
            {error && <p>{error}</p>}
          </div>
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
          {/* 🚀 Suspense for Routes */}
          <Suspense fallback={
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          }>
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
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}