'use client';

import { useEffect, useState } from 'react';
import { getAllProducts } from '@/lib/supabase';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    isLoading: true,
  });
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setStats({
          totalProducts: allProducts.length,
          totalOrders: 0, // TODO: Implementeer order count
          totalCustomers: 0, // TODO: Implementeer customer count
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats((prev) => ({ ...prev, isLoading: false }));
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Totaal Producten',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      title: 'Totaal Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      href: '/admin/orders',
    },
    {
      title: 'Klanten',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/customers',
    },
    {
      title: 'Verkoop (deze maand)',
      value: '€0',
      icon: TrendingUp,
      color: 'bg-orange-500',
      href: '/admin/orders',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welkom terug! Hier is een overzicht van je webshop.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stats.isLoading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Snelle Acties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="px-4 py-3 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors text-center"
          >
            Nieuw Product Toevoegen
          </Link>
          <Link
            href="/admin/import"
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Producten Importeren
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Instellingen
          </Link>
        </div>
      </div>

      {/* Recente Producten */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recente Producten</h2>
          <Link
            href="/admin/products"
            className="text-sm text-[#3bb13b] hover:text-[#34a034] font-medium"
          >
            Bekijk alle
          </Link>
        </div>
        {stats.isLoading ? (
          <p className="text-gray-500 text-center py-8">Laden...</p>
        ) : stats.totalProducts === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nog geen producten. Voeg je eerste product toe!
          </p>
        ) : (
          <div className="space-y-2">
            {products.slice(0, 5).map((product) => (
              <Link
                key={product.artikelcode}
                href={`/admin/products/${product.artikelcode}/edit`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {product.afbeelding ? (
                    <img
                      src={product.afbeelding}
                      alt={product.artikelomschrijving}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="text-gray-400" size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-[#3bb13b] transition-colors">
                    {product.artikelomschrijving}
                  </p>
                  <p className="text-sm text-gray-500">{product.artikelcode}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {product.potmaat}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
