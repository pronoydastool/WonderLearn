import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Zap, 
  Settings, 
  Palette, 
  BarChart3,
  CheckCircle2,
  Clock,
  Edit2,
  Save,
  X,
  Lock,
  LogOut,
  User
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const THEMES = [
  { id: 'default', name: 'Classic', color: 'bg-rose-400' },
  { id: 'ocean', name: 'Ocean', color: 'bg-blue-400' },
  { id: 'forest', name: 'Forest', color: 'bg-emerald-400' },
  { id: 'sunset', name: 'Sunset', color: 'bg-orange-400' },
  { id: 'galaxy', name: 'Galaxy', color: 'bg-indigo-400' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { name, xp, level, stats, theme, setTheme, setName, logout } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [showParentalGate, setShowParentalGate] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  const nextLevelXP = level * 100;
  const progress = (xp % 100);

  const handleSave = async () => {
    const finalName = editName.trim();
    if (finalName) {
      setName(finalName);
      if (auth.currentUser) {
        try {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            name: finalName
          });
        } catch (err) {
          console.error("Failed to update name in Firestore", err);
        }
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(name);
    setIsEditing(false);
  };

  const handleSettingsClick = () => {
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
      navigate('/parents');
    } else {
      setError('Incorrect PIN');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 px-4 bg-slate-50 overflow-y-auto">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-3xl font-black text-slate-800">My Profile 🌟</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleLogout}
            className="w-12 h-12 bg-red-100 rounded-2xl shadow-md flex items-center justify-center hover:bg-red-200 transition-colors"
            title="Logout"
          >
            <LogOut className="w-6 h-6 text-red-600" />
          </button>
          <button 
            onClick={handleSettingsClick}
            className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
            title="Settings"
          >
            <Settings className="w-6 h-6 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* User Info Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-1 bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl flex flex-col items-center text-center relative"
        >
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          ) : null}

          {isEditing ? (
            <div className="w-full flex flex-col items-center">
              <div className="bg-indigo-100 text-indigo-500 w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-inner relative group">
                <User className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-center text-xl md:text-2xl font-black text-slate-800 mb-4 md:mb-6 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-2 focus:outline-none focus:border-indigo-500"
                placeholder="Your Name"
                maxLength={15}
              />
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors text-sm md:text-base"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors text-sm md:text-base"
                >
                  <Save className="w-4 h-4 md:w-5 md:h-5" /> Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-indigo-100 text-indigo-500 w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-inner">
                <User className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">{name}</h2>
              <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1 rounded-full font-bold mb-6 text-sm md:text-base">
                <Trophy className="w-4 h-4" /> Level {level}
              </div>

              <div className="w-full space-y-3 md:space-y-4">
                <div className="flex justify-between text-xs md:text-sm font-bold text-slate-500">
                  <span>XP Progress</span>
                  <span>{progress}/100</span>
                </div>
                <div className="w-full h-3 md:h-4 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-amber-400"
                  />
                </div>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium">
                  Only {100 - progress} XP until Level {level + 1}!
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* Stats & Dashboard */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6 md:space-y-8"
        >
          {/* Dashboard Grid */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">Learning Dashboard</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(stats).map(([subject, data]) => (
                <div key={subject} className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-700 capitalize text-sm md:text-base">{subject}</span>
                    <span className="text-[10px] md:text-xs font-black bg-white px-2 py-1 rounded-lg text-indigo-600">
                      {data.accuracy}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 md:h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500" 
                        style={{ width: `${data.accuracy}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{data.completed} Lessons</span>
                    <span>{data.timeSpent}m Spent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Customization */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-5 h-5 md:w-6 md:h-6 text-rose-500" />
              <h3 className="text-xl md:text-2xl font-bold text-slate-800">App Theme</h3>
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-4">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`
                    flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold transition-all text-sm md:text-base
                    ${theme === t.id ? 'ring-4 ring-rose-200 scale-105 bg-rose-50' : 'hover:bg-slate-50'}
                  `}
                >
                  <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full ${t.color}`} />
                  <span className="text-slate-700">{t.name}</span>
                  {theme === t.id && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

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
