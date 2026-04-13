import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export default function Recommendations({ recommendations }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
         <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-500">
               <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
               <h2 className="text-lg font-bold text-gray-900">Actionable Insights</h2>
               <p className="text-xs text-gray-500 font-medium">Smart AI Recommendations</p>
            </div>
         </div>
         <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">{recommendations.length} Alert{recommendations.length !== 1 && 's'}</span>
      </div>
      
      <div className="flex-grow space-y-3 overflow-y-auto pr-2 max-h-[380px] scrollbar-thin">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => {
            const lowerRec = rec.toLowerCase();
            const isDrop = lowerRec.includes('drop') || lowerRec.includes('remove');
            const isImpute = lowerRec.includes('impute');
            const isTarget = lowerRec.includes('class imbalance');
            
            let colorClass = 'bg-blue-50/50 border-blue-100 text-blue-900 hover:bg-blue-50';
            let iconColor = 'text-blue-500';
            
            if (isDrop) {
               colorClass = 'bg-red-50/50 border-red-100 text-red-900 hover:bg-red-50';
               iconColor = 'text-red-500';
            } else if (isTarget) {
               colorClass = 'bg-purple-50/50 border-purple-100 text-purple-900 hover:bg-purple-50';
               iconColor = 'text-purple-500';
            } else if (isImpute) {
               colorClass = 'bg-amber-50/50 border-amber-100 text-amber-900 hover:bg-amber-50';
               iconColor = 'text-amber-500';
            }

            return (
              <div key={index} className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${colorClass}`}>
                <AlertCircle className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
                <p className="text-sm font-medium leading-relaxed flex-grow">{rec}</p>
                <ChevronRight className={`w-4 h-4 mt-1 opacity-50 shrink-0 ${iconColor}`} />
              </div>
            );
          })
        ) : (
           <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-8 bg-emerald-50/60 rounded-xl border border-emerald-100/60 mt-2">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3" />
              <p className="text-emerald-900 font-bold text-lg">Spotless Data Quality</p>
              <p className="text-emerald-600/80 text-sm mt-2 max-w-xs">We couldn't detect any severe structural issues or massive missing thresholds. You are good to proceed!</p>
           </div>
        )}
      </div>
    </div>
  );
}
