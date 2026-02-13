'use client';

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Users,
  Mail,
  Calendar,
  Download,
  Upload,
  Filter
} from 'lucide-react';

export default function SubscribersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Placeholder data
  const subscribers: any[] = [];

  const statusOptions = [
    { value: 'all', label: 'Alle subscribers' },
    { value: 'active', label: 'Actief' },
    { value: 'unsubscribed', label: 'Uitgeschreven' },
    { value: 'bounced', label: 'Bounced' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-gray-600 mt-1">
            Beheer je email lijst en subscribers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            <Upload size={18} />
            Importeren
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            <Download size={18} />
            Exporteren
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors">
            <Plus size={18} />
            Toevoegen
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Zoekbalk */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Zoek op naam of email..."
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

      {/* Subscribers lijst */}
      {subscribers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nog geen subscribers
          </h3>
          <p className="text-gray-600 mb-6">
            Voeg subscribers toe of importeer een CSV bestand
          </p>
          <div className="flex items-center justify-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors">
              <Plus size={18} />
              Subscriber Toevoegen
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              <Upload size={18} />
              CSV Importeren
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Naam
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aangemeld
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Subscribers worden hier weergegeven */}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Mail className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Subscriber Beheer</h3>
            <p className="text-sm text-green-700">
              Je kunt subscribers handmatig toevoegen, importeren via CSV, of ze kunnen zichzelf aanmelden via je website.
              Zorg ervoor dat je GDPR-compliant bent en toestemming hebt van alle subscribers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
