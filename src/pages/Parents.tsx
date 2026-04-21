import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Shield, Clock, Lock, User, BarChart, Save, CheckCircle2, Palette, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore, AgeGroup } from '../store/useStore';
import LearningDashboard from '../components/LearningDashboard';
import { cn } from '../lib/utils';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Parents() {
  const navigate = useNavigate();
  const store = useStore();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [name, setName] = useState(store.name);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(store.ageGroup);
  const [nativeLanguage, setNativeLanguage] = useState(store.nativeLanguage);
  const [pin, setPin] = useState(store.parentalPin || '');
  const [limit, setLimit] = useState(store.screenTimeLimit?.toString() || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const finalPin = pin.length === 4 ? pin : null;
    const finalLimit = limit ? parseInt(limit) : null;

    // Locally update Zustand store
    store.setName(name);
    store.setAgeGroup(ageGroup);
    store.setNativeLanguage(nativeLanguage);
    store.setParentalPin(finalPin);
    store.setScreenTimeLimit(finalLimit);
    
    // Save to Firestore
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          name,
          ageGroup,
          nativeLanguage,
          parentalPin: finalPin,
          screenTimeLimit: finalLimit,
          disabledModules: store.disabledModules
        });
      } catch (err) {
        console.error("Failed to save settings to Firestore", err);
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center py-8 relative">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8 px-4">
        <button 
          onClick={() => navigate('/')}
          className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-8 h-8 text-slate-600" />
        </button>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm">
          <Shield className="w-8 h-8 text-slate-700" />
          <h1 className="text-2xl font-black text-slate-800">Parents Area</h1>
        </div>
        <div className="w-14 h-14"></div>
      </div>

      <div className="w-full max-w-5xl px-4 flex justify-center mb-8">
        <div className="bg-white p-2 rounded-2xl shadow-md flex gap-2 w-full max-w-md">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn(
               "flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all",
               activeTab === 'dashboard' ? "bg-indigo-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <BarChart3 className="w-5 h-5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
               "flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all",
               activeTab === 'settings' ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <SettingsIcon className="w-5 h-5" /> Settings
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full"
            >
              <LearningDashboard />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col md:flex-row gap-8"
            >
              <div className="flex-1 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <User className="w-8 h-8 text-indigo-500" />
                    <h2 className="text-2xl font-bold text-slate-800">Child Profile</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-14 bg-slate-50 rounded-xl px-4 text-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Age Group</label>
                      <div className="flex gap-4">
                        {(['3-5', '6-8', '9-12'] as AgeGroup[]).map((age) => (
                          <button
                            key={age}
                            onClick={() => setAgeGroup(age)}
                            className={`flex-1 h-14 rounded-xl font-bold text-lg transition-colors ${
                              ageGroup === age 
                                ? 'bg-indigo-500 text-white shadow-md' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Native Language</label>
                      <select 
                        value={nativeLanguage}
                        onChange={(e) => setNativeLanguage(e.target.value)}
                        className="w-full h-14 bg-slate-50 rounded-xl px-4 text-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <Shield className="w-8 h-8 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-slate-800">Content Filtering</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 mb-4">Choose which modules are available for your child.</p>
                    {[
                      { id: 'math', name: 'Math Learning' },
                      { id: 'words', name: 'Word Building' },
                      { id: 'science', name: 'Science Explorer' },
                      { id: 'tutor', name: 'AI Tutor' },
                      { id: 'read', name: 'Story Library' },
                    ].map((mod) => (
                      <div key={mod.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="font-bold text-slate-700">{mod.name}</span>
                        <button
                          onClick={() => store.toggleModule(mod.id)}
                          className={`
                            w-14 h-8 rounded-full transition-colors relative
                            ${!store.disabledModules.includes(mod.id) ? 'bg-emerald-500' : 'bg-slate-300'}
                          `}
                        >
                          <div className={`
                            absolute top-1 w-6 h-6 bg-white rounded-full transition-all
                            ${!store.disabledModules.includes(mod.id) ? 'left-7' : 'left-1'}
                          `} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <Lock className="w-8 h-8 text-rose-500" />
                    <h2 className="text-2xl font-bold text-slate-800">Security & Limits</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Parental PIN (4 digits)</label>
                      <input 
                        type="password" 
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="Leave blank for no PIN"
                        className="w-full h-14 bg-slate-50 rounded-xl px-4 text-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200 tracking-[0.5em]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Daily Screen Time Limit (minutes)</label>
                      <input 
                        type="number" 
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        placeholder="e.g. 60 (Leave blank for no limit)"
                        className="w-full h-14 bg-slate-50 rounded-xl px-4 text-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full h-16 bg-slate-800 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl hover:bg-slate-900 transition-colors"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span className="text-emerald-400">Saved Successfully</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Save Changes
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    store.logout();
                    navigate('/');
                  }}
                  className="w-full h-16 bg-red-100 text-red-600 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-sm hover:bg-red-200 transition-colors mt-4"
                >
                  Log Out
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
