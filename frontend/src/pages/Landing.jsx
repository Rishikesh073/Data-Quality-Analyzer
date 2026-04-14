import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BarChart3, Settings2, ShieldCheck, Zap, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { currentUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (!currentUser) {
        await loginWithGoogle();
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-20 px-4 relative z-10 text-center container mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-8 uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Instant Dataset Profiling
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6 max-w-4xl">
          Understand Your Data <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            In Seconds.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
          Upload your dataset and get an instant quality score, deep profiling insights, and highly actionable AI-driven data cleaning recommendations.
        </p>

        <Link to="/dashboard" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2 text-lg">
          START ANALYSIS <Zap className="w-5 h-5 fill-current" />
        </Link>
      </main>

      {/* Features Section - SLIDER */}
      <section className="bg-white py-24 relative z-10 border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-float">
            <h2 className="text-3xl font-bold mb-4 tracking-tight text-gray-900">Key Features</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to deeply understand the state and shape of your raw data before moving into production.</p>
          </div>

          <div className="feature-slider-container">
            <div className="feature-slider-track gap-8">
              <div className="w-[25%] px-4">
                <FeatureCard
                  icon={<ShieldCheck className="w-6 h-6 text-[#ff2a5f]" />}
                  title="Data Quality Score"
                  desc="Comprehensive 0-100 score evaluating completeness, uniqueness, and consistency instantly."
                />
              </div>
              <div className="w-[25%] px-4">
                <FeatureCard
                  icon={<Settings2 className="w-6 h-6 text-[#00f0ff]" />}
                  title="Smart Recommendations"
                  desc="Automated suggestions detailing exactly how to clean, impute, and encode your dataset."
                />
              </div>
              <div className="w-[25%] px-4">
                <FeatureCard
                  icon={<BarChart3 className="w-6 h-6 text-[#b14fff]" />}
                  title="Feature Importance"
                  desc="Identify columns that strongly correlate with your target variable using simple stats."
                />
              </div>
              <div className="w-[25%] px-4">
                <FeatureCard
                  icon={<Activity className="w-6 h-6 text-[#00ff88]" />}
                  title="Data Cleaning Insights"
                  desc="Detect outliers, mixed types, and class imbalances immediately before training ML models."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-2xl mx-auto mb-6 shadow-sm relative">
                1
                <div className="hidden md:block absolute top-1/2 left-full w-full h-[1px] bg-gradient-to-r from-gray-200 to-transparent -translate-y-1/2 ml-4"></div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Upload Dataset</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Drop your CSV or XLSX file securely into our interface. It runs completely securely.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-2xl mx-auto mb-6 shadow-sm relative">
                2
                <div className="hidden md:block absolute top-1/2 left-full w-full h-[1px] bg-gradient-to-r from-gray-200 to-transparent -translate-y-1/2 ml-4"></div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Analyze</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Our backend calculates deep profiling metrics, missing data bounds, and heuristics.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-600 border border-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg shadow-indigo-200">
                3
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Get Results</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Review quality scores, charts, target correlations, and specialized alerts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">About Us</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Data Quality Analyzer is built to solve one of the biggest pain points in data science and engineering: blindly debugging dirty datasets. Instead of writing custom python scripts for every new file, just upload it here and get the statistical distribution, missing gaps, and correlations visually mapped out for you instantly.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl shadow-sm transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
      <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center mb-6 text-indigo-600 relative z-10 group-hover:bg-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-3 relative z-10">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed relative z-10">{desc}</p>
    </div>
  )
}
