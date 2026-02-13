
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-12 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Neem Contact Op</h2>
            <p className="text-gray-600 mb-10">Heeft u vragen over ons assortiment of wilt u meer weten over de mogelijkheden voor uw bedrijf? Ons team staat voor u klaar.</p>
            
            <div className="space-y-6">
              <ContactInfo icon={<MapPin className="text-[#3bb13b]" />} title="Adres" detail="Middenweg 23, 4281 KH Andel" />
              <ContactInfo icon={<Phone className="text-[#3bb13b]" />} title="Telefoon" detail="+31 (0)6-53976428" />
              <ContactInfo icon={<Mail className="text-[#3bb13b]" />} title="E-mail" detail="info@arnostraver.nl" />
              <ContactInfo icon={<Clock className="text-[#3bb13b]" />} title="Openingstijden" detail="Ma - Vr: 08:00 - 18:00" />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 lg:p-12 border border-gray-100">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Stuur een bericht</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Naam" className="bg-white p-4 rounded-xl border border-gray-200 w-full outline-none focus:border-[#3bb13b]" />
                <input type="email" placeholder="E-mail" className="bg-white p-4 rounded-xl border border-gray-200 w-full outline-none focus:border-[#3bb13b]" />
              </div>
              <input type="text" placeholder="Onderwerp" className="bg-white p-4 rounded-xl border border-gray-200 w-full outline-none focus:border-[#3bb13b]" />
              <textarea placeholder="Uw bericht..." rows={4} className="bg-white p-4 rounded-xl border border-gray-200 w-full outline-none focus:border-[#3bb13b]"></textarea>
              <button className="w-full bg-[#3bb13b] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#34a034] transition-all">Verstuur Bericht</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactInfo = ({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: string }) => (
  <div className="flex items-start gap-4">
    <div className="bg-green-50 p-3 rounded-xl">{icon}</div>
    <div>
      <h4 className="font-bold text-gray-900">{title}</h4>
      <p className="text-gray-600">{detail}</p>
    </div>
  </div>
);

export default Contact;
