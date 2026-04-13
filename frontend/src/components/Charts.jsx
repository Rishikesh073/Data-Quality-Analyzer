import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

export default function Charts({ profile }) {
  // Process missing data
  const missingData = Object.entries(profile.missing_per_column)
    .map(([name, count]) => ({ name, count }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); 

  // Process data types
  const typeCounts = { numeric: 0, string: 0, date: 0, boolean: 0, unknown: 0 };
  Object.values(profile.dtypes).forEach(type => {
    if (type === 'number') typeCounts.numeric++;
    else if (type === 'string') typeCounts.string++;
    else if (type === 'date') typeCounts.date++;
    else if (type === 'boolean') typeCounts.boolean++;
    else typeCounts.unknown++;
  });

  const typeData = Object.entries(typeCounts)
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);
  
  const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#64748b'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 shadow-xl">
          <p className="text-xs font-bold text-gray-300 mb-1">{label}</p>
          <p className="text-sm font-medium">Missing: <span className="text-red-400">{payload[0].value.toLocaleString()}</span> rows</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      
      {/* Missing Values Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[360px]">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Missing Data Breakdown</h3>
          <p className="text-xs text-gray-500">Columns with highest null value counts</p>
        </div>
        
        <div className="flex-grow w-full relative">
          {missingData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={missingData} layout="vertical" margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={32}>
                  {missingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#ef4444" opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100/50">
              <span className="text-4xl mb-3">🎉</span>
              <p className="font-bold text-emerald-800">100% Complete Data!</p>
              <p className="text-xs text-emerald-600 mt-1">No missing cells detected anywhere.</p>
            </div>
          )}
        </div>
      </div>

      {/* Data Types */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[360px]">
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 text-lg">Data Type Composition</h3>
          <p className="text-xs text-gray-500">Auto-detected schema distribution across columns.</p>
        </div>
        
        <div className="flex-grow w-full">
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  stroke="none"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white' }} 
                  itemStyle={{color: 'white', fontWeight: 600}}
                  formatter={(val, name) => [val, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl">
               No data types resolved.
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
