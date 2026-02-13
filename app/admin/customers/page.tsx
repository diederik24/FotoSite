'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Users, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { getAllCustomers, searchCustomers, type Customer } from '@/lib/supabase';

const ITEMS_PER_PAGE = 20;

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Kolom filters
  const [filters, setFilters] = useState({
    klantcode: '',
    naam: '',
    contactpersoon: '',
    email: '',
    telefoon: '',
    adres: '',
    postcode: '',
    stad: '',
    land: '',
  });

  // Laad klanten
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const allCustomers = await getAllCustomers();
      setCustomers(allCustomers);
    } catch (error: any) {
      console.error('Error loading customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Zoek klanten
  useEffect(() => {
    if (searchTerm.trim()) {
      const performSearch = async () => {
        setIsLoading(true);
        try {
          const results = await searchCustomers(searchTerm);
          setCustomers(results);
        } catch (error: any) {
          console.error('Error searching customers:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      const timeoutId = setTimeout(performSearch, 300);
      return () => clearTimeout(timeoutId);
    } else {
      loadCustomers();
    }
  }, [searchTerm]);

  // Filter klanten lokaal (algemene zoekterm + kolom filters)
  const filteredCustomers = useMemo(() => {
    let filtered = customers;
    
    // Algemene zoekterm filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(customer => {
        const klantcode = customer.klantcode?.toLowerCase() || '';
        const email = customer.email?.toLowerCase() || '';
        const naam = customer.naam?.toLowerCase() || '';
        const bedrijfsnaam = customer.bedrijfsnaam?.toLowerCase() || '';
        const land = customer.land?.toLowerCase() || '';
        const stad = customer.stad?.toLowerCase() || '';
        const postcode = customer.postcode?.toLowerCase() || '';
        
        return (
          klantcode.includes(term) ||
          email.includes(term) ||
          naam.includes(term) ||
          bedrijfsnaam.includes(term) ||
          land.includes(term) ||
          stad.includes(term) ||
          postcode.includes(term)
        );
      });
    }
    
    // Kolom filters
    if (filters.klantcode.trim()) {
      const term = filters.klantcode.toLowerCase();
      filtered = filtered.filter(customer => 
        (customer.klantcode?.toLowerCase() || '').includes(term)
      );
    }
    
    if (filters.naam.trim()) {
      const term = filters.naam.toLowerCase();
      filtered = filtered.filter(customer =>
        (customer.naam?.toLowerCase() || '').includes(term) ||
        (customer.bedrijfsnaam?.toLowerCase() || '').includes(term)
      );
    }
    
    if (filters.contactpersoon.trim()) {
      const term = filters.contactpersoon.toLowerCase();
      filtered = filtered.filter(customer =>
        (customer.contactpersoon?.toLowerCase() || '').includes(term)
      );
    }
    
    if (filters.email.trim()) {
      const term = filters.email.toLowerCase();
      filtered = filtered.filter(customer => 
        (customer.email?.toLowerCase() || '').includes(term)
      );
    }
    
    if (filters.telefoon.trim()) {
      const term = filters.telefoon.toLowerCase();
      filtered = filtered.filter(customer => 
        (customer.telefoon_mobiel?.toLowerCase() || '').includes(term) ||
        (customer.telefoon_vast?.toLowerCase() || '').includes(term) ||
        (customer.telefoon_fax?.toLowerCase() || '').includes(term)
      );
    }
    
    if (filters.adres.trim()) {
      const term = filters.adres.toLowerCase();
      filtered = filtered.filter(customer => 
        (customer.adres?.straat?.toLowerCase() || '').includes(term)
      );
    }
    
    if (filters.postcode.trim()) {
      const term = filters.postcode.toLowerCase();
      filtered = filtered.filter(customer => 
        (customer.postcode?.toLowerCase() || '').includes(term)
      );
    }
    
    if (filters.stad.trim()) {
      const term = filters.stad.toLowerCase();
      filtered = filtered.filter(customer => 
        (customer.stad?.toLowerCase() || '').includes(term)
      );
    }
    
    if (filters.land.trim()) {
      const term = filters.land.toLowerCase();
      filtered = filtered.filter(customer => 
        (customer.land?.toLowerCase() || '').includes(term)
      );
    }
    
    return filtered;
  }, [customers, searchTerm, filters]);

  // Paginering
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset pagina bij zoeken of filteren
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Klantenbeheer</h1>
            <span className="text-sm text-[#3bb13b] font-medium">
              ({isLoading ? '...' : customers.length})
            </span>
          </div>
          <p className="text-gray-600 mt-1">Bekijk en beheer alle klanten.</p>
        </div>
      </div>

      {/* Zoekbalk */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Zoek op naam, email, bedrijfsnaam, klantcode, land of stad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 focus:border-[#3bb13b] focus:ring-1 focus:ring-[#3bb13b] focus:outline-none hover:border-gray-400"
          />
        </div>
      </div>

      {/* Klanten Tabel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-300">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300 w-20">
                  Klantnr
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">
                  Naam / Bedrijf
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">
                  Contactpersoon
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">
                  Telefoon
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">
                  Adres
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">
                  Postcode
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r border-gray-300">
                  Stad
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                  Land
                </th>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-300">
                <td className="px-0 py-0 border-r border-gray-300 w-20">
                  <input
                    type="text"
                    value={filters.klantcode}
                    onChange={(e) => setFilters({ ...filters, klantcode: e.target.value })}
                    className="w-full h-full px-3 py-2 text-xs border-0 border-transparent rounded-none focus:ring-1 focus:ring-[#3bb13b] focus:outline-none bg-transparent"
                  />
                </td>
                <td className="px-0 py-0 border-r border-gray-300">
                  <input
                    type="text"
                    value={filters.naam}
                    onChange={(e) => setFilters({ ...filters, naam: e.target.value })}
                    className="w-full h-full px-4 py-2 text-xs border-0 border-transparent rounded-none focus:ring-1 focus:ring-[#3bb13b] focus:outline-none bg-transparent"
                  />
                </td>
                <td className="px-0 py-0 border-r border-gray-300">
                  <input
                    type="text"
                    value={filters.contactpersoon}
                    onChange={(e) => setFilters({ ...filters, contactpersoon: e.target.value })}
                    className="w-full h-full px-4 py-2 text-xs border-0 border-transparent rounded-none focus:ring-1 focus:ring-[#3bb13b] focus:outline-none bg-transparent"
                  />
                </td>
                <td className="px-0 py-0 border-r border-gray-300">
                  <input
                    type="text"
                    value={filters.email}
                    onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    className="w-full h-full px-4 py-2 text-xs border-0 border-transparent rounded-none focus:ring-1 focus:ring-[#3bb13b] focus:outline-none bg-transparent"
                  />
                </td>
                <td className="px-0 py-0 border-r border-gray-300">
                  <input
                    type="text"
                    value={filters.telefoon}
                    onChange={(e) => setFilters({ ...filters, telefoon: e.target.value })}
                    className="w-full h-full px-4 py-2 text-xs border-0 border-transparent rounded-none focus:ring-1 focus:ring-[#3bb13b] focus:outline-none bg-transparent"
                  />
                </td>
                <td className="px-0 py-0 border-r border-gray-300">
                  <input
                    type="text"
                    value={filters.adres}
                    onChange={(e) => setFilters({ ...filters, adres: e.target.value })}
                    className="w-full h-full px-4 py-2 text-xs border-0 border-transparent rounded-none focus:ring-1 focus:ring-[#3bb13b] focus:outline-none bg-transparent"
                  />
                </td>
                <td className="px-0 py-0 border-r border-gray-300">
                  <input
                    type="text"
                    value={filters.postcode}
                    onChange={(e) => setFilters({ ...filters, postcode: e.target.value })}
                    className="w-full h-full px-4 py-2 text-xs border-0 border-transparent rounded-none focus:ring-1 focus:ring-[#3bb13b] focus:outline-none bg-transparent"
                  />
                </td>
                <td className="px-0 py-0 border-r border-gray-300">
                  <input
                    type="text"
                    value={filters.stad}
                    onChange={(e) => setFilters({ ...filters, stad: e.target.value })}
                    className="w-full h-full px-4 py-2 text-xs border-0 border-transparent rounded-none focus:ring-1 focus:ring-[#3bb13b] focus:outline-none bg-transparent"
                  />
                </td>
                <td className="px-0 py-0">
                  <input
                    type="text"
                    value={filters.land}
                    onChange={(e) => setFilters({ ...filters, land: e.target.value })}
                    className="w-full h-full px-4 py-2 text-xs border-0 border-transparent rounded-none focus:ring-1 focus:ring-[#3bb13b] focus:outline-none bg-transparent"
                  />
                </td>
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3bb13b]"></div>
                    <p className="text-gray-500 mt-4">Klanten laden...</p>
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <Users className="mx-auto text-gray-400" size={48} />
                    <p className="text-gray-500 mt-4">
                      {searchTerm || Object.values(filters).some(f => f.trim()) 
                        ? 'Geen klanten gevonden voor deze filters.' 
                        : 'Nog geen klanten in de database.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="border-b border-gray-300 hover:bg-blue-50 transition-colors cursor-pointer"
                    onDoubleClick={() => router.push(`/admin/customers/${customer.id}`)}
                  >
                    <td className="px-3 py-3 text-sm text-gray-900 border-r border-gray-300 whitespace-nowrap w-20">
                      {customer.klantcode || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                      <div className="font-medium">{customer.bedrijfsnaam || customer.naam}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                      {customer.contactpersoon || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                      {customer.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                      {customer.telefoon_mobiel || customer.telefoon_vast || customer.telefoon_fax || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                      {customer.adres?.straat || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300 whitespace-nowrap">
                      {customer.postcode || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                      {customer.stad || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {customer.land || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginering */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Toon {startIndex + 1} tot {Math.min(startIndex + ITEMS_PER_PAGE, filteredCustomers.length)} van {filteredCustomers.length} klanten
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Vorige
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Volgende
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
