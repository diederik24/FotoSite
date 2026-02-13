'use client';

import { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter,
  Eye,
  Package,
  Calendar,
  User,
  Euro
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Placeholder data - wordt later vervangen door echte orders
  const orders: any[] = [];

  const statusOptions = [
    { value: 'all', label: 'Alle statussen' },
    { value: 'pending', label: 'In behandeling' },
    { value: 'processing', label: 'Wordt verwerkt' },
    { value: 'shipped', label: 'Verzonden' },
    { value: 'delivered', label: 'Afgeleverd' },
    { value: 'cancelled', label: 'Geannuleerd' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orderbeheer</h1>
          <p className="text-gray-600 mt-1">
            Beheer alle bestellingen en volg de status
          </p>
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
              placeholder="Zoek op ordernummer, klantnaam of email..."
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

      {/* Orders lijst */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nog geen orders
          </h3>
          <p className="text-gray-600">
            Orders worden hier weergegeven zodra klanten bestellingen plaatsen
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ordernummer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Klant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Totaal
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Orders worden hier weergegeven */}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Package className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Orderbeheer wordt binnenkort geïmplementeerd</h3>
            <p className="text-sm text-blue-700">
              Zodra het checkout proces en order systeem klaar zijn, worden hier alle orders weergegeven.
              Je kunt dan orders bekijken, status bijwerken, facturen genereren en meer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
