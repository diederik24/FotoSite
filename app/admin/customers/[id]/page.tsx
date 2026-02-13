'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Building2, User, Calendar, Edit } from 'lucide-react';
import { getCustomerById, type Customer } from '@/lib/supabase';

export default function CustomerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  const loadCustomer = async () => {
    setIsLoading(true);
    try {
      const customerData = await getCustomerById(customerId);
      setCustomer(customerData);
    } catch (error: any) {
      console.error('Error loading customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3bb13b]"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Terug naar klanten</span>
        </button>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Klant niet gevonden.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Terug naar klanten</span>
        </button>
        <button
          onClick={() => router.push(`/admin/customers/${customerId}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3bb13b] text-white rounded-lg hover:bg-[#34a034] transition-colors"
        >
          <Edit size={18} />
          <span>Bewerken</span>
        </button>
      </div>

      {/* Klant Informatie */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#3bb13b] to-[#34a034] px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            {customer.bedrijfsnaam || customer.naam}
          </h1>
          {customer.bedrijfsnaam && customer.naam && (
            <p className="text-white/90 mt-1">{customer.naam}</p>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Basis Informatie */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Basis Informatie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Klantnummer</label>
                <p className="text-sm text-gray-900 mt-1">{customer.klantcode || '-'}</p>
              </div>
              {customer.contactpersoon && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Contactpersoon</label>
                  <p className="text-sm text-gray-900 mt-1">{customer.contactpersoon}</p>
                </div>
              )}
              {customer.kvk_nummer && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">KVK Nummer</label>
                  <p className="text-sm text-gray-900 mt-1">{customer.kvk_nummer}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Informatie */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} />
              Contact Informatie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  {customer.email}
                </p>
              </div>
              {(customer.telefoon_mobiel || customer.telefoon_vast || customer.telefoon_fax) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Telefoon</label>
                  <div className="text-sm text-gray-900 mt-1 space-y-1">
                    {customer.telefoon_mobiel && (
                      <p className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        Mobiel: {customer.telefoon_mobiel}
                      </p>
                    )}
                    {customer.telefoon_vast && (
                      <p className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        Vast: {customer.telefoon_vast}
                      </p>
                    )}
                    {customer.telefoon_fax && (
                      <p className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        Fax: {customer.telefoon_fax}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Adres Informatie */}
          {(customer.adres?.straat || customer.postcode || customer.stad || customer.land) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Adres Informatie
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.adres?.straat && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Straat</label>
                    <p className="text-sm text-gray-900 mt-1">{customer.adres.straat}</p>
                  </div>
                )}
                {customer.postcode && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Postcode</label>
                    <p className="text-sm text-gray-900 mt-1">{customer.postcode}</p>
                  </div>
                )}
                {customer.stad && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Stad</label>
                    <p className="text-sm text-gray-900 mt-1">{customer.stad}</p>
                  </div>
                )}
                {customer.land && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Land</label>
                    <p className="text-sm text-gray-900 mt-1">{customer.land}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Metadata
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.created_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Aangemaakt op</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(customer.created_at).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
              {customer.updated_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Laatst bijgewerkt</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(customer.updated_at).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
