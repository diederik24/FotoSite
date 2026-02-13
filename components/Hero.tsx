
import React from 'react';
import LoginForm from './LoginForm';
import { Truck, ShieldCheck, TrendingUp, UserCheck } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24 bg-[#fcfcfc] overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-green-50 rounded-full blur-3xl opacity-20 -mr-32 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Column: Content */}
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Uw Partner in <br />
              <span className="text-[#3bb13b]">Professionele</span> <br />
              Groenexport.
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-lg text-gray-600 max-w-lg leading-relaxed">
              Krijg toegang tot onze realtime voorraad, exclusieve B2B-prijzen en een breed assortiment van hoogwaardige planten. Straver Pflanzen Export bedient kwekers, tuincentra en hoveniers door heel Europa.
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
        <div className="flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-4 duration-700 delay-200 px-4 sm:px-0">
          <div className="sticky top-4">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
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

export default Hero;
