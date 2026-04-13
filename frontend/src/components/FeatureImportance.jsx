import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Network } from 'lucide-react';

export default function FeatureImportance({ data, target }) {
  // Normalize and sort the data for Recharts compatibility format
  const chartData = Object.entries(data)
    .map(([name, score]) => ({ name, score: Number(score) }))
    .sort((a, b) => b.score - a.score);

  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="mb-8 flex items-start gap-4">
         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Network className="w-6 h-6" />
         </div>
         <div>
           <h2 className="text-xl font-bold text-gray-900">Feature Importance Ranking</h2>
           <p className="text-sm text-gray-500 mt-1">
              Relative correlation of numeric variables against the specified target column: <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{target}</span>
           </p>
         </div>
      </div>
      
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
               dataKey="name" 
               tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} 
               axisLine={false} 
               tickLine={false} 
               angle={-25} 
               textAnchor="end" 
               dy={10}
            />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}} 
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(val) => [`${val.toFixed(2)}%`, 'Relative Import.']}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={48}>
               {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#6366f1'} opacity={1 - (index * 0.05)} />
               ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
