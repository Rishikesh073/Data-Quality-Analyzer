import React from 'react';
import { AlertOctagon } from 'lucide-react';

export default function Outliers({ outliers }) {
  if (!outliers || Object.keys(outliers).length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50 pointer-events-none"></div>
      <div className="mb-6 flex items-start gap-4 relative z-10">
         <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <AlertOctagon className="w-6 h-6" />
         </div>
         <div>
           <h2 className="text-xl font-bold text-gray-900">Statistical Outliers Detected</h2>
           <p className="text-sm text-gray-500 mt-1">Columns with data points falling outside the expected Interquartile Range (IQR).</p>
         </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        {Object.entries(outliers).map(([col, count]) => (
          <div key={col} className="bg-red-50/50 rounded-xl p-4 border border-red-100 text-center">
             <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">{col}</p>
             <p className="text-3xl font-black text-red-500">{count.toLocaleString()}</p>
             <p className="text-[10px] text-red-400 font-bold uppercase mt-1">Anomalies</p>
          </div>
        ))}
      </div>
    </div>
  );
}
