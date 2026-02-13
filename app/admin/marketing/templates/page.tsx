'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  FileText,
  Edit,
  Trash2,
  Copy,
  Eye
} from 'lucide-react';

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Placeholder data
  const templates: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-1">
            Beheer je email templates voor campagnes
          </p>
        </div>
        <Link
          href="/admin/marketing/templates/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors"
        >
          <Plus size={20} />
          Nieuw Template
        </Link>
      </div>

      {/* Zoekbalk */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Zoek op template naam..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none"
          />
        </div>
      </div>

      {/* Templates grid */}
      {templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nog geen templates
          </h3>
          <p className="text-gray-600 mb-6">
            Maak je eerste email template om te beginnen
          </p>
          <Link
            href="/admin/marketing/templates/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors"
          >
            <Plus size={20} />
            Nieuw Template Maken
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Laatst gewijzigd: {template.updatedAt}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:text-[#3bb13b] hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Template Tips</h3>
            <p className="text-sm text-blue-700">
              Gebruik templates om tijd te besparen bij het maken van campagnes. 
              Je kunt variabelen gebruiken zoals {'{{'}naam{'}}'} en {'{{'}bedrijf{'}}'} voor personalisatie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
