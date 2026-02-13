
import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, Star, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      {/* Top Green Bar */}
      <div className="bg-[#3bb13b] text-white py-2 px-4 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex justify-between md:justify-end items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="flex text-[#facc15]">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" className="opacity-50" />
            </div>
            <span className="font-semibold hidden sm:inline">4.5/5 Google Reviews</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+310653976428" className="flex items-center gap-1 hover:underline">
              <Phone size={14} /> <span className="hidden sm:inline">+31 (0)6-53976428</span>
            </a>
            <a href="mailto:info@arnostraver.nl" className="flex items-center gap-1 hover:underline">
              <Mail size={14} /> <span className="hidden sm:inline">info@arnostraver.nl</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white border-b border-gray-100 py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="cursor-pointer group flex items-center">
            <Image 
              src="/Logo Links BOven .png" 
              alt="Straver Pflanzen Export" 
              width={350} 
              height={105}
              className="h-12 md:h-16 lg:h-20 w-auto max-w-[200px] md:max-w-[280px] lg:max-w-[350px] block"
            />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-[#3bb13b] font-semibold transition-colors">Diensten</a>
            <a href="#" className="text-gray-600 hover:text-[#3bb13b] font-semibold transition-colors">Catalogus</a>
            <a href="#contact" className="text-gray-600 hover:text-[#3bb13b] font-semibold transition-colors">Contact</a>
            <button className="bg-[#3bb13b] hover:bg-[#34a034] text-white px-6 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95">
              B2B Portal
            </button>
          </nav>
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 top-[calc(100%)] shadow-xl animate-fade-in p-6 flex flex-col gap-4 z-40">
          <a href="#features" className="text-lg font-semibold text-gray-800" onClick={() => setIsMenuOpen(false)}>Diensten</a>
          <a href="#" className="text-lg font-semibold text-gray-800" onClick={() => setIsMenuOpen(false)}>Catalogus</a>
          <a href="#contact" className="text-lg font-semibold text-gray-800" onClick={() => setIsMenuOpen(false)}>Contact</a>
          <button className="w-full bg-[#3bb13b] text-white py-4 rounded-xl font-bold shadow-lg">
            Login B2B Portal
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
