import React, { useState } from 'react';
import { Search, ArrowRight, Menu, X } from 'lucide-react';

export default function HeroNav({ onLaunchApp, onNavigate }) {
  const [activeLink, setActiveLink] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = ['Home', 'About', 'Technology', 'Impact', 'Explore', 'Team'];

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(link);
  };

  return (
    <header className="w-full max-w-[1440px] mx-auto pt-7 pb-4 px-[5vw] flex items-center justify-between relative z-40">
      {/* Brand: Nautilus Logo + Wordmark */}
      <a 
        href="#home" 
        onClick={(e) => { e.preventDefault(); handleLinkClick('Home'); }}
        className="flex items-center gap-3.5 group select-none"
      >
        {/* Nautilus Wave SVG Mark */}
        <div className="w-10 h-10 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
          <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
            <path 
              d="M5 24C9 14 19 8 30 8C35 8 39 10 41 12C36 13.5 31 17 28 21C25 25 19 27 13 27C10 27 7 26 5 24Z" 
              fill="#FFFFFF" 
              fillOpacity="0.95"
            />
            <path 
              d="M6 28C10 32 18 34 27 32C33 30.5 38 26 40 18C37 22 32 25 26 25C20 25 15 22 13 17C11 13 8 10 5 12C7 17 7 23 6 28Z" 
              fill="#6EDCFF" 
              fillOpacity="0.85"
            />
            <path 
              d="M9 30.5C13 35 22 36 29 34C24 34.5 19 33 15 29.5C12 27.5 11 24.5 10 21C9.5 24.5 9 28 9 30.5Z" 
              fill="#FFFFFF" 
              fillOpacity="0.65"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <span className="text-white font-bold text-lg tracking-[0.12em] uppercase font-sans">
          NAUTILUS
        </span>
      </a>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 lg:gap-10">
        {navLinks.map((link) => {
          const isActive = activeLink === link;
          return (
            <button
              key={link}
              onClick={() => handleLinkClick(link)}
              className="relative text-[14px] lg:text-[15px] font-medium tracking-wide text-white/80 hover:text-white py-1 flex flex-col items-center cursor-pointer transition-colors"
            >
              <span>{link}</span>
              {isActive && (
                <span className="w-5 h-[2px] bg-[#6EDCFF] rounded-full mt-1.5 transition-all" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Search + Launch App CTA */}
      <div className="hidden sm:flex items-center gap-6">
        <button 
          aria-label="Search" 
          className="text-white/80 hover:text-white transition-colors p-2 cursor-pointer"
          onClick={() => onNavigate && onNavigate('Search')}
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={onLaunchApp}
          className="btn-nautilus-nav px-6 py-3 text-[14px] font-semibold tracking-wide flex items-center gap-2 group cursor-pointer"
        >
          <span>Launch App</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center gap-3">
        <button
          onClick={onLaunchApp}
          className="btn-nautilus-nav px-4 py-2 text-xs tracking-wide flex items-center gap-1.5"
        >
          <span>Launch</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white/90 p-2"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown (Clean, Minimal, No Glassmorphism) */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-[#031A2E] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 md:hidden shadow-2xl z-50">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => handleLinkClick(link)}
              className={`text-left text-base font-medium py-1.5 ${
                activeLink === link ? 'text-[#6EDCFF]' : 'text-white/80'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
