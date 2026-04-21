import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Trophy, Clock, Target, BookOpen } from 'lucide-react';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#64748b'];

export default function LearningDashboard() {
  const { stats, xp, level, timeSpentToday } = useStore();

  const getAccuracyData = () => {
    return Object.entries(stats).map(([subject, data]) => ({
      subject,
      accuracy: data.accuracy,
    }));
  };

  const getTimeData = () => {
    return Object.entries(stats).map(([subject, data]) => ({
      name: subject,
      value: data.timeSpent,
    }));
  };

  const getLessonsData = () => {
    return Object.entries(stats).map(([subject, data]) => ({
      subject,
      completed: data.completed,
    }));
  };

  const accuracyData = getAccuracyData();
  const timeData = getTimeData();
  const lessonsData = getLessonsData();
  
  const totalLessons = Object.values(stats).reduce((acc, curr) => acc + curr.completed, 0);

  return (
    <div className="space-y-6">
      {/* High-level Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center"
        >
          <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-sky-500" />
          </div>
          <p className="text-slate-500 text-sm font-bold">Total XP</p>
          <p className="text-2xl font-black text-slate-800">{xp}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center"
        >
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-slate-500 text-sm font-bold">Lessons Done</p>
          <p className="text-2xl font-black text-slate-800">{totalLessons}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-slate-500 text-sm font-bold">Current Level</p>
          <p className="text-2xl font-black text-slate-800">{level}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center justify-center text-center"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-slate-500 text-sm font-bold">Minutes Today</p>
          <p className="text-2xl font-black text-slate-800">{timeSpentToday}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accuracy Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-3xl shadow-md border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <Target className="text-emerald-500" /> Accuracy by Subject (%)
          </h3>
          <div className="h-64">
            {accuracyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f1f5f9' }} 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="accuracy" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No accuracy data yet.</div>
            )}
          </div>
        </motion.div>

        {/* Time Spent Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-3xl shadow-md border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <Clock className="text-amber-500" /> Time Spent (Minutes)
          </h3>
          <div className="h-64">
            {timeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {timeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No time data yet.</div>
            )}
          </div>
        </motion.div>

        {/* Lessons Completed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 md:col-span-2"
        >
          <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <BookOpen className="text-blue-500" /> Lessons Completed
          </h3>
          <div className="h-64">
            {lessonsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lessonsData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '3 3' }} 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No lessons data yet.</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
