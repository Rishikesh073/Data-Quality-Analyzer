import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function ScoreCard({ score, detailedScores, profile }) {
  
  let scoreTheme = { text: 'text-emerald-500', bg: 'bg-emerald-50', solid: 'bg-emerald-500', stroke: '#10b981', label: 'Excellent' };
  
  if (score < 60) scoreTheme = { text: 'text-red-500', bg: 'bg-red-50', solid: 'bg-red-500', stroke: '#ef4444', label: 'Critical / Poor' };
  else if (score < 80) scoreTheme = { text: 'text-amber-500', bg: 'bg-amber-50', solid: 'bg-amber-500', stroke: '#f59e0b', label: 'Needs Warning' };

  // Circle Math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
      
      {/* Top Banner section */}
      <div className="relative pt-10 pb-8 px-6 bg-slate-900 border-b-4" style={{borderBottomColor: scoreTheme.stroke}}>
        <div className="absolute top-4 right-4 outline-none">
           {score >= 80 ? <ShieldCheck className="w-8 h-8 text-emerald-400 opacity-80"/> : <ShieldAlert className={`w-8 h-8 ${scoreTheme.text} opacity-80`} />}
        </div>
        
        <h2 className="text-center text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">Final Quality Score</h2>
        
        <div className="flex justify-center items-center relative my-2">
            <svg className="transform -rotate-90 w-44 h-44 drop-shadow-xl">
              <circle cx="88" cy="88" r={radius} stroke="#1e293b" strokeWidth="14" fill="transparent" />
              <circle 
                cx="88" cy="88" r={radius} 
                stroke={scoreTheme.stroke} 
                strokeWidth="14" 
                fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-5xl font-black text-white ml-2">{score}</span>
              <span className={`text-xs font-bold uppercase mt-1 ${scoreTheme.text}`}>{scoreTheme.label}</span>
            </div>
        </div>

        {/* Profile Stats */}
        <div className="flex justify-between items-center bg-slate-800/80 rounded-xl p-4 mt-8 mx-auto w-full border border-slate-700/50 backdrop-blur-md">
           <div className="text-center px-2 border-r border-slate-600/50 w-1/3">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Rows</p>
              <p className="font-medium text-white">{profile.rows?.toLocaleString()}</p>
           </div>
           <div className="text-center px-2 border-r border-slate-600/50 w-1/3">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Cols</p>
              <p className="font-medium text-white">{profile.columns}</p>
           </div>
           <div className="text-center px-2 w-1/3">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Dupes</p>
              <p className="font-medium text-white">{profile.duplicates?.toLocaleString()}</p>
           </div>
        </div>
      </div>
      
      {/* Metrics Breakdown */}
      <div className="p-6 flex-grow grid grid-cols-2 gap-4 bg-white">
         {Object.entries(detailedScores).map(([key, val]) => {
           let barColor = 'bg-emerald-500';
           if (val < 60) barColor = 'bg-red-500';
           else if (val < 80) barColor = 'bg-amber-500';

           return (
             <div key={key} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">{key}</p>
                  <p className="font-bold text-gray-800 text-sm">{val}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${val}%`, transition: 'width 1s ease-in-out' }}></div>
                </div>
             </div>
           );
         })}
      </div>
    </div>
  );
}
