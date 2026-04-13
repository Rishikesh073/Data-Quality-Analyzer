import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { BarChart2 } from 'lucide-react';

export default function Histograms({ histograms }) {
  if (!histograms || Object.keys(histograms).length === 0) return null;

  // Let's render up to 4 significant numerical features to avoid crowding
  const featuresToRender = Object.keys(histograms).slice(0, 4);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-4">
         <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <BarChart2 className="w-6 h-6" />
         </div>
         <div>
           <h2 className="text-lg font-bold text-gray-900">Feature Distributions (Histograms)</h2>
           <p className="text-sm text-gray-500 mt-1">Understanding the shape and bin counts of your numeric variables.</p>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featuresToRender.map(col => (
          <div key={col} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
            <h3 className="font-bold text-center text-sm text-gray-700 tracking-wide mb-4 uppercase">{col}</h3>
            <div className="h-[220px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={histograms[col]} margin={{ top: 5, right: 5, left: -25, bottom: 20 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis 
                      dataKey="range" 
                      tick={{ fontSize: 9, fill: '#64748b' }} 
                      axisLine={false} 
                      tickLine={false} 
                      angle={-35} 
                      textAnchor="end"
                      dy={10}
                   />
                   <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                   <Tooltip 
                     cursor={{fill: '#f1f5f9'}} 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     labelStyle={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}
                     itemStyle={{ color: '#8b5cf6', fontSize: '13px', fontWeight: 'bold' }}
                   />
                   <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {histograms[col].map((entry, index) => (
                         <Cell key={`cell-${index}`} fill="#8b5cf6" opacity={0.8 + (index * 0.02)} />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
