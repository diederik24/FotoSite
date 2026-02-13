'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Users, 
  FileText, 
  Send, 
  BarChart3,
  Plus,
  TrendingUp,
  Eye,
  MousePointerClick
} from 'lucide-react';

export default function MarketingPage() {
  const [stats] = useState({
    totalSubscribers: 0,
    totalCampaigns: 0,
    openRate: 0,
    clickRate: 0,
  });

  const quickActions = [
    {
      title: 'Nieuwe Campagne',
      description: 'Maak een nieuwe email campagne',
      href: '/admin/marketing/campaigns/new',
      icon: Plus,
      color: 'bg-[#3bb13b] hover:bg-[#34a034]',
    },
    {
      title: 'Email Templates',
      description: 'Beheer je email templates',
      href: '/admin/marketing/templates',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Subscribers',
      description: 'Beheer je email lijst',
      href: '/admin/marketing/subscribers',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Statistieken',
      description: 'Bekijk campagne resultaten',
      href: '/admin/marketing/analytics',
      icon: BarChart3,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ];

  const statCards = [
    {
      title: 'Totaal Subscribers',
      value: stats.totalSubscribers,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/marketing/subscribers',
    },
    {
      title: 'Actieve Campagnes',
      value: stats.totalCampaigns,
      icon: Send,
      color: 'bg-green-500',
      href: '/admin/marketing/campaigns',
    },
    {
      title: 'Open Rate',
      value: `${stats.openRate}%`,
      icon: Eye,
      color: 'bg-purple-500',
      href: '/admin/marketing/analytics',
    },
    {
      title: 'Click Rate',
      value: `${stats.clickRate}%`,
      icon: MousePointerClick,
      color: 'bg-orange-500',
      href: '/admin/marketing/analytics',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email Marketing</h1>
        <p className="text-gray-600 mt-1">Beheer je email campagnes, templates en subscribers</p>
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
                    {stat.value}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className={`${action.color} text-white rounded-lg p-6 hover:shadow-lg transition-all transform hover:-translate-y-1`}
              >
                <Icon className="mb-3" size={32} />
                <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recente Campagnes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recente Campagnes</h2>
          <Link
            href="/admin/marketing/campaigns"
            className="text-sm text-[#3bb13b] hover:text-[#34a034] font-medium"
          >
            Bekijk alle →
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>Nog geen campagnes. Maak je eerste campagne!</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Mail className="text-blue-500 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Marketing Features</h3>
            <p className="text-sm text-gray-700 mb-3">
              Met deze email marketing tool kun je:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Professionele email templates maken en beheren</li>
              <li>Email campagnes creëren en verzenden</li>
              <li>Subscribers beheren en segmenteren</li>
              <li>Gedetailleerde statistieken bekijken (open rates, click rates)</li>
              <li>Geautomatiseerde email workflows instellen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
