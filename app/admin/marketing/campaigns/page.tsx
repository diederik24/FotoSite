'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter,
  Send,
  Calendar,
  Users,
  Eye,
  MousePointerClick,
  MoreVertical,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Placeholder data
  const campaigns: any[] = [];

  const statusOptions = [
    { value: 'all', label: 'Alle statussen' },
    { value: 'draft', label: 'Concept' },
    { value: 'scheduled', label: 'Gepland' },
    { value: 'sending', label: 'Wordt verzonden' },
    { value: 'sent', label: 'Verzonden' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Campagnes</h1>
          <p className="text-gray-600 mt-1">
            Beheer en verzend je email campagnes
          </p>
        </div>
        <Link
          href="/admin/marketing/campaigns/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors"
        >
          <Plus size={20} />
          Nieuwe Campagne
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Zoekbalk */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Zoek op campagne naam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none appearance-none bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Campagnes lijst */}
      {campaigns.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Send className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nog geen campagnes
          </h3>
          <p className="text-gray-600 mb-6">
            Maak je eerste email campagne om te beginnen met email marketing
          </p>
          <Link
            href="/admin/marketing/campaigns/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors"
          >
            <Plus size={20} />
            Nieuwe Campagne Maken
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Campagne
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ontvangers
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Click Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Campagnes worden hier weergegeven */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
