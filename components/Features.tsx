
import React from 'react';
import { Leaf, Clock, MapPin, Globe } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Leaf className="text-white" size={24} />,
      title: "Dagverse Kwaliteit",
      desc: "Wij selecteren dagelijks de beste planten van geselecteerde kwekers voor optimale versheid.",
      color: "bg-green-500"
    },
    {
      icon: <Clock className="text-white" size={24} />,
      title: "Snelle Logistiek",
      desc: "Dankzij ons eigen logistieke netwerk leveren we door heel Europa binnen afzienbare tijd.",
      color: "bg-[#3bb13b]"
    },
    {
      icon: <Globe className="text-white" size={24} />,
      title: "Breed Assortiment",
      desc: "Van kamerplanten tot grote bomen, ons B2B portaal biedt toegang tot duizenden artikelen.",
      color: "bg-[#2d6a4f]"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Onze Expertise</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Al meer dan 25 jaar de vertrouwde partner voor groenexport in Europa.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className={`${f.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-100`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
