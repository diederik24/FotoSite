'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { createProduct } from '@/lib/supabase';
import { useToast } from '@/lib/ToastContext';

export default function NewProductPage() {
  const router = useRouter();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    artikelcode: '',
    artikelomschrijving: '',
    afbeelding: '',
    potmaat: '',
    verpakkingsinhoud: '',
    wetenschappelijkeNaam: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.artikelcode.trim()) {
      newErrors.artikelcode = 'Artikelcode is verplicht';
    }

    if (!formData.artikelomschrijving.trim()) {
      newErrors.artikelomschrijving = 'Omschrijving is verplicht';
    }

    if (!formData.afbeelding.trim()) {
      newErrors.afbeelding = 'Afbeelding URL is verplicht';
    } else if (!formData.afbeelding.startsWith('/') && !formData.afbeelding.startsWith('http')) {
      newErrors.afbeelding = 'Afbeelding moet een geldige URL zijn (begint met / of http)';
    }

    if (!formData.potmaat.trim()) {
      newErrors.potmaat = 'Potmaat is verplicht';
    }

    if (!formData.verpakkingsinhoud.trim()) {
      newErrors.verpakkingsinhoud = 'Verpakkingsinhoud is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Controleer de ingevulde gegevens');
      return;
    }

    setIsSaving(true);
    try {
      await createProduct({
        artikelcode: formData.artikelcode,
        artikelomschrijving: formData.artikelomschrijving,
        afbeelding: formData.afbeelding,
        potmaat: formData.potmaat,
        verpakkingsinhoud: formData.verpakkingsinhoud,
        wetenschappelijkeNaam: formData.wetenschappelijkeNaam || undefined,
      });

      toast.success('Product succesvol toegevoegd');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      if (error.code === '23505') {
        toast.error('Een product met deze artikelcode bestaat al');
        setErrors({ artikelcode: 'Deze artikelcode bestaat al' });
      } else {
        toast.error(error.message || 'Fout bij het toevoegen van product');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nieuw Product</h1>
          <p className="text-gray-600 mt-1">Voeg een nieuw product toe aan je webshop</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Artikelcode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Artikelcode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.artikelcode}
              onChange={(e) => setFormData({ ...formData, artikelcode: e.target.value.toUpperCase() })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none ${
                errors.artikelcode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Bijv. V09001"
            />
            {errors.artikelcode && (
              <p className="mt-1 text-sm text-red-600">{errors.artikelcode}</p>
            )}
          </div>

          {/* Omschrijving */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Artikelomschrijving <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.artikelomschrijving}
              onChange={(e) => setFormData({ ...formData, artikelomschrijving: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none ${
                errors.artikelomschrijving ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Bijv. Appelboom 'Elstar'"
            />
            {errors.artikelomschrijving && (
              <p className="mt-1 text-sm text-red-600">{errors.artikelomschrijving}</p>
            )}
          </div>

          {/* Wetenschappelijke naam */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Wetenschappelijke Naam
            </label>
            <input
              type="text"
              value={formData.wetenschappelijkeNaam}
              onChange={(e) => setFormData({ ...formData, wetenschappelijkeNaam: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none"
              placeholder="Bijv. Malus domestica"
            />
          </div>

          {/* Afbeelding */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Afbeelding URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.afbeelding}
              onChange={(e) => setFormData({ ...formData, afbeelding: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none ${
                errors.afbeelding ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="/product-afbeelding.jpg of https://..."
            />
            {errors.afbeelding && (
              <p className="mt-1 text-sm text-red-600">{errors.afbeelding}</p>
            )}
            {formData.afbeelding && !errors.afbeelding && (
              <div className="mt-2 w-32 h-32 relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.afbeelding}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Potmaat */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Potmaat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.potmaat}
              onChange={(e) => setFormData({ ...formData, potmaat: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none ${
                errors.potmaat ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Bijv. C2, C5, 9cm"
            />
            {errors.potmaat && (
              <p className="mt-1 text-sm text-red-600">{errors.potmaat}</p>
            )}
          </div>

          {/* Verpakkingsinhoud */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Verpakkingsinhoud <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.verpakkingsinhoud}
              onChange={(e) => setFormData({ ...formData, verpakkingsinhoud: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none ${
                errors.verpakkingsinhoud ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Bijv. 1, 6, 12"
            />
            {errors.verpakkingsinhoud && (
              <p className="mt-1 text-sm text-red-600">{errors.verpakkingsinhoud}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            Annuleren
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Opslaan...
              </>
            ) : (
              <>
                <Save size={18} />
                Product Opslaan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
