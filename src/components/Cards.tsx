import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const StreakCard = ({ streak, points, badges }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500 rounded-full p-3 shadow-glow-amber">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Current Streak</p>
            <p className="text-3xl font-bold text-slate-900">{streak} days</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
              <p className="text-2xl font-bold text-slate-900">{points}</p>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase">Points</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-emerald-500" />
              <p className="text-2xl font-bold text-slate-900">{badges.filter(b => b.earned).length}</p>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase">Badges</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CourseCard = ({ course, onClick }) => {
  const progressPercent = course.enrolled ? course.progress : 0;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group cursor-pointer bg-white rounded-2xl border-2 border-transparent hover:border-violet-500 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-glow-violet"
      onClick={onClick}
      data-testid={`course-card-${course.id}`}
    >
      <div className="relative h-40 bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-slate-900 font-bold backdrop-blur-sm">
            {course.difficulty}
          </Badge>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-wide">{course.category}</span>
          <span className="text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium">{course.duration}</span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{course.description}</p>
        
        {course.enrolled && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Progress</span>
              <span className="text-xs font-bold text-violet-600">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
        
        {!course.enrolled && (
          <button className="w-full h-10 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors">
            Start Learning
          </button>
        )}
      </div>
    </motion.div>
  );
};

export const KPICard = ({ title, value, subtitle, icon: Icon, color = "violet" }) => {
  const colorClasses = {
    violet: "bg-violet-50 text-violet-600 border-violet-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200"
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl border border-slate-200 p-6"
      data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
    </motion.div>
  );
};

export const BadgeDisplay = ({ badges }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Your Badges</h3>
      <div className="grid grid-cols-5 gap-4">
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.1 }}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg ${
              badge.earned 
                ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200' 
                : 'bg-slate-50 border-2 border-slate-200 opacity-40'
            }`}
            data-testid={`badge-${badge.id}`}
          >
            <span className="text-3xl">{badge.icon}</span>
            <span className="text-xs font-bold text-slate-700 text-center">{badge.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
