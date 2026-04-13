import React from 'react';
import { Table } from 'lucide-react';

export default function DataPreview({ data }) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
          <Table className="w-5 h-5 fill-current opacity-70" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Dataset Preview</h2>
          <p className="text-xs text-gray-500 font-medium">First 10 rows of the uploaded file</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              {headers.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-bold border-b border-gray-100">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                {headers.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {/* Render strings directly, stringify objects if any */}
                    <span className="truncate max-w-[200px] inline-block font-medium text-gray-700">
                      {row[col] !== null && row[col] !== undefined ? String(row[col]) : <span className="text-gray-300 italic">null</span>}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
