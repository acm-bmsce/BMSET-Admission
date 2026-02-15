import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const isHomeActive = location.pathname === '/';
  const isInstitutesActive = location.pathname.startsWith('/institute');

  const lastVisited = localStorage.getItem('lastVisitedInstitute');
  const institutesRoute = lastVisited ? `/institute/${lastVisited}` : '/';

  const getLinkClasses = (isActive) => {
    return isActive 
      ? "text-theme-accent border-b-2 border-theme-accent pb-1 font-semibold"
      : "text-theme-primary hover:text-theme-accent font-semibold transition-colors";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* UPDATED: Left side is now purely the Image Logo */}
        <Link to="/" className="flex items-center cursor-pointer">
          <img 
            src="/BMSETLOGO.webp" 
            alt="BMSET Logo" 
            className="h-14 w-auto object-contain" 
          />
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex space-x-6 text-sm">
          <Link 
            to="/" 
            className={getLinkClasses(isHomeActive)}
          >
            HOME
          </Link>
          <Link 
            to={institutesRoute} 
            className={getLinkClasses(isInstitutesActive)}
          >
            INSTITUTES
          </Link>
        </nav>
      </div>
    </header>
  );
}