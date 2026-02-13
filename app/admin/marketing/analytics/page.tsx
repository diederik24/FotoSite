'use client';

import { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  Eye,
  MousePointerClick,
  Users,
  Mail,
  Calendar
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    {
      title: 'Totaal Verzonden',
      value: '0',
      icon: Mail,
      color: 'bg-blue-500',
      change: '+0%',
    },
    {
      title: 'Open Rate',
      value: '0%',
      icon: Eye,
      color: 'bg-green-500',
      change: '+0%',
    },
    {
      title: 'Click Rate',
      value: '0%',
      icon: MousePointerClick,
      color: 'bg-purple-500',
      change: '+0%',
    },
    {
      title: 'Unsubscribe Rate',
      value: '0%',
      icon: Users,
      color: 'bg-red-500',
      change: '+0%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Statistieken</h1>
          <p className="text-gray-600 mt-1">
            Bekijk de prestaties van je email campagnes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none bg-white"
          >
            <option value="7d">Laatste 7 dagen</option>
            <option value="30d">Laatste 30 dagen</option>
            <option value="90d">Laatste 90 dagen</option>
            <option value="1y">Laatste jaar</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Rate Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Open Rate Over Tijd</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 mb-2" />
              <p>Grafiek wordt hier weergegeven</p>
            </div>
          </div>
        </div>

        {/* Click Rate Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Click Rate Over Tijd</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 mb-2" />
              <p>Grafiek wordt hier weergegeven</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Campaigns */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Beste Presterende Campagnes</h2>
        <div className="text-center py-8 text-gray-500">
          <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>Nog geen campagne data beschikbaar</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <BarChart3 className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Statistieken Uitleg</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li><strong>Open Rate:</strong> Percentage emails dat is geopend</li>
              <li><strong>Click Rate:</strong> Percentage emails met kliks op links</li>
              <li><strong>Unsubscribe Rate:</strong> Percentage dat zich heeft uitgeschreven</li>
              <li>Statistieken worden bijgewerkt na elke campagne</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
