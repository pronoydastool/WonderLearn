import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, AgeGroup } from '../store/useStore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  User
} from 'firebase/auth';
import { ArrowRight, Sparkles, Globe, User as UserIcon, Calendar, BookOpen, Gamepad2, Palette, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Bengali', 'Hindi', 'Mandarin', 'Arabic'];

const INTRO_SCREENS = [
  {
    title: "Welcome to WonderLearn!",
    description: "Your magical journey into learning starts here.",
    icon: Sparkles,
    color: "text-yellow-500",
    bg: "bg-yellow-100"
  },
  {
    title: "Learn & Grow",
    description: "Explore math, reading, science and more with interactive lessons.",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-100"
  },
  {
    title: "Play & Create",
    description: "Draw, compose music, and play games while you learn.",
    icon: Palette,
    color: "text-purple-500",
    bg: "bg-purple-100"
  },
  {
    title: "AI Magical Tutor",
    description: "Ask questions and get help from your smart AI companion anytime.",
    icon: Gamepad2,
    color: "text-sky-500",
    bg: "bg-sky-100"
  }
];

type AuthMode = 'login' | 'register' | 'profile-setup';

export default function Onboarding() {
  const { 
    setName, 
    setAgeGroup, 
    setNativeLanguage, 
    setIsFirstLogin 
  } = useStore();

  const [step, setStep] = useState(0); // 0-3 intros, 4 welcome, 5 auth
  
  // Registration / Profile form
  const [authMode, setAuthMode] = useState<AuthMode>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localName, setLocalName] = useState('');
  const [localAgeGroup, setLocalAgeGroup] = useState<AgeGroup>('6-8');
  const [localLanguage, setLocalLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createProfileInFirestore = async (user: User) => {
    try {
      const profileData = {
        userId: user.uid,
        name: localName.trim() || 'Explorer',
        ageGroup: localAgeGroup,
        nativeLanguage: localLanguage,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), profileData);
      
      // Update local state
      setName(profileData.name);
      setAgeGroup(profileData.ageGroup);
      setNativeLanguage(profileData.nativeLanguage);
      setIsFirstLogin(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // After creation, ask for profile details
        setAuthMode('profile-setup');
      } else if (authMode === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        // Check profile
        const docRef = doc(db, 'users', result.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setAgeGroup(data.ageGroup);
          setNativeLanguage(data.nativeLanguage);
          setIsFirstLogin(false);
        } else {
          setAuthMode('profile-setup');
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    setError('');
    try {
      await createProfileInFirestore(auth.currentUser);
    } catch (err: any) {
       setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderIntroScreens = () => {
    const currentScreen = INTRO_SCREENS[step];
    const Icon = currentScreen.icon;

    return (
      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="flex flex-col items-center justify-center p-6 text-center h-full"
      >
        <div className={cn("w-32 h-32 rounded-3xl flex items-center justify-center mb-8", currentScreen.bg)}>
          <Icon className={cn("w-16 h-16", currentScreen.color)} />
        </div>
        <h2 className="text-3xl font-black text-white mb-4">{currentScreen.title}</h2>
        <p className="text-xl text-white/90 mb-12 max-w-sm">{currentScreen.description}</p>
        
        <div className="flex gap-2 mb-12">
          {INTRO_SCREENS.map((_, i) => (
            <div key={i} className={cn("w-3 h-3 rounded-full", step === i ? "bg-white" : "bg-white/30")} />
          ))}
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={() => setStep(step + 1)}
            className="w-full bg-white text-indigo-600 font-bold py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            {step === INTRO_SCREENS.length - 1 ? "Get Started" : "Next"}
          </button>
          
          <button 
            onClick={() => setStep(4)}
            className="w-full text-white/80 font-medium py-2 hover:text-white transition-colors"
          >
            Skip
          </button>
        </div>
      </motion.div>
    );
  };

  const renderAuthScreen = () => {
    if (authMode === 'profile-setup') {
      return (
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-slate-800">Child Profile</h2>
            <p className="text-slate-500 font-medium">Just a little bit about the explorer!</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <UserIcon className="w-4 h-4 text-sky-500" /> Child's Name (Optional)
              </label>
              <input 
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Explorer"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-700 focus:outline-none focus:border-sky-500"
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Calendar className="w-4 h-4 text-rose-500" /> Age Group
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['3-5', '6-8', '9-12'] as AgeGroup[]).map(age => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setLocalAgeGroup(age)}
                    className={cn(
                      "py-2 rounded-xl font-bold transition-all text-sm",
                      localAgeGroup === age ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Globe className="w-4 h-4 text-indigo-500" /> Native Language
              </label>
              <select 
                value={localLanguage}
                onChange={(e) => setLocalLanguage(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-8"
            >
              {loading ? "Saving..." : "Start Learning"} <Sparkles className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      );
    }

    return (
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-slate-800">
            {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-slate-500 font-medium">
             {authMode === 'login' ? 'Ready to learn more today?' : 'Sign up to track your learning progress.'}
          </p>
        </div>

        {error && <p className="text-red-500 text-sm font-bold text-center mb-4 bg-red-50 p-2 rounded-xl">{error}</p>}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Mail className="w-4 h-4 text-sky-500" /> Email Address
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="parent@example.com"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-700 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Lock className="w-4 h-4 text-rose-500" /> Password
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-base font-bold text-slate-700 focus:outline-none focus:border-rose-500"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors mt-4"
          >
            {loading ? "Please wait..." : (authMode === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 font-medium text-sm">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-sky-500 font-bold hover:underline"
            >
               {authMode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      
      <AnimatePresence mode="wait">
        {step < INTRO_SCREENS.length ? renderIntroScreens() : renderAuthScreen()}
      </AnimatePresence>
    </div>
  );
}
