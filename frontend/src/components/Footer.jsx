import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full relative z-10 bg-gray-900 text-gray-300 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-xl text-white mb-4 tracking-tight">Data Quality Analyzer</h3>
          <p className="text-sm text-gray-400 leading-relaxed pr-8">
            Instantly evaluate your datasets and get intelligent insights for data cleaning and preparation.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Privacy Policy</h4>
          <ul className="text-sm space-y-3 text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> We do not store your data permanently.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Files are processed securely in memory.
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Contact Us</h4>
          <div className="flex flex-col space-y-3 text-sm">
            <a href="mailto:rishichothe@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
              <Mail className="w-4 h-4" /> rishichothe@gmail.com
            </a>
            <div className="flex gap-4 mt-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition"><Github className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-800 pt-8">
        &copy; {new Date().getFullYear()} Data Quality Analyzer. All rights reserved.
      </div>
    </footer>
  );
}
