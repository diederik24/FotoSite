'use client';

import HomeTopbar from '@/components/HomeTopbar';
import HomeLogoBanner from '@/components/HomeLogoBanner';
import LoginForm from '@/components/LoginForm';
import { Truck, ShieldCheck, TrendingUp, UserCheck } from 'lucide-react';

export default function B2BPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#fcfcfc] flex flex-col">
      <HomeTopbar />
      <HomeLogoBanner />
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <div className="space-y-6 md:space-y-8 py-8">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Uw Partner in <br />
                <span className="text-[#3bb13b]">Professionele</span> <br />
                Groenexport.
              </h1>
              <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 max-w-lg leading-relaxed">
                Wij leveren hoogwaardige planten aan tuincentra&apos;s, hoveniers en groen aanleggers. Met onze realtime voorraad en exclusieve B2B-prijzen bent u verzekerd van de beste kwaliteit voor uw klanten.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-2 md:pt-4">
              <FeatureItem 
                icon={<Truck className="text-[#3bb13b]" size={20} />} 
                title="Snelle Levering" 
                description="Door heel Europa." 
              />
              <FeatureItem 
                icon={<ShieldCheck className="text-[#3bb13b]" size={20} />} 
                title="Top Kwaliteit" 
                description="Direct van de bron." 
              />
              <FeatureItem 
                icon={<TrendingUp className="text-[#3bb13b]" size={20} />} 
                title="Live Voorraad" 
                description="Altijd up-to-date." 
              />
              <FeatureItem 
                icon={<UserCheck className="text-[#3bb13b]" size={20} />} 
                title="Persoonlijk Advies" 
                description="Decennia aan expertise." 
              />
            </div>
          </div>

          {/* Right Column: Login Card */}
          <div className="flex justify-center lg:justify-end py-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex items-start gap-4 group">
    <div className="bg-green-100 p-3 rounded-xl group-hover:bg-[#3bb13b]/10 transition-colors">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);
