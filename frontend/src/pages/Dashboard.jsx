import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import ScoreCard from '../components/ScoreCard';
import Charts from '../components/Charts';
import FeatureImportance from '../components/FeatureImportance';
import Recommendations from '../components/Recommendations';
import DataPreview from '../components/DataPreview';
import Histograms from '../components/Histograms';
import Outliers from '../components/Outliers';
import { analyzeData } from '../services/api';

export default function Dashboard() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (file, target) => {
    setLoading(true);
    setError(null);
    setResults(null); // Reset purely
    try {
      const data = await analyzeData(file, target);
      setResults(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <Navbar />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10 flex flex-col gap-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Insights</h1>
          <p className="text-gray-500 text-sm mt-1">Upload a file to generate a data quality report instantly.</p>
        </div>

        {/* SECTION 1: File Upload */}
        <FileUpload onAnalyze={handleAnalyze} isLoading={loading} />
        
        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-sm flex flex-col justify-center animate-in fade-in slide-in-from-top-4">
            <p className="font-bold">Analysis Failed</p>
            <p className="text-sm mt-1">{typeof error === 'string' ? error : 'Verify the backend is running and the file is correct.'}</p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-5 text-indigo-900 font-medium tracking-tight">Processing dataset...</p>
            <p className="text-sm text-gray-400 mt-1">Doing the heavy statistical lifting</p>
          </div>
        )}

        {/* RESULTS METRICS */}
        {results && !loading && (
          <div className="flex flex-col gap-8" style={{ animation: "fadeIn 0.7s ease-out forwards" }}>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* SECTION 2: Score Card */}
              <div className="xl:col-span-1 flex flex-col">
                <ScoreCard 
                  score={results.data_quality_score} 
                  detailedScores={results.scores} 
                  profile={results.profile} 
                />
              </div>

              {/* SECTION 5 (Recommendations) & SECTION 3 (Charts) */}
              <div className="xl:col-span-2 flex flex-col gap-8">
                <Recommendations recommendations={results.recommendations} />
                <Charts profile={results.profile} />
              </div>
            </div>

            {/* SECTION 4: Feature Importance */}
            {results.feature_importance && Object.keys(results.feature_importance).length > 0 && (
              <div className="w-full">
                <FeatureImportance data={results.feature_importance} target={results.target_column || "Target"} />
              </div>
            )}
            
            {/* SECTION 4.5: Outliers */}
            {results.profile?.outliers && Object.keys(results.profile.outliers).length > 0 && (
              <div className="w-full" style={{ animation: "fadeIn 0.9s ease-out forwards" }}>
                <Outliers outliers={results.profile.outliers} />
              </div>
            )}
            
            {/* SECTION 5: Histograms */}
            {results.profile?.histograms && Object.keys(results.profile.histograms).length > 0 && (
              <div className="w-full">
                <Histograms histograms={results.profile.histograms} />
              </div>
            )}

            {/* SECTION 6: Data Preview (Top 10 Rows) */}
            {results.preview && results.preview.length > 0 && (
              <div className="w-full">
                <DataPreview data={results.preview} />
              </div>
            )}
          </div>
        )}
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
