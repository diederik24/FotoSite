'use client';

import { Eye } from 'lucide-react';

export default function AdminHeader() {
  const liveVisitors = 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">Webshop Beheer</h1>
        <span className="text-sm text-gray-500">Straver Pflanzen Export</span>
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          ⚠️ Authenticatie uitgeschakeld
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Live Visitors Counter */}
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <Eye className="text-red-600" size={18} />
          <span className="text-sm font-semibold text-red-700">
            {liveVisitors}
          </span>
          <span className="text-xs text-red-600 hidden sm:inline">
            live
          </span>
          {/* Pulse indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div>
      </div>
    </header>
  );
}
