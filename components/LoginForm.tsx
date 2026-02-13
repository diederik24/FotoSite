
import React, { useState } from 'react';
import { Mail, Lock, Smartphone, Send } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header section */}
      <div className="bg-[#3bb13b] p-3 md:p-4 text-center text-white">
        <h2 className="text-base md:text-lg font-bold">B2B Login</h2>
        <p className="text-xs opacity-90 mt-0.5 font-medium">Beheer uw bestellingen en bekijk prijzen</p>
      </div>

      {/* Form section */}
      <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-3 md:space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">E-mailadres</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="naam@bedrijf.nl"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none transition-all placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Wachtwoord</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none transition-all placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 accent-[#3bb13b] rounded" />
            <span className="text-gray-600">Onthoud mij</span>
          </label>
          <a href="#" className="text-[#3bb13b] hover:underline font-semibold">Wachtwoord vergeten?</a>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#3bb13b] hover:bg-[#34a034] text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all active:scale-[0.98]"
        >
          Log In
        </button>

        <div className="grid grid-cols-2 gap-2 md:gap-3 pt-2">
          <button type="button" className="flex items-center justify-center gap-1 md:gap-2 border border-[#3bb13b] text-[#3bb13b] py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold hover:bg-green-50 transition-colors">
            <Send size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden sm:inline">Code via Mail</span><span className="sm:hidden">Mail</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-1 md:gap-2 border border-[#3bb13b] text-[#3bb13b] py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold hover:bg-green-50 transition-colors">
            <Smartphone size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden sm:inline">Code via SMS</span><span className="sm:hidden">SMS</span>
          </button>
        </div>

        <div className="text-center pt-4 space-y-2 border-t border-gray-100 mt-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Nog geen klant?</p>
          <a href="#" className="inline-block text-[#3bb13b] font-bold hover:translate-x-1 transition-transform">
            Vraag een zakelijk account aan &rarr;
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
