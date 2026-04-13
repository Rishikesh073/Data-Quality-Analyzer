import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, X, Target } from 'lucide-react';

export default function FileUpload({ onAnalyze, isLoading }) {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState('');
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f) => {
    const validEndings = ['.csv', '.xlsx'];
    if (validEndings.some(ext => f.name.toLowerCase().endsWith(ext))) {
      setFile(f);
    } else {
      alert("Invalid format. Please upload a .csv or .xlsx file");
    }
  };

  const clearFile = () => {
    setFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onAnalyze(file, target);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* DRAG & DROP ZONE */}
        {!file ? (
          <div 
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
              dragActive ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
             <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
             </div>
             <p className="font-semibold text-gray-800 text-lg">Click to browse or drag & drop</p>
             <p className="text-sm text-gray-500 mt-2 text-center max-w-sm">Support for CSV and Microsoft Excel (XLSX) files up to 50MB.</p>
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleChange} 
                accept=".csv, .xlsx, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                className="hidden" 
             />
          </div>
        ) : (
          <div className="border border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white rounded-xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-white border border-indigo-100 shadow-sm p-3 rounded-lg flex-shrink-0">
                <FileSpreadsheet className="text-indigo-600 w-8 h-8" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">
                    {file.name.split('.').pop()}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={clearFile} className="p-2.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-600 transition-colors bg-white border border-transparent hover:border-red-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* INPUT AND BUTTON */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-2/3 lg:w-1/2 relative">
            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-500" /> Target Column (Optional)
            </label>
            <input 
              type="text" 
              placeholder="e.g., 'Category' or 'Price'"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!file || isLoading}
            className={`w-full md:w-auto flex-grow px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${
              !file || isLoading ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40'
            }`}
          >
            {isLoading ? 'Running Analysis...' : 'Analyze Now'}
          </button>
        </div>
      </form>
    </div>
  );
}
